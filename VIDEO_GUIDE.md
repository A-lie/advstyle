# 视频功能使用指南

## 📹 支持的视频格式

### ✅ 完全支持（推荐）
- **MP4 (H.264 编码)** - 最佳兼容性，所有浏览器支持 ⭐⭐⭐⭐⭐
- **WebM (VP8/VP9 编码)** - 现代浏览器支持良好 ⭐⭐⭐⭐
- **OGG (Theora 编码)** - 部分浏览器支持 ⭐⭐⭐

### ⚠️ 可以尝试（可能需要转换）
- **MOV (QuickTime)** - Safari 支持，其他浏览器可能不支持
- **AVI** - 浏览器通常不支持，建议转换
- **MKV** - 浏览器不支持，需要转换
- **其他格式** - 系统会尝试加载，但不保证兼容性

> **重要说明**: 系统**不会阻止**您上传任何视频格式，但会根据格式给出兼容性提示。如果视频无法播放，请参考下方的转换指南。

### 视频编码要求
- **视频编码**: H.264 (AVC)
- **音频编码**: AAC
- **容器格式**: MP4

## 📊 文件大小建议

- **推荐大小**: < 50MB
- **最大支持**: 100MB
- **超过限制**: 可能导致加载失败或性能问题

## 🔧 视频转换工具

如果您的视频无法播放，可以使用以下工具转换格式：

### 在线工具
- [CloudConvert](https://cloudconvert.com/) - 在线视频转换
- [Online-Convert](https://www.online-convert.com/) - 支持多种格式

### 桌面工具
- **HandBrake** (免费) - 推荐设置:
  - 格式: MP4
  - 视频编码: H.264
  - 音频编码: AAC
  - 质量: RF 20-23

- **FFmpeg** (命令行) - 转换命令:
  ```bash
  ffmpeg -i input.mp4 -c:v libx264 -c:a aac -strict experimental output.mp4
  ```

## ⚠️ 常见问题

### 1. 为什么推荐 MP4 + H.264？

**不是只能用这个组合！** 而是因为：
- ✅ 兼容性最好（99%+ 的浏览器和设备）
- ✅ 硬件加速支持广泛
- ✅ 工具链成熟，易于处理

**其他格式也可以用**，只要您的目标浏览器支持。详见 [VIDEO_FORMAT_SUPPORT.md](./VIDEO_FORMAT_SUPPORT.md)

### 2. 视频加载失败: 不支持的视频格式

**原因**: 
- 视频编码不是 H.264
- 使用了浏览器不支持的编码格式

**解决方案**:
1. 使用 HandBrake 或 FFmpeg 转换为 H.264 编码
2. 确保音频编码为 AAC
3. 使用 MP4 容器格式

### 2. 视频解码失败

**原因**:
- 视频文件损坏
- 编码参数不兼容

**解决方案**:
1. 重新导出视频
2. 降低视频分辨率和比特率
3. 使用标准的编码配置

### 3. 视频文件过大

**原因**:
- 原始视频分辨率过高
- 比特率设置过高

**解决方案**:
1. 降低视频分辨率 (如 1920x1080 → 1280x720)
2. 调整比特率 (建议 2-5 Mbps)
3. 压缩视频文件

## 💡 最佳实践

### 1. 视频准备
- ✅ 使用 MP4 格式，H.264 编码
- ✅ 分辨率不超过 1920x1080
- ✅ 文件大小控制在 50MB 以内
- ✅ 比特率 2-5 Mbps

### 2. 性能优化
- 使用较短的视频片段 (< 30秒)
- 避免同时播放多个视频
- 在编辑模式下禁用自动播放

### 3. 兼容性测试
- 在不同浏览器中测试视频播放
- 检查移动设备上的表现
- 确保视频在预览模式下正常播放

## 🎬 推荐的视频设置

### HandBrake 设置
```
Summary:
  Format: MP4
  
Video:
  Codec: H.264 (x264)
  Framerate: Same as source
  Quality: Constant Quality RF 22
  Encoder Preset: Fast
  
Audio:
  Codec: AAC
  Bitrate: 128 kbps
  Sample Rate: Auto
```

### FFmpeg 命令
```bash
# 基本转换
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4

# 调整分辨率
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -c:a aac output.mp4

# 压缩大文件
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k output.mp4
```

## 🐛 错误代码说明

| 错误代码 | 错误类型 | 说明 | 解决方案 |
|---------|---------|------|---------|
| 1 | MEDIA_ERR_ABORTED | 视频加载被中止 | 重新选择视频文件 |
| 2 | MEDIA_ERR_NETWORK | 网络错误 | 检查网络连接 |
| 3 | MEDIA_ERR_DECODE | 视频解码失败 | 视频文件可能已损坏，重新转换 |
| 4 | MEDIA_ERR_SRC_NOT_SUPPORTED | 不支持的格式 | 转换为 MP4(H.264) 格式 |

## 📝 技术说明

### Blob URL vs Base64
- 本系统使用 **Blob URL** 加载视频，性能更好
- Blob URL 格式: `blob:http://...`
- 优势: 内存占用小，加载速度快
- 注意: 页面刷新后 Blob URL 会失效

### 浏览器兼容性
- Chrome/Edge: 完全支持 ✅
- Firefox: 完全支持 ✅
- Safari: 支持 MP4(H.264) ✅
- IE11: 仅支持 MP4(H.264) ⚠️

## 🔗 相关资源

- [HTML5 Video 格式支持](https://caniuse.com/video)
- [HandBrake 官网](https://handbrake.fr/)
- [FFmpeg 官网](https://ffmpeg.org/)
- [H.264 编码指南](https://trac.ffmpeg.org/wiki/Encode/H.264)
