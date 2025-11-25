<template>
  <div class="image-element" :class="{ selected: selected }" :style="elementStyle" @click.stop="handleClick"
    @mousedown="handleMouseDown">
    <el-image v-if="currentImage" :src="currentImage.url" :style="imageStyle" @load="handleImageLoad"
      @error="handleImageError"></el-image>
    <div v-else class="placeholder">
      <i class="el-icon-picture"></i>
      <span>图片加载中...</span>
    </div>

    <div class="image-info" v-if="selected && !preview && element.images && element.images.length > 1">
      <span>{{ currentImageIndex + 1 }} / {{ element.images.length }}</span>
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
  name: 'ImageElement',
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
      currentImageIndex: 0,
      imageTimer: null
    }
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
    imageStyle() {
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
    currentImage() {
      if (!this.element.images || this.element.images.length === 0) {
        return null
      }
      return this.element.images[this.currentImageIndex] || this.element.images[0]
    }
  },
  watch: {
    'element.images': {
      handler() {
        this.setupImageRotation()
      },
      immediate: true
    },
    'element.interval': {
      handler() {
        this.setupImageRotation()
      }
    },
    'preview': {
      handler() {
        // 当进入或退出预览模式时，重新设置图片轮播
        this.setupImageRotation()
      }
    }
  },
  methods: {
    setupImageRotation() {
      this.clearImageTimer()

      if (this.element.images && this.element.images.length > 1 && this.element.interval > 0) {
        this.imageTimer = setInterval(() => {
          this.currentImageIndex = (this.currentImageIndex + 1) % this.element.images.length
        }, this.element.interval)
      }
    },
    clearImageTimer() {
      if (this.imageTimer) {
        clearInterval(this.imageTimer)
        this.imageTimer = null
      }
    },
    handleImageLoad() {
      // 图片加载成功
    },
    handleImageError() {
      console.error('图片加载失败')
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

        const newX = Math.max(0, Math.round(this.startElementX + deltaX))
        const newY = Math.max(0, Math.round(this.startElementY + deltaY))

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
        x: Math.max(0, Math.round(newX)),
        y: Math.max(0, Math.round(newY)),
        width: Math.round(newWidth),
        height: Math.round(newHeight)
      })
    },
    handleDelete() {
      this.$emit('delete', this.element.id)
    }
  },
  mounted() {
    this.currentImageIndex = this.element.currentImageIndex || 0
    this.setupImageRotation()
  },
  beforeDestroy() {
    this.clearImageTimer()
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
}
</script>

<style scoped>
.image-element {
  cursor: move;
  box-sizing: border-box;
  position: relative;
}

.image-element.selected {
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

.image-info {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
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