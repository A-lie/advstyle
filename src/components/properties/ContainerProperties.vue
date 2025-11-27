<template>
  <div class="container-properties">
    <h4 class="panel-title">容器属性</h4>
    
    <el-form size="small" label-width="100px" class="container-properties-form">
      <!-- 位置控制 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-location"></i>
          <span>位置</span>
        </div>
        <el-form-item label="X坐标" class="position-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.x"
              :min="0"
              :max="getMaxX"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.x"
              @change="handleInputChange('x', $event)"
              size="mini"
              class="compact-input"
            ></el-input>
          </div>
        </el-form-item>
        
        <el-form-item label="Y坐标" class="position-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.y"
              :min="0"
              :max="getMaxY"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.y"
              @change="handleInputChange('y', $event)"
              size="mini"
              class="compact-input"
            ></el-input>
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
            <el-slider
              v-model.number="localElement.width"
              :min="50"
              :max="2000"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.width"
              @change="handleInputChange('width', $event)"
              size="mini"
              class="compact-input"
            ></el-input>
          </div>
        </el-form-item>
        
        <el-form-item label="高度" class="size-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.height"
              :min="50"
              :max="2000"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.height"
              @change="handleInputChange('height', $event)"
              size="mini"
              class="compact-input"
            ></el-input>
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
            <el-color-picker 
              v-model="localElement.backgroundColor"
              @change="handleInputChange('backgroundColor', $event)"
              show-alpha
              size="mini"
              class="compact-color-picker"
            ></el-color-picker>
            <el-input
              v-model="localElement.backgroundColor"
              @change="handleInputChange('backgroundColor', $event)"
              size="mini"
              placeholder="透明"
              class="color-input"
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item label="透明度" class="opacity-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.opacity"
              :min="0"
              :max="255"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.opacity"
              @change="handleInputChange('opacity', $event)"
              size="mini"
              class="compact-input"
            ></el-input>
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
              <el-slider
                v-model.number="localElement.zIndex"
                :min="0"
                :max="100"
                @change="updateElement"
                class="compact-slider"
              ></el-slider>
              <el-input
                v-model.number="localElement.zIndex"
                @change="handleInputChange('zIndex', $event)"
                size="mini"
                class="compact-input"
              ></el-input>
            </div>
            <div class="layer-buttons">
              <el-tooltip effect="dark" content="置于顶层" placement="top">
                <el-button 
                  size="mini" 
                  @click="moveToTop"
                  class="layer-btn"
                >
                  <i class="el-icon-top"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="上移一层" placement="top">
                <el-button 
                  size="mini" 
                  @click="moveUp"
                  class="layer-btn"
                >
                  <i class="el-icon-arrow-up"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="下移一层" placement="top">
                <el-button 
                  size="mini" 
                  @click="moveDown"
                  class="layer-btn"
                >
                  <i class="el-icon-arrow-down"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="置于底层" placement="top">
                <el-button 
                  size="mini" 
                  @click="moveToBottom"
                  class="layer-btn"
                >
                  <i class="el-icon-bottom"></i>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 边框设置 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-c-scale-to-original"></i>
          <span>边框设置</span>
        </div>
        
        <el-form-item label="边框宽度" class="border-width-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.borderWidth"
              :min="0"
              :max="20"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.borderWidth"
              @change="handleInputChange('borderWidth', $event)"
              size="mini"
              class="compact-input"
            >
              <template slot="append">px</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item 
          label="边框颜色" 
          v-if="localElement.borderWidth > 0"
          class="border-color-item"
        >
          <div class="color-control-wrapper">
            <el-color-picker 
              v-model="localElement.borderColor"
              @change="updateElement"
              size="mini"
              class="compact-color-picker"
            ></el-color-picker>
            <el-input
              v-model="localElement.borderColor"
              @change="handleInputChange('borderColor', $event)"
              size="mini"
              class="color-input"
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item 
          label="边框样式" 
          v-if="localElement.borderWidth > 0"
          class="border-style-item"
        >
          <el-select 
            v-model="localElement.borderStyle" 
            @change="handleInputChange('borderStyle', $event)"
            class="full-width-select"
            size="mini"
          >
            <el-option label="实线" value="solid"></el-option>
            <el-option label="虚线" value="dashed"></el-option>
            <el-option label="点线" value="dotted"></el-option>
            <el-option label="双线" value="double"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="圆角" class="border-radius-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.borderRadius"
              :min="0"
              :max="100"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.borderRadius"
              @change="handleInputChange('borderRadius', $event)"
              size="mini"
              class="compact-input"
            >
              <template slot="append">px</template>
            </el-input>
          </div>
        </el-form-item>
      </div>

      <!-- 阴影设置 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-moon"></i>
          <span>阴影设置</span>
        </div>
        
        <el-form-item label="阴影颜色" class="shadow-color-item">
          <div class="color-control-wrapper">
            <el-color-picker 
              v-model="localElement.shadowColor"
              @change="handleInputChange('shadowColor', $event)"
              show-alpha
              size="mini"
              class="compact-color-picker"
            ></el-color-picker>
            <el-input
              v-model="localElement.shadowColor"
              @change="handleInputChange('shadowColor', $event)"
              size="mini"
              placeholder="rgba(0,0,0,0.5)"
              class="color-input"
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item label="阴影模糊" class="shadow-blur-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.shadowBlur"
              :min="0"
              :max="50"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.shadowBlur"
              @change="handleInputChange('shadowBlur', $event)"
              size="mini"
              class="compact-input"
            >
              <template slot="append">px</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="阴影偏移X" class="shadow-offset-x-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.shadowOffsetX"
              :min="-50"
              :max="50"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.shadowOffsetX"
              @change="handleInputChange('shadowOffsetX', $event)"
              size="mini"
              class="compact-input"
            >
              <template slot="append">px</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="阴影偏移Y" class="shadow-offset-y-item">
          <div class="slider-input-group">
            <el-slider
              v-model.number="localElement.shadowOffsetY"
              :min="-50"
              :max="50"
              :step="1"
              @change="updateElement"
              class="compact-slider"
            ></el-slider>
            <el-input
              v-model.number="localElement.shadowOffsetY"
              @change="handleInputChange('shadowOffsetY', $event)"
              size="mini"
              class="compact-input"
            >
              <template slot="append">px</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="预览" class="shadow-preview-item">
          <div 
            class="shadow-preview" 
            :style="{
              boxShadow: `${localElement.shadowOffsetX || 0}px ${localElement.shadowOffsetY || 0}px ${localElement.shadowBlur || 0}px ${localElement.shadowColor || 'rgba(0,0,0,0.5)'}`
            }"
          ></div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ContainerProperties',
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
        width: this.element.width || 300,
        height: this.element.height || 200,
        backgroundColor: this.element.backgroundColor || 'rgba(255,255,255,0.8)',
        opacity: this.element.opacity || 255,
        zIndex: this.element.zIndex || 1,
        borderWidth: this.element.borderWidth || 0,
        borderColor: this.element.borderColor || '#409EFF',
        borderStyle: this.element.borderStyle || 'solid',
        borderRadius: this.element.borderRadius || 0,
        shadowColor: this.element.shadowColor || 'rgba(0,0,0,0.3)',
        shadowBlur: this.element.shadowBlur || 5,
        shadowOffsetX: this.element.shadowOffsetX || 0,
        shadowOffsetY: this.element.shadowOffsetY || 2,
        id: this.element.id
      }
    }
  },
  computed: {
    getMaxX() {
      return Math.max(1920 - (this.localElement.width || 300), 0)
    },
    getMaxY() {
      return Math.max(1080 - (this.localElement.height || 200), 0)
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
            width: newVal.width || 300,
            height: newVal.height || 200,
            backgroundColor: newVal.backgroundColor || 'rgba(255,255,255,0.8)',
            opacity: newVal.opacity || 255,
            zIndex: newVal.zIndex || 1,
            borderWidth: newVal.borderWidth || 0,
            borderColor: newVal.borderColor || '#409EFF',
            borderStyle: newVal.borderStyle || 'solid',
            borderRadius: newVal.borderRadius || 0,
            shadowColor: newVal.shadowColor || 'rgba(0,0,0,0.3)',
            shadowBlur: newVal.shadowBlur || 5,
            shadowOffsetX: newVal.shadowOffsetX || 0,
            shadowOffsetY: newVal.shadowOffsetY || 2,
            id: newVal.id
          }
        } else {
          // 如果是同一个元素，同步更新所有属性，但保留用户正在编辑的值
          this.localElement = {
            ...this.localElement,
            ...newVal
          }
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
      // 根据属性类型处理不同的输入值
      if (value !== null && value !== undefined) {
        // 数字类型的属性
        const numberProps = ['x', 'y', 'width', 'height', 'opacity', 'zIndex', 'borderWidth', 'borderRadius', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY']
        if (numberProps.includes(prop)) {
          this.localElement[prop] = Number(value)
        } else {
          // 字符串类型的属性
          this.localElement[prop] = value
        }
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

.container-properties-form {
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
  width: 80px !important;
}

.slider-input-group>>>.el-input-group__append {
  padding: 0 10px;
}

.slider-input-group>>>.el-input__inner {
  padding: 0 8px;
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

/* 阴影预览 */
.shadow-preview {
  width: 100%;
  height: 60px;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 12px;
  transition: all 0.3s;
}

.shadow-preview::before {
  content: "阴影效果预览";
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
}
</style>