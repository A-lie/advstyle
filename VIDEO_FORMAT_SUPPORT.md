# 浏览器视频格式支持详解

## 🎥 为什么推荐 MP4 + H.264？

**答案**: 不是只能用这个组合，而是它的**兼容性最好**（几乎所有浏览器都支持）。

## 📊 浏览器支持对照表

### 视频容器格式

| 容器格式 | Chrome | Firefox | Safari | Edge | IE11 | 移动端 |
|---------|--------|---------|--------|------|------|--------|
| **MP4** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 最佳 |
| **WebM** | ✅ | ✅ | ❌ | ✅ | ❌ | ⚠️ 部分 |
| **OGG** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **AVI** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **MOV** | ⚠️ | ❌ | ✅ | ⚠️ | ❌ | ⚠️ iOS |
| **MKV** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 视频编码格式

| 编码格式 | Chrome | Firefox | Safari | Edge | IE11 | 说明 |
|---------|--------|---------|--------|------|------|------|
| **H.264 (AVC)** | ✅ | ✅ | ✅ | ✅ | ✅ | 最佳兼容性 |
| **H.265 (HEVC)** | ⚠️ | ❌ | ✅ | ⚠️ | ❌ | 需硬件支持 |
| **VP8** | ✅ | ✅ | ❌ | ✅ | ❌ | WebM 常用 |
| **VP9** | ✅ | ✅ | ❌ | ✅ | ❌ | 高质量 |
| **AV1** | ✅ | ✅ | ❌ | ✅ | ❌ | 最新标准 |
| **Theora** | ✅ | ✅ | ❌ | ❌ | ❌ | OGG 使用 |

### 音频编码格式

| 编码格式 | Chrome | Firefox | Safari | Edge | IE11 |
|---------|--------|---------|--------|------|------|
| **AAC** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **MP3** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Opus** | ✅ | ✅ | ⚠️ | ✅ | ❌ |
| **Vorbis** | ✅ | ✅ | ❌ | ✅ | ❌ |

## 🎯 推荐组合

### 1️⃣ 最佳兼容性（推荐）
```
容器: MP4
视频编码: H.264 (AVC)
音频编码: AAC
兼容性: 99%+ 的浏览器和设备
```

### 2️⃣ 现代浏览器优化
```
容器: WebM
视频编码: VP9
音频编码: Opus
优势: 文件更小，质量更好
兼容性: Chrome, Firefox, Edge (不支持 Safari/iOS)
```

### 3️⃣ 高质量方案
```
容器: MP4
视频编码: H.265 (HEVC)
音频编码: AAC
优势: 文件小，质量高
兼容性: 需要硬件支持，Safari 支持好
```

### 4️⃣ 开源方案
```
容器: OGG
视频编码: Theora
音频编码: Vorbis
优势: 完全开源
兼容性: Chrome, Firefox (不支持 Safari/Edge/IE)
```

## 🔄 多格式兼容方案

HTML5 支持提供多个视频源，浏览器会自动选择支持的格式：

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <source src="video.ogv" type="video/ogg">
  您的浏览器不支持视频播放
</video>
```

## 📱 移动端特别说明

### iOS (Safari)
- ✅ 完美支持: MP4 + H.264 + AAC
- ✅ 支持: MP4 + H.265 + AAC (iPhone 6s+)
- ❌ 不支持: WebM, OGG

### Android
- ✅ 支持: MP4 + H.264 + AAC
- ✅ 支持: WebM + VP8/VP9 + Opus (Android 4.0+)
- ⚠️ 部分支持: 取决于设备和系统版本

## 🛠️ 实际应用建议

### 场景 1: 广告投放系统（本项目）
**推荐**: MP4 + H.264 + AAC
**理由**: 
- 需要在各种设备上播放
- 兼容性最重要
- 文件大小可接受

### 场景 2: 仅限现代浏览器
**推荐**: WebM + VP9 + Opus
**理由**:
- 文件更小（节省带宽）
- 质量更好
- 不需要支持 Safari

### 场景 3: 高质量视频展示
**推荐**: 提供多格式
```
主要: MP4 + H.264 + AAC (兼容性)
备选: WebM + VP9 + Opus (质量优化)
```

## 🔍 如何检测浏览器支持

### JavaScript 检测
```javascript
const video = document.createElement('video')

