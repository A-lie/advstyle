<template>
  <div class="ad-designer">
    <el-container style="height: 100%;">
      <!-- 左侧组件库 -->
      <el-card class="box-card" style="width: 520px;">
        <div class="library-header">
          <h3>组件库</h3>
        </div>

        <!-- 屏幕尺寸设置 -->
        <div class="screen-size-setting">
          <h4>屏幕尺寸</h4>
          <el-form size="small">
            <el-form-item label="宽度">
              <el-input-number v-model="canvasWidth" :min="100" :max="4000" @change="updateCanvasSize"
                size="small"></el-input-number>
            </el-form-item>
            <el-form-item label="高度">
              <el-input-number v-model="canvasHeight" :min="100" :max="4000" @change="updateCanvasSize"
                size="small"></el-input-number>
            </el-form-item>
          </el-form>
        </div>

        <!-- 组件列表 -->
        <div class="component-list">
          <h4>拖拽组件</h4>
          <div class="component-items">
            <div class="component-item" draggable="true" @dragstart="handleDragStart($event, 'container')">
              <i class="el-icon-s-grid"></i>
              <span>容器</span>
            </div>
            <div class="component-item" draggable="true" @dragstart="handleDragStart($event, 'image')">
              <i class="el-icon-picture"></i>
              <span>图片</span>
            </div>
            <div class="component-item" draggable="true" @dragstart="handleDragStart($event, 'video')">
              <i class="el-icon-video-camera"></i>
              <span>视频</span>
            </div>
            <div class="component-item" draggable="true" @dragstart="handleDragStart($event, 'text')">
              <i class="el-icon-edit"></i>
              <span>文字</span>
            </div>
          </div>
        </div>

        <!-- 元素列表 -->
        <div class="element-list-panel" v-if="elements.length > 0">
          <h4>元素列表</h4>
          <div class="element-list">
            <div v-for="element in sortedElements" :key="element.id" class="element-item"
              :class="{ active: selectedElement && selectedElement.id === element.id }" @click="selectElement(element)">
              <div class="element-info">
                <i :class="getElementIcon(element.type)"></i>
                <span class="element-name">{{ getElementName(element) }}</span>
                <span class="element-index">层级 {{ element.zIndex }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>


      <!-- 中间编辑区域 -->
      <el-card class="box-card">
        <el-main class="editor-main">
          <div class="editor-header">
            <div class="editor-title">
              <h3>编辑区域</h3>
              <el-input v-model="programName" placeholder="请输入节目名称" style="width: 160px; margin-left: 20px;"
                size="small"></el-input>
            </div>
            <div class="editor-actions">
              <el-button size="small" @click="saveDesign">保存设计</el-button>
              <el-button size="small" type="warning" @click="saveAsProgram">保存为节目</el-button>
              <el-button size="small" type="primary" @click="previewDesign">预览</el-button>
              <el-button size="small" type="success" @click="deployToDevice">下发到设备</el-button>
            </div>
          </div>

          <div class="canvas-container" ref="canvasContainer">
            <div class="canvas" ref="canvas" :style="canvasStyle" @drop="handleDrop" @dragover="handleDragOver"
              @click="selectCanvas">
              <component v-for="element in elements" :key="element.id" :is="getComponentName(element.type)"
                :element="element" :selected="selectedElement && selectedElement.id === element.id"
                @select="selectElement" @update="updateElement" @delete="deleteElement" />
            </div>
          </div>
        </el-main>
      </el-card>

      <!-- 右侧属性设置 -->
      <el-card class="box-card" style="width: 850px;">
        <div class="property-content" v-if="selectedElement">
          <component :is="getPropertyComponentName(selectedElement.type)" :element="selectedElement"
            @update="updateElement" @layer-action="handleLayerAction" />
        </div>

        <div class="property-content" v-else-if="canvasSelected">
          <canvas-properties :canvas-width="canvasWidth" :canvas-height="canvasHeight"
            @update="updateCanvasProperties" />
        </div>

        <div class="property-content" v-else>
          <p class="no-selection">请选择一个元素来编辑属性</p>
        </div>
      </el-card>
    </el-container>

    <!-- 预览对话框 -->
    <el-dialog title="预览效果" :visible.sync="previewVisible" width="80%" top="5vh">
      <div class="preview-header">
        <p class="preview-tips">
          <i class="el-icon-info"></i>
          预览模式下可以看到文字滚动、图片轮播、视频播放等动画效果
        </p>
      </div>
      <div class="preview-container">
        <div class="preview-canvas" :style="previewCanvasStyle">
          <component v-for="element in elements" :key="'preview-' + element.id" :is="getComponentName(element.type)"
            :element="element" :preview="true" />
        </div>
      </div>
    </el-dialog>

    <!-- 设备下发对话框 -->
    <el-dialog title="下发到设备" :visible.sync="deployVisible" width="400px">
      <el-form>
        <el-form-item label="设备SN">
          <el-input v-model="deviceSN" placeholder="请输入设备SN号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="deployVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDeploy">确认下发</el-button>
      </div>
    </el-dialog>

    <!-- 保存设计对话框 -->
    <el-dialog title="保存设计" :visible.sync="saveVisible" width="70%" top="5vh">
      <div class="save-container">
        <div class="save-info">
          <p><strong>设计信息：</strong></p>
          <p>画布尺寸：{{ canvasWidth }} × {{ canvasHeight }}</p>
          <p>元素数量：{{ elements.length }}</p>
          <p>保存时间：{{ new Date().toLocaleString() }}</p>
        </div>

        <div class="json-container">
          <div class="json-header">
            <span><strong>JSON 配置数据：</strong></span>
            <el-button type="primary" size="mini" @click="copyJsonData" icon="el-icon-document-copy">
              复制 JSON
            </el-button>
          </div>
          <el-input type="textarea" v-model="designJsonData" :rows="15" readonly class="json-textarea"
            placeholder="JSON数据将在这里显示..."></el-input>
        </div>
      </div>

      <div slot="footer">
        <el-button @click="saveVisible = false">关闭</el-button>
        <el-button type="primary" @click="downloadJson">下载 JSON 文件</el-button>
        <el-button type="success" @click="saveToLocalStorage">保存到本地</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ContainerElement from './elements/ContainerElement.vue'
import ImageElement from './elements/ImageElement.vue'
import VideoElement from './elements/VideoElement.vue'
import TextElement from './elements/TextElement.vue'

import ContainerProperties from './properties/ContainerProperties.vue'
import ImageProperties from './properties/ImageProperties.vue'
import VideoProperties from './properties/VideoProperties.vue'
import TextProperties from './properties/TextProperties.vue'
import CanvasProperties from './properties/CanvasProperties.vue'

export default {
  name: 'AdDesigner',
  components: {
    ContainerElement,
    ImageElement,
    VideoElement,
    TextElement,
    ContainerProperties,
    ImageProperties,
    VideoProperties,
    TextProperties,
    CanvasProperties
  },
  data() {
    return {
      canvasWidth: 1920,
      canvasHeight: 700,
      elements: [],
      selectedElement: null,
      canvasSelected: false,
      draggedComponentType: null,
      previewVisible: false,
      deployVisible: false,
      saveVisible: false,
      deviceSN: '',
      elementIdCounter: 1,
      designJsonData: '',
      programName: '' // 节目名称
    }
  },
  computed: {
    canvasStyle() {
      return {
        width: this.canvasWidth + 'px',
        height: this.canvasHeight + 'px',
        transform: this.getCanvasScale()
      }
    },
    previewCanvasStyle() {
      return {
        width: this.canvasWidth + 'px',
        height: this.canvasHeight + 'px',
        transform: 'scale(0.8)',
        transformOrigin: 'top left'
      }
    },
    sortedElements() {
      // 按zIndex从大到小排序，显示层级关系
      return [...this.elements].sort((a, b) => b.zIndex - a.zIndex)
    }
  },
  methods: {
    getCanvasScale() {
      const container = this.$refs.canvasContainer
      if (!container) return 'scale(1)'

      const containerWidth = container.clientWidth - 40
      const containerHeight = container.clientHeight - 40

      const scaleX = containerWidth / this.canvasWidth
      const scaleY = containerHeight / this.canvasHeight
      const scale = Math.min(scaleX, scaleY, 1)

      return `scale(${scale})`
    },
    updateCanvasSize() {
      this.$nextTick(() => {
        this.updateCanvasScale()
      })
    },
    updateCanvasScale() {
      // 触发重新计算缩放
      this.$forceUpdate()
    },
    handleDragStart(event, componentType) {
      this.draggedComponentType = componentType
      event.dataTransfer.effectAllowed = 'copy'
    },
    handleDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    async handleDrop(event) {
      event.preventDefault()

      if (!this.draggedComponentType) return

      const canvas = this.$refs.canvas
      const rect = canvas.getBoundingClientRect()
      const scale = this.getScaleFromTransform(canvas.style.transform)

      const x = (event.clientX - rect.left) / scale
      const y = (event.clientY - rect.top) / scale

      const element = await this.createElement(this.draggedComponentType, x, y)
      if (element) {
        this.elements.push(element)
        this.selectElement(element)
      }

      this.draggedComponentType = null
    },
    getScaleFromTransform(transform) {
      if (!transform || transform === 'none') return 1
      const match = transform.match(/scale\(([^)]+)\)/)
      return match ? parseFloat(match[1]) : 1
    },
    async createElement(type, x, y) {
      const baseElement = {
        id: this.elementIdCounter++,
        type: type,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: 200,
        height: 150,
        backgroundColor: 'transparent',
        opacity: 255,
        zIndex: this.elements.length
      }

      switch (type) {
        case 'container':
          return {
            ...baseElement,
            backgroundColor: '#f0f0f0'
          }
        case 'image':
          const imageFiles = await this.selectFiles('image/*', true)
          if (imageFiles && imageFiles.length > 0) {
            return {
              ...baseElement,
              images: imageFiles.map(file => ({
                url: file.url,
                name: file.name
              })),
              displayMode: 'cover',
              interval: 3000, // 图片切换间隔(ms)
              currentImageIndex: 0
            }
          }
          return null
        case 'video':
          const videoFiles = await this.selectFiles('video/*', false)
          if (videoFiles && videoFiles.length > 0) {
            const file = videoFiles[0]

            // 验证文件大小
            const maxSize = 100 * 1024 * 1024 // 100MB
            if (file.size > maxSize) {
              this.$message.warning('视频文件过大（' + (file.size / 1024 / 1024).toFixed(2) + 'MB），可能导致加载失败')
            }

            // 格式兼容性提示（不阻止上传）
            const formatInfo = this.getVideoFormatInfo(file.type)
            if (formatInfo.warning) {
              this.$message.warning(formatInfo.warning)
            } else if (formatInfo.info) {
              this.$message.info(formatInfo.info)
            }

            return {
              ...baseElement,
              videoUrl: file.url,
              videoName: file.name,
              displayMode: 'center', // center, stretch
              autoplay: true,
              loop: true
            }
          }
          return null
        case 'text':
          return {
            ...baseElement,
            texts: ['请输入文本内容'],
            currentTextIndex: 0,
            fontSize: 24,
            fontColor: '#000000',
            fontWeight: false,
            textAlign: 'left', // left, center, right, scroll
            scrollSpeed: 5, // 0-9
            interval: 3000 // 文本切换间隔(ms)
          }
        default:
          return baseElement
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

          // 对于视频文件，使用 Blob URL 而不是 Base64
          if (accept.includes('video')) {
            const fileData = files.map(file => {
              // 创建 Blob URL
              const blobUrl = URL.createObjectURL(file)
              return {
                url: blobUrl,
                name: file.name,
                size: file.size,
                type: file.type,
                blob: file // 保存原始文件引用
              }
            })
            resolve(fileData)
          } else {
            // 对于图片等其他文件，继续使用 Base64
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
        }

        input.oncancel = () => resolve(null)
        input.click()
      })
    },
    selectElement(element) {
      this.selectedElement = element
      this.canvasSelected = false
    },
    selectCanvas() {
      this.selectedElement = null
      this.canvasSelected = true
    },
    updateElement(elementData) {
      const index = this.elements.findIndex(el => el.id === elementData.id)
      if (index !== -1) {
        this.$set(this.elements, index, { ...this.elements[index], ...elementData })
      }
    },
    deleteElement(elementId) {
      const index = this.elements.findIndex(el => el.id === elementId)
      if (index !== -1) {
        this.elements.splice(index, 1)
        if (this.selectedElement && this.selectedElement.id === elementId) {
          this.selectedElement = null
        }
      }
    },
    updateCanvasProperties(properties) {
      this.canvasWidth = properties.width
      this.canvasHeight = properties.height
      this.updateCanvasSize()
    },
    getComponentName(type) {
      const componentMap = {
        container: 'ContainerElement',
        image: 'ImageElement',
        video: 'VideoElement',
        text: 'TextElement'
      }
      return componentMap[type] || 'ContainerElement'
    },
    getPropertyComponentName(type) {
      const componentMap = {
        container: 'ContainerProperties',
        image: 'ImageProperties',
        video: 'VideoProperties',
        text: 'TextProperties'
      }
      return componentMap[type] || 'ContainerProperties'
    },
    saveDesign() {
      const designData = {
        canvas: {
          width: this.canvasWidth,
          height: this.canvasHeight
        },
        elements: this.elements.map(el => ({ ...el })),
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          elementCount: this.elements.length
        }
      }

      // 格式化JSON数据用于显示
      this.designJsonData = JSON.stringify(designData, null, 2)

      // 显示保存对话框
      this.saveVisible = true

      console.log('设计数据:', designData)
    },
    copyJsonData() {
      if (navigator.clipboard && window.isSecureContext) {
        // 使用现代的 Clipboard API
        navigator.clipboard.writeText(this.designJsonData).then(() => {
          this.$message.success('JSON 数据已复制到剪贴板')
        }).catch(err => {
          console.error('复制失败:', err)
          this.fallbackCopyTextToClipboard(this.designJsonData)
        })
      } else {
        // 降级方案
        this.fallbackCopyTextToClipboard(this.designJsonData)
      }
    },
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand('copy')
        if (successful) {
          this.$message.success('JSON 数据已复制到剪贴板')
        } else {
          this.$message.error('复制失败，请手动复制')
        }
      } catch (err) {
        console.error('复制失败:', err)
        this.$message.error('复制失败，请手动复制')
      }

      document.body.removeChild(textArea)
    },
    downloadJson() {
      const blob = new Blob([this.designJsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ad-design-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      this.$message.success('JSON 文件已下载')
    },
    saveToLocalStorage() {
      try {
        const designData = JSON.parse(this.designJsonData)
        localStorage.setItem('adDesign', JSON.stringify(designData))
        this.$message.success('设计已保存到本地存储')
        this.saveVisible = false
      } catch (err) {
        console.error('保存失败:', err)
        this.$message.error('保存失败，JSON 数据格式错误')
      }
    },
    // 保存为节目
    async saveAsProgram() {
      // 验证节目名称
      if (!this.programName.trim()) {
        this.$message.error('请先输入节目名称')
        return
      }

      // 验证是否有元素
      if (this.elements.length === 0) {
        this.$message.warning('请先添加一些元素再保存为节目')
        return
      }

      try {
        // 导入 mockApi
        const { mockPlayListAPI } = await import('@/services/mockApi')

        // 转换元素为区域列表
        const arealist = this.convertElementsToAreas()

        // 构建节目对象
        const programData = {
          advertid: 'adv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          advertname: this.programName.trim(),
          fullscreen: false,
          screenwidth: this.canvasWidth,
          screenheight: this.canvasHeight,
          duration: 0,
          repeat: 0,
          arealist: arealist
        }

        // 保存节目
        await mockPlayListAPI.saveProgram(programData)

        this.$message.success(`节目"${this.programName}"已保存，可在播放设置中关联使用`)

        // 询问是否跳转到播放设置
        this.$confirm('节目已保存成功，是否跳转到播放设置页面创建播放任务？', '提示', {
          confirmButtonText: '立即跳转',
          cancelButtonText: '稍后再说',
          type: 'success'
        }).then(() => {
          this.$router.push('/schedule')
        }).catch(() => { })

      } catch (error) {
        console.error('保存节目失败:', error)
        this.$message.error('保存节目失败，请重试')
      }
    },
    // 将元素转换为区域列表
    convertElementsToAreas() {
      return this.elements.map(element => {
        const area = {
          areaid: 'area_' + element.id,
          areaname: this.getElementName(element),
          areax: Math.round(element.x),
          areay: Math.round(element.y),
          areawidth: Math.round(element.width),
          areaheight: Math.round(element.height),
          areatype: this.getAreaType(element.type),
          alpha: element.opacity || 255,
          bkcolor: element.backgroundColor || '#FFFFFF',
          reslist: this.convertElementToResources(element)
        }
        return area
      })
    },
    // 获取区域类型
    getAreaType(elementType) {
      const typeMap = {
        'text': 0,
        'image': 1,
        'video': 2,
        'container': 1 // 容器当作图片类型
      }
      return typeMap[elementType] || 1
    },
    // 将元素转换为资源列表
    convertElementToResources(element) {
      const resources = []

      switch (element.type) {
        case 'text':
          // 文本元素
          const texts = element.texts || ['文本内容']
          texts.forEach((text, index) => {
            resources.push({
              resid: 'res_' + element.id + '_' + index,
              file: null,
              show: this.getTextShowMode(element.textAlign),
              showtime: element.interval || 3000,
              text: text,
              font: {
                fontname: 'sans-serif',
                textcolor: element.fontColor || '#000000',
                fontsize: element.fontSize || 24,
                bold: element.fontWeight ? 1 : 0,
                roll: element.scrollSpeed || 5
              }
            })
          })
          break

        case 'image':
          // 图片元素
          const images = element.images || []
          images.forEach((image, index) => {
            resources.push({
              resid: 'res_' + element.id + '_' + index,
              file: {
                filename: image.name || 'image.jpg',
                fileurl: image.url,
                filesize: image.size || 0,
                md5: 'generated_' + Date.now()
              },
              show: element.displayMode === 'stretch' ? 1 : 0,
              showtime: element.interval || 3000,
              text: null,
              font: null
            })
          })
          break

        case 'video':
          // 视频元素
          if (element.videoUrl) {
            resources.push({
              resid: 'res_' + element.id,
              file: {
                filename: element.videoName || 'video.mp4',
                fileurl: element.videoUrl,
                filesize: 0,
                md5: 'generated_' + Date.now()
              },
              show: element.displayMode === 'stretch' ? 1 : 0,
              showtime: 0,
              text: null,
              font: null
            })
          }
          break

        case 'container':
          // 容器元素 - 作为背景色区域
          resources.push({
            resid: 'res_' + element.id,
            file: null,
            show: 0,
            showtime: 0,
            text: null,
            font: null
          })
          break
      }

      return resources
    },
    // 获取文本显示方式
    getTextShowMode(textAlign) {
      const modeMap = {
        'left': 0,
        'center': 1,
        'right': 2,
        'scroll': 3
      }
      return modeMap[textAlign] || 0
    },
    previewDesign() {
      if (this.elements.length === 0) {
        this.$message.warning('请先添加一些元素再预览')
        return
      }

      // 检查是否有滚动文本或轮播内容
      const hasScrollText = this.elements.some(el =>
        el.type === 'text' && el.textAlign === 'scroll'
      )
      const hasMultipleImages = this.elements.some(el =>
        el.type === 'image' && el.images && el.images.length > 1
      )
      const hasMultipleTexts = this.elements.some(el =>
        el.type === 'text' && el.texts && el.texts.length > 1
      )
      const hasVideo = this.elements.some(el => el.type === 'video')

      if (hasScrollText || hasMultipleImages || hasMultipleTexts || hasVideo) {
        this.$message.success('预览中可以看到动画效果：文字滚动、图片轮播、视频播放等')
      }

      this.previewVisible = true
    },
    deployToDevice() {
      this.deployVisible = true
    },
    confirmDeploy() {
      if (!this.deviceSN.trim()) {
        this.$message.error('请输入设备SN号')
        return
      }

      const deployData = {
        canvas: {
          width: this.canvasWidth,
          height: this.canvasHeight
        },
        elements: this.elements.map(el => ({ ...el })),
        deviceSN: this.deviceSN,
        timestamp: Date.now()
      }

      // 这里应该调用API发送到设备
      console.log('下发数据:', deployData)
      this.$message.success(`已下发到设备 ${this.deviceSN}`)
      this.deployVisible = false
    },
    handleLayerAction(data) {
      const { action, elementId } = data
      const elementIndex = this.elements.findIndex(el => el.id === elementId)

      if (elementIndex === -1) return

      const element = this.elements[elementIndex]
      const allZIndexes = this.elements.map(el => el.zIndex).sort((a, b) => a - b)

      switch (action) {
        case 'moveToTop':
          // 置于顶层：设置为最大zIndex + 1
          const maxZIndex = Math.max(...allZIndexes)
          this.updateElement({ ...element, zIndex: maxZIndex + 1 })
          this.$message.success('已置于顶层')
          break

        case 'moveUp':
          // 上移一层：找到比当前zIndex大的最小值，与其交换
          const currentZIndex = element.zIndex
          const higherZIndexes = allZIndexes.filter(z => z > currentZIndex)
          if (higherZIndexes.length > 0) {
            const targetZIndex = Math.min(...higherZIndexes)
            const targetElement = this.elements.find(el => el.zIndex === targetZIndex)
            if (targetElement) {
              this.updateElement({ ...element, zIndex: targetZIndex })
              this.updateElement({ ...targetElement, zIndex: currentZIndex })
              this.$message.success('已上移一层')
            }
          } else {
            this.$message.info('已经是最顶层')
          }
          break

        case 'moveDown':
          // 下移一层：找到比当前zIndex小的最大值，与其交换
          const currentZIndex2 = element.zIndex
          const lowerZIndexes = allZIndexes.filter(z => z < currentZIndex2)
          if (lowerZIndexes.length > 0) {
            const targetZIndex2 = Math.max(...lowerZIndexes)
            const targetElement2 = this.elements.find(el => el.zIndex === targetZIndex2)
            if (targetElement2) {
              this.updateElement({ ...element, zIndex: targetZIndex2 })
              this.updateElement({ ...targetElement2, zIndex: currentZIndex2 })
              this.$message.success('已下移一层')
            }
          } else {
            this.$message.info('已经是最底层')
          }
          break

        case 'moveToBottom':
          // 置于底层：设置为最小zIndex - 1，但不小于0
          const minZIndex = Math.min(...allZIndexes)
          const newZIndex = Math.max(0, minZIndex - 1)
          this.updateElement({ ...element, zIndex: newZIndex })
          this.$message.success('已置于底层')
          break
      }
    },
    getElementIcon(type) {
      const iconMap = {
        container: 'el-icon-s-grid',
        image: 'el-icon-picture',
        video: 'el-icon-video-camera',
        text: 'el-icon-edit'
      }
      return iconMap[type] || 'el-icon-s-grid'
    },
    getElementName(element) {
      const typeNames = {
        container: '容器',
        image: '图片',
        video: '视频',
        text: '文字'
      }
      const baseName = typeNames[element.type] || '元素'
      return `${baseName} ${element.id}`
    },
    isTopElement(element) {
      const maxZIndex = Math.max(...this.elements.map(el => el.zIndex))
      return element.zIndex === maxZIndex
    },
    isBottomElement(element) {
      const minZIndex = Math.min(...this.elements.map(el => el.zIndex))
      return element.zIndex === minZIndex
    },
    getVideoFormatInfo(mimeType) {
      const formatMap = {
        'video/mp4': {
          info: '已加载 MP4 视频，兼容性最佳（推荐使用 H.264 编码）'
        },
        'video/webm': {
          info: '已加载 WebM 视频，现代浏览器支持良好（Safari/iOS 不支持）'
        },
        'video/ogg': {
          warning: '已加载 OGG 视频，部分浏览器不支持（Safari/Edge/IE 不支持）'
        },
        'video/quicktime': {
          warning: '已加载 MOV 视频，建议转换为 MP4 以获得更好的兼容性'
        },
        'video/x-msvideo': {
          warning: '已加载 AVI 视频，浏览器可能不支持，建议转换为 MP4'
        },
        'video/x-matroska': {
          warning: '已加载 MKV 视频，浏览器不支持，请转换为 MP4 或 WebM'
        }
      }

      if (mimeType && formatMap[mimeType]) {
        return formatMap[mimeType]
      }

      // 未知格式
      if (mimeType && mimeType.startsWith('video/')) {
        return {
          warning: '检测到视频格式: ' + mimeType + '，如果无法播放，请转换为 MP4(H.264) 格式'
        }
      }

      return {
        warning: '无法识别视频格式，推荐使用 MP4(H.264)、WebM(VP9) 或 OGG 格式'
      }
    }
  },
  mounted() {
    // 加载保存的设计
    const savedDesign = localStorage.getItem('adDesign')
    if (savedDesign) {
      try {
        const designData = JSON.parse(savedDesign)
        this.canvasWidth = designData.canvas.width
        this.canvasHeight = designData.canvas.height
        this.elements = designData.elements || []
        this.elementIdCounter = Math.max(...this.elements.map(el => el.id), 0) + 1
      } catch (e) {
        console.error('加载设计数据失败:', e)
      }
    }

    this.updateCanvasSize()

    // 监听窗口大小变化
    window.addEventListener('resize', this.updateCanvasScale)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateCanvasScale)
  }
}
</script>

