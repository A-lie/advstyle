<template>
  <div class="video-properties">
    <h4 class="panel-title">视频属性</h4>

    <el-form size="small" label-width="100px" class="video-properties-form">
      <!-- 位置控制 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-location"></i>
          <span>位置</span>
        </div>
        <el-form-item label="X坐标" class="position-item">
          <div class="slider-input-group">
            <el-slider v-model.number="localElement.x" :min="0" :max="getMaxX" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.x" @change="handleInputChange('x', $event)" size="mini"
              class="compact-input"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="Y坐标" class="position-item">
          <div class="slider-input-group">
            <el-slider v-model.number="localElement.y" :min="0" :max="getMaxY" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.y" @change="handleInputChange('y', $event)" size="mini"
              class="compact-input"></el-input>
          </div>
        </el-form-item>
      </div>

      <!-- 尺寸控制 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-crop"></i>
          <span>尺寸</span>
        </div>
        <el-form-item label="宽度" class="size-item">
          <div class="slider-input-group">
            <el-slider v-model.number="localElement.width" :min="50" :max="2000" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.width" @change="handleInputChange('width', $event)" size="mini"
              class="compact-input"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="高度" class="size-item">
          <div class="slider-input-group">
            <el-slider v-model.number="localElement.height" :min="50" :max="2000" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.height" @change="handleInputChange('height', $event)" size="mini"
              class="compact-input"></el-input>
          </div>
        </el-form-item>
      </div>

      <!-- 显示与样式 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-video-camera"></i>
          <span>显示与样式</span>
        </div>

        <el-form-item label="显示方式" class="display-item">
          <el-select v-model="localElement.displayMode" @change="updateElement" class="full-width-select" size="mini">
            <el-option label="等比例居中" value="center"></el-option>
            <el-option label="拉伸填充" value="stretch"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="背景色" class="color-item">
          <div class="color-control-wrapper">
            <el-color-picker v-model="localElement.backgroundColor" @change="updateElement" show-alpha size="mini"
              class="compact-color-picker"></el-color-picker>
            <el-input v-model="localElement.backgroundColor" @change="updateElement" size="mini" placeholder="透明"
              class="color-input"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="透明度" class="opacity-item">
          <div class="slider-input-group">
            <el-slider v-model.number="localElement.opacity" :min="0" :max="255" @change="updateElement"
              class="compact-slider"></el-slider>
            <!-- <el-input v-model.number="localElement.opacity" @change="handleInputChange('opacity', $event)" size="mini"
              class="compact-input"></el-input> -->
          </div>
          <div class="percentage-display">
            {{ Math.round((localElement.opacity || 255) / 255 * 100) }}%
          </div>
        </el-form-item>
      </div>

      <!-- 层级控制 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-sort"></i>
          <span>层级控制</span>
        </div>
        <el-form-item label="层级" class="zindex-item">
          <div class="zindex-control-wrapper">
            <div class="slider-input-group">
              <el-slider v-model.number="localElement.zIndex" :min="0" :max="100" @change="updateElement"
                class="compact-slider"></el-slider>
              <el-input v-model.number="localElement.zIndex" @change="handleInputChange('zIndex', $event)" size="mini"
                class="compact-input"></el-input>
            </div>
            <div class="layer-buttons">
              <el-tooltip effect="dark" content="置于顶层" placement="top">
                <el-button size="mini" @click="moveToTop" class="layer-btn">
                  <i class="el-icon-top"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="上移一层" placement="top">
                <el-button size="mini" @click="moveUp" class="layer-btn">
                  <i class="el-icon-arrow-up"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="下移一层" placement="top">
                <el-button size="mini" @click="moveDown" class="layer-btn">
                  <i class="el-icon-arrow-down"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="置于底层" placement="top">
                <el-button size="mini" @click="moveToBottom" class="layer-btn">
                  <i class="el-icon-bottom"></i>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 视频文件管理 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-video-camera-solid"></i>
          <span>视频文件</span>
        </div>

        <el-form-item label="视频文件" class="video-file-item">
          <div class="video-manager-wrapper">
            <div v-if="!localElement.videoUrl" class="empty-video">
              <i class="el-icon-video-camera"></i>
              <p>暂无视频文件</p>
              <el-button size="small" @click="changeVideo" class="select-video-btn" icon="el-icon-upload">
                选择视频文件
              </el-button>
            </div>
            <div v-else class="video-info">
              <div class="video-preview-wrapper">
                <video :src="localElement.videoUrl" class="video-thumbnail" muted
                  @loadedmetadata="onVideoLoaded"></video>
                <div class="video-overlay">
                  <el-button type="text" size="mini" @click="playPausePreview" class="video-play-btn">
                    <i :class="isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'"></i>
                  </el-button>
                </div>
              </div>
              <div class="video-details">
                <div class="video-name">{{ localElement.videoName || '未命名视频' }}</div>
                <div class="video-specs">
                  <span v-if="videoDuration" class="video-duration">{{ formatDuration(videoDuration) }}</span>
                  <span v-if="videoSize" class="video-size">{{ formatFileSize(videoSize) }}</span>
                </div>
                <div class="video-actions">
                  <el-button type="text" size="mini" @click="changeVideo" class="change-video-btn">
                    <i class="el-icon-refresh"></i> 更换视频
                  </el-button>
                  <el-button type="text" size="mini" @click="removeVideo" class="remove-video-btn">
                    <i class="el-icon-delete"></i> 删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="视频格式" v-if="localElement.videoUrl" class="video-format-item">
          <div class="format-info">
            <span class="format-type">{{ getVideoFormat(localElement.videoUrl) }}</span>
            <span class="format-compatibility" :class="getCompatibilityClass(localElement.videoUrl)">
              {{ getCompatibilityText(localElement.videoUrl) }}
            </span>
          </div>
        </el-form-item>
      </div>

      <!-- 播放设置 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-set-up"></i>
          <span>播放设置</span>
        </div>

        <el-form-item label="播放控制" class="playback-controls">
          <div class="playback-options">
            <el-checkbox v-model="localElement.autoplay" @change="updateElement" class="playback-option">
              自动播放
            </el-checkbox>
            <el-checkbox v-model="localElement.loop" @change="updateElement" class="playback-option">
              循环播放
            </el-checkbox>
            <el-checkbox v-model="localElement.muted" @change="updateElement" class="playback-option">
              静音播放
            </el-checkbox>
            <el-checkbox v-model="localElement.controls" @change="updateElement" class="playback-option">
              显示控件
            </el-checkbox>
          </div>
        </el-form-item>

        <el-form-item label="音量" class="volume-item" v-if="!localElement.muted">
          <div class="slider-input-group">
            <el-slider v-model.number="localElement.volume" :min="0" :max="100" :step="1" @change="updateElement"
              class="compact-slider" :show-tooltip="false"></el-slider>
            <el-input v-model.number="localElement.volume" @change="handleInputChange('volume', $event)" size="mini"
              class="compact-input">
              <template slot="append">%</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="播放速率" class="playback-rate-item">
          <div class="slider-input-group">
            <el-slider v-model.number="localElement.playbackRate" :min="0.25" :max="2" :step="0.25"
              @change="updateElement" class="compact-slider" :show-tooltip="false"></el-slider>
            <el-input v-model.number="localElement.playbackRate" @change="handleInputChange('playbackRate', $event)"
              size="mini" class="compact-input">
              <template slot="append">x</template>
            </el-input>
          </div>
          <div class="rate-display">
            {{ getRateLabel(localElement.playbackRate) }}
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'VideoProperties',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localElement: {
        // 确保所有属性都有默认值
        x: this.element.x || 0,
        y: this.element.y || 0,
        width: this.element.width || 400,
        height: this.element.height || 300,
        backgroundColor: this.element.backgroundColor || 'transparent',
        opacity: this.element.opacity || 255,
        zIndex: this.element.zIndex || 1,
        displayMode: this.element.displayMode || 'center',
        videoUrl: this.element.videoUrl || '',
        videoName: this.element.videoName || '',
        autoplay: this.element.autoplay || false,
        loop: this.element.loop || false,
        muted: this.element.muted || true,
        controls: this.element.controls || false,
        volume: this.element.volume || 80,
        playbackRate: this.element.playbackRate || 1.0,
        id: this.element.id
      },
      isPlaying: false,
      videoDuration: 0,
      videoSize: 0
    }
  },
  computed: {
    getMaxX() {
      return Math.max(1920 - (this.localElement.width || 400), 0)
    },
    getMaxY() {
      return Math.max(1080 - (this.localElement.height || 300), 0)
    }
  },
  watch: {
    element: {
      handler(newVal) {
        // 只在元素ID变化时才重置localElement
        if (!this.localElement || this.localElement.id !== newVal.id) {
          this.localElement = {
            x: newVal.x || 0,
            y: newVal.y || 0,
            width: newVal.width || 400,
            height: newVal.height || 300,
            backgroundColor: newVal.backgroundColor || 'transparent',
            opacity: newVal.opacity || 255,
            zIndex: newVal.zIndex || 1,
            displayMode: newVal.displayMode || 'center',
            videoUrl: newVal.videoUrl || '',
            videoName: newVal.videoName || '',
            autoplay: newVal.autoplay || false,
            loop: newVal.loop || false,
            muted: newVal.muted || true,
            controls: newVal.controls || false,
            volume: newVal.volume || 80,
            playbackRate: newVal.playbackRate || 1.0,
            id: newVal.id
          }
          // 重置视频预览状态
          this.isPlaying = false
          this.videoDuration = 0
          this.videoSize = 0
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateElement() {
      this.$emit('update', this.localElement)
    },

    handleInputChange(prop, value) {
      // 确保输入的值是数字类型
      if (value !== null && value !== undefined) {
        this.localElement[prop] = Number(value)
      }
      this.updateElement()
    },

    moveToTop() {
      this.$emit('layer-action', { action: 'moveToTop', elementId: this.localElement.id })
    },
    moveUp() {
      this.$emit('layer-action', { action: 'moveUp', elementId: this.localElement.id })
    },
    moveDown() {
      this.$emit('layer-action', { action: 'moveDown', elementId: this.localElement.id })
    },
    moveToBottom() {
      this.$emit('layer-action', { action: 'moveToBottom', elementId: this.localElement.id })
    },

    async changeVideo() {
      const videoFiles = await this.selectFiles('video/*', false)
      if (videoFiles && videoFiles.length > 0) {
        const file = videoFiles[0]

        // 验证文件大小（建议不超过100MB）
        const maxSize = 100 * 1024 * 1024 // 100MB
        if (file.size > maxSize) {
          this.$message.warning('视频文件过大（' + (file.size / 1024 / 1024).toFixed(2) + 'MB），建议使用小于100MB的视频文件')
        }

        // 格式兼容性提示（不阻止上传）
        const formatInfo = this.getVideoFormatInfo(file.type)
        if (formatInfo.warning) {
          this.$message.warning(formatInfo.warning)
        } else if (formatInfo.info) {
          this.$message.info(formatInfo.info)
        }

        this.localElement.videoUrl = file.url
        this.localElement.videoName = file.name
        this.videoSize = file.size
        this.updateElement()

        this.$message.success('视频文件已选择，正在加载...')
      }
    },

    removeVideo() {
      this.$confirm('确定要删除这个视频吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.localElement.videoUrl = ''
        this.localElement.videoName = ''
        this.videoSize = 0
        this.videoDuration = 0
        this.isPlaying = false
        this.updateElement()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // 用户取消删除
      })
    },

    playPausePreview() {
      const videoElement = this.$el.querySelector('.video-thumbnail')
      if (videoElement) {
        if (this.isPlaying) {
          videoElement.pause()
        } else {
          videoElement.play()
        }
        this.isPlaying = !this.isPlaying
      }
    },

    onVideoLoaded(event) {
      this.videoDuration = event.target.duration
    },

    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    getVideoFormat(videoUrl) {
      if (!videoUrl) return '未知'

      const extension = videoUrl.split('.').pop().toLowerCase()
      const formatMap = {
        'mp4': 'MP4',
        'webm': 'WebM',
        'ogg': 'OGG',
        'mov': 'MOV',
        'avi': 'AVI',
        'mkv': 'MKV'
      }

      return formatMap[extension] || extension.toUpperCase()
    },

    getCompatibilityClass(videoUrl) {
      if (!videoUrl) return 'unknown'

      const extension = videoUrl.split('.').pop().toLowerCase()
      if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return 'good'
      } else if (['mov', 'avi'].includes(extension)) {
        return 'warning'
      } else {
        return 'poor'
      }
    },

    getCompatibilityText(videoUrl) {
      if (!videoUrl) return '未知兼容性'

      const extension = videoUrl.split('.').pop().toLowerCase()
      const compatibilityMap = {
        'mp4': '优秀兼容性',
        'webm': '良好兼容性',
        'ogg': '一般兼容性',
        'mov': '有限兼容性',
        'avi': '有限兼容性',
        'mkv': '不兼容'
      }

      return compatibilityMap[extension] || '未知兼容性'
    },

    getVideoFormatInfo(mimeType) {
      const formatMap = {
        'video/mp4': {
          info: '已加载 MP4 视频，兼容性最佳（推荐使用 H.264 编码）'
        },
        'video/webm': {
          info: '已加载 WebM 视频，现代浏览器支持良好（Safari/iOS 不支持）'
        },
        'video/ogg': {
          warning: '已加载 OGG 视频，部分浏览器不支持（Safari/Edge/IE 不支持）'
        },
        'video/quicktime': {
          warning: '已加载 MOV 视频，建议转换为 MP4 以获得更好的兼容性'
        },
        'video/x-msvideo': {
          warning: '已加载 AVI 视频，浏览器可能不支持，建议转换为 MP4'
        },
        'video/x-matroska': {
          warning: '已加载 MKV 视频，浏览器不支持，请转换为 MP4 或 WebM'
        }
      }

      if (mimeType && formatMap[mimeType]) {
        return formatMap[mimeType]
      }

      // 未知格式
      if (mimeType && mimeType.startsWith('video/')) {
        return {
          warning: '检测到视频格式: ' + mimeType + '，如果无法播放，请转换为 MP4(H.264) 格式'
        }
      }

      return {
        warning: '无法识别视频格式，推荐使用 MP4(H.264)、WebM(VP9) 或 OGG 格式'
      }
    },

    getRateLabel(rate) {
      const rateMap = {
        0.25: '慢速',
        0.5: '较慢',
        0.75: '稍慢',
        1: '正常',
        1.25: '稍快',
        1.5: '较快',
        1.75: '快速',
        2: '2倍速'
      }
      return rateMap[rate] || `${rate}x`
    },

    selectFiles(accept, multiple = false) {
      return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = accept
        input.multiple = multiple

        input.onchange = (event) => {
          const files = Array.from(event.target.files)

          // 对于视频文件，使用 Blob URL 而不是 Base64
          if (accept.includes('video')) {
            const fileData = files.map(file => {
              // 创建 Blob URL
              const blobUrl = URL.createObjectURL(file)
              return {
                url: blobUrl,
                name: file.name,
                size: file.size,
                type: file.type,
                blob: file // 保存原始文件引用
              }
            })
            resolve(fileData)
          } else {
            // 对于图片等其他文件，继续使用 Base64
            const filePromises = files.map(file => {
              return new Promise((fileResolve) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                  fileResolve({
                    url: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type
                  })
                }
                reader.readAsDataURL(file)
              })
            })
            Promise.all(filePromises).then(resolve)
          }
        }

        input.oncancel = () => resolve(null)
        input.click()
      })
    }
  }
}
</script>

