# Skija のシャドウ

Skija では、**2D ドロップシャドウ**（ImageFilter 経由）と **3D エレベーションシャドウ**（ShadowUtils 経由）という 2 つの異なる方法でシャドウを描画できます。

## 1. 2D ドロップシャドウ (ImageFilter)

これは特定の描画操作にシャドウを追加する標準的な方法です。シャドウは描画される図形や画像の形状に沿って表示されます。

```java
ImageFilter shadow = ImageFilter.makeDropShadow(
    2.0f, 2.0f,   // オフセット (dx, dy)
    3.0f, 3.0f,   // ぼかし量 (sigmaX, sigmaY)
    0x80000000    // シャドウ色 (50% 透明の黒)
);

Paint paint = new Paint().setImageFilter(shadow);
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
```

### シャドウのみを描画
元のオブジェクトなしでシャドウのみを描画したい場合（例：複雑なレイヤリング）、`makeDropShadowOnly` を使用します。

---

## 2. 3D エレベーションシャドウ (ShadowUtils)

`ShadowUtils` は、Material Design のエレベーションに似た、より物理ベースのシャドウモデルを提供します。特定の 3D 位置にある光源が、「オクルーダー」（Path）からキャンバス平面に影を落とす方法を計算します。

### 基本的な使い方

```java
Path path = new Path().addRect(Rect.makeXYWH(50, 50, 100, 100));

// Z平面: オブジェクトの高さ。
// 通常、平面UI要素では一定: (0, 0, elevation)
Point3 elevation = new Point3(0, 0, 10.0f); 

// 光源位置: キャンバスに対する 3D 座標
Point3 lightPos = new Point3(250, 0, 600); 

float lightRadius = 800.0f;
int ambientColor = 0x10000000;
int spotColor = 0x30000000;

ShadowUtils.drawShadow(
    canvas, 
    path, 
    elevation, 
    lightPos, 
    lightRadius, 
    ambientColor, 
    spotColor, 
    ShadowUtilsFlag.TRANSPARENT_OCCLUDER
);

// 注意: drawShadow はシャドウのみを描画します。
// オブジェクト自体は別途描画する必要があります:
canvas.drawPath(path, new Paint().setColor(0xFFFFFFFF));
```

### アンビエントシャドウ vs スポットシャドウ
- **アンビエントシャドウ**: 間接光による柔らかく非指向性のシャドウ。
- **スポットシャドウ**: 特定の光源位置による指向性のあるシャドウ。
両方を組み合わせることで、リアルな奥行き効果が生まれます。

### シャドウフラグ
- `TRANSPARENT_OCCLUDER`: オブジェクトが半透明の場合に使用します。これにより、シャドウがオブジェクトの下で切り取られなくなります。
- `GEOMETRIC_ONLY`: 高品質なぼかしが必要ない場合の最適化です。
- `DIRECTIONAL_LIGHT`: 光を無限遠にあるもの（太陽光のように）として扱います。

## 比較

| 特徴 | ドロップシャドウ (ImageFilter) | エレベーションシャドウ (ShadowUtils) |
| :--- | :--- | :--- |
| **モデル** | 2D ガウスぼかし | 3D 透視投影 |
| **パフォーマンス** | 高速 (Skia によってキャッシュされる) | より複雑だが、高度に最適化されている |
| **使用方法** | `Paint` に設定 | `ShadowUtils` への直接呼び出し |
| **最適な用途** | テキスト、シンプルな UI グロー、アイコン | Material Design のボタン、カード、奥行き効果 |

## 視覚的な例

これらのシャドウの動作を確認するには、**Scenes** サンプルアプリを実行し、**ShadowUtils** シーンを選択してください。

**ソースコード:** [`examples/scenes/src/ShadowUtilsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadowUtilsScene.java)

*図: 様々な ShadowUtils フラグと光源位置の比較。*