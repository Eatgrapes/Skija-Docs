# API 参考：TextLine

`TextLine` 表示单行已排版的文本。通常由 `Shaper` 创建，并提供度量信息和点击测试功能，这对于构建文本编辑器或交互式标签至关重要。

## 创建

```java
// 排版单行文本
TextLine line = TextLine.make("Hello World", font);
```

## 度量信息

- `getAscent()`: 从基线到最高字形顶部的距离（负值）。
- `getDescent()`: 从基线到最低字形底部的距离（正值）。
- `getCapHeight()`: 大写字母的高度。
- `getXHeight()`: 小写字母 'x' 的高度。
- `getWidth()`: 行的总前进宽度。
- `getHeight()`: 总高度（descent - ascent）。

## 点击测试（交互）

`TextLine` 提供了在像素坐标和字符偏移之间进行映射的方法。

```java
// 1. 从坐标获取偏移量（点击）
float x = mouseEvent.getX();
int offset = line.getOffsetAtCoord(x); // 返回 UTF-16 字符索引
// 'offset' 将最接近鼠标光标

// 2. 从偏移量获取坐标（光标放置）
float cursorX = line.getCoordAtOffset(offset);
// 在 (cursorX, baseline) 处绘制光标
```

- `getOffsetAtCoord(x)`: 最接近的字符偏移量。
- `getLeftOffsetAtCoord(x)`: 严格位于左侧的字符偏移量。
- `getCoordAtOffset(offset)`: 给定字符索引的像素 X 坐标。

## 渲染

```java
// 可以直接绘制该行
canvas.drawTextLine(line, x, y, paint);

// 或者提取 TextBlob 以进行更手动的控制
try (TextBlob blob = line.getTextBlob()) {
    canvas.drawTextBlob(blob, x, y, paint);
}
```

## 生命周期
`TextLine` 实现了 `Managed` 接口。使用完毕后务必关闭以释放原生资源。

```java
try (TextLine line = TextLine.make(text, font)) {
    // ... 使用 line ...
}
```