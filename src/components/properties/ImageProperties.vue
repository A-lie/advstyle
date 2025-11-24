<template>
  <div class="image-properties">
    <h4>图片属性</h4>

    <el-form size="small" label-width="70px">
      <el-form-item label="位置">
        <div class="slider-group">
          <div class="slider-item">
            <label>X坐标</label>
            <el-slider v-model="localElement.x" :min="0" :max="getMaxX" :step="1" @change="updateElement" show-input
              :show-input-controls="false" input-size="mini"></el-slider>
          </div>
          <div class="slider-item">
            <label>Y坐标</label>
            <el-slider v-model="localElement.y" :min="0" :max="getMaxY" :step="1" @change="updateElement" show-input
              :show-input-controls="false" input-size="mini"></el-slider>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="尺寸">
        <div class="slider-group">
          <div class="slider-item">
            <label>宽度</label>
            <el-slider v-model="localElement.width" :min="50" :max="2000" :step="1" @change="updateElement" show-input
              :show-input-controls="false" input-size="mini"></el-slider>
          </div>
          <div class="slider-item">
            <label>高度</label>
            <el-slider v-model="localElement.height" :min="50" :max="2000" :step="1" @change="updateElement" show-input
              :show-input-controls="false" input-size="mini"></el-slider>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="显示方式">
        <el-select v-model="localElement.displayMode" @change="updateElement">
          <el-option label="覆盖" value="cover"></el-option>
          <el-option label="填充" value="fill"></el-option>
          <el-option label="缩放" value="scale-down"></el-option>
          <el-option label="无" value="none"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="背景色">
        <el-color-picker v-model="localElement.backgroundColor" @change="updateElement" show-alpha
          size="small"></el-color-picker>
      </el-form-item>

      <el-form-item label="透明度">
        <div class="slider-item">
          <el-slider v-model="localElement.opacity" :min="0" :max="255" @change="updateElement" show-input
            :show-input-controls="false" input-size="mini"></el-slider>
          <span class="opacity-value">{{ Math.round(localElement.opacity / 255 * 100) }}%</span>
        </div>
      </el-form-item>

      <el-form-item label="层级">
        <div class="layer-control">
          <el-slider v-model="localElement.zIndex" :min="0" :max="100" @change="updateElement" show-input
            :show-input-controls="false" input-size="mini" style="flex: 1; margin-right: 10px;"></el-slider>
          <div class="layer-buttons">
            <el-button size="mini" @click="moveToTop" title="置于顶层" icon="el-icon-top"></el-button>
            <el-button size="mini" @click="moveUp" title="上移一层" icon="el-icon-arrow-up"></el-button>
            <el-button size="mini" @click="moveDown" title="下移一层" icon="el-icon-arrow-down"></el-button>
            <el-button size="mini" @click="moveToBottom" title="置于底层" icon="el-icon-bottom"></el-button>
          </div>
        </div>
      </el-form-item>

      <!-- 图片管理 -->
      <el-form-item label="图片管理">
        <div class="image-list">
          <div v-for="(image, index) in localElement.images" :key="index" class="image-item">
            <img :src="image.url" class="image-thumbnail" />
            <div class="image-info">
              <span class="image-name">{{ image.name }}</span>
              <el-button type="text" size="mini" @click="removeImage(index)" style="color: #f56c6c;">
                删除
              </el-button>
            </div>
          </div>
        </div>
        <el-button size="small" @click="addImages">添加图片</el-button>
      </el-form-item>

      <el-form-item label="切换间隔" v-if="localElement.images && localElement.images.length > 1">
        <div class="slider-item">
          <el-slider v-model="localElement.interval" :min="500" :max="60000" :step="500" @change="updateElement"
            show-input :show-input-controls="false" input-size="mini"></el-slider>
          <span class="unit">毫秒</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ImageProperties',
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
    async addImages() {
      const imageFiles = await this.selectFiles('image/*', true)
      if (imageFiles && imageFiles.length > 0) {
        const newImages = imageFiles.map(file => ({
          url: file.url,
          name: file.name
        }))
        this.localElement.images = [...(this.localElement.images || []), ...newImages]
        this.updateElement()
      }
    },
    removeImage(index) {
      this.localElement.images.splice(index, 1)
      this.updateElement()
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
.image-properties h4 {
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

.opacity-value,
.unit {
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

.image-list {
  margin-bottom: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

.image-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.image-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-name {
  font-size: 12px;
  color: #666;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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