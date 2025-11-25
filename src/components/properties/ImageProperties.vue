<template>
  <div class="image-properties">
    <h4 class="panel-title">图片属性</h4>

    <el-form size="small" label-width="100px" class="image-properties-form">
      <!-- 位置控制 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-location"></i>
          <span>位置</span>
        </div>
        <el-form-item label="X坐标" class="position-item">
          <div class="slider-input-group">
            <el-slider v-model="localElement.x" :min="0" :max="getMaxX" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.x" @change="updateElement" size="mini"
              class="compact-input"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="Y坐标" class="position-item">
          <div class="slider-input-group">
            <el-slider v-model="localElement.y" :min="0" :max="getMaxY" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.y" @change="updateElement" size="mini"
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
            <el-slider v-model="localElement.width" :min="50" :max="2000" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.width" @change="updateElement" size="mini"
              class="compact-input"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="高度" class="size-item">
          <div class="slider-input-group">
            <el-slider v-model="localElement.height" :min="50" :max="2000" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.height" @change="updateElement" size="mini"
              class="compact-input"></el-input>
          </div>
        </el-form-item>
      </div>

      <!-- 显示与样式 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-picture"></i>
          <span>显示与样式</span>
        </div>

        <el-form-item label="显示方式" class="display-item">
          <el-select v-model="localElement.displayMode" @change="updateElement" class="full-width-select" size="mini">
            <el-option label="覆盖" value="cover"></el-option>
            <el-option label="填充" value="fill"></el-option>
            <el-option label="缩放" value="scale-down"></el-option>
            <el-option label="无" value="none"></el-option>
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
            <el-slider v-model="localElement.opacity" :min="0" :max="255" @change="updateElement"
              class="compact-slider"></el-slider>
            <!-- <el-input 
              v-model.number="localElement.opacity" 
              @change="updateElement"
              size="mini" 
              class="compact-input"
            >
              <template slot="append">%</template>
</el-input> -->
          </div>
          <div class="percentage-display">
            {{ Math.round(localElement.opacity / 255 * 100) }}%
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
              <el-slider v-model="localElement.zIndex" :min="0" :max="100" @change="updateElement"
                class="compact-slider"></el-slider>
              <el-input v-model.number="localElement.zIndex" @change="updateElement" size="mini"
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

      <!-- 图片管理 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-files"></i>
          <span>图片管理</span>
        </div>
        <el-form-item label="图片列表" class="image-manager-item">
          <div class="image-list-wrapper">
            <div v-if="!localElement.images || localElement.images.length === 0" class="empty-image-list">
              <i class="el-icon-picture-outline"></i>
              <p>暂无图片</p>
            </div>
            <div v-else class="image-list">
              <div v-for="(image, index) in localElement.images" :key="index" class="image-item"
                :class="{ 'active-image': index === currentImageIndex }" @click="setCurrentImage(index)">
                <div class="image-thumbnail-wrapper">
                  <img :src="image.url" class="image-thumbnail" />
                  <div class="image-overlay">
                    <el-button type="text" size="mini" @click.stop="removeImage(index)" class="image-remove-btn">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </div>
                </div>
                <div class="image-info">
                  <span class="image-name">{{ image.name }}</span>
                  <span class="image-index">#{{ index + 1 }}</span>
                </div>
              </div>
            </div>
            <el-button size="small" @click="addImages" class="add-image-btn" icon="el-icon-plus">
              添加图片
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="切换间隔" v-if="localElement.images && localElement.images.length > 1" class="interval-item">
          <div class="slider-input-group">
            <el-slider v-model="localElement.interval" :min="500" :max="60000" :step="500" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.interval" @change="updateElement" size="mini" class="compact-input">
              <template slot="append">ms</template>
            </el-input>
          </div>
          <div class="interval-display">
            {{ (localElement.interval / 1000).toFixed(1) }}秒
          </div>
        </el-form-item>
      </div>
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
      localElement: { ...this.element },
      currentImageIndex: 0
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
    setCurrentImage(index) {
      this.currentImageIndex = index
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
      this.$confirm('确定要删除这张图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.localElement.images.splice(index, 1)
        this.updateElement()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // 用户取消删除
      })
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
.panel-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.image-properties-form {
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
  width: 85px !important;
}

.slider-input-group>>>.el-input-group__append {
  padding: 0 10px;
}

.slider-input-group>>>.el-input__inner {
  padding: 0 7px;
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

/* 图片管理 */
.image-list-wrapper {
  width: 100%;
}

.empty-image-list {
  text-align: center;
  padding: 20px 0;
  color: #c0c4cc;
}

.empty-image-list i {
  font-size: 40px;
  margin-bottom: 8px;
  display: block;
}

.empty-image-list p {
  margin: 0;
  font-size: 12px;
}

.image-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 12px;
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}

.image-item {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.image-item:hover,
.image-item.active-image {
  border-color: #409EFF;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
}

.image-thumbnail-wrapper {
  position: relative;
  height: 60px;
  overflow: hidden;
}

.image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
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

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-remove-btn {
  color: #f56c6c !important;
  font-size: 16px;
}

.image-info {
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
}

.image-name {
  font-size: 11px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70px;
}

.image-index {
  font-size: 10px;
  color: #909399;
  background-color: #e4e7ed;
  border-radius: 2px;
  padding: 1px 4px;
}

.add-image-btn {
  width: 100%;
  margin-top: 8px;
}

.interval-display {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin-top: 5px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .image-list {
    grid-template-columns: 1fr;
  }

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
}
</style>