<style scoped>
.panel-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.video-properties-form {
  margin-top: 10px;
}

.form-section {
  margin-bottom: 24px;
  padding: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.section-header i {
  margin-right: 8px;
  color: #409EFF;
}

::v-deep .el-form-item {
  margin-bottom: 18px;
}

::v-deep .el-form-item__label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

/* 滑块和输入框组合样式 */
.slider-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.compact-slider {
  flex: 1;
}

.compact-input {
  width: 65px !important;
}

::v-deep .el-input-group__append {
  padding: 0 10px;
}

::v-deep .compact-input .el-input__inner {
  padding: 0 8px;
  text-align: center;
  height: 28px;
  line-height: 28px;
}

.full-width-select {
  width: 100%;
}

/* 颜色选择器样式 */
.color-control-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.compact-color-picker {
  height: 28px;
}

.color-input {
  width: 120px !important;
}

/* 透明度百分比显示 */
.percentage-display {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin-top: 5px;
}

/* 层级控制 */
.zindex-control-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.layer-buttons {
  display: flex;
  justify-content: space-between;
}

.layer-btn {
  flex: 1;
  margin: 0 2px;
  padding: 6px 0;
}

/* 视频管理样式 */
.video-manager-wrapper {
  width: 100%;
}

.empty-video {
  text-align: center;
  padding: 20px 0;
  color: #c0c4cc;
}

.empty-video i {
  font-size: 40px;
  margin-bottom: 8px;
  display: block;
}

.empty-video p {
  margin: 0 0 12px 0;
  font-size: 12px;
}

.select-video-btn {
  width: 100%;
}

.video-info {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fafafa;
}

.video-preview-wrapper {
  position: relative;
  width: 120px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #000;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.video-preview-wrapper:hover .video-overlay {
  opacity: 1;
}

.video-play-btn {
  color: white !important;
  font-size: 24px;
}

.video-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.video-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-specs {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.video-duration,
.video-size {
  font-size: 11px;
  color: #909399;
  background-color: #f0f0f0;
  border-radius: 2px;
  padding: 2px 6px;
}

.video-actions {
  display: flex;
  gap: 8px;
}

.change-video-btn {
  color: #409EFF !important;
  font-size: 12px;
}

.remove-video-btn {
  color: #f56c6c !important;
  font-size: 12px;
}

/* 格式信息 */
.format-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.format-type {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}

.format-compatibility {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 2px;
  display: inline-block;
}

.format-compatibility.good {
  background-color: #f0f9ff;
  color: #409EFF;
}

.format-compatibility.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.format-compatibility.poor {
  background-color: #fef0f0;
  color: #f56c6c;
}

.format-compatibility.unknown {
  background-color: #f4f4f5;
  color: #909399;
}

/* 播放设置 */
.playback-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playback-option {
  margin-right: 0;
}

.rate-display {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin-top: 5px;
}

.compact-input {
  width: 80px !important;
}

.slider-input-group>>>.el-input-group__append {
  padding: 0 15px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .layer-buttons {
    flex-wrap: wrap;
  }

  .layer-btn {
    flex: 0 0 48%;
    margin-bottom: 4px;
  }

  .slider-input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .compact-input {
    width: 100% !important;
  }

  .video-info {
    flex-direction: column;
  }

  .video-preview-wrapper {
    width: 100%;
    height: 120px;
  }

  .playback-options {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .playback-option {
    flex: 0 0 48%;
  }
}
</style>