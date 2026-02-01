# API リファレンス: Path

`Path` クラスは、直線セグメント、二次曲線、三次曲線で構成される複雑な複合幾何学的パスを表します。

> **注意:** 新しいパスを構築する際は、`Path` のメソッドを直接呼び出す代わりに、[**PathBuilder**](path-builder.md) を使用することを強くお勧めします。`PathBuilder` はより優れた流暢な API を提供し、結果の `Path` が不変であることを保証します。

## パスの構築 (静的ファクトリ)

複雑なパスには `PathBuilder` が推奨されますが、`Path` は一般的な形状に対して効率的な静的ファクトリを提供します。

- `makeRect(rect)`: 長方形からパスを作成します。
- `makeOval(rect)`: 楕円からパスを作成します。
- `makeCircle(x, y, radius)`: 円からパスを作成します。
- `makeRRect(rrect)`: 角丸長方形からパスを作成します。
- `makeLine(p1, p2)`: 単一の線分からパスを作成します。
- `makePolygon(points, closed)`: 点のシーケンスからパスを作成します。
- `makeFromSVGString(svgString)`: SVG パス文字列 (例: `"M10 10 L50 50 Z"`) を解析します。

## パス情報とメトリクス

- `getBounds()`: 保守的なバウンディングボックスを返します (高速、キャッシュ済み)。
- `computeTightBounds()`: 正確なバウンディングボックスを返します (低速)。
- `isEmpty()`: パスに動詞が含まれていない場合に true を返します。
- `isConvex()`: パスが凸形状を定義している場合に true を返します。
- `isRect()`: パスが単純な長方形を表す場合は `Rect` を、そうでない場合は null を返します。
- `isOval()`: パスが楕円の場合はバウンディング `Rect` を、そうでない場合は null を返します。
- `isFinite()`: パス内のすべての点が有限の場合に true を返します。

## ヒットテスト

- `contains(x, y)`: 指定された点がパス内にある場合に true を返します (現在の塗りつぶしタイプに基づく)。
- `conservativelyContainsRect(rect)`: 長方形が確実にパス内にある場合に true を返します (高速な拒否テスト)。

## ブール演算

パスは論理演算を使用して結合できます。これらは**新しい** `Path` オブジェクトを作成します。

```java
Path result = Path.makeCombining(pathA, pathB, PathOp.INTERSECT);
```

利用可能な `PathOp`:
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A

## 変換と変更

これらのメソッドは、変換が適用された**新しい** `Path` インスタンスを返します。

- `makeTransform(matrix)`: パス内のすべての点に `Matrix33` を適用します。
- `makeOffset(dx, dy)`: パスを平行移動します。
- `makeScale(s)`: パスを拡大縮小します。

## 補間 (モーフィング)

互換性のある2つのパス間で補間できます (アニメーションに有用)。

```java
// pathA と pathB の間を 50% 補間
if (pathA.isInterpolatable(pathB)) {
    Path midPath = pathA.makeInterpolate(pathB, 0.5f);
}
```

## シリアライゼーション

- `serializeToBytes()`: パスをバイト配列にシリアライズします。
- `makeFromBytes(bytes)`: バイトからパスを再構築します。
- `dump()`: パス構造を標準出力に出力します (デバッグ用)。

## 測定と反復処理

- `PathMeasure`: パスの長さを計算し、その長さに沿った位置/接線を見つけるために使用されます。
- `PathSegmentIterator`: パスを構成する個々の動詞と点を反復処理できます。

## 例

```java
Path path = new Path()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath();

canvas.drawPath(path, paint);
```

## 塗りつぶしタイプ

塗りつぶしタイプは、塗りつぶし操作でどの領域がパスの「内側」と見なされるかを決定します。
- `WINDING` (デフォルト): 巻き数ルールを使用します。
- `EVEN_ODD`: 偶数-奇数ルールを使用します。
- `INVERSE_WINDING`: 巻き数ルールを反転します (外側を塗りつぶします)。
- `INVERSE_EVEN_ODD`: 偶数-奇数ルールを反転します。

## 視覚的な例

パスの作成、変更、結合の例については、[`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) を参照してください。
