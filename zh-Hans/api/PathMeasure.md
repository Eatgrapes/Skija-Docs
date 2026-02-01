# API 参考：PathMeasure

`PathMeasure` 用于计算路径长度，并获取路径上任意距离处的位置和切线方向。

## 概述

`PathMeasure` 对象通过 [`Path`](Path.md) 初始化。它会遍历路径的各个轮廓。如果路径包含多个轮廓，可以使用 `nextContour()` 切换到下一个轮廓。

## 构造函数

- `new PathMeasure()`：创建一个空的 `PathMeasure`。
- `new PathMeasure(path)`：使用指定路径初始化。
- `new PathMeasure(path, forceClosed)`：如果 `forceClosed` 为 true，即使路径未闭合也会按闭合路径处理。
- `new PathMeasure(path, forceClosed, resScale)`：`resScale` 控制测量精度（默认为 1.0）。

## 方法

### 状态管理

- `setPath(path, forceClosed)`：用新路径重置测量器。
- `nextContour()`：移动到路径中的下一个轮廓。如果存在则返回 `true`。
- `isClosed()`：如果当前轮廓是闭合的则返回 `true`。

### 测量功能

- `getLength()`：返回当前轮廓的总长度。
- `getPosition(distance)`：返回路径上指定距离处的 `Point`。
- `getTangent(distance)`：返回指定距离处的切线方向（作为 `Point` 向量）。
- `getRSXform(distance)`：返回指定距离处的 `RSXform`。
- `getMatrix(distance, getPosition, getTangent)`：返回表示该距离处位置和/或切线方向的 `Matrix33`。

### 路径提取

- `getSegment(startD, endD, dst, startWithMoveTo)`：将路径在 `startD` 和 `endD` 之间的线段提取到提供的 `PathBuilder` 中。

## 示例

```java
Path path = Path.makeCircle(100, 100, 50);
PathMeasure measure = new PathMeasure(path);

float length = measure.getLength();
Point pos = measure.getPosition(length / 2); // 获取半程点位置
Point tan = measure.getTangent(length / 2);   // 获取该点的切线方向
```