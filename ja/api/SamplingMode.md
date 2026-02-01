# API リファレンス: SamplingMode

`SamplingMode` は、画像が拡大縮小、回転、または変形される際にピクセルをどのようにサンプリングするかを定義するインターフェースです。

## 実装

Skija では、サンプリングを指定する主な方法が3つあります:

1.  **[`FilterMipmap`](#filtermipmap)**: オプションのミップマップを伴う標準的な線形/最近傍フィルタリング。
2.  **[`CubicResampler`](CubicResampler.md)**: 高品質なバイキュービック補間 (Mitchell, Catmull-Rom)。
3.  **`SamplingModeAnisotropic`**: 鋭い角度で見られるテクスチャ用の高品質フィルタリング。

## 一般的なプリセット

- `SamplingMode.DEFAULT`: 最近傍フィルタリング (最速、ブロック状)。
- `SamplingMode.LINEAR`: バイリニアフィルタリング (滑らか、ほとんどの用途でデフォルト)。
- `SamplingMode.MITCHELL`: 高品質バイキュービック (滑らかでシャープ)。
- `SamplingMode.CATMULL_ROM`: 非常にシャープなバイキュービック。

## FilterMipmap

これは最も一般的なサンプリングモードです。2つのパラメータを使用します:

### FilterMode
- `NEAREST`: 最も近い単一のピクセルをサンプリング。
- `LINEAR`: 最も近い4つのピクセル間で補間。

### MipmapMode
- `NONE`: ミップマップを使用しない。
- `NEAREST`: 最も近いミップマップレベルからサンプリング。
- `LINEAR`: 2つのミップマップレベル間で補間 (トライリニアフィルタリング)。

## 使用例

```java
// バイリニアサンプリング
canvas.drawImage(img, 0, 0, SamplingMode.LINEAR, null);

// 最近傍 (ピクセルアートスタイル)
canvas.drawImage(img, 0, 0, SamplingMode.DEFAULT, null);

// 高品質バイキュービック
canvas.drawImage(img, 0, 0, CubicResampler.MITCHELL, null);
```