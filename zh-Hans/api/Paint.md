# API 参考：Paint

`Paint` 类定义了在 `Canvas` 上绘制时使用的样式、颜色和效果。它是一个轻量级对象，可以在多个绘制调用中重复使用。

## 核心属性

### 颜色与透明度

- `setColor(int color)`：设置 ARGB 颜色。
- `setAlpha(int alpha)`：仅设置透明度（alpha）分量（0-255）。
- `setColor4f(Color4f color, ColorSpace space)`：使用浮点数值设置颜色，以获得更高精度。

### 样式

- `setMode(PaintMode mode)`：确定绘制是填充形状内部（`FILL`）、描边轮廓（`STROKE`），还是两者兼具（`STROKE_AND_FILL`）。
- `setStrokeWidth(float width)`：设置描边的粗细。
- `setStrokeCap(PaintStrokeCap cap)`：定义描边线条端点的形状（BUTT、ROUND、SQUARE）。
- `setStrokeJoin(PaintStrokeJoin join)`：定义描边线段如何连接（MITER、ROUND、BEVEL）。

### 抗锯齿

- `setAntiAlias(boolean enabled)`：启用或禁用边缘平滑。强烈建议在大多数 UI 绘制中使用。

## 效果与着色器

`Paint` 对象可以通过各种效果增强，以创建复杂的视觉效果。

### 着色器（渐变与图案）

着色器根据像素位置定义其颜色。
- `setShader(Shader shader)`：应用线性渐变、径向渐变或图像图案。

### 颜色滤镜

颜色滤镜在绘制前修改源颜色。
- `setColorFilter(ColorFilter filter)`：应用颜色矩阵、混合模式或亮度转换。

### 遮罩滤镜（模糊）

遮罩滤镜影响绘制的透明度通道。
- `setMaskFilter(MaskFilter filter)`：主要用于创建模糊和阴影效果。

### 图像滤镜

图像滤镜更为复杂，可以影响整个绘制结果。
- `setImageFilter(ImageFilter filter)`：用于模糊、投影以及组合多种效果。

## 使用示例

```java
Paint paint = new Paint()
    .setColor(0xFF4285F4)
    .setAntiAlias(true)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(4f)
    .setStrokeJoin(PaintStrokeJoin.ROUND);

canvas.drawRect(Rect.makeXYWH(10, 10, 100, 100), paint);
```

## 性能说明

创建 `Paint` 对象相对较快，但在紧密循环中频繁修改它可能会带来一些开销。通常建议在渲染前准备好 `Paint` 对象，并在属性不变的情况下重复使用它们。