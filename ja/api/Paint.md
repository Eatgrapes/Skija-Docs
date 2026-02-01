# API リファレンス: Paint

`Paint` クラスは、`Canvas` 上で描画する際に使用されるスタイル、色、エフェクトを定義します。これは軽量なオブジェクトであり、複数の描画呼び出しで再利用できます。

## コアプロパティ

### 色と透明度

- `setColor(int color)`: ARGB カラーを設定します。
- `setAlpha(int alpha)`: アルファ（透明度）成分のみを設定します (0-255)。
- `setColor4f(Color4f color, ColorSpace space)`: より高精度な浮動小数点値を使用して色を設定します。

### スタイル

- `setMode(PaintMode mode)`: ペイントが図形の内部を塗りつぶす (`FILL`)、輪郭を描画する (`STROKE`)、またはその両方を行う (`STROKE_AND_FILL`) かを決定します。
- `setStrokeWidth(float width)`: ストロークの太さを設定します。
- `setStrokeCap(PaintStrokeCap cap)`: ストロークされた線の端の形状を定義します (BUTT, ROUND, SQUARE)。
- `setStrokeJoin(PaintStrokeJoin join)`: ストロークされたセグメントの結合方法を定義します (MITER, ROUND, BEVEL)。

### アンチエイリアス

- `setAntiAlias(boolean enabled)`: エッジのスムージングを有効または無効にします。ほとんどの UI 描画で強く推奨されます。

## エフェクトとシェーダー

`Paint` オブジェクトは、複雑な視覚効果を作成するために様々なエフェクトで強化できます。

### シェーダー (グラデーションとパターン)

シェーダーは、各ピクセルの位置に基づいてその色を定義します。
- `setShader(Shader shader)`: 線形グラデーション、放射状グラデーション、または画像パターンを適用します。

### カラーフィルター

カラーフィルターは、描画される前にソースの色を変更します。
- `setColorFilter(ColorFilter filter)`: カラーマトリックス、ブレンドモード、またはルマ変換を適用します。

### マスクフィルター (ぼかし)

マスクフィルターは、描画のアルファチャンネルに影響を与えます。
- `setMaskFilter(MaskFilter filter)`: 主にぼかしや影の作成に使用されます。

### イメージフィルター

イメージフィルターはより複雑で、描画結果全体に影響を与えることができます。
- `setImageFilter(ImageFilter filter)`: ぼかし、ドロップシャドウ、および複数のエフェクトの組み合わせに使用されます。

## 使用例

```java
Paint paint = new Paint()
    .setColor(0xFF4285F4)
    .setAntiAlias(true)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(4f)
    .setStrokeJoin(PaintStrokeJoin.ROUND);

canvas.drawRect(Rect.makeXYWH(10, 10, 100, 100), paint);
```

## パフォーマンスに関する注意

`Paint` オブジェクトの作成は比較的高速ですが、頻繁に変更するループ内では多少のオーバーヘッドが発生する可能性があります。一般的には、プロパティが変更されない場合、`Paint` オブジェクトを一度準備し、レンダリング中に再利用することが推奨されます。