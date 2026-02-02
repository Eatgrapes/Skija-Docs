---
layout: home

hero:
  name: Skija
  text: Skia 的 Java 绑定
  tagline: 适用于 JVM 的高性能、硬件加速 2D 图形库。
  actions:
    - theme: brand
      text: 快速开始
      link: /zh-Hans/getting-started
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/HumbleUI/Skija

features:
  - title: 硬件加速
    details: 利用 Skia 通过 OpenGL、Metal、Vulkan 和 Direct3D 实现如丝般顺滑的性能。
  - title: 丰富的排版
    details: 使用 HarfBuzz 进行高级文本整形，使用 SkParagraph 进行复杂布局。
  - title: 现代着色器
    details: 使用 SkSL（Skia 着色语言）编写自定义 GPU 着色器。
---

::: warning 非官方文档
本文档由社区维护，**不是** Skia 或 Skija 项目的官方出版物。
如果您发现任何错误或有建议，请在 [**Eatgrapes/Skija-Docs**](https://github.com/Eatgrapes/Skija-Docs) 报告。
:::

## 完整文档索引

### 基础知识

- [**快速开始**](getting-started.md): Skija 工作原理的概览以及从何处开始。
- [**安装**](installation.md): Windows、macOS 和 Linux 的依赖项设置。
- [**渲染基础**](rendering-basics.md): Surface、Canvas 和你的第一个 "Hello World"。
- [**颜色和 Alpha**](colors.md): 处理透明度、预乘和色彩空间。
- [**Color API**](api/Color.md): 高精度颜色表示、像素格式和色彩空间。
- [**动画**](animation.md): 创建运动、游戏循环和播放 Lottie/GIF。
- [**资源管理**](resource-management.md): Skija 如何处理原生内存和 `Managed` 生命周期。

### API 深度解析

- [**Surface**](api/Surface.md): 创建绘图目标（光栅、GPU、包装）。
- [**Canvas**](api/Canvas.md): 变换、裁剪和绘制图元。
- [**Images & Bitmaps**](api/Images.md): 加载、绘制和操作像素数据。
- [**ImageInfo**](api/ImageInfo.md): 像素维度和编码方式。
- [**ImageFilter**](api/ImageFilter.md): 像素级效果（模糊、阴影）。
- [**IHasImageInfo**](api/IHasImageInfo.md): 包含 ImageInfo 对象的接口。
- [**SamplingMode**](api/SamplingMode.md): 定义缩放时像素的采样方式。
- [**CubicResampler**](api/CubicResampler.md): 高质量的双三次插值。
- [**Data**](api/Data.md): 高效的原生内存管理。
- [**StreamAsset**](api/StreamAsset.md): 可寻址的只读数据流。
- [**Matrix**](api/Matrix.md): 3x3 和 4x4 矩阵变换。
- [**Codec (Animations)**](api/Codec.md): 底层图像解码和 GIF/WebP 动画。
- [**Paint & Effects**](api/Effects.md): 样式、模糊、阴影和颜色过滤器。
- [**Shadows**](api/Shadows.md): 2D 投影和基于 3D 高度的阴影。
- [**Paths**](api/Path.md): 创建和组合复杂的几何形状。
- [**PathBuilder**](api/path-builder.md): 用于构建路径的流式 API。
- [**PathMeasure**](api/PathMeasure.md): 测量路径长度并沿路径查找点。
- [**Region**](api/Region.md): 基于整数的区域操作和点击测试。
- [**Picture**](api/Picture.md): 为了性能记录和重放绘图命令。

### 排版与文本

- [**Typeface**](api/Typeface.md): 字体文件加载和属性。
- [**Font**](api/Font.md): 字体大小、度量和渲染属性。
- [**Typography & Fonts**](typography.md): 字体和度量的基础。
- [**Text Animation & Clipping**](api/text-animation.md): 使用文本作为遮罩、波浪文字和可变字体。
- [**TextBlob & Builder**](api/TextBlob.md): 优化的、可重用的字形运行。
- [**TextLine**](api/TextLine.md): 单行文本布局和点击测试。
- [**Paragraph (Rich Text)**](api/Paragraph.md): 复杂的多样式文本布局和换行。
- [**BreakIterator**](api/BreakIterator.md): 定位单词、行和句子的边界。

### 高级图形

- [**GPU Rendering**](gpu-rendering.md): 使用 OpenGL、Metal、Vulkan 和 Direct3D 进行硬件加速。
- [**DirectContext**](api/direct-context.md): 管理 GPU 状态和命令提交。
- [**Shaper**](api/Shaper.md): 文本整形和字形定位 (HarfBuzz)。
- [**SkSL (RuntimeEffect)**](api/runtime-effect.md): 编写自定义 GPU 着色器以获得极致的灵活性。
- [**PDF Generation**](api/Document.md): 创建基于矢量的 PDF 文档。

### 扩展

- [**SVG**](api/SVG.md): 加载和渲染 SVG 图标和插图。
- [**Lottie**](extensions.md): 使用 Skottie 进行高性能矢量动画。
