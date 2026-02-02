# API 參考：ImageInfo

`ImageInfo` 描述像素尺寸與編碼方式。它用於建立和描述表面、圖像與點陣圖的記憶體佈局。

## 建構函式與工廠方法

- `new ImageInfo(width, height, colorType, alphaType)`
- `new ImageInfo(width, height, colorType, alphaType, colorSpace)`
- `makeN32(width, height, alphaType)`：平台預設的 32 位元色彩類型。
- `makeS32(width, height, alphaType)`：使用 sRGB 色彩空間的 N32。
- `makeN32Premul(width, height)`：使用預乘 Alpha 的 N32。
- `makeA8(width, height)`：僅 8 位元 Alpha 通道。

## 方法

- `getWidth()` / `getHeight()`：像素尺寸。
- `getColorType()`：像素格式（例如 `RGBA_8888`）。
- `getColorAlphaType()`：Alpha 編碼方式（`PREMUL`、`UNPREMUL`、`OPAQUE`）。
- `getColorSpace()`：色彩範圍與線性特性。
- `getBounds()`：回傳從 (0,0) 到 (width, height) 的 `IRect`。
- `getBytesPerPixel()`：單一像素所需的位元組數。
- `getMinRowBytes()`：單行像素所需的最小位元組數。
- `isEmpty()`：若寬度或高度 <= 0 則回傳 `true`。

## 功能性修改

`ImageInfo` 是不可變的。使用以下方法建立修改後的副本：

- `withWidthHeight(w, h)`
- `withColorType(type)`
- `withColorAlphaType(type)`
- `withColorSpace(cs)`