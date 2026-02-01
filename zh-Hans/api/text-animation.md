# 高级排版：裁剪与动画

Skija 不仅提供了绘制静态文本的强大工具，还能将文本作为几何对象用于裁剪、遮罩和动画。

## 文本作为裁剪遮罩

要将文本用作遮罩（例如，在字母*内部*显示图像），不能简单地“裁剪到文本”。相反，必须先将文本转换为 `Path`。

### 1. 从文本获取路径
使用 `Font.getPath()` 获取特定字形的几何轮廓。

```java
Font font = new Font(typeface, 100);
short[] glyphs = font.getStringGlyphs("MASK");

// 获取这些字形的路径
// 注意：getPaths 返回路径数组（每个字形一个）
// 通常需要将它们组合或按顺序绘制
Point[] positions = font.getPositions(glyphs, new Point(50, 150)); // 定位文本

Path textPath = new Path();
for (int i = 0; i < glyphs.length; i++) {
    Path glyphPath = font.getPath(glyphs[i]);
    if (glyphPath != null) {
        // 将字形路径偏移到其位置并添加到主路径
        glyphPath.transform(Matrix33.makeTranslate(positions[i].getX(), positions[i].getY()));
        textPath.addPath(glyphPath);
    }
}
```

### 2. 裁剪画布
获得 `Path` 后，即可裁剪画布。

```java
canvas.save();
canvas.clipPath(textPath);

// 现在绘制图像（或渐变、图案）
// 它将仅出现在字母 "MASK" 内部
canvas.drawImage(myImage, 0, 0);

canvas.restore();
```

## 文本动画

Skija 通过 `TextBlob` 提供对字形定位的低级访问，从而实现高性能文本动画。

### 1. 逐字形动画（波浪文本）
不直接绘制字符串，而是手动计算每个字符的位置。

```java
String text = "Wavy Text";
short[] glyphs = font.getStringGlyphs(text);
float[] widths = font.getWidths(glyphs);

// 计算每个字形的位置
Point[] positions = new Point[glyphs.length];
float x = 50;
float time = (System.currentTimeMillis() % 1000) / 1000f; // 0.0 到 1.0

for (int i = 0; i < glyphs.length; i++) {
    // 正弦波动画
    float yOffset = (float) Math.sin((x / 50.0) + (time * Math.PI * 2)) * 10;
    
    positions[i] = new Point(x, 100 + yOffset);
    x += widths[i];
}

// 根据这些显式位置创建 TextBlob
TextBlob blob = TextBlob.makeFromPos(glyphs, positions, font);

// 绘制
canvas.drawTextBlob(blob, 0, 0, paint);
```

### 2. 路径上的文本（RSXform）
对于沿曲线排列（并旋转以匹配曲线）的文本，使用 `RSXform`（旋转缩放平移变换）。

```java
// 参见 API 中的 'TextBlob.makeFromRSXform'
// 这允许为每个字形独立指定旋转和位置。
```

## 可变字体
如果拥有可变字体（如 `Inter-Variable.ttf`），可以平滑地动画化其字重或倾斜度。

```java
// 1. 创建 FontVariation 实例
FontVariation weight = new FontVariation("wght", 400 + (float)Math.sin(time) * 300); // 字重 100 到 700

// 2. 从可变基础创建特定 Typeface
Typeface currentFace = variableTypeface.makeClone(weight);

// 3. 创建字体并绘制
Font font = new Font(currentFace, 40);
canvas.drawString("Breathing Text", 50, 50, font, paint);
```

## 总结

- **裁剪：** 转换 文本 -> 字形 -> 路径 -> `canvas.clipPath()`。
- **波浪/移动文本：** 手动计算 `Point[]` 位置并使用 `TextBlob.makeFromPos()`。
- **路径上的文本：** 使用 `TextBlob.makeFromRSXform()`。
- **字重/样式动画：** 使用可变字体和 `makeClone(FontVariation)`。