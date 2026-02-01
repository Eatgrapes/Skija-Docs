# API 参考：Canvas

`Canvas` 类是 Skija 中所有绘图操作的核心点。它管理绘图状态，包括变换和裁剪。

## 概述

`Canvas` 本身不持有像素；它是一个接口，将绘图命令导向目标，例如 `Surface` 或 `Bitmap`。

## 状态管理

Canvas 维护一个状态栈。您可以保存当前状态（矩阵和裁剪）并在稍后恢复。

- `save()`: 将当前矩阵和裁剪的副本推入栈中。返回保存计数。
- `restore()`: 弹出栈并将矩阵和裁剪重置为之前的状态。
- `restoreToCount(count)`: 恢复到特定的保存计数。
- `getSaveCount()`: 返回当前栈深度。

### 图层

图层创建一个离屏缓冲区用于绘图，然后在恢复时合成回主画布。

- `saveLayer(rect, paint)`: 保存状态并将绘图重定向到一个图层。`paint` 控制图层合成回来时的透明度/混合。
- `saveLayerAlpha(rect, alpha)`: 仅改变透明度的简化版本。
- `saveLayer(SaveLayerRec)`: 高级图层控制（背景、平铺模式）。

```java
// 创建模糊滤镜
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
SaveLayerRec rec = new SaveLayerRec(null, null, blur);

canvas.saveLayer(rec);
    // 在此处绘制的所有内容将出现在模糊背景之上
    // （创建“磨砂玻璃”效果）
    canvas.drawRect(Rect.makeWH(200, 200), new Paint().setColor(0x80FFFFFF));
canvas.restore();
```

## 变换

变换影响所有后续绘图操作。

- `translate(dx, dy)`: 移动原点。
- `scale(sx, sy)`: 缩放坐标。
- `rotate(degrees)`: 围绕当前原点旋转。
- `skew(sx, sy)`: 倾斜坐标系。
- `concat(matrix)`: 乘以自定义的 `Matrix33` 或 `Matrix44`。
- `setMatrix(matrix)`: 完全替换当前矩阵。
- `resetMatrix()`: 重置为单位矩阵。
- `getLocalToDevice()`: 返回当前总变换矩阵。

## 裁剪

裁剪限制可以绘制的区域。

- `clipRect(rect, mode, antiAlias)`: 裁剪到矩形。
- `clipRRect(rrect, mode, antiAlias)`: 裁剪到圆角矩形。
- `clipPath(path, mode, antiAlias)`: 裁剪到路径。
- `clipRegion(region, mode)`: 裁剪到区域（像素对齐）。

## 绘图方法

**视觉示例：**
查看 [`examples/scenes/src/GeometryScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/GeometryScene.java) 以获取绘图图元的演示。

![Canvas 图元](../images/canvas_primitives.png)

### 基本图元

```java
// 绘制一个点（根据画笔笔帽，可能是像素或圆形）
canvas.drawPoint(50, 50, new Paint().setColor(0xFF0000FF).setStrokeWidth(5));

// 绘制一条线
canvas.drawLine(10, 10, 100, 100, paint);

// 绘制一个矩形（根据画笔模式，可以是轮廓或填充）
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);

// 绘制一个圆
canvas.drawCircle(100, 100, 40, paint);

// 绘制一个椭圆
canvas.drawOval(Rect.makeXYWH(50, 50, 100, 50), paint);

// 绘制一个圆角矩形（半径可以很复杂）
canvas.drawRRect(RRect.makeXYWH(50, 50, 100, 100, 10), paint);

// 绘制一个圆弧（扇形或描边）
// startAngle: 0 表示右侧，sweepAngle: 顺时针角度
canvas.drawArc(Rect.makeXYWH(50, 50, 100, 100), 0, 90, true, paint);
```

- `drawPoint(x, y, paint)`: 绘制单个点。
- `drawPoints(points, paint)`: 绘制点集合（根据画笔笔帽，可以是点、线或多边形）。
- `drawLine(x0, y0, x1, y1, paint)`: 绘制线段。
- `drawLines(points, paint)`: 为每对点绘制独立的线段。
- `drawRect(rect, paint)`: 绘制矩形。
- `drawOval(rect, paint)`: 绘制椭圆。
- `drawCircle(x, y, radius, paint)`: 绘制圆。
- `drawRRect(rrect, paint)`: 绘制圆角矩形。
- `drawDRRect(outer, inner, paint)`: 绘制两个圆角矩形之间的区域（环形）。
- `drawArc(rect, startAngle, sweepAngle, useCenter, paint)`: 绘制楔形（扇形）或圆弧描边。
- `drawPath(path, paint)`: 绘制路径。
- `drawRegion(region, paint)`: 绘制特定区域。

### 填充与清除

```java
// 用特定颜色填充整个画布/图层（与现有内容混合）
canvas.drawColor(0x80FF0000); // 50% 红色叠加

