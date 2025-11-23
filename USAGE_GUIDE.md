# 保存设计功能使用指南

## 新增功能说明

### 保存设计对话框
当点击"保存设计"按钮时，现在会弹出一个详细的保存对话框，包含以下功能：

#### 1. 设计信息展示
- 画布尺寸
- 元素数量
- 保存时间

#### 2. JSON 数据展示
- 完整的设计配置数据
- 格式化的 JSON 显示
- 只读文本框，便于查看

#### 3. 操作按钮
- **复制 JSON**：一键复制 JSON 数据到剪贴板
- **下载 JSON 文件**：将 JSON 数据下载为文件
- **保存到本地**：保存到浏览器本地存储
- **关闭**：关闭对话框

## 使用步骤

### 1. 创建设计
1. 访问设计器页面：http://localhost:8080/designer
2. 设置画布尺寸
3. 拖拽组件到画布
4. 调整元素属性

### 2. 保存设计
1. 点击顶部的"保存设计"按钮
2. 查看弹出的保存对话框
3. 查看设计信息和 JSON 数据

### 3. 复制 JSON 数据
1. 在保存对话框中点击"复制 JSON"按钮
2. JSON 数据会自动复制到剪贴板
3. 可以粘贴到其他地方使用

### 4. 下载 JSON 文件
1. 点击"下载 JSON 文件"按钮
2. 浏览器会自动下载 JSON 文件
3. 文件名格式：`ad-design-{时间戳}.json`

### 5. 保存到本地存储
1. 点击"保存到本地"按钮
2. 数据会保存到浏览器的 localStorage
3. 下次打开页面时会自动加载

## JSON 数据结构

```json
{
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "elements": [
    {
      "id": 1,
      "type": "image",
      "x": 100,
      "y": 100,
      "width": 300,
      "height": 200,
      "images": [
        {
          "url": "data:image/...",
          "name": "image1.jpg"
        }
      ],
      "displayMode": "center",
      "interval": 3000,
      "opacity": 255,
      "zIndex": 1,
      "backgroundColor": "transparent"
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "elementCount": 1
  }
}
```

## 技术特性

### 复制功能
- 优先使用现代的 Clipboard API
- 自动降级到传统的 execCommand 方法
- 兼容各种浏览器环境

### 下载功能
- 使用 Blob API 生成文件
- 自动触发下载
- 文件名包含时间戳，避免重复

### 数据格式
- 标准 JSON 格式
- 包含元数据信息
- 支持版本控制

## 浏览器兼容性

### 复制功能
- Chrome 66+：支持 Clipboard API
- Firefox 63+：支持 Clipboard API
- Safari 13.1+：支持 Clipboard API
- 其他浏览器：使用 execCommand 降级方案

### 下载功能
- 所有现代浏览器都支持 Blob 和 URL.createObjectURL

## 故障排除

### 复制失败
1. 检查浏览器是否支持剪贴板操作
2. 确保页面在 HTTPS 环境下（本地开发除外）
3. 检查浏览器权限设置

### 下载失败
1. 检查浏览器下载设置
2. 确保没有被弹窗拦截器阻止
3. 检查磁盘空间是否充足

### 保存失败
1. 检查浏览器是否支持 localStorage
2. 确保存储空间未满
3. 检查隐私模式设置

## 开发说明

### 新增的数据属性
```javascript
data() {
  return {
    // ... 其他属性
    saveVisible: false,        // 保存对话框显示状态
    designJsonData: ''         // 格式化的 JSON 数据
  }
}
```

### 新增的方法
- `copyJsonData()`: 复制 JSON 到剪贴板
- `fallbackCopyTextToClipboard()`: 复制功能的降级方案
- `downloadJson()`: 下载 JSON 文件
- `saveToLocalStorage()`: 保存到本地存储

### 修改的方法
- `saveDesign()`: 现在会显示保存对话框而不是直接保存