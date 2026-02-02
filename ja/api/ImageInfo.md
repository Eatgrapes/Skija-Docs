# API リファレンス: ImageInfo

`ImageInfo` はピクセル寸法とエンコーディングを記述します。サーフェス、画像、ビットマップのメモリレイアウトを作成および記述するために使用されます。

## コンストラクタとファクトリメソッド

- `new ImageInfo(width, height, colorType, alphaType)`
- `new ImageInfo(width, height, colorType, alphaType, colorSpace)`
- `makeN32(width, height, alphaType)`: プラットフォームデフォルトの32ビットカラータイプ。
- `makeS32(width, height, alphaType)`: sRGB カラースペースを持つ N32。
- `makeN32Premul(width, height)`: 乗算済みアルファを持つ N32。
- `makeA8(width, height)`: 8ビットアルファのみ。

## メソッド

- `getWidth()` / `getHeight()`: ピクセル寸法。
- `getColorType()`: ピクセルフォーマット (例: `RGBA_8888`)。
- `getColorAlphaType()`: アルファエンコーディング (`PREMUL`, `UNPREMUL`, `OPAQUE`)。
- `getColorSpace()`: 色域と線形性。
- `getBounds()`: (0,0) から (width, height) までの `IRect` を返します。
- `getBytesPerPixel()`: 1ピクセルあたりのバイト数。
- `getMinRowBytes()`: 1行のピクセルに必要な最小バイト数。
- `isEmpty()`: 幅または高さが <= 0 の場合に `true` を返します。

## 関数型変更

`ImageInfo` は不変です。変更されたコピーを作成するには、以下のメソッドを使用します:

- `withWidthHeight(w, h)`
- `withColorType(type)`
- `withColorAlphaType(type)`
- `withColorSpace(cs)`