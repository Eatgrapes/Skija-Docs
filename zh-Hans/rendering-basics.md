# 渲染基础

本指南涵盖使用 Skija 进行渲染的基本概念，从创建绘图表面到执行基本绘图操作。

## 表面与画布

在 Skia（以及 Skija）中，所有绘图都在**画布**上进行。然而，画布需要一个绘制目标，这个目标由**表面**提供。

### 离屏渲染（光栅）

最简单的开始方式是创建一个光栅（内存中）表面。这非常适合生成图像、服务器端渲染或测试。

```java
// 使用默认的 N32 颜色格式（通常是 RGBA 或 BGRA）创建一个 100x100 像素的表面
Surface surface = Surface.makeRasterN32Premul(100, 100);

// 从表面获取画布
Canvas canvas = surface.getCanvas();
```

`Canvas` 对象是您进行绘图的主要接口。它维护当前状态（变换、裁剪）并提供绘图方法。

## 使用画笔

虽然 `Canvas` 定义了*在哪里*和*绘制什么*，但 `Paint` 对象定义了*如何*绘制。`Paint` 对象保存有关颜色、描边样式、混合模式和各种效果的信息。

```java
Paint paint = new Paint();
paint.setColor(0xFFFF0000); // 完全不透明的红色
```

### 处理颜色

Skija 中的颜色以 **ARGB** 格式的 32 位整数表示：
- `0x` 后跟 `FF`（Alpha）、`RR`（红）、`GG`（绿）、`BB`（蓝）。
- `0xFFFF0000` 是不透明的红色。
- `0xFF00FF00` 是不透明的绿色。
- `0xFF0000FF` 是不透明的蓝色。
- `0x80000000` 是半透明的黑色。

## 基本绘图操作

`Canvas` 提供了许多绘制基本图形的方法。

```java
// 在 (50, 50) 处绘制半径为 30 的圆
canvas.drawCircle(50, 50, 30, paint);

// 绘制一条简单的线
canvas.drawLine(10, 10, 90, 90, paint);

// 绘制一个矩形
canvas.drawRect(Rect.makeXYWH(10, 10, 80, 80), paint);
```

## 捕获和保存输出

在表面上绘图后，通常希望将结果保存为图像文件。

```java
// 1. 将当前表面内容快照为图像
Image image = surface.makeImageSnapshot();

// 2. 将图像编码为特定格式（例如 PNG）
Data pngData = image.encodeToData(EncodedImageFormat.PNG);

// 3. 将数据转换为 ByteBuffer 以便写入
ByteBuffer pngBytes = pngData.toByteBuffer();

// 4. 使用标准 Java I/O 写入文件
try {
    java.nio.file.Path path = java.nio.file.Path.of("output.png");
    Files.write(path, pngBytes.array());
} catch (IOException e) {
    e.printStackTrace();
}
```

### 读取像素（屏幕捕获）

如果您需要从表面获取原始像素数据（例如，用于处理或检查）而不将其编码为图像格式：

```java
// 创建一个位图来存储结果
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));

// 从表面读取像素到位图中
// 如果尺寸匹配，这将读取整个表面
surface.readPixels(bitmap, 0, 0);

// 对于特定区域（例如，从 10, 10 开始的 50x50 区域）
Bitmap region = new Bitmap();
region.allocPixels(ImageInfo.makeN32Premul(50, 50));
surface.readPixels(region, 10, 10);
```

## 链式 API

许多 Skija 的设置器返回 `this`，允许使用流畅的构建器风格 API：

```java
Paint strokePaint = new Paint()
    .setColor(0xFF1D7AA2)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(2f)
    .setAntiAlias(true);
```