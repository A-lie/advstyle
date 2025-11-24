<template>
  <div class="text-properties">
    <h4 class="panel-title">文字属性</h4>

    <el-form size="small" label-width="100px" class="text-properties-form">
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
            <el-slider v-model="localElement.height" :min="30" :max="2000" :step="1" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.height" @change="updateElement" size="mini"
              class="compact-input"></el-input>
          </div>
        </el-form-item>
      </div>

      <!-- 背景与透明度 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-picture"></i>
          <span>背景与透明度</span>
        </div>

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
            <!-- <el-input v-model.number="localElement.opacity" @change="updateElement" size="mini"
              class="compact-input"></el-input> -->
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

      <!-- 文字样式 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-edit"></i>
          <span>文字样式</span>
        </div>

        <el-form-item label="字体大小" class="font-size-item">
          <div class="slider-input-group">
            <el-slider v-model="localElement.fontSize" :min="12" :max="200" @change="updateElement"
              class="compact-slider"></el-slider>
            <el-input v-model.number="localElement.fontSize" @change="updateElement" size="mini" class="compact-input">
              <template slot="append">px</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="字体颜色" class="font-color-item">
          <div class="color-control-wrapper">
            <el-color-picker v-model="localElement.fontColor" @change="updateElement" size="mini"
              class="compact-color-picker"></el-color-picker>
            <el-input v-model="localElement.fontColor" @change="updateElement" size="mini"
              class="color-input"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="字体样式" class="font-style-item">
          <div class="font-style-controls">
            <el-checkbox v-model="localElement.fontWeight" @change="updateElement" class="font-style-checkbox">
              加粗
            </el-checkbox>
            <el-checkbox v-model="localElement.fontItalic" @change="updateElement" class="font-style-checkbox">
              斜体
            </el-checkbox>
            <el-checkbox v-model="localElement.fontUnderline" @change="updateElement" class="font-style-checkbox">
              下划线
            </el-checkbox>
          </div>
        </el-form-item>

        <el-form-item label="对齐方式" class="text-align-item">
          <el-select v-model="localElement.textAlign" @change="updateElement" class="full-width-select" size="mini">
            <el-option label="左对齐" value="left"></el-option>
            <el-option label="居中" value="center"></el-option>
            <el-option label="右对齐" value="right"></el-option>
            <el-option label="滚动" value="scroll"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="滚动速度" v-if="localElement.textAlign === 'scroll'" class="scroll-speed-item">
          <div class="slider-input-group">
            <el-slider v-model="localElement.scrollSpeed" :min="1" :max="9" :step="1" @change="updateElement"
              class="compact-slider" :marks="scrollSpeedMarks"></el-slider>
            <el-input v-model.number="localElement.scrollSpeed" @change="updateElement" size="mini"
              class="compact-input"></el-input>
          </div>
          <div class="speed-display">
            {{ getSpeedLabel(localElement.scrollSpeed) }}
          </div>
        </el-form-item>
      </div>

      <!-- 文本内容管理 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-document"></i>
          <span>文本内容</span>
        </div>
        <el-form-item label="文本列表" class="text-manager-item">
          <div class="text-list-wrapper">
            <div v-if="!localElement.texts || localElement.texts.length === 0" class="empty-text-list">
              <i class="el-icon-document-remove"></i>
              <p>暂无文本内容</p>
            </div>
            <div v-else class="text-list">
              <div v-for="(text, index) in localElement.texts" :key="index" class="text-item"
                :class="{ 'active-text': index === currentTextIndex }">
                <div class="text-content-wrapper">
                  <el-input v-model="localElement.texts[index]" type="textarea" :rows="3" @input="updateElement"
                    placeholder="请输入文本内容" class="text-content-input" resize="none"></el-input>
                  <div class="text-actions" v-if="localElement.texts.length > 1">
                    <el-button type="text" size="mini" @click="removeText(index)" class="text-remove-btn">
                      <i class="el-icon-delete"></i> 删除
                    </el-button>
                  </div>
                </div>
                <div class="text-info">
                  <span class="text-index">文本 #{{ index + 1 }}</span>
                  <span class="text-length">{{ text.length }} 字符</span>
                </div>
              </div>
            </div>
            <el-button size="small" @click="addText" class="add-text-btn" icon="el-icon-plus">
              添加文本
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="切换间隔" v-if="localElement.texts && localElement.texts.length > 1" class="interval-item">
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
  name: 'TextProperties',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localElement: {
        ...this.element,
        // 确保关键属性有默认值
        textAlign: this.element.textAlign || 'left',
        scrollSpeed: this.element.scrollSpeed || 5,
        fontWeight: this.element.fontWeight || false,
        fontItalic: this.element.fontItalic || false,
        fontUnderline: this.element.fontUnderline || false,
        texts: this.element.texts || ['文本内容']
      },
      currentTextIndex: 0,
      scrollSpeedMarks: {
        1: '慢',
        5: '中',
        9: '快'
      }
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
        // 只在元素ID变化时才重置localElement，避免覆盖用户的修改
        if (!this.localElement || this.localElement.id !== newVal.id) {
          this.localElement = {
            ...newVal,
            textAlign: newVal.textAlign || 'left',
            scrollSpeed: newVal.scrollSpeed || 5,
            fontWeight: newVal.fontWeight || false,
            fontItalic: newVal.fontItalic || false,
            fontUnderline: newVal.fontUnderline || false,
            texts: newVal.texts || ['文本内容']
          }
        } else {
          // 如果是同一个元素，只更新那些不是用户正在编辑的属性
          // 保留用户在属性面板中的修改
          this.localElement = {
            ...this.localElement,
            ...newVal,
            // 确保样式属性不被覆盖
            textAlign: this.localElement.textAlign,
            scrollSpeed: this.localElement.scrollSpeed,
            fontWeight: this.localElement.fontWeight,
            fontItalic: this.localElement.fontItalic,
            fontUnderline: this.localElement.fontUnderline
          }
        }
      },
      deep: true
    }
  },
  methods: {
    updateElement() {
      // 确保所有属性都被正确传递
      const updatedElement = {
        ...this.localElement,
        // 明确包含这些关键属性
        textAlign: this.localElement.textAlign,
        scrollSpeed: this.localElement.scrollSpeed || 5,
        fontWeight: this.localElement.fontWeight,
        fontItalic: this.localElement.fontItalic,
        fontUnderline: this.localElement.fontUnderline
      }
      this.$emit('update', updatedElement)
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
    getSpeedLabel(speed) {
      if (speed <= 3) return '慢速'
      if (speed <= 6) return '中速'
      return '快速'
    },
    addText() {
      if (!this.localElement.texts) {
        this.localElement.texts = []
      }
      this.localElement.texts.push('新文本内容')
      this.updateElement()
    },
    removeText(index) {
      if (this.localElement.texts.length > 1) {
        this.$confirm('确定要删除这个文本吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.localElement.texts.splice(index, 1)
          this.updateElement()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          // 用户取消删除
        })
      }
    }
  }
}
</script>

