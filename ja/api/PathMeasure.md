# API リファレンス: PathMeasure

`PathMeasure` は、パスの長さを計算し、パス上の任意の距離における位置と接線を求めるために使用されます。

## 概要

`PathMeasure` オブジェクトは [`Path`](Path.md) で初期化されます。これはパスの輪郭を反復処理します。パスに複数の輪郭がある場合は、`nextContour()` を使用して次の輪郭に移動できます。

## コンストラクタ

- `new PathMeasure()`: 空の `PathMeasure` を作成します。
- `new PathMeasure(path)`: 指定されたパスで初期化します。
- `new PathMeasure(path, forceClosed)`: `forceClosed` が true の場合、パスが閉じていなくても閉じているものとして扱います。
- `new PathMeasure(path, forceClosed, resScale)`: `resScale` は測定の精度を制御します（デフォルトは 1.0）。

## メソッド

### 状態管理

- `setPath(path, forceClosed)`: 新しいパスで測定器をリセットします。
- `nextContour()`: パス内の次の輪郭に移動します。存在する場合は `true` を返します。
- `isClosed()`: 現在の輪郭が閉じている場合、`true` を返します。

### 測定

- `getLength()`: 現在の輪郭の全長を返します。
- `getPosition(distance)`: パス上の指定された距離にある `Point` を返します。
- `getTangent(distance)`: 指定された距離における接線（`Point` ベクトルとして）を返します。
- `getRSXform(distance)`: 指定された距離における `RSXform` を返します。
- `getMatrix(distance, getPosition, getTangent)`: 指定された距離における位置および/または接線を表す `Matrix33` を返します。

### 抽出

- `getSegment(startD, endD, dst, startWithMoveTo)`: `startD` と `endD` の間のパスのセグメントを、提供された `PathBuilder` に返します。

## 例

```java
Path path = Path.makeCircle(100, 100, 50);
PathMeasure measure = new PathMeasure(path);

float length = measure.getLength();
Point pos = measure.getPosition(length / 2); // 中間点を取得
Point tan = measure.getTangent(length / 2);   // その点での方向を取得
```