<style scoped>
.ad-designer {
  position: relative;
  top: 60px;
  background: #f5f5f5;
}

.box-card {
  margin: 10px;
  overflow-y: auto;
}

.library-header h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.screen-size-setting {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e6e6;
}

.screen-size-setting h4 {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.component-list h4 {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.component-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s;
}

.component-item:hover {
  background: #e9ecef;
  border-color: #409eff;
}

.component-item:active {
  cursor: grabbing;
}

.component-item i {
  margin-right: 8px;
  font-size: 16px;
  color: #409eff;
}

.element-list-panel {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e6e6e6;
}

.element-list-panel h4 {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.element-list {
  max-height: 300px;
  overflow-y: auto;
}

.element-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.element-item:hover {
  background: #e9ecef;
  border-color: #409eff;
  transform: translateX(2px);
}

.element-item.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.element-info {
  display: flex;
  align-items: center;
  width: 100%;
}

.element-info i {
  margin-right: 10px;
  font-size: 16px;
}

.element-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.element-index {
  font-size: 11px;
  background: rgba(0, 0, 0, 0.1);
  padding: 3px 8px;
  border-radius: 12px;
  margin-left: 8px;
  white-space: nowrap;
}

.element-item.active .element-index {
  background: rgba(255, 255, 255, 0.25);
}

.editor-main {
  /* background: #f0f0f0; */
  padding: 10px;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  /* margin-bottom: 20px; */
}

.editor-title {
  display: flex;
  align-items: center;
}

.editor-header h3 {
  margin: 0;
  color: #333;
}

.canvas-container {
  height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.canvas {
  background: white;
  border: 2px dashed #ccc;
  position: relative;
  transform-origin: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-selection {
  color: #999;
  text-align: center;
  margin-top: 50px;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #f0f0f0;
}

.preview-header {
  margin-bottom: 15px;
}

.preview-tips {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 0;
  color: #1890ff;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.preview-tips i {
  margin-right: 8px;
  font-size: 16px;
}

.preview-canvas {
  background: white;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* 确保预览画布中的动画正常显示 */
  overflow: visible;
}

.save-container {
  max-height: 70vh;
  overflow-y: auto;
}

.save-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #409eff;
}

.save-info p {
  margin: 5px 0;
  color: #666;
}

.json-container {
  margin-bottom: 20px;
}

.json-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.json-header span {
  color: #333;
}

.json-textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
}

.json-textarea .el-textarea__inner {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #495057;
}
</style>