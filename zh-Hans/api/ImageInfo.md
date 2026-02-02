# API 参考：ImageInfo

`ImageInfo` 描述像素尺寸和编码格式。它用于创建和描述表面、图像和位图的内存布局。

## 构造函数与工厂方法

- `new ImageInfo(width, height, colorType, alphaType)`
- `new ImageInfo(width, height, colorType, alphaType, colorSpace)`
- `makeN32(width, height, alphaType)`：平台默认的 32 位颜色类型。
- `makeS32(width, height, alphaType)`：采用 sRGB 色彩空间的 N32 类型。
- `makeN32Premul(width, height)`：采用预乘 Alpha 的 N32 类型。
- `makeA8(width, height)`：仅 8 位 Alpha 通道。

## 方法

- `getWidth()` / `getHeight()`：像素尺寸。
- `getColorType()`：像素格式（例如 `RGBA_8888`）。
- `getColorAlphaType()`：Alpha 编码方式（`PREMUL`、`UNPREMUL`、`OPAQUE`）。
- `getColorSpace()`：色彩范围与线性特性。
- `getBounds()`：返回从 (0,0) 到 (width, height) 的 `IRect` 区域。
- `getBytesPerPixel()`：单个像素占用的字节数。
- `getMinRowBytes()`：单行像素所需的最小字节数。
- `isEmpty()`：当宽度或高度 <= 0 时返回 `true`。

## 函数式修改

`ImageInfo` 是不可变对象。使用以下方法创建修改后的副本：

- `withWidthHeight(w, h)`
- `withColorType(type)`
- `withColorAlphaType(type)`
- `withColorSpace(cs)`