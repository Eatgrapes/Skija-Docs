# API Reference: IHasImageInfo

`IHasImageInfo` is an interface implemented by classes that have an associated [`ImageInfo`](ImageInfo.md), such as `Surface`, `Image`, `Bitmap`, and `Pixmap`.

## Methods

- `getImageInfo()`: Returns the full [`ImageInfo`](ImageInfo.md) object.
- `getWidth()`: Convenience for `getImageInfo().getWidth()`.
- `getHeight()`: Convenience for `getImageInfo().getHeight()`.
- `getColorInfo()`: Returns the `ColorInfo` (ColorType, AlphaType, ColorSpace).
- `getColorType()`: Returns the `ColorType`.
- `getAlphaType()`: Returns the `ColorAlphaType`.
- `getColorSpace()`: Returns the `ColorSpace`.
- `getBytesPerPixel()`: Number of bytes required per pixel.
- `isEmpty()`: Returns `true` if width or height is zero.
- `isOpaque()`: Returns `true` if all pixels are guaranteed to be opaque. 