# APIリファレンス: ImageFilter

`ImageFilter`オブジェクトは、描画時にぼかし、影、色変換などの画像レベルの効果を適用するために使用されます。これらは`setImageFilter()`を介して[`Paint`](Paint.md)に適用されます。

## 静的ファクトリーメソッド

### 一般的な効果

- `makeBlur(sigmaX, sigmaY, tileMode)`: ガウスぼかしを作成します。
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: ドロップシャドウを作成します。
- `makeDropShadowOnly(dx, dy, sigmaX, sigmaY, color)`: 影のみを描画します。
- `makeColorFilter(colorFilter, input)`: 画像に[`ColorFilter`](Effects.md#color-filters)を適用します。

### 結合と合成

- `makeCompose(outer, inner)`: 2つのフィルターを連結します。
- `makeMerge(filters[])`: 複数のフィルターをSrcOverブレンディングで統合します。
- `makeArithmetic(k1, k2, k3, k4, enforcePM, bg, fg)`: 算術式を使用して2つの入力を結合します。
- `makeBlend(blendMode, bg, fg)`: [`BlendMode`](#)を使用して2つの入力をブレンドします。

### 幾何学的変換とサンプリング

- `makeOffset(dx, dy, input)`: 入力をオフセット分だけシフトします。
- `makeMatrixTransform(matrix, sampling, input)`: 行列変換を適用します。
- `makeCrop(rect, tileMode, input)`: 入力フィルターをクロップします。
- `makeTile(src, dst, input)`: ソース領域をデスティネーションにタイル状に配置します。

### 高度なフィルター

- `makeRuntimeShader(builder, childName, input)`: カスタム[SkSL](runtime-effect.md)シェーダーをフィルターとして適用します。
- `makeDisplacementMap(xChan, yChan, scale, displacement, color)`: 別の画像に基づいてピクセルを変位させます。
- `makeMatrixConvolution(...)`: NxMの畳み込みカーネルを適用します。
- `makeLighting(...)`: 様々な照明フィルター（遠方光源、点光源、スポットライト）。

## 使用例

```java
Paint paint = new Paint()
    .setImageFilter(ImageFilter.makeBlur(5f, 5f, FilterTileMode.CLAMP));

canvas.drawRect(Rect.makeWH(100, 100), paint);
```