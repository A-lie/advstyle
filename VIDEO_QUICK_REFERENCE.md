# 视频格式快速参考

## 🎯 一句话总结

**系统支持所有视频格式，但推荐 MP4(H.264) 以获得最佳兼容性。**

## ⚡ 快速决策

### 我应该用什么格式？

```
┌─────────────────────────────────────┐
│  需要支持 iPhone/iPad？              │
│  ├─ 是 → MP4 (H.264)                │
│  └─ 否 → 继续                        │
│       ↓                              │
│  只针对现代浏览器？                   │
│  ├─ 是 → WebM (VP9)                 │
│  └─ 否 → MP4 (H.264)                │
└─────────────────────────────────────┘
```

### 不确定？用这个！

```bash
格式: MP4
视频编码: H.264
音频编码: AAC
分辨率: 1920x1080 或更低
文件大小: < 50MB
```

## 📊 格式对比速查表

| 格式 | 兼容性 | 文件大小 | 质量 | 推荐度 |
|------|--------|---------|------|--------|
| **MP4 (H.264)** | ⭐⭐⭐⭐⭐ | 中等 | 高 | ⭐⭐⭐⭐⭐ |
| **WebM (VP9)** | ⭐⭐⭐⭐ | 小 | 高 | ⭐⭐⭐⭐ |
| **MP4 (H.265)** | ⭐⭐⭐ | 很小 | 很高 | ⭐⭐⭐ |
| **OGG (Theora)** | ⭐⭐ | 大 | 中 | ⭐⭐ |

## 🔧 一键转换命令

### 转换为推荐格式 (MP4 H.264)
```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -c:a aac output.mp4
```

### 压缩大文件
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k output.mp4
```

### 调整分辨率
```bash
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 output.mp4
```

## ✅ 检查清单

上传视频前检查：
- [ ] 格式是 MP4/WebM/OGG 之一
- [ ] 文件大小 < 100MB (推荐 < 50MB)
- [ ] 分辨率 ≤ 1920x1080
- [ ] 如果是 MP4，确认是 H.264 编码

## 🚨 常见错误速查

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| 不支持的视频格式 | 编码不兼容 | 转换为 H.264 |
| 视频解码失败 | 文件损坏 | 重新导出视频 |
| 加载缓慢 | 文件太大 | 压缩视频 |

## 📱 浏览器支持速查

| 浏览器 | 推荐格式 |
|--------|---------|
| Chrome | MP4 或 WebM |
| Firefox | MP4 或 WebM |
| Safari | 仅 MP4 |
| Edge | MP4 或 WebM |
| 移动端 | MP4 |

## 🔗 详细文档

- 完整说明: [VIDEO_FORMAT_FAQ.md](./VIDEO_FORMAT_FAQ.md)
- 使用指南: [VIDEO_GUIDE.md](./VIDEO_GUIDE.md)
- 格式支持: [VIDEO_FORMAT_SUPPORT.md](./VIDEO_FORMAT_SUPPORT.md)
- 问题排查: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
