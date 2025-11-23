<template>
  <div
    class="text-element"
    :class="{ selected: selected }"
    :style="elementStyle"
    @click.stop="handleClick"
    @mousedown="handleMouseDown"
  >
    <div
      class="text-content"
      :class="{ 
        'text-scroll': element.textAlign === 'scroll',
        'text-left': element.textAlign === 'left',
        'text-center': element.textAlign === 'center',
        'text-right': element.textAlign === 'right'
      }"
      :style="textStyle"
      @dblclick="handleDoubleClick"
    >
      <div
        v-if="element.textAlign === 'scroll'"
        class="scroll-text"
        :style="scrollStyle"
        ref="scrollText"
      >
        {{ currentText }}
      </div>
      <div v-else>
        {{ currentText }}
      </div>
    </div>
    
    <!-- 编辑模式 -->
    <textarea
      v-if="isEditing && !preview"
      ref="textInput"
      v-model="editingText"
      class="text-input"
      :style="textInputStyle"
      @blur="handleEditBlur"
      @keydown.enter.ctrl="handleEditBlur"
    ></textarea>
    
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
      textTimer: null,
      scrollAnimation: null
    }
  },
  computed: {
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
        overflow: 'hidden'
      }
    },
    textStyle() {
      return {
        fontSize: this.element.fontSize + 'px',
        color: this.element.fontColor,
        fontWeight: this.element.fontWeight ? 'bold' : 'normal',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        lineHeight: '1.2'
      }
    },
    textInputStyle() {
      return {
        fontSize: this.element.fontSize + 'px',
        color: this.element.fontColor,
        fontWeight: this.element.fontWeight ? 'bold' : 'normal',
        textAlign: this.element.textAlign === 'scroll' ? 'left' : this.element.textAlign
      }
    },
    scrollStyle() {
      if (this.element.textAlign !== 'scroll') return {}
      
      const speed = this.element.scrollSpeed || 5
      const duration = Math.max(2, 10 - speed) + 's'
      
      return {
        animation: `scrollText ${duration} linear infinite`,
        whiteSpace: 'nowrap'
      }
    },
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
    }
  },
  methods: {
    setupTextRotation() {
      this.clearTextTimer()
      
      if (this.element.texts && this.element.texts.length > 1 && this.element.interval > 0) {
        this.textTimer = setInterval(() => {
          this.currentTextIndex = (this.currentTextIndex + 1) % this.element.texts.length
        }, this.element.interval)
      }
    },
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
    handleMouseMove(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.startX
        const deltaY = event.clientY - this.startY
        
        const newX = Math.max(0, this.startElementX + deltaX)
        const newY = Math.max(0, this.startElementY + deltaY)
        
        this.$emit('update', {
          ...this.element,
          x: newX,
          y: newY
        })
      } else if (this.isResizing) {
        this.handleResize(event)
      }
    },
    handleMouseUp() {
      this.isDragging = false
      this.isResizing = false
      this.resizeDirection = ''
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
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
        x: Math.max(0, newX),
        y: Math.max(0, newY),
        width: newWidth,
        height: newHeight
      })
    },
    handleDelete() {
      this.$emit('delete', this.element.id)
    }
  },
  mounted() {
    this.currentTextIndex = this.element.currentTextIndex || 0
    this.setupTextRotation()
  },
  beforeDestroy() {
    this.clearTextTimer()
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
}

.scroll-text {
  width: 100%;
}

@keyframes scrollText {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
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