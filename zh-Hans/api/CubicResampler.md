# API 参考：CubicResampler

`CubicResampler` 是一种 [`SamplingMode`](SamplingMode.md) 类型，用于通过双三次插值实现高质量的图像缩放。

## 概述

三次重采样器由两个参数 **B** 和 **C** 定义，它们控制着三次滤波器的形状。不同的值会产生不同的特性（锐度、振铃效应等）。

## 常量

`CubicResampler` 提供了两种常用的预设：

- `CubicResampler.MITCHELL`: (B=1/3, C=1/3)。在锐度和伪影之间取得了良好的平衡。
- `CubicResampler.CATMULL_ROM`: (B=0, C=1/2)。比 Mitchell 更锐利，常用于缩小图像。

## 参数

- **B (模糊度)**: 控制滤波器的“模糊”程度。
- **C (振铃效应)**: 控制边缘周围的“振铃”或“光晕”效应。

## 用法

```java
// 使用 Mitchell 重采样器进行高质量缩放
canvas.drawImageRect(image, dstRect, CubicResampler.MITCHELL, null);

// 自定义重采样器
CubicResampler custom = new CubicResampler(0.2f, 0.4f);
canvas.drawImageRect(image, dstRect, custom, paint);
```

## 参考文献

- "Reconstruction Filters in Computer Graphics" (Mitchell & Netravali, 1988)。
- [双三次滤波概述](https://entropymine.com/imageworsener/bicubic/)