<template>
  <div class="container-properties">
    <h4>容器属性</h4>
    
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
      localElement: { ...this.element }
    }
  },
  computed: {
    getMaxX() {
      // 假设画布宽度为1920，可以从父组件传入
      return Math.max(1920 - this.localElement.width, 0)
    },
    getMaxY() {
      // 假设画布高度为1080，可以从父组件传入
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
    }
  }
}
</script>

<style scoped>
.container-properties h4 {
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