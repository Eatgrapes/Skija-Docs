# API 参考：Path

`Path` 类表示由直线段、二次曲线和三次曲线组成的复杂复合几何路径。

> **注意：** 对于构建新路径，强烈建议使用 [**PathBuilder**](path-builder.md)，而不是直接在 `Path` 上调用方法。`PathBuilder` 提供了更好的流式 API，并确保生成的 `Path` 是不可变的。

## 构建路径（静态工厂方法）

虽然对于复杂路径更推荐使用 `PathBuilder`，但 `Path` 为常见形状提供了高效的静态工厂方法。

- `makeRect(rect)`：从矩形创建路径。
- `makeOval(rect)`：从椭圆创建路径。
- `makeCircle(x, y, radius)`：从圆形创建路径。
- `makeRRect(rrect)`：从圆角矩形创建路径。
- `makeLine(p1, p2)`：从单个线段创建路径。
- `makePolygon(points, closed)`：从一系列点创建路径。
- `makeFromSVGString(svgString)`：解析 SVG 路径字符串（例如 `"M10 10 L50 50 Z"`）。

## 路径信息与度量

- `getBounds()`：返回保守的边界框（快速，已缓存）。
- `computeTightBounds()`：返回精确的边界框（较慢）。
- `isEmpty()`：如果路径不包含任何动词，则返回 true。
- `isConvex()`：如果路径定义了一个凸形，则返回 true。
- `isRect()`：如果路径表示一个简单的矩形，则返回 `Rect`，否则返回 null。
- `isOval()`：如果路径是一个椭圆，则返回其边界 `Rect`，否则返回 null。
- `isFinite()`：如果路径中的所有点都是有限的，则返回 true。

## 命中测试

- `contains(x, y)`：如果指定点在路径内部（基于当前的填充类型），则返回 true。
- `conservativelyContainsRect(rect)`：如果矩形肯定在路径内部（快速拒绝测试），则返回 true。

## 布尔运算

可以使用逻辑运算组合路径。这些操作会创建一个**新的** `Path` 对象。

```java
Path result = Path.makeCombining(pathA, pathB, PathOp.INTERSECT);
```

可用的 `PathOp` 操作：
- `DIFFERENCE`：A - B
- `INTERSECT`：A & B
- `UNION`：A | B
- `XOR`：(A | B) - (A & B)
- `REVERSE_DIFFERENCE`：B - A

## 变换与修改

这些方法返回一个应用了变换的**新的** `Path` 实例。

- `makeTransform(matrix)`：将 `Matrix33` 应用于路径中的所有点。
- `makeOffset(dx, dy)`：平移路径。
- `makeScale(s)`：缩放路径。

## 插值（变形）

可以在两个兼容的路径之间进行插值（适用于动画）。

```java
// 在 pathA 和 pathB 之间插值 50%
if (pathA.isInterpolatable(pathB)) {
    Path midPath = pathA.makeInterpolate(pathB, 0.5f);
}
```

## 序列化

- `serializeToBytes()`：将路径序列化为字节数组。
- `makeFromBytes(bytes)`：从字节重建路径。
- `dump()`：将路径结构打印到标准输出（用于调试）。

## 测量与迭代

- `PathMeasure`：用于计算路径长度并沿其长度查找位置/切线。
- `PathSegmentIterator`：允许迭代构成路径的各个动词和点。

## 示例

```java
Path path = new Path()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath();

canvas.drawPath(path, paint);
```

## 填充类型

填充类型决定了在填充操作中哪些区域被视为路径的“内部”。
- `WINDING`（默认）：使用环绕数规则。
- `EVEN_ODD`：使用奇偶规则。
- `INVERSE_WINDING`：反转环绕规则（填充外部）。
- `INVERSE_EVEN_ODD`：反转奇偶规则。

## 视觉示例

有关创建、修改和组合路径的示例，请参见 [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java)。
