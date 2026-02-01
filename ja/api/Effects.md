# APIリファレンス: エフェクト（フィルター）

Skijaは、`Paint`を介して適用できる3種類のフィルターを提供します: **MaskFilter**、**ColorFilter**、**ImageFilter**。これらの違いを理解することが、望む視覚効果を得るための鍵です。

## 1. MaskFilter
**アルファチャンネルの変更。** 形状（ジオメトリ）が色付けされる前に、マスクに影響を与えます。アルファ値のみを認識します。

### ガウシアンブラー
最も一般的な用途は、ソフトなエッジや単純なグロー効果の作成です。

```java
// Sigmaはぼかし半径の約1/3です
MaskFilter blur = MaskFilter.makeBlur(FilterBlurMode.NORMAL, 5.0f);
paint.setMaskFilter(blur);
```

**モード:**
- `NORMAL`: 形状の内側と外側の両方をぼかします。
- `SOLID`: 元の形状を不透明のまま保ち、外側のみをぼかします。
- `OUTER`: 形状の外側のぼかされた部分のみを描画します。
- `INNER`: 形状の内側のぼかされた部分のみを描画します。

---

## 2. ColorFilter
**色空間の変更。** 各ピクセルの色を独立して変換します。

### カラーマトリックス
グレースケール、セピア、色のシフトなどに便利です。

```java
ColorFilter grayscale = ColorFilter.makeMatrix(ColorMatrix.grayscale());
paint.setColorFilter(grayscale);
```

### ブレンドモードカラーフィルター
特定の色ですべてを着色します。

```java
ColorFilter tint = ColorFilter.makeBlend(0xFF4285F4, BlendMode.SRC_ATOP);
```

---

## 3. ImageFilter (ピクセルエフェクト)

`ImageFilter`は、描画（またはその背景）のピクセルに対して操作を行います。ぼかし、影、照明効果によく使用されます。

### 基本フィルター
- `makeBlur(sigmaX, sigmaY, tileMode)`: ガウシアンブラー。
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: コンテンツ + 影を描画します。
- `makeDropShadowOnly(...)`: 影のみを描画します（コンテンツなし）。
- `makeDilate(rx, ry)`: 明るい領域を拡大します（モルフォロジー）。
- `makeErode(rx, ry)`: 暗い領域を拡大します（モルフォロジー）。
- `makeOffset(dx, dy)`: コンテンツをシフトします。
- `makeTile(src, dst)`: コンテンツをタイル状に繰り返します。

### 合成
- `makeCompose(outer, inner)`: `inner`フィルターを適用した後、`outer`フィルターを適用します。
- `makeMerge(filters)`: 複数のフィルターの結果を結合します（例：複数の影を描画）。
- `makeBlend(mode, bg, fg)`: `BlendMode`を使用して2つのフィルターをブレンドします。
- `makeArithmetic(k1, k2, k3, k4, bg, fg)`: カスタムピクセル合成: `k1*fg*bg + k2*fg + k3*bg + k4`。

### カラー & シェーダー
- `makeColorFilter(cf, input)`: `ColorFilter`を画像フィルターの結果に適用します。
- `makeShader(shader)`: フィルター領域を`Shader`（例：グラデーションやノイズ）で塗りつぶします。
- `makeRuntimeShader(builder, ...)`: カスタムSkSLシェーダーを画像フィルターとして使用します。

### 照明（マテリアルデザイン）
アルファチャンネル（アルファ = 高さ）で定義された表面からの光の反射をシミュレートします。
- `makeDistantLitDiffuse(...)`
- `makePointLitDiffuse(...)`
- `makeSpotLitDiffuse(...)`
- `makeDistantLitSpecular(...)`
- `makePointLitSpecular(...)`
- `makeSpotLitSpecular(...)`

### 例: すりガラス効果（背景ぼかし）
レイヤーの*背後*にあるものをぼかすには、バックドロップフィルター付きの`Canvas.saveLayer`を使用します。

```java
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
// 'paint'引数はnull（レイヤー自体のアルファ/ブレンディングなし）
// 'backdrop'引数がぼかしフィルターです
canvas.saveLayer(new SaveLayerRec(null, null, blur));
    canvas.drawRect(rect, new Paint().setColor(0x40FFFFFF)); // 半透明の白
canvas.restore();
```

