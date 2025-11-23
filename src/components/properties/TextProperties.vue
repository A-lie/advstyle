<template>
  <div class="text-properties">
    <h4>文字属性</h4>
    
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
              :min="30"
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
      
      <!-- 文字样式 -->
      <el-form-item label="字体大小">
        <div class="slider-item">
          <el-slider
            v-model="localElement.fontSize"
            :min="12"
            :max="200"
            @change="updateElement"
            show-input
            :show-input-controls="false"
            input-size="mini"
          ></el-slider>
          <span class="unit">px</span>
        </div>
      </el-form-item>
      
      <el-form-item label="字体颜色">
        <el-color-picker 
          v-model="localElement.fontColor"
          @change="updateElement"
        ></el-color-picker>
      </el-form-item>
      
      <el-form-item label="字体样式">
        <el-checkbox 
          v-model="localElement.fontWeight" 
          @change="updateElement"
        >
          加粗
        </el-checkbox>
      </el-form-item>
      
      <el-form-item label="对齐方式">
        <el-select v-model="localElement.textAlign" @change="updateElement">
          <el-option label="左对齐" value="left"></el-option>
          <el-option label="居中" value="center"></el-option>
          <el-option label="右对齐" value="right"></el-option>
          <el-option label="滚动" value="scroll"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="滚动速度" v-if="localElement.textAlign === 'scroll'">
        <el-slider
          v-model="localElement.scrollSpeed"
          :min="1"
          :max="9"
          :marks="{ 1: '慢', 5: '中', 9: '快' }"
          @change="updateElement"
        ></el-slider>
      </el-form-item>
      
      <!-- 文本内容管理 -->
      <el-form-item label="文本内容">
        <div class="text-list">
          <div 
            v-for="(text, index) in localElement.texts" 
            :key="index"
            class="text-item"
          >
            <el-input
              v-model="localElement.texts[index]"
              type="textarea"
              :rows="2"
              @input="updateElement"
              placeholder="请输入文本内容"
            ></el-input>
            <el-button 
              type="text" 
              size="mini" 
              @click="removeText(index)"
              style="color: #f56c6c; margin-top: 5px;"
              v-if="localElement.texts.length > 1"
            >
              删除此文本
            </el-button>
          </div>
        </div>
        <el-button size="small" @click="addText">添加文本</el-button>
      </el-form-item>
      
      <el-form-item label="切换间隔" v-if="localElement.texts && localElement.texts.length > 1">
        <div class="slider-item">
          <el-slider
            v-model="localElement.interval"
            :min="500"
            :max="60000"
            :step="500"
            @change="updateElement"
            show-input
            :show-input-controls="false"
            input-size="mini"
          ></el-slider>
          <span class="unit">毫秒</span>
        </div>
      </el-form-item>
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
    addText() {
      if (!this.localElement.texts) {
        this.localElement.texts = []
      }
      this.localElement.texts.push('新文本内容')
      this.updateElement()
    },
    removeText(index) {
      if (this.localElement.texts.length > 1) {
        this.localElement.texts.splice(index, 1)
        this.updateElement()
      }
    }
  }
}
</script>

<style scoped>
.text-properties h4 {
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

.opacity-value, .unit {
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

.text-list {
  margin-bottom: 10px;
}

.text-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
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