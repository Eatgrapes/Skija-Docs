# API 参考：IHasImageInfo

`IHasImageInfo` 是一个接口，由具有关联 [`ImageInfo`](ImageInfo.md) 的类实现，例如 `Surface`、`Image`、`Bitmap` 和 `Pixmap`。

## 方法

- `getImageInfo()`：返回完整的 [`ImageInfo`](ImageInfo.md) 对象。
- `getWidth()`：便捷方法，等同于 `getImageInfo().getWidth()`。
- `getHeight()`：便捷方法，等同于 `getImageInfo().getHeight()`。
- `getColorInfo()`：返回 `ColorInfo`（ColorType、AlphaType、ColorSpace）。
- `getColorType()`：返回 `ColorType`。
- `getAlphaType()`：返回 `ColorAlphaType`。
- `getColorSpace()`：返回 `ColorSpace`。
- `getBytesPerPixel()`：每个像素所需的字节数。
- `isEmpty()`：如果宽度或高度为零，则返回 `true`。
- `isOpaque()`：如果所有像素都保证不透明，则返回 `true`。