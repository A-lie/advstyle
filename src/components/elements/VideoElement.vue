<template>
  <div
    class="video-element"
    :class="{ selected: selected }"
    :style="elementStyle"
    @click.stop="handleClick"
    @mousedown="handleMouseDown"
  >
    <video
      v-if="element.videoUrl"
      ref="video"
      :src="element.videoUrl"
      :style="videoStyle"
      :autoplay="shouldAutoplay"
      :loop="element.loop"
      :muted="preview"
      @loadedmetadata="handleVideoLoad"
      @error="handleVideoError"
      :controls="!preview"
      playsinline
    ></video>
    <div v-else class="placeholder">
      <i class="el-icon-video-camera"></i>
      <span v-if="!videoError">视频加载中...</span>
      <div v-else class="error-message">
        <i class="el-icon-warning"></i>
        <span>视频加载失败</span>
        <small v-if="element.videoName">{{ element.videoName }}</small>
        <small v-if="videoError">{{ videoError }}</small>
      </div>
    </div>
    
    <div class="video-info" v-if="selected && !preview && element.videoName">
      <span>{{ element.videoName }}</span>
    </div>
    
    <div class="resize-handles" v-if="selected && !preview">
      <div class="resize-handle nw" @mousedown.stop="handleResizeStart('nw', $event)"></div>
      <div class="resize-handle ne" @mousedown.stop="handleResizeStart('ne', $event)"></div>
      <div class="resize-handle sw" @mousedown.stop="handleResizeStart('sw', $event)"></div>
      <div class="resize-handle se" @mousedown.stop="handleResizeStart('se', $event)"></div>
    </div>
    <div class="delete-btn" v-if="selected && !preview" @click.stop="handleDelete">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoElement',
  props: {
    element: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDragging: false,
      isResizing: false,
      resizeDirection: '',
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startElementX: 0,
      startElementY: 0,
      videoError: null,
      browserSupport: null
    }
  },
  mounted() {
    // 检测浏览器视频格式支持
    this.checkBrowserSupport()
  },
  computed: {
    elementStyle() {
      return {
        position: 'absolute',
        left: this.element.x + 'px',
        top: this.element.y + 'px',
        width: this.element.width + 'px',
        height: this.element.height + 'px',
        backgroundColor: this.element.backgroundColor,
        opacity: this.element.opacity / 255,
        zIndex: this.element.zIndex,
        border: this.selected && !this.preview ? '2px solid #409eff' : 'none',
        overflow: this.selected && !this.preview ? 'visible' : 'hidden'
      }
    },
    videoStyle() {
      const style = {
        width: '100%',
        height: '100%'
      }
      
      if (this.element.displayMode === 'stretch') {
        style.objectFit = 'fill'
      } else {
        style.objectFit = 'contain'
      }
      
      return style
    },
    shouldAutoplay() {
      // 在预览模式下，如果设置了自动播放则自动播放
      // 在编辑模式下，不自动播放以避免干扰编辑
      return this.preview && this.element.autoplay
    }
  },
  watch: {
    preview(newVal) {
      if (newVal && this.element.autoplay) {
        this.$nextTick(() => {
          if (this.$refs.video) {
            this.$refs.video.play().catch(e => {
              console.warn('视频自动播放失败:', e)
            })
          }
        })
      }
    }
  },
  methods: {
    handleVideoLoad() {
      // 视频加载成功，清除错误状态
      this.videoError = null
      if (this.preview && this.element.autoplay) {
        this.$refs.video.play().catch(e => {
          console.warn('视频自动播放失败:', e)
        })
      }
    },
    handleVideoError(event) {
      const video = event.target
      let errorMessage = '未知错误'
      let errorTip = ''
      
      if (video.error) {
        switch (video.error.code) {
          case video.error.MEDIA_ERR_ABORTED:
            errorMessage = '视频加载被中止'
            errorTip = '请重新选择视频文件'
            break
          case video.error.MEDIA_ERR_NETWORK:
            errorMessage = '网络错误'
            errorTip = '请检查网络连接'
            break
          case video.error.MEDIA_ERR_DECODE:
            errorMessage = '视频解码失败'
            errorTip = '视频文件可能已损坏，请尝试使用其他视频'
            break
          case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = '不支持的视频格式'
            errorTip = '请使用 MP4(H.264) 格式的视频文件'
            break
        }
      }
      
      this.videoError = errorMessage
      
      // 构建日志信息（兼容旧版本语法）
      const urlPreview = this.element.videoUrl ? 
        (this.element.videoUrl.startsWith('blob:') ? 
          this.element.videoUrl : 
          this.element.videoUrl.substring(0, 100) + '...') : 
        'N/A'
      
      const logInfo = {
        url: urlPreview,
        name: this.element.videoName,
        error: errorMessage,
        errorCode: video.error ? video.error.code : null,
        tip: errorTip
      }
      console.error('视频加载失败:', logInfo)
      
      // 提示用户
      if (!this.preview) {
        this.$message({
          message: errorMessage + (errorTip ? ': ' + errorTip : ''),
          type: 'error',
          duration: 5000
        })
      }
    },
    handleClick() {
      if (!this.preview) {
        this.$emit('select', this.element)
      }
    },
    handleMouseDown(event) {
      if (this.preview) return
      
      this.isDragging = true
      this.startX = event.clientX
      this.startY = event.clientY
      this.startElementX = this.element.x
      this.startElementY = this.element.y
      
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
      event.preventDefault()
    },
    handleMouseMove(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.startX
        const deltaY = event.clientY - this.startY
        
        const newX = Math.max(0, this.startElementX + deltaX)
        const newY = Math.max(0, this.startElementY + deltaY)
        
        this.$emit('update', {
          ...this.element,
          x: newX,
          y: newY
        })
      } else if (this.isResizing) {
        this.handleResize(event)
      }
    },
    handleMouseUp() {
      this.isDragging = false
      this.isResizing = false
      this.resizeDirection = ''
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
    handleResizeStart(direction, event) {
      this.isResizing = true
      this.resizeDirection = direction
      this.startX = event.clientX
      this.startY = event.clientY
      this.startWidth = this.element.width
      this.startHeight = this.element.height
      this.startElementX = this.element.x
      this.startElementY = this.element.y
      
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
      event.preventDefault()
    },
    handleResize(event) {
      const deltaX = event.clientX - this.startX
      const deltaY = event.clientY - this.startY
      
      let newWidth = this.startWidth
      let newHeight = this.startHeight
      let newX = this.startElementX
      let newY = this.startElementY
      
      switch (this.resizeDirection) {
        case 'nw':
          newWidth = Math.max(50, this.startWidth - deltaX)
          newHeight = Math.max(50, this.startHeight - deltaY)
          newX = this.startElementX + (this.startWidth - newWidth)
          newY = this.startElementY + (this.startHeight - newHeight)
          break
        case 'ne':
          newWidth = Math.max(50, this.startWidth + deltaX)
          newHeight = Math.max(50, this.startHeight - deltaY)
          newY = this.startElementY + (this.startHeight - newHeight)
          break
        case 'sw':
          newWidth = Math.max(50, this.startWidth - deltaX)
          newHeight = Math.max(50, this.startHeight + deltaY)
          newX = this.startElementX + (this.startWidth - newWidth)
          break
        case 'se':
          newWidth = Math.max(50, this.startWidth + deltaX)
          newHeight = Math.max(50, this.startHeight + deltaY)
          break
      }
      
      this.$emit('update', {
        ...this.element,
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: newWidth,
        height: newHeight
      })
    },
    handleDelete() {
      this.$emit('delete', this.element.id)
    },
    checkBrowserSupport() {
      // 检测浏览器对各种视频格式的支持
      const video = document.createElement('video')
      this.browserSupport = {
        mp4: video.canPlayType('video/mp4; codecs="avc1.42E01E"'),
        webm: video.canPlayType('video/webm; codecs="vp8, vorbis"'),
        webmVP9: video.canPlayType('video/webm; codecs="vp9"'),
        ogg: video.canPlayType('video/ogg; codecs="theora"')
      }
      
      // 在控制台输出支持信息（仅开发模式）
      if (process.env.NODE_ENV === 'development') {
        console.log('浏览器视频格式支持:', this.browserSupport)
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
}
</script>

<style scoped>
.video-element {
  cursor: move;
  box-sizing: border-box;
  position: relative;
}

.video-element.selected {
  outline: none;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
}

.placeholder i {
  font-size: 24px;
  margin-bottom: 8px;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #f56c6c;
  text-align: center;
  padding: 10px;
}

.error-message i {
  font-size: 32px;
  color: #f56c6c;
}

.error-message small {
  font-size: 11px;
  color: #999;
  max-width: 90%;
  word-break: break-all;
}

.video-info {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  max-width: calc(100% - 10px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #409eff;
  border: 1px solid white;
  pointer-events: all;
}

.resize-handle.nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background: #f78989;
}
</style>