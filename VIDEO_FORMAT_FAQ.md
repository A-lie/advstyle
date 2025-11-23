# 视频格式常见问题解答

## ❓ 为什么一定要是 H.264 和 MP4 格式呢？

### 简短回答
**不是一定要！** 系统支持多种视频格式，只是 MP4 + H.264 兼容性最好。

### 详细说明

#### 系统实际支持的格式
```
✅ MP4 (H.264/H.265)  - 推荐，兼容性最好
✅ WebM (VP8/VP9)     - 现代浏览器支持
✅ OGG (Theora)       - 部分浏览器支持
⚠️ MOV (QuickTime)   - 可以尝试，Safari 支持
⚠️ 其他格式          - 系统会尝试加载，但不保证兼容性
```

#### 为什么推荐 MP4 + H.264？

| 原因 | 说明 |
|------|------|
| **兼容性** | 99%+ 的浏览器和设备都支持 |
| **硬件加速** | 几乎所有设备都有 H.264 硬件解码器 |
| **稳定性** | 技术成熟，问题少 |
| **工具支持** | 转换工具丰富，易于处理 |
| **文件大小** | 压缩效率好，质量与大小平衡 |

## 🎯 不同场景的推荐

### 场景 1: 需要最大兼容性（广告投放）
```
推荐: MP4 + H.264 + AAC
理由: 需要在各种设备上播放，包括老旧设备
```

### 场景 2: 仅限现代浏览器
```
推荐: WebM + VP9 + Opus
理由: 文件更小，质量更好
注意: Safari/iOS 不支持
```

### 场景 3: 高质量视频
```
推荐: MP4 + H.265 + AAC
理由: 文件小，质量高
注意: 需要硬件支持，老设备可能不支持
```

### 场景 4: 完全开源方案
```
推荐: OGG + Theora + Vorbis
理由: 完全开源，无专利问题
注意: Safari/Edge/IE 不支持
```

## 📊 浏览器兼容性对照

### 桌面浏览器

| 格式 | Chrome | Firefox | Safari | Edge | IE11 |
|------|--------|---------|--------|------|------|
| MP4 (H.264) | ✅ | ✅ | ✅ | ✅ | ✅ |
| MP4 (H.265) | ⚠️ | ❌ | ✅ | ⚠️ | ❌ |
| WebM (VP8) | ✅ | ✅ | ❌ | ✅ | ❌ |
| WebM (VP9) | ✅ | ✅ | ❌ | ✅ | ❌ |
| OGG (Theora) | ✅ | ✅ | ❌ | ❌ | ❌ |

### 移动浏览器

| 格式 | iOS Safari | Android Chrome | Android Firefox |
|------|-----------|----------------|-----------------|
| MP4 (H.264) | ✅ | ✅ | ✅ |
| MP4 (H.265) | ✅ (6s+) | ⚠️ | ❌ |
| WebM (VP8) | ❌ | ✅ | ✅ |
| WebM (VP9) | ❌ | ✅ | ✅ |
| OGG (Theora) | ❌ | ✅ | ✅ |

## 🔄 如何选择格式？

### 决策流程图

```
开始
  ↓
需要支持 Safari/iOS 吗？
  ├─ 是 → 使用 MP4 (H.264)
  └─ 否 → 继续
       ↓
     需要最小文件大小吗？
       ├─ 是 → 使用 WebM (VP9)
       └─ 否 → 使用 MP4 (H.264)
```

### 快速选择指南

**如果你不确定用什么，就用 MP4 + H.264！**

理由：
- ✅ 适用于 99% 的场景
- ✅ 不需要考虑兼容性问题
- ✅ 工具链成熟，易于处理

## 💡 实用建议

### 1. 提供多格式备选（最佳实践）

虽然本系统目前只支持单个视频源，但 HTML5 标准支持多格式：

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <source src="video.ogv" type="video/ogg">
  您的浏览器不支持视频播放
</video>
```

浏览器会自动选择第一个支持的格式。

### 2. 文件大小优化

不同格式的文件大小对比（1080p, 1分钟，相同质量）：

```
MP4 (H.264, CRF 23):  ~15 MB
MP4 (H.265, CRF 28):  ~8 MB   (更小！)
WebM (VP9, CRF 30):   ~10 MB  (较小)
WebM (VP8, CRF 10):   ~18 MB
OGG (Theora):         ~25 MB  (较大)
```

### 3. 质量 vs 兼容性

```
最佳质量:    H.265 > VP9 > H.264 > VP8 > Theora
最佳兼容性:  H.264 > VP8 > H.265 > VP9 > Theora
最小文件:    H.265 > VP9 > H.264 > VP8 > Theora
```

## 🛠️ 格式转换工具

### 推荐工具

1. **HandBrake** (免费，图形界面)
   - 适合: 新手用户
   - 支持: MP4, WebM, OGG
   - 下载: https://handbrake.fr/

2. **FFmpeg** (免费，命令行)
   - 适合: 高级用户
   - 支持: 几乎所有格式
   - 下载: https://ffmpeg.org/

3. **在线工具**
   - CloudConvert: https://cloudconvert.com/
   - Online-Convert: https://www.online-convert.com/

### 快速转换命令

```bash
# 转换为 MP4 (H.264) - 最佳兼容性
ffmpeg -i input.mov -c:v libx264 -crf 23 -c:a aac output.mp4

# 转换为 WebM (VP9) - 最小文件
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -c:a libopus output.webm

# 转换为 OGG (Theora) - 开源方案
ffmpeg -i input.mov -c:v libtheora -q:v 7 -c:a libvorbis output.ogv

# 同时生成多种格式
ffmpeg -i input.mov -c:v libx264 -crf 23 -c:a aac output.mp4
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -c:a libopus output.webm
```

## 🔍 如何检测浏览器支持？

### 在浏览器控制台中测试

```javascript
const video = document.createElement('video')

// 检测 MP4 (H.264)
console.log('MP4 H.264:', video.canPlayType('video/mp4; codecs="avc1.42E01E"'))

// 检测 MP4 (H.265)
console.log('MP4 H.265:', video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"'))

// 检测 WebM (VP8)
console.log('WebM VP8:', video.canPlayType('video/webm; codecs="vp8, vorbis"'))

// 检测 WebM (VP9)
console.log('WebM VP9:', video.canPlayType('video/webm; codecs="vp9"'))

// 检测 OGG (Theora)
console.log('OGG Theora:', video.canPlayType('video/ogg; codecs="theora"'))
```

返回值：
- `"probably"` - 很可能支持
- `"maybe"` - 可能支持
- `""` (空字符串) - 不支持

## 📝 总结

### 核心要点

1. **系统不限制格式** - 可以上传任何视频格式
2. **推荐 MP4 + H.264** - 兼容性最好，但不是唯一选择
3. **根据需求选择** - 不同场景有不同的最佳选择
4. **测试很重要** - 在目标浏览器中测试视频播放

### 最终建议

```
如果只能选一种:     MP4 + H.264 + AAC
如果追求文件大小:   WebM + VP9 + Opus
如果需要高质量:     MP4 + H.265 + AAC
如果完全开源:       OGG + Theora + Vorbis
如果不确定:         MP4 + H.264 + AAC (最安全)
```

## 🔗 相关资源

- [浏览器视频格式支持详解](./VIDEO_FORMAT_SUPPORT.md)
- [视频功能使用指南](./VIDEO_GUIDE.md)
- [问题排查指南](./TROUBLESHOOTING.md)
- [Can I Use - Video Format](https://caniuse.com/video)
- [MDN - Video Codecs](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)
