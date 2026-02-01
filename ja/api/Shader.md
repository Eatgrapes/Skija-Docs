# APIリファレンス: シェーダー

シェーダーは、キャンバス上の位置に基づいて各ピクセルの色を定義します。主にグラデーション、パターン、ノイズに使用されます。シェーダーは `paint.setShader(shader)` を介して `Paint` オブジェクトに割り当てられます。

## グラデーション

グラデーションは最も一般的なシェーダーのタイプです。Skijaはいくつかのタイプをサポートしています：

### 線形グラデーション
2点間の滑らかな遷移を作成します。

**視覚的な例:**
線形、放射状、スイープ、円錐グラデーション、およびノイズシェーダーの例については、[`examples/scenes/src/ShadersScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadersScene.java) を参照してください。

```java
Shader linear = Shader.makeLinearGradient(
    0, 0, 100, 100,      // x0, y0, x1, y1
    new int[] { 0xFFFF0000, 0xFF0000FF } // 色 (赤から青)
);
```

### 放射状グラデーション
中心点からの円形の遷移を作成します。

```java
Shader radial = Shader.makeRadialGradient(
    50, 50, 30,          // 中心 x, y, 半径
    new int[] { 0xFFFFFFFF, 0xFF000000 } // 色 (白から黒)
);
```

### スイープグラデーション
中心点を中心に遷移が掃引されるグラデーションを作成します（カラーホイールのように）。

```java
Shader sweep = Shader.makeSweepGradient(
    50, 50,              // 中心 x, y
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFFFF0000 }
);
```

### 2点円錐グラデーション
2つの円の間の遷移を作成します（3Dのような照明やフレアに便利です）。

```java
Shader conical = Shader.makeTwoPointConicalGradient(
    30, 30, 10,          // 開始 x, y, 半径
    70, 70, 40,          // 終了 x, y, 半径
    new int[] { 0xFFFF0000, 0xFF0000FF }
);
```

## ノイズとパターン

### パーリンノイズ
雲、大理石、炎のように見えるテクスチャを生成します。

```java
// フラクタルノイズ
Shader noise = Shader.makeFractalNoise(
    0.05f, 0.05f,        // baseFrequencyX, baseFrequencyY
    4,                   // numOctaves
    0.0f                 // seed
);

// 乱流
Shader turb = Shader.makeTurbulence(0.05f, 0.05f, 4, 0.0f);
```

### イメージシェーダー
`Image` をシェーダーに変換し、タイル状に配置したり、形状を塗りつぶすために使用できます。

```java
// Imageクラスを介してアクセス
Shader imageShader = image.makeShader(
    FilterTileMode.REPEAT, 
    FilterTileMode.REPEAT, 
    SamplingMode.DEFAULT
);
```

## 合成と変更

- `Shader.makeBlend(mode, dst, src)`: ブレンドモードを使用して2つのシェーダーを合成します。
- `shader.makeWithLocalMatrix(matrix)`: シェーダーの座標系に変換を適用します。
- `shader.makeWithColorFilter(filter)`: シェーダーの出力にカラーフィルターを適用します。

## タイルモード (`FilterTileMode`)

シェーダー（グラデーションや画像など）が定義された境界よりも大きな領域を塗りつぶす必要がある場合：
- `CLAMP`: 残りの部分を塗りつぶすために端の色を使用します。
- `REPEAT`: パターンを繰り返します。
- `MIRROR`: パターンを繰り返し、端でミラーリングします。
- `DECAL`: 境界の外側を透明にレンダリングします。