# API リファレンス: IHasImageInfo

`IHasImageInfo` は、`Surface`、`Image`、`Bitmap`、`Pixmap` など、関連する [`ImageInfo`](ImageInfo.md) を持つクラスによって実装されるインターフェースです。

## メソッド

- `getImageInfo()`: 完全な [`ImageInfo`](ImageInfo.md) オブジェクトを返します。
- `getWidth()`: `getImageInfo().getWidth()` の便利なショートカットです。
- `getHeight()`: `getImageInfo().getHeight()` の便利なショートカットです。
- `getColorInfo()`: `ColorInfo` (ColorType, AlphaType, ColorSpace) を返します。
- `getColorType()`: `ColorType` を返します。
- `getAlphaType()`: `ColorAlphaType` を返します。
- `getColorSpace()`: `ColorSpace` を返します。
- `getBytesPerPixel()`: 1ピクセルあたりに必要なバイト数を返します。
- `isEmpty()`: 幅または高さがゼロの場合に `true` を返します。
- `isOpaque()`: すべてのピクセルが不透明であることが保証されている場合に `true` を返します。