<template>
  <div class="video-properties">
    <h4>视频属性</h4>
    
    <el-form size="small" label-width="70px">
      <el-form-item label="位置">
        <div class="slider-group">
          <div class="slider-item">
            <label>X坐标</label>
            <el-slider
              v-model="localElement.x"
              :min="0"
              :max="getMaxX"
              :step="1"
              @change="updateElement"
              show-input
              :show-input-controls="false"
              input-size="mini"
            ></el-slider>
          </div>
          <div class="slider-item">
            <label>Y坐标</label>
            <el-slider
              v-model="localElement.y"
              :min="0"
              :max="getMaxY"
              :step="1"
              @change="updateElement"
              show-input
              :show-input-controls="false"
              input-size="mini"
            ></el-slider>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item label="尺寸">
        <div class="slider-group">
          <div class="slider-item">
            <label>宽度</label>
            <el-slider
              v-model="localElement.width"
              :min="50"
              :max="2000"
              :step="1"
              @change="updateElement"
              show-input
              :show-input-controls="false"
              input-size="mini"
            ></el-slider>
          </div>
          <div class="slider-item">
            <label>高度</label>
            <el-slider
              v-model="localElement.height"
              :min="50"
              :max="2000"
              :step="1"
              @change="updateElement"
              show-input
              :show-input-controls="false"
              input-size="mini"
            ></el-slider>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item label="显示方式">
        <el-select v-model="localElement.displayMode" @change="updateElement">
          <el-option label="等比例居中" value="center"></el-option>
          <el-option label="拉伸填充" value="stretch"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="背景色">
        <el-color-picker 
          v-model="localElement.backgroundColor"
          @change="updateElement"
          show-alpha
          size="small"
        ></el-color-picker>
      </el-form-item>
      
      <el-form-item label="透明度">
        <div class="slider-item">
          <el-slider
            v-model="localElement.opacity"
            :min="0"
            :max="255"
            @change="updateElement"
            show-input
            :show-input-controls="false"
            input-size="mini"
          ></el-slider>
          <span class="opacity-value">{{ Math.round(localElement.opacity / 255 * 100) }}%</span>
        </div>
      </el-form-item>
      
      <el-form-item label="层级">
        <div class="layer-control">
          <el-slider
            v-model="localElement.zIndex"
            :min="0"
            :max="100"
            @change="updateElement"
            show-input
            :show-input-controls="false"
            input-size="mini"
            style="flex: 1; margin-right: 10px;"
          ></el-slider>
          <div class="layer-buttons">
            <el-button 
              size="mini" 
              @click="moveToTop"
              title="置于顶层"
              icon="el-icon-top"
            ></el-button>
            <el-button 
              size="mini" 
              @click="moveUp"
              title="上移一层"
              icon="el-icon-arrow-up"
            ></el-button>
            <el-button 
              size="mini" 
              @click="moveDown"
              title="下移一层"
              icon="el-icon-arrow-down"
            ></el-button>
            <el-button 
              size="mini" 
              @click="moveToBottom"
              title="置于底层"
              icon="el-icon-bottom"
            ></el-button>
          </div>
        </div>
      </el-form-item>
      
      <!-- 视频文件 -->
      <el-form-item label="视频文件">
        <div v-if="localElement.videoUrl" class="video-info">
          <div class="video-preview">
            <video 
              :src="localElement.videoUrl" 
              class="video-thumbnail"
              muted
            ></video>
          </div>
          <div class="video-details">
            <span class="video-name">{{ localElement.videoName }}</span>
            <el-button 
              type="text" 
              size="mini" 
              @click="changeVideo"
              style="color: #409eff;"
            >
              更换视频
            </el-button>
          </div>
        </div>
        <el-button v-else size="small" @click="changeVideo">选择视频文件</el-button>
      </el-form-item>
      
      <!-- 播放设置 -->
      <el-form-item label="播放设置">
        <el-checkbox 
          v-model="localElement.autoplay" 
          @change="updateElement"
        >
          自动播放
        </el-checkbox>
        <br>
        <el-checkbox 
          v-model="localElement.loop" 
          @change="updateElement"
        >
          循环播放
        </el-checkbox>
      </el-form-item>
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
      localElement: { ...this.element }
    }
  },
  computed: {
    getMaxX() {
      return Math.max(1920 - this.localElement.width, 0)
    },
    getMaxY() {
      return Math.max(1080 - this.localElement.height, 0)
    }
  },
  watch: {
    element: {
      handler(newVal) {
        this.localElement = { ...newVal }
      },
      deep: true
    }
  },
  methods: {
    updateElement() {
      this.$emit('update', this.localElement)
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
        this.updateElement()
        
        this.$message.success('视频文件已选择，正在加载...')
      }
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
.video-properties h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
}

.slider-group {
  margin-bottom: 10px;
}

.slider-item {
  margin-bottom: 15px;
}

.slider-item label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.opacity-value {
  margin-left: 10px;
  color: #666;
  font-size: 12px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.el-slider {
  margin-right: 10px;
}

.el-slider__input {
  width: 60px;
}

.video-info {
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

.video-preview {
  margin-right: 10px;
}

.video-thumbnail {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.video-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.video-name {
  font-size: 12px;
  color: #666;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}

.el-checkbox {
  margin-bottom: 8px;
}

.layer-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.layer-buttons {
  display: flex;
  gap: 4px;
}

.layer-buttons .el-button {
  padding: 4px 6px;
  min-width: auto;
}
</style>