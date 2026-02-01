# API 參考：PathMeasure

`PathMeasure` 用於計算路徑的長度，並找出沿路徑任意距離處的位置和切線方向。

## 概述

`PathMeasure` 物件使用 [`Path`](Path.md) 初始化。它會遍歷路徑的輪廓。如果路徑有多個輪廓，可以使用 `nextContour()` 移動到下一個輪廓。

## 建構函式

- `new PathMeasure()`：建立一個空的 `PathMeasure`。
- `new PathMeasure(path)`：使用指定的路徑初始化。
- `new PathMeasure(path, forceClosed)`：如果 `forceClosed` 為 true，即使路徑未封閉，也會將其視為封閉路徑。
- `new PathMeasure(path, forceClosed, resScale)`：`resScale` 控制測量的精度（預設為 1.0）。

## 方法

### 狀態管理

- `setPath(path, forceClosed)`：使用新路徑重置測量器。
- `nextContour()`：移動到路徑中的下一個輪廓。如果存在則返回 `true`。
- `isClosed()`：如果當前輪廓是封閉的，則返回 `true`。

### 測量

- `getLength()`：返回當前輪廓的總長度。
- `getPosition(distance)`：返回沿路徑指定距離處的 `Point`。
- `getTangent(distance)`：返回指定距離處的切線（作為 `Point` 向量）。
- `getRSXform(distance)`：返回指定距離處的 `RSXform`。
- `getMatrix(distance, getPosition, getTangent)`：返回表示該距離處位置和/或切線的 `Matrix33`。

### 擷取

- `getSegment(startD, endD, dst, startWithMoveTo)`：將 `startD` 和 `endD` 之間的路徑區段擷取到提供的 `PathBuilder` 中。

## 範例

```java
Path path = Path.makeCircle(100, 100, 50);
PathMeasure measure = new PathMeasure(path);

float length = measure.getLength();
Point pos = measure.getPosition(length / 2); // 取得半途的點
Point tan = measure.getTangent(length / 2);   // 取得該點的方向
```