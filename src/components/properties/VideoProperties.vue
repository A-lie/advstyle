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
        <el-slider
          v-model="localElement.zIndex"
          :min="0"
          :max="100"
          @change="updateElement"
          show-input
          :show-input-controls="false"
          input-size="mini"
        ></el-slider>
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
    async changeVideo() {
      const videoFiles = await this.selectFiles('video/*', false)
      if (videoFiles && videoFiles.length > 0) {
        this.localElement.videoUrl = videoFiles[0].url
        this.localElement.videoName = videoFiles[0].name
        this.updateElement()
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
</style>