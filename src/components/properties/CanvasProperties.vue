<template>
  <div class="canvas-properties">
    <h4>画布属性</h4>

    <el-form size="small" label-width="70px">
      <el-form-item label="画布尺寸">
        <div class="slider-group">
          <div class="slider-item">
            <label>宽度</label>
            <el-slider v-model="localCanvasWidth" :min="100" :max="4000" :step="1" @change="updateCanvas" show-input
              :show-input-controls="false" input-size="mini"></el-slider>
          </div>
          <div class="slider-item">
            <label>高度</label>
            <el-slider v-model="localCanvasHeight" :min="100" :max="4000" :step="1" @change="updateCanvas" show-input
              :show-input-controls="false" input-size="mini"></el-slider>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="预设尺寸">
        <el-select v-model="selectedPreset" @change="applyPreset" placeholder="选择预设尺寸">
          <el-option label="1920x1080 (Full HD)" value="1920x1080"></el-option>
          <el-option label="1366x768 (HD)" value="1366x768"></el-option>
          <el-option label="1280x720 (HD Ready)" value="1280x720"></el-option>
          <el-option label="1024x768 (XGA)" value="1024x768"></el-option>
          <el-option label="800x600 (SVGA)" value="800x600"></el-option>
          <el-option label="1080x1920 (竖屏 Full HD)" value="1080x1920"></el-option>
          <el-option label="768x1366 (竖屏 HD)" value="768x1366"></el-option>
          <el-option label="720x1280 (竖屏 HD Ready)" value="720x1280"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="比例">
        <span class="ratio-info">{{ aspectRatio }}</span>
      </el-form-item>

      <el-form-item label="操作">
        <el-button size="small" @click="resetCanvas">重置画布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CanvasProperties',
  props: {
    canvasWidth: {
      type: Number,
      required: true
    },
    canvasHeight: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      localCanvasWidth: this.canvasWidth,
      localCanvasHeight: this.canvasHeight,
      selectedPreset: ''
    }
  },
  computed: {
    // 计算并返回画布的宽高比
    aspectRatio() {
      const gcd = this.getGCD(this.localCanvasWidth, this.localCanvasHeight)
      const ratioW = this.localCanvasWidth / gcd
      const ratioH = this.localCanvasHeight / gcd
      return `${ratioW}:${ratioH}`
    }
  },
  watch: {
    canvasWidth(newVal) {
      this.localCanvasWidth = newVal
    },
    canvasHeight(newVal) {
      this.localCanvasHeight = newVal
    }
  },
  methods: {
    updateCanvas() {
      this.$emit('update', {
        width: this.localCanvasWidth,
        height: this.localCanvasHeight
      })
    },
    applyPreset() {
      if (this.selectedPreset) {
        const [width, height] = this.selectedPreset.split('x').map(Number)
        this.localCanvasWidth = width
        this.localCanvasHeight = height
        this.updateCanvas()
      }
    },
    resetCanvas() {
      this.$confirm('确定要重置画布吗？这将清空所有元素。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.localCanvasWidth = 1920
        this.localCanvasHeight = 1080
        this.updateCanvas()
        this.$message.success('画布已重置')
      }).catch(() => {
        // 用户取消
      })
    },
    getGCD(a, b) {
      return b === 0 ? a : this.getGCD(b, a % b)
    }
  }
}
</script>

<style scoped>
.canvas-properties h4 {
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

.ratio-info {
  color: #666;
  font-size: 14px;
}
</style>