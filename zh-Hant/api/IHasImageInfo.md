# API 參考：IHasImageInfo

`IHasImageInfo` 是一個介面，由具有關聯 [`ImageInfo`](ImageInfo.md) 的類別所實作，例如 `Surface`、`Image`、`Bitmap` 和 `Pixmap`。

## 方法

- `getImageInfo()`: 返回完整的 [`ImageInfo`](ImageInfo.md) 物件。
- `getWidth()`: 便捷方法，等同於 `getImageInfo().getWidth()`。
- `getHeight()`: 便捷方法，等同於 `getImageInfo().getHeight()`。
- `getColorInfo()`: 返回 `ColorInfo`（ColorType、AlphaType、ColorSpace）。
- `getColorType()`: 返回 `ColorType`。
- `getAlphaType()`: 返回 `ColorAlphaType`。
- `getColorSpace()`: 返回 `ColorSpace`。
- `getBytesPerPixel()`: 每個像素所需的位元組數。
- `isEmpty()`: 如果寬度或高度為零，則返回 `true`。
- `isOpaque()`: 如果保證所有像素都是不透明的，則返回 `true`。