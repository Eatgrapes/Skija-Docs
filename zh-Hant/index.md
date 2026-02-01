---
layout: home

hero:
  name: Skija
  text: Skia 的 Java 綁定
  tagline: JVM 上的高效能硬體加速 2D 圖形庫。
  actions:
    - theme: brand
      text: 快速開始
      link: /getting-started
    - theme: alt
      text: 檢視 GitHub
      link: https://github.com/HumbleUI/Skija

features:
  - title: 硬體加速
    details: 透過 Skia 利用 OpenGL, Metal, Vulkan 和 Direct3D 實現絲般順滑的效能。
  - title: 豐富的排版
    details: 使用 HarfBuzz 進行高階文字整形，並使用 SkParagraph 進行複雜的佈局。
  - title: 現代著色器
    details: 使用 SkSL (Skia Shading Language) 編寫自定義 GPU 著色器。
---

::: warning 非官方文件
本文件由社群維護，**不是** Skia 或 Skija 專案的官方出版物。
如果您發現任何錯誤或有建議，請在 [**Eatgrapes/Skija-Docs**](https://github.com/Eatgrapes/Skija-Docs) 報告。
:::

## 完整文件索引

### 基礎知識

- [**Getting Started**](../getting-started.md): Skija 運作原理的鳥瞰圖以及如何開始。
- [**Installation**](../installation.md): 為 Windows、macOS 和 Linux 設定專案依賴。
- [**Rendering Basics**](../rendering-basics.md): Surface、Canvas 以及您的第一個「Hello World」。
- [**Colors and Alpha**](../colors.md): 處理透明度、預乘和色彩空間。
- [**Animation**](../animation.md): 建立運動、遊戲迴圈並播放 Lottie/GIF 動畫。
- [**Resource Management**](../resource-management.md): Skija 如何處理本機記憶體和 `Managed` 生命周期。

### API 深度解析

- [**Surface**](../api/Surface.md): 建立繪圖目標（光柵、GPU、包裝）。
- [**Canvas**](../api/Canvas.md): 變換、裁剪和繪圖原語。
- [**Images & Bitmaps**](../api/Images.md): 載入、繪製和操作畫素資料。
- [**Data**](../api/Data.md): 高效的本機記憶體管理。
- [**Matrix**](../api/Matrix.md): 3x3 和 4x4 矩陣變換。
- [**Codec (Animations)**](../api/Codec.md): 低階影象解碼和 GIF/WebP 動畫。
- [**Paint & Effects**](../api/Effects.md): 樣式、模糊、陰影和濾色器。
- [**Shadows**](../api/Shadows.md): 2D 投影陰影和基於 3D 高度的陰影。
- [**Paths**](../api/Path.md): 建立和組合複雜的幾何形狀。
- [**PathBuilder**](../api/path-builder.md): 用於構建路徑的流暢 API。
- [**Region**](../api/Region.md): 基於整數的區域操作和點選測試。
- [**Picture**](../api/Picture.md): 記錄和重放繪圖命令以提高效能。

### 排版與文字

- [**Typeface**](../api/Typeface.md): 字型檔案載入和屬性。
- [**Typography & Fonts**](../typography.md): 字型和度量的基礎知識。
- [**Text Animation & Clipping**](../api/text-animation.md): 將文字用作遮罩、波浪文字和可變字型。
- [**TextBlob & Builder**](../api/TextBlob.md): 最佳化的、可重複使用的字形執行。
- [**TextLine**](../api/TextLine.md): 單行文字佈局和點選測試。
- [**Paragraph (Rich Text)**](../api/Paragraph.md): 複雜的多樣式文字佈局和換行。
- [**BreakIterator**](../api/BreakIterator.md): 定位單詞、行和句子的邊界。

### 高階圖形

- [**GPU Rendering**](../gpu-rendering.md): 使用 OpenGL、Metal、Vulkan 和 Direct3D 進行硬體加速。
- [**DirectContext**](../api/direct-context.md): 管理 GPU 狀態和命令提交。
- [**Shaper**](../api/Shaper.md): 文字整形和字形定位 (HarfBuzz)。
- [**SkSL (RuntimeEffect)**](../api/runtime-effect.md): 編寫自定義 GPU 著色器以實現極致的靈活性。
- [**PDF Generation**](../api/Document.md): 建立基於向量的 PDF 文件。

### 擴充

- [**SVG**](../api/SVG.md): 載入和渲染 SVG 圖示和插圖。
- [**Lottie**](../extensions.md): 使用 Skottie 播放高效能向量動畫。