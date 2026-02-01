# API 參考：CubicResampler

`CubicResampler` 是一種 [`SamplingMode`](SamplingMode.md) 類型，用於通過雙三次插值實現高品質的圖像縮放。

## 概述

立方重採樣器由兩個參數 **B** 和 **C** 定義，它們控制立方濾波器的形狀。不同的值會產生不同的特性（銳利度、振鈴效應等）。

## 常量

`CubicResampler` 提供了兩個常用的預設值：

- `CubicResampler.MITCHELL`: (B=1/3, C=1/3)。在銳利度和偽影之間取得良好平衡。
- `CubicResampler.CATMULL_ROM`: (B=0, C=1/2)。比 Mitchell 更銳利，常用於縮小圖像。

## 參數

- **B (模糊)**: 控制濾波器的「模糊度」。
- **C (振鈴)**: 控制邊緣周圍的「振鈴」或「光暈」效應。

## 用法

```java
// 使用 Mitchell 重採樣器進行高品質縮放
canvas.drawImageRect(image, dstRect, CubicResampler.MITCHELL, null);

// 自定義重採樣器
CubicResampler custom = new CubicResampler(0.2f, 0.4f);
canvas.drawImageRect(image, dstRect, custom, paint);
```

## 參考文獻

- "Reconstruction Filters in Computer Graphics" (Mitchell & Netravali, 1988)。
- [Bicubic Filtering Overview](https://entropymine.com/imageworsener/bicubic/)