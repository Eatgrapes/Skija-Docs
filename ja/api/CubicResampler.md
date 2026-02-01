# API リファレンス: CubicResampler

`CubicResampler` は、バイキュービック補間を使用した高品質な画像スケーリングに使用される [`SamplingMode`](SamplingMode.md) の一種です。

## 概要

キュービックリサンプラーは、立方体フィルタの形状を制御する2つのパラメータ **B** と **C** によって定義されます。異なる値は、異なる特性（シャープネス、リンギングなど）をもたらします。

## 定数

`CubicResampler` は、一般的に使用される2つのプリセットを提供します:

- `CubicResampler.MITCHELL`: (B=1/3, C=1/3)。シャープさとアーティファクトのバランスが良い。
- `CubicResampler.CATMULL_ROM`: (B=0, C=1/2)。Mitchell よりもシャープで、ダウンスケーリングによく使用される。

## パラメータ

- **B (Blur)**: フィルタの「ぼやけ」を制御します。
- **C (Ringing)**: エッジ周辺の「リンギング」または「ハロー」を制御します。

## 使用法

```java
// 高品質スケーリングに Mitchell リサンプラーを使用
canvas.drawImageRect(image, dstRect, CubicResampler.MITCHELL, null);

// カスタムリサンプラー
CubicResampler custom = new CubicResampler(0.2f, 0.4f);
canvas.drawImageRect(image, dstRect, custom, paint);
```

## 参考文献

- "Reconstruction Filters in Computer Graphics" (Mitchell & Netravali, 1988).
- [Bicubic Filtering Overview](https://entropymine.com/imageworsener/bicubic/)