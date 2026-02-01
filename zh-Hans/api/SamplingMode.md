# API 参考：SamplingMode

`SamplingMode` 是一个接口，定义了图像在缩放、旋转或变换时像素的采样方式。

## 实现方式

在 Skija 中，有三种主要的采样指定方式：

1.  **[`FilterMipmap`](#filtermipmap)**：标准的线性/最近邻过滤，可选使用 Mipmap。
2.  **[`CubicResampler`](CubicResampler.md)**：高质量的双三次插值（Mitchell、Catmull-Rom）。
3.  **`SamplingModeAnisotropic`**：针对锐角视角纹理的高质量过滤。

## 常用预设

- `SamplingMode.DEFAULT`：最近邻过滤（最快，有块状感）。
- `SamplingMode.LINEAR`：双线性过滤（平滑，大多数情况下的默认选项）。
- `SamplingMode.MITCHELL`：高质量双三次过滤（平滑且锐利）。
- `SamplingMode.CATMULL_ROM`：非常锐利的双三次过滤。

## FilterMipmap

这是最常用的采样模式。它使用两个参数：

### FilterMode
- `NEAREST`：采样单个最近的像素。
- `LINEAR`：在 4 个最近的像素之间进行插值。

### MipmapMode
- `NONE`：不使用 Mipmap。
- `NEAREST`：从最近的 Mipmap 层级采样。
- `LINEAR`：在两个 Mipmap 层级之间进行插值（三线性过滤）。

## 用法

```java
// 双线性采样
canvas.drawImage(img, 0, 0, SamplingMode.LINEAR, null);

// 最近邻采样（像素艺术风格）
canvas.drawImage(img, 0, 0, SamplingMode.DEFAULT, null);

// 高质量双三次采样
canvas.drawImage(img, 0, 0, CubicResampler.MITCHELL, null);
```