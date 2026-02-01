# API リファレンス: PathBuilder

`PathBuilder` は、Skija で `Path` オブジェクトを構築するためのモダンで推奨される方法です。フルーエントな API を提供し、パスの構築プロセスを不変の `Path` 結果から分離するために特別に設計されています。

## 基本コマンド

移動と直線:
- `moveTo(x, y)`: 新しい輪郭を開始します。
- `lineTo(x, y)`: 直線セグメントを追加します。
- `polylineTo(points)`: 複数の直線セグメントを追加します。
- `closePath()`: 現在の輪郭を閉じます。

相対コマンド (現在の点からのオフセット):
- `rMoveTo(dx, dy)`
- `rLineTo(dx, dy)`

## 曲線

二次ベジェ曲線 (制御点1つ):
- `quadTo(x1, y1, x2, y2)`: 絶対座標。
- `rQuadTo(dx1, dy1, dx2, dy2)`: 相対座標。

三次ベジェ曲線 (制御点2つ):
- `cubicTo(x1, y1, x2, y2, x3, y3)`: 絶対座標。
- `rCubicTo(dx1, dy1, dx2, dy2, dx3, dy3)`: 相対座標。

コニック (重み付き二次曲線):
- `conicTo(x1, y1, x2, y2, w)`: 正確な円/楕円に便利です。
- `rConicTo(...)`: 相対バージョン。

## 円弧

- `arcTo(oval, startAngle, sweepAngle, forceMoveTo)`: 指定された楕円に制限された円弧を追加します。
- `tangentArcTo(p1, p2, radius)`: 直線 (現在点 -> p1) と (p1 -> p2) に接する円弧を追加します。
- `ellipticalArcTo(...)`: SVG スタイルの円弧を追加します。

## 形状の追加

`PathBuilder` は、新しい輪郭として完全な形状を追加できます。

- `addRect(rect, direction, startIndex)`
- `addOval(rect, direction, startIndex)`
- `addCircle(x, y, radius, direction)`
- `addRRect(rrect, direction, startIndex)`: 角丸長方形。
- `addPolygon(points, close)`: 点のシーケンスを輪郭として追加します。
- `addPath(path, mode)`: 別のパスの輪郭をこのパスに追加します。

## 変換 (ビルダー状態)

これらのメソッドは、ビルダー内の*現在の*点に影響を与えます。

- `offset(dx, dy)`: ビルダー内のすべての既存の点を平行移動します。
- `transform(matrix)`: すべての既存の点に行列を適用します。

## ビルダー管理

- `reset()`: ビルダーを空の状態にクリアします (メモリは保持)。
- `incReserve(points, verbs)`: 構築中のサイズ変更を避けるためにメモリを事前に割り当てます。
- `setFillMode(mode)`: 塗りつぶしルール (`WINDING`, `EVEN_ODD` など) を設定します。
- `setVolatile(boolean)`: 結果のパスをキャッシュすべきでないことを示唆します (一度限りのアニメーションパスに便利)。

## 出力メソッド

- **`snapshot()`**: `Path` を返し、ビルダーの状態をそのまま保持します。
- **`detach()`**: `Path` を返し、ビルダーをリセットします (最も効率的)。
- **`build()`**: `Path` を返し、ビルダーを閉じます (その後は使用できません)。

## 例: 基本的な構築

```java
Path path = new PathBuilder()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath()
    .snapshot(); // Path を返す
```

## 例: 変換

```java
PathBuilder builder = new PathBuilder();

builder.addRect(Rect.makeXYWH(0, 0, 100, 100))
       .offset(10, 10)
       .transform(Matrix33.makeRotate(45));

Path p = builder.detach(); // パスを返し、ビルダーをリセット
```

## ビジュアル例

様々なパスの組み合わせと塗りつぶしルールについては、[`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) を参照してください。