// 将整个画布清除为透明（替换内容，无混合）
canvas.clear(0x00000000);

// 用特定画笔填充当前裁剪区域
// 适用于用渐变或复杂画笔效果填充屏幕
canvas.drawPaint(new Paint().setShader(myGradient));
```

- `clear(color)`: 用颜色填充整个裁剪区域（替换像素，忽略混合）。
- `drawColor(color, mode)`: 用颜色填充裁剪区域（尊重混合）。
- `drawPaint(paint)`: 用给定画笔填充裁剪区域（适用于用着色器填充）。

### 图像与位图

```java
// 在 (0, 0) 处绘制图像
canvas.drawImage(image, 0, 0);

// 将图像缩放到特定矩形
canvas.drawImageRect(image, Rect.makeXYWH(0, 0, 200, 200));

// 绘制 9 切片图像（可缩放 UI 元素）
// center: 源图像中可缩放的中间区域
// dst: 要绘制到的目标矩形
canvas.drawImageNine(image, IRect.makeLTRB(10, 10, 20, 20), Rect.makeXYWH(0, 0, 100, 50), FilterMode.LINEAR, null);
```

- `drawImage(image, x, y, paint)`: 在坐标处绘制图像。
- `drawImageRect(image, src, dst, sampling, paint, strict)`: 绘制图像的子集并缩放到目标矩形。
- `drawImageNine(image, center, dst, filter, paint)`: 绘制 9 切片可缩放图像。
- `drawBitmap(bitmap, x, y, paint)`: 绘制位图（栅格数据）。

### 文本

```java
// 简单文本绘制
canvas.drawString("Hello World", 50, 50, font, paint);

// 使用 TextBlob 的高级文本绘制（预计算布局）
canvas.drawTextBlob(blob, 50, 50, paint);

// 绘制 TextLine（来自 Shaper）
canvas.drawTextLine(line, 50, 50, paint);
```

- `drawString(string, x, y, font, paint)`: 绘制简单字符串。
- `drawTextBlob(blob, x, y, paint)`: 绘制预计算的文本块。
- `drawTextLine(line, x, y, paint)`: 绘制已排版的 `TextLine`。

### 高级绘图

```java
// 绘制三角形网格（例如，用于自定义 3D 效果或扭曲）
canvas.drawVertices(
    new Point[] { new Point(0, 0), new Point(100, 0), new Point(50, 100) },
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF }, // 每个顶点的颜色
    null, // 无纹理坐标
    null, // 无索引（按顺序使用顶点）
    BlendMode.MODULATE,
    new Paint()
);

// 为矩形绘制投影
// （比手动创建阴影滤镜更简单）
canvas.drawRectShadow(
    Rect.makeXYWH(50, 50, 100, 100),
    5, 5,  // dx, dy
    10,    // 模糊
    0,     // 扩散
    0x80000000 // 阴影颜色
);
```

- `drawPicture(picture)`: 重放已记录的 `Picture`。
- `drawDrawable(drawable)`: 绘制动态 `Drawable` 对象。
- `drawVertices(positions, colors, texCoords, indices, mode, paint)`: 绘制三角形网格。
- `drawPatch(cubics, colors, texCoords, mode, paint)`: 绘制 Coons 补丁。
- `drawRectShadow(rect, dx, dy, blur, spread, color)`: 绘制简单投影的辅助方法。

## 像素访问

```java
// 从画布读取像素到位图
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));
canvas.readPixels(bmp, 0, 0); // 从画布上的 (0,0) 开始读取

// 将像素写回画布
canvas.writePixels(bmp, 50, 50);
```

- `readPixels(bitmap, srcX, srcY)`: 从画布读取像素到位图。
- `writePixels(bitmap, x, y)`: 将像素从位图写入画布。