<style scoped>
.text-properties {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto;
}

.panel-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.text-properties-form {
  margin-top: 10px;
}

.form-section {
  margin-bottom: 24px;
  padding: 16px;
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
  width: 100px !important;
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

/* 字体样式控制 */
.font-style-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.font-style-checkbox {
  margin-right: 0;
}

/* 滚动速度显示 */
.speed-display {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin-top: 5px;
}

/* 文本内容管理 */
.text-list-wrapper {
  width: 100%;
}

.empty-text-list {
  text-align: center;
  padding: 20px 0;
  color: #c0c4cc;
}

.empty-text-list i {
  font-size: 40px;
  margin-bottom: 8px;
  display: block;
}

.empty-text-list p {
  margin: 0;
  font-size: 12px;
}

.text-list {
  margin-bottom: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.text-item {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: all 0.3s;
}

.text-item:hover,
.text-item.active-text {
  border-color: #409EFF;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.1);
}

.text-content-wrapper {
  margin-bottom: 8px;
}

.text-content-input ::v-deep .el-textarea__inner {
  resize: none;
  font-size: 12px;
  line-height: 1.4;
}

.text-actions {
  text-align: right;
  margin-top: 8px;
}

.text-remove-btn {
  color: #f56c6c !important;
  font-size: 12px;
}

.text-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #909399;
  padding-top: 6px;
  border-top: 1px solid #f0f0f0;
}

.text-index {
  font-weight: 500;
}

.text-length {
  background-color: #f0f0f0;
  border-radius: 2px;
  padding: 1px 4px;
}

.add-text-btn {
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

  .font-style-controls {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
