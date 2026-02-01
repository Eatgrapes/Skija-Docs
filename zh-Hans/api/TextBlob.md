# API 参考：TextBlob 与 Builder

`TextBlob` 是一组字形不可变且经过优化的表示。在 Skija 中，如果文本布局（字形位置）不变，这是绘制文本最快的方式。

## TextBlob

`TextBlob` 将字形、位置和字体组合成一个可以重复使用的单一对象。

### 属性
- `getBounds()`: 返回文本块的保守边界框。
- `getUniqueId()`: 返回用于缓存的唯一标识符。
- `serializeToData()`: 将文本块序列化为 `Data` 对象。

### 从位置创建
如果您已经计算好字形位置（例如使用 `Shaper` 或手动计算），可以直接创建文本块。

```java
// 仅水平位置（y 为常量）
TextBlob blob = TextBlob.makeFromPosH(glyphs, xPositions, y, font);

// 每个字形的完整 (x, y) 位置
TextBlob blob2 = TextBlob.makeFromPos(glyphs, points, font);

// 每个字形的 RSXform（旋转 + 缩放 + 平移）
TextBlob blob3 = TextBlob.makeFromRSXform(glyphs, xforms, font);
```

### 绘制
```java
canvas.drawTextBlob(blob, x, y, paint);
```

---

## TextBlobBuilder

`TextBlobBuilder` 允许您通过追加多个文本“片段”来构建 `TextBlob`。一个“片段”是一组共享相同字体和画笔的字形序列。

### 基本用法

```java
TextBlobBuilder builder = new TextBlobBuilder();

// 追加一个文本片段
builder.appendRun(font, "Hello ", 0, 0);

// 追加另一个片段（例如，不同样式或位置）
builder.appendRun(boldFont, "World!", 100, 0);

// 构建不可变的 TextBlob
TextBlob blob = builder.build();
```

### 高级追加方法
- `appendRun(font, glyphs, x, y, bounds)`: 追加具有共享原点的字形。
- `appendRunPosH(...)`: 追加具有明确 X 位置的字形。
- `appendRunPos(...)`: 追加具有明确 (X, Y) 位置的字形。
- `appendRunRSXform(...)`: 追加具有完整仿射变换（旋转/缩放）的字形。

### 性能提示
如果您需要多次绘制同一段文本（即使画布移动），请创建一次 `TextBlob` 并重复使用。这样可以避免重新计算字形位置和形状。