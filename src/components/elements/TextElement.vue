<template>
  <div class="text-element" :class="{ selected: selected }" :style="elementStyle" @click.stop="handleClick"
    @mousedown="handleMouseDown">
    <div class="text-content" :class="{
      'text-scroll': element.textAlign === 'scroll',
      'text-left': element.textAlign === 'left',
      'text-center': element.textAlign === 'center',
      'text-right': element.textAlign === 'right'
    }" :style="textStyle" @dblclick="handleDoubleClick">
      <div v-if="element.textAlign === 'scroll'" class="scroll-container" :style="scrollContainerStyle" ref="scrollContainer">
        <div class="scroll-text" :style="scrollTextStyle" ref="scrollText">
          {{ currentText }}
        </div>
      </div>
      <div v-else>
        {{ currentText }}
      </div>
    </div>

    <!-- 编辑模式 -->
    <textarea v-if="isEditing && !preview" ref="textInput" v-model="editingText" class="text-input"
      :style="textInputStyle" @blur="handleEditBlur" @keydown.enter.ctrl="handleEditBlur"></textarea>

    <div class="text-info" v-if="selected && !preview && element.texts && element.texts.length > 1">
      <span>{{ currentTextIndex + 1 }} / {{ element.texts.length }}</span>
    </div>

    <div class="resize-handles" v-if="selected && !preview">
      <div class="resize-handle nw" @mousedown.stop="handleResizeStart('nw', $event)"></div>
      <div class="resize-handle ne" @mousedown.stop="handleResizeStart('ne', $event)"></div>
      <div class="resize-handle sw" @mousedown.stop="handleResizeStart('sw', $event)"></div>
      <div class="resize-handle se" @mousedown.stop="handleResizeStart('se', $event)"></div>
    </div>
    <div class="delete-btn" v-if="selected && !preview" @click.stop="handleDelete">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextElement',
  props: {
    element: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDragging: false,
      isResizing: false,
      isEditing: false,
      editingText: '',
      resizeDirection: '',
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startElementX: 0,
      startElementY: 0,
      currentTextIndex: 0,
      textTimer: null
    }
  },
  computed: {
    /**
     * 计算并返回元素的样式对象
     * 
     * @returns {Object} 包含元素位置、尺寸、背景色、透明度、层级等样式的对象
     *  - position: 定位方式，固定为'absolute'
     *  - left: 元素左侧位置(px)
     *  - top: 元素顶部位置(px) 
     *  - width: 元素宽度(px)
     *  - height: 元素高度(px)
     *  - backgroundColor: 背景颜色
     *  - opacity: 透明度(0-1)
     *  - zIndex: 元素层级
     *  - border: 选中状态下的边框样式
     *  - overflow: 选中状态下的溢出处理
     */
    elementStyle() {
      return {
        position: 'absolute',
        left: this.element.x + 'px',
        top: this.element.y + 'px',
        width: this.element.width + 'px',
        height: this.element.height + 'px',
        backgroundColor: this.element.backgroundColor,
        opacity: this.element.opacity / 255,
        zIndex: this.element.zIndex,
        border: this.selected && !this.preview ? '2px solid #409eff' : 'none',
        overflow: this.selected && !this.preview ? 'visible' : 'hidden'
      }
    },
    textStyle() {
      const baseStyle = {
        fontSize: this.element.fontSize + 'px',
        color: this.element.fontColor,
        fontWeight: this.element.fontWeight ? 'bold' : 'normal',
        fontStyle: this.element.fontItalic ? 'italic' : 'normal',
        textDecoration: this.element.fontUnderline ? 'underline' : 'none',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        lineHeight: '1.2'
      }

      // 为滚动文本调整样式
      if (this.element.textAlign === 'scroll') {
        baseStyle.justifyContent = 'flex-start'
        baseStyle.overflow = 'hidden'
      } else {
        baseStyle.justifyContent = this.element.textAlign === 'center' ? 'center' :
          this.element.textAlign === 'right' ? 'flex-end' : 'flex-start'
        baseStyle.textAlign = this.element.textAlign
      }

      return baseStyle
    },
    textInputStyle() {
      return {
        fontSize: this.element.fontSize + 'px',
        color: this.element.fontColor,
        fontWeight: this.element.fontWeight ? 'bold' : 'normal',
        fontStyle: this.element.fontItalic ? 'italic' : 'normal',
        textDecoration: this.element.fontUnderline ? 'underline' : 'none',
        textAlign: this.element.textAlign === 'scroll' ? 'left' : this.element.textAlign
      }
    },
    scrollContainerStyle() {
      return {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }
    },
    scrollTextStyle() {
      const speed = this.element.scrollSpeed || 5
      return {
        position: 'absolute',
        whiteSpace: 'nowrap',
        animation: `scroll-${this.element.id} ${10 / speed}s linear infinite`,
        paddingRight: '50px'
      }
    },
    // 获取当前显示的文本内容
    currentText() {
      if (!this.element.texts || this.element.texts.length === 0) {
        return '请输入文本内容'
      }
      return this.element.texts[this.currentTextIndex] || this.element.texts[0]
    }
  },
  watch: {
    'element.texts': {
      handler() {
        this.setupTextRotation()
      },
      immediate: true
    },
    'element.interval': {
      handler() {
        this.setupTextRotation()
      }
    },
    'preview': {
      handler() {
        // 当进入或退出预览模式时，重新设置文本轮播
        this.setupTextRotation()
        this.$nextTick(() => {
          this.addScrollAnimation()
        })
      }
    },
    'element.textAlign': {
      handler() {
        this.$nextTick(() => {
          this.addScrollAnimation()
        })
      }
    },
    'currentText': {
      handler() {
        this.$nextTick(() => {
          this.addScrollAnimation()
        })
      }
    }
  },
  methods: {
    /**
     * 设置文本轮播功能
     * 如果存在多个文本且设置了切换间隔，则启动定时器轮播显示文本
     * 在预览模式或编辑模式下生效
     */
    setupTextRotation() {
      this.clearTextTimer()
      // 在预览模式或编辑模式下，如果有多个文本且设置了切换间隔，启动轮播
      if (this.element.texts && this.element.texts.length > 1 && this.element.interval > 0) {
        this.textTimer = setInterval(() => {
          this.currentTextIndex = (this.currentTextIndex + 1) % this.element.texts.length
        }, this.element.interval)
      }
    },
    /**
     * 清除文本轮播定时器
     * 如果存在活动的定时器则清除它，并将定时器引用置为null
     */
    clearTextTimer() {
      if (this.textTimer) {
        clearInterval(this.textTimer)
        this.textTimer = null
      }
    },

    handleClick() {
      if (!this.preview) {
        this.$emit('select', this.element)
      }
    },
    handleDoubleClick() {
      if (!this.preview && this.selected) {
        this.startEditing()
      }
    },
    /**
     * 开始编辑文本内容
     * 设置编辑状态为true，保存当前文本到编辑缓冲区
     * 并在下一个DOM更新周期后自动聚焦并选中输入框内容
     */
    startEditing() {
      this.isEditing = true
      this.editingText = this.currentText
      this.$nextTick(() => {
        if (this.$refs.textInput) {
          this.$refs.textInput.focus()
          this.$refs.textInput.select()
        }
      })
    },
    /**
     * 处理文本编辑完成事件
     * 当编辑框失去焦点时，如果编辑内容不为空，则更新元素文本内容
     * 并触发更新事件，同时关闭编辑状态
     */
    handleEditBlur() {
      if (this.editingText.trim() !== '') {
        const newTexts = [...this.element.texts]
        newTexts[this.currentTextIndex] = this.editingText.trim()

        this.$emit('update', {
          ...this.element,
          texts: newTexts
        })
      }
      this.isEditing = false
    },
    // 处理鼠标按下事件，开始元素拖动
    handleMouseDown(event) {
      if (this.preview || this.isEditing) return
      this.isDragging = true
      this.startX = event.clientX
      this.startY = event.clientY
      this.startElementX = this.element.x
      this.startElementY = this.element.y
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
      event.preventDefault()
    },
    // 处理鼠标移动事件，实现元素的拖动和调整大小功能
    handleMouseMove(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.startX
        const deltaY = event.clientY - this.startY

        const newX = Math.max(0, Math.round(this.startElementX + deltaX))
        const newY = Math.max(0, Math.round(this.startElementY + deltaY))

        this.$emit('update', {
          ...this.element,
          x: newX,
          y: newY
        })
      } else if (this.isResizing) {
        this.handleResize(event)
      }
    },
    // 处理鼠标抬起事件
    handleMouseUp() {
      // 重置拖动和调整大小状态标志
      this.isDragging = false
      this.isResizing = false
      // 清除调整方向
      this.resizeDirection = ''
      // 移除鼠标移动和抬起事件监听器
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
    // 处理元素调整大小开始事件
    handleResizeStart(direction, event) {
      this.isResizing = true
      this.resizeDirection = direction
      this.startX = event.clientX
      this.startY = event.clientY
      this.startWidth = this.element.width
      this.startHeight = this.element.height
      this.startElementX = this.element.x
      this.startElementY = this.element.y

      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
      event.preventDefault()
    },
    /**
     * @param {MouseEvent} event - 鼠标事件对象，包含当前鼠标位置信息
     * @emits update - 当元素大小或位置改变时触发，携带更新后的元素属性
     * 
     * 根据调整方向(resizeDirection)计算元素的新位置和尺寸：
     * - 'nw'：从西北角调整，同时改变宽度、高度和位置
     * - 'ne'：从东北角调整，改变宽度和高度，调整Y位置
     * - 'sw'：从西南角调整，改变宽度和高度，调整X位置
     * - 'se'：从东南角调整，改变宽度和高度
     * 
     * 确保元素的最小宽度为50px，最小高度为30px
     * 确保元素位置不会超出画布边界(不小于0)
     * 所有尺寸和位置值都会四舍五入为整数
     */
    handleResize(event) {
      const deltaX = event.clientX - this.startX
      const deltaY = event.clientY - this.startY

      let newWidth = this.startWidth
      let newHeight = this.startHeight
      let newX = this.startElementX
      let newY = this.startElementY

      switch (this.resizeDirection) {
        case 'nw':
          newWidth = Math.max(50, this.startWidth - deltaX)
          newHeight = Math.max(30, this.startHeight - deltaY)
          newX = this.startElementX + (this.startWidth - newWidth)
          newY = this.startElementY + (this.startHeight - newHeight)
          break
        case 'ne':
          newWidth = Math.max(50, this.startWidth + deltaX)
          newHeight = Math.max(30, this.startHeight - deltaY)
          newY = this.startElementY + (this.startHeight - newHeight)
          break
        case 'sw':
          newWidth = Math.max(50, this.startWidth - deltaX)
          newHeight = Math.max(30, this.startHeight + deltaY)
          newX = this.startElementX + (this.startWidth - newWidth)
          break
        case 'se':
          newWidth = Math.max(50, this.startWidth + deltaX)
          newHeight = Math.max(30, this.startHeight + deltaY)
          break
      }

      this.$emit('update', {
        ...this.element,
        x: Math.max(0, Math.round(newX)),
        y: Math.max(0, Math.round(newY)),
        width: Math.round(newWidth),
        height: Math.round(newHeight)
      })
    },
    // 删除
    handleDelete() {
      this.$emit('delete', this.element.id)
    },
    // 添加滚动动画
    addScrollAnimation() {
      if (this.element.textAlign === 'scroll') {
        this.$nextTick(() => {
          const container = this.$refs.scrollContainer
          const text = this.$refs.scrollText
          
          if (container && text) {
            const containerWidth = container.offsetWidth
            const textWidth = text.offsetWidth
            
            const styleId = `scroll-animation-${this.element.id}`
            let styleElement = document.getElementById(styleId)
            
            if (styleElement) {
              styleElement.remove()
            }
            
            styleElement = document.createElement('style')
            styleElement.id = styleId
            styleElement.textContent = `
              @keyframes scroll-${this.element.id} {
                from {
                  transform: translateX(${containerWidth}px);
                }
                to {
                  transform: translateX(-${textWidth}px);
                }
              }
            `
            document.head.appendChild(styleElement)
          }
        })
      }
    },
    // 移除滚动动画
    removeScrollAnimation() {
      const styleId = `scroll-animation-${this.element.id}`
      const styleElement = document.getElementById(styleId)
      if (styleElement) {
        styleElement.remove()
      }
    }
  },
  mounted() {
    this.currentTextIndex = this.element.currentTextIndex || 0
    this.setupTextRotation()
    this.addScrollAnimation()
  },
  beforeDestroy() {
    this.clearTextTimer()
    this.removeScrollAnimation()
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
}
</script>

<style scoped>
.text-element {
  cursor: move;
  box-sizing: border-box;
  position: relative;
}

.text-element.selected {
  outline: none;
}

.text-content {
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow: hidden;
}

.text-left {
  justify-content: flex-start;
  text-align: left;
}

.text-center {
  justify-content: center;
  text-align: center;
}

.text-right {
  justify-content: flex-end;
  text-align: right;
}

.text-scroll {
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.scroll-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.scroll-text {
  display: inline-block;
  will-change: transform;
}

/* 确保滚动容器正确设置 */
.text-element .text-scroll {
  overflow: hidden !important;
  position: relative;
}

.text-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid #409eff;
  background: rgba(255, 255, 255, 0.9);
  resize: none;
  outline: none;
  padding: 5px;
  box-sizing: border-box;
  font-family: inherit;
}

.text-info {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #409eff;
  border: 1px solid white;
  pointer-events: all;
}

.resize-handle.nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background: #f78989;
}
</style>