// 检测 MP4 支持
console.log('MP4:', video.canPlayType('video/mp4'))
// 返回: "probably" 或 "maybe" 或 ""

// 检测 WebM 支持
console.log('WebM:', video.canPlayType('video/webm'))

// 检测具体编码
console.log('H.264:', video.canPlayType('video/mp4; codecs="avc1.42E01E"'))
console.log('VP9:', video.canPlayType('video/webm; codecs="vp9"'))
```

## 📦 文件大小对比

相同质量下的文件大小（1080p, 1分钟视频）：

| 格式 | 编码 | 文件大小 | 质量 |
|------|------|---------|------|
| MP4 | H.264 (CRF 23) | ~15 MB | 高 |
| MP4 | H.265 (CRF 28) | ~8 MB | 高 |
| WebM | VP9 (CRF 30) | ~10 MB | 高 |
| WebM | VP8 (CRF 10) | ~18 MB | 高 |
| OGG | Theora | ~25 MB | 中 |

## 🎬 转换命令参考

### 转换为 MP4 (H.264)
```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4
```

### 转换为 WebM (VP9)
```bash
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

### 转换为 OGG (Theora)
```bash
ffmpeg -i input.mov -c:v libtheora -q:v 7 -c:a libvorbis output.ogv
```

### 同时生成多种格式
```bash
# MP4
ffmpeg -i input.mov -c:v libx264 -crf 23 -c:a aac output.mp4

# WebM
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -c:a libopus output.webm

# OGG
ffmpeg -i input.mov -c:v libtheora -q:v 7 -c:a libvorbis output.ogv
```

## ⚠️ 常见误区

### 误区 1: "MP4 就是 H.264"
❌ **错误**: MP4 是容器格式，可以包含多种编码
✅ **正确**: MP4 可以包含 H.264, H.265, MPEG-4 等多种编码

### 误区 2: "所有 MP4 都能播放"
❌ **错误**: 即使是 MP4，如果编码不支持也无法播放
✅ **正确**: 需要检查视频编码和音频编码是否都支持

### 误区 3: "WebM 质量不如 MP4"
❌ **错误**: 格式本身不决定质量
✅ **正确**: VP9 编码的 WebM 通常比 H.264 的 MP4 质量更好（相同文件大小）

## 🌐 未来趋势

### AV1 编码
- **优势**: 比 H.265 和 VP9 更高效
- **现状**: Chrome, Firefox, Edge 已支持
- **问题**: Safari 尚未支持，编码速度慢
- **建议**: 观望，暂不推荐用于生产环境

### H.266 (VVC)
- **优势**: 下一代视频编码标准
- **现状**: 浏览器尚未支持
- **建议**: 等待浏览器支持

## 📝 总结

### 为什么推荐 MP4 + H.264？
1. ✅ **兼容性**: 几乎所有浏览器和设备都支持
2. ✅ **稳定性**: 技术成熟，问题少
3. ✅ **硬件加速**: 大部分设备都有硬件解码支持
4. ✅ **生态系统**: 工具链完善，易于处理

### 其他格式可以用吗？
**当然可以！** 只要：
1. 你的目标用户使用的浏览器支持
2. 你愿意处理兼容性问题
3. 你可以提供多格式备选方案

### 最佳实践
```
如果只能选一种: MP4 + H.264 + AAC
如果可以提供多种: MP4 (主) + WebM (备选)
如果只针对现代浏览器: WebM + VP9 + Opus
```