## 比較まとめ

| フィルタータイプ | 影響範囲 | 一般的な用途 |
| :--- | :--- | :--- |
| **MaskFilter** | アルファのみ | 単純なぼかし、グロー |
| **ColorFilter** | ピクセルの色 | グレースケール、着色、コントラスト |
| **ImageFilter** | ピクセル全体 | ドロップシャドウ、複雑なぼかし、合成 |

## 4. Blender (高度なブレンディング)

`BlendMode`は標準的なPorter-Duffブレンディング（`SRC_OVER`、`MULTIPLY`など）を提供しますが、`Blender`クラスはプログラム可能なカスタムブレンディングを可能にします。

`paint.setBlender(blender)`を使用してペイントにブレンダーを割り当てます。

### 算術ブレンダー
ソースピクセルとデスティネーションピクセルの線形結合を定義できます:
`result = k1 * src * dst + k2 * src + k3 * dst + k4`

```java
// 例: リニアドッジ（加算）を近似できます
Blender b = Blender.makeArithmetic(0, 1, 1, 0, false);
paint.setBlender(b);
```

### ランタイムブレンダー (SkSL)
SkSLで独自のブレンド関数を書くことができます！シェーダーは`src`と`dst`の色を受け取り、結果を返す必要があります。

```java
String sksl = "vec4 main(vec4 src, vec4 dst) {" +
              "  return src * dst;" + // 単純な乗算
              "}";
RuntimeEffect effect = RuntimeEffect.makeForBlender(sksl);
Blender myBlender = effect.makeBlender(null);
paint.setBlender(myBlender);
```

## 5. PathEffect (ストローク修飾子)

`PathEffect`は、パスが描画（ストロークまたは塗りつぶし）される*前に*、そのジオメトリを変更します。破線、角の丸め、有機的なラフネスによく使用されます。

### 作成メソッド

**1. Discrete (ラフネス)**
パスをセグメントに分割し、ランダムに変位させます。
- `makeDiscrete(segLength, dev, seed)`:
    - `segLength`: セグメントの長さ。
    - `dev`: 最大偏差（ジッター）。
    - `seed`: 乱数シード。

```java
PathEffect rough = PathEffect.makeDiscrete(10f, 4f, 0);
paint.setPathEffect(rough);
```

**2. Corner (角丸め)**
鋭い角を丸めます。
- `makeCorner(radius)`: 角丸の半径。

```java
PathEffect round = PathEffect.makeCorner(20f);
```

**3. Dash (破線)**
破線や点線を作成します。
- `makeDash(intervals, phase)`:
    - `intervals`: オン/オフの長さの配列（長さは偶数である必要があります）。
    - `phase`: 間隔へのオフセット。

```java
// 10px ON, 5px OFF
PathEffect dash = PathEffect.makeDash(new float[] { 10f, 5f }, 0f);
```

**4. Path1D (スタンプパス)**
パスに沿って形状をスタンプします（ブラシのように）。
- `makePath1D(path, advance, phase, style)`

```java
Path shape = new Path().addCircle(0, 0, 3);
PathEffect dots = PathEffect.makePath1D(shape, 10f, 0f, PathEffect1DStyle.TRANSLATE);
```

**5. Path2D (マトリックス)**
マトリックスによってパスジオメトリを変換します。
- `makePath2D(matrix, path)`

**6. Line2D**
- `makeLine2D(width, matrix)`

### 合成

複数のパスエフェクトを組み合わせることができます。

- `makeSum(second)`: *両方*のエフェクトを描画します（例：塗りつぶし + ストローク）。
- `makeCompose(inner)`: 最初に`inner`を適用し、次に`this`を適用します（例：ラフなアウトライン -> 破線）。

```java
PathEffect dashed = PathEffect.makeDash(new float[] {10, 5}, 0);
PathEffect corner = PathEffect.makeCorner(10);

// 角を丸めてから、線を破線にします
PathEffect composed = dashed.makeCompose(corner);
```