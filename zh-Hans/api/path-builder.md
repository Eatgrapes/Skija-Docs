# API 参考：PathBuilder

`PathBuilder` 是 Skija 中构建 `Path` 对象的现代推荐方式。它提供了流畅的 API，专为路径构建而设计，将构建过程与不可变的 `Path` 结果分离。

## 基本命令

移动和直线：
- `moveTo(x, y)`：开始一个新轮廓。
- `lineTo(x, y)`：添加一条线段。
- `polylineTo(points)`：添加多条线段。
- `closePath()`：闭合当前轮廓。

相对命令（相对于当前点的偏移）：
- `rMoveTo(dx, dy)`
- `rLineTo(dx, dy)`

## 曲线

二次贝塞尔曲线（1 个控制点）：
- `quadTo(x1, y1, x2, y2)`：绝对坐标。
- `rQuadTo(dx1, dy1, dx2, dy2)`：相对坐标。

三次贝塞尔曲线（2 个控制点）：
- `cubicTo(x1, y1, x2, y2, x3, y3)`：绝对坐标。
- `rCubicTo(dx1, dy1, dx2, dy2, dx3, dy3)`：相对坐标。

圆锥曲线（带权重的二次曲线）：
- `conicTo(x1, y1, x2, y2, w)`：适用于精确的圆/椭圆。
- `rConicTo(...)`：相对版本。

## 圆弧

- `arcTo(oval, startAngle, sweepAngle, forceMoveTo)`：添加限制在给定椭圆内的圆弧。
- `tangentArcTo(p1, p2, radius)`：添加与直线（当前点 -> p1）和（p1 -> p2）相切的圆弧。
- `ellipticalArcTo(...)`：添加 SVG 风格的圆弧。

## 添加形状

`PathBuilder` 允许将整个形状作为新轮廓添加。

- `addRect(rect, direction, startIndex)`
- `addOval(rect, direction, startIndex)`
- `addCircle(x, y, radius, direction)`
- `addRRect(rrect, direction, startIndex)`：圆角矩形。
- `addPolygon(points, close)`：将一系列点添加为轮廓。
- `addPath(path, mode)`：将另一个路径的轮廓追加到此路径。

## 变换（构建器状态）

这些方法影响构建器中*当前*的点。

- `offset(dx, dy)`：平移构建器中的所有现有点。
- `transform(matrix)`：将矩阵应用于所有现有点。

## 构建器管理

- `reset()`：将构建器清空（保留内存）。
- `incReserve(points, verbs)`：预分配内存以避免构建过程中调整大小。
- `setFillMode(mode)`：设置填充规则（`WINDING`、`EVEN_ODD` 等）。
- `setVolatile(boolean)`：提示结果路径不应被缓存（适用于一次性动画路径）。

## 输出方法

- **`snapshot()`**：返回一个 `Path` 并保持构建器状态不变。
- **`detach()`**：返回一个 `Path` 并重置构建器（最有效）。
- **`build()`**：返回一个 `Path` 并关闭构建器（之后无法使用）。

## 示例：基本构建

```java
Path path = new PathBuilder()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath()
    .snapshot(); // 返回 Path
```

## 示例：变换

```java
PathBuilder builder = new PathBuilder();

builder.addRect(Rect.makeXYWH(0, 0, 100, 100))
       .offset(10, 10)
       .transform(Matrix33.makeRotate(45));

Path p = builder.detach(); // 返回路径并重置构建器
```

## 可视化示例

查看 [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) 以了解各种路径组合和填充规则。