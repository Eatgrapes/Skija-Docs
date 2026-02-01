# API 参考：Region

`Region` 类表示画布上的一个复杂区域，类似于 `Path`，但由**整数**坐标定义。Region 针对布尔运算（如交集、并集、差集）以及测试点或矩形是否在区域内进行了高度优化。

## 概述

与使用浮点坐标并可包含曲线的 `Path` 不同，`Region` 本质上是一组水平扫描线。它对于命中测试和裁剪非常高效。

## 创建和修改 Region

```java
// 创建一个空区域
Region region = new Region();

// 将其设置为一个矩形
region.setRect(new IRect(0, 0, 100, 100));

// 从 Path 设置
// （需要一个 'clip' 区域来定义最大边界）
Path path = new Path().addCircle(50, 50, 40);
Region clip = new Region();
clip.setRect(new IRect(0, 0, 200, 200));
region.setPath(path, clip);
```

## 布尔运算

`Region` 的强大之处在于它能够使用逻辑运算符组合多个区域。

```java
Region regionA = new Region();
regionA.setRect(new IRect(0, 0, 100, 100));

Region regionB = new Region();
regionB.setRect(new IRect(50, 50, 150, 150));

// 交集：结果是重叠区域 (50, 50, 100, 100)
regionA.op(regionB, RegionOp.INTERSECT);

// 并集：结果是两个区域的合并区域
regionA.op(regionB, RegionOp.UNION);

// 差集：从 A 中移除 B
regionA.op(regionB, RegionOp.DIFFERENCE);
```

可用运算（`RegionOp`）：
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A
- `REPLACE`: B

## 命中测试

您可以检查一个点或矩形是否在区域内。

```java
if (region.contains(10, 10)) {
    // 点在区域内
}

if (region.quickReject(new IRect(200, 200, 300, 300))) {
    // 矩形肯定在区域外
}
```

## 与 Canvas 一起使用

您可以使用 `Region` 来裁剪 `Canvas`。

```java
canvas.clipRegion(region);
```

**注意：** `Region` 操作（如 `setPath`）严格基于整数。曲线将通过小步长进行近似。对于高精度渲染，建议使用 `Path`。`Region` 最适合用于复杂的 UI 命中测试或像素对齐的裁剪遮罩。