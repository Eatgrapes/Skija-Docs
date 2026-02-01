# 排版与文本

文本是任何图形库中最复杂的部分之一。Skija 提供了高级 API 来处理从简单标签到复杂多行文本布局的所有需求。

## 字体（Typeface）—— "内容"

`Typeface` 代表特定的字体文件（如 "Inter-Bold.ttf"）。它定义了字形（glyph）的形状。

### 加载字体
可以从文件、资源或系统字体管理器加载字体。

```java
// 从文件加载
Typeface inter = Typeface.makeFromFile("fonts/Inter.ttf");

// 从系统加载（安全方式）
Typeface sans = FontMgr.getDefault().matchFamilyStyle("sans-serif", FontStyle.NORMAL);
```

**常见陷阱：** 不要假设用户系统上存在某个字体。始终提供备用字体或将字体作为资源打包。

## 字体样式（Font）—— "方式"

`Font` 接收一个 `Typeface` 并赋予其大小和其他渲染属性。

```java
Font font = new Font(inter, 14f);
```

### 文本定位：字体度量

如果要居中或精确对齐文本，需要理解 `FontMetrics`。

```java
FontMetrics metrics = font.getMetrics();
// metrics.getAscent()  -> 从基线到顶部的距离（负值）
// metrics.getDescent() -> 从基线到底部的距离（正值）
// metrics.getLeading() -> 建议的行间距
```

**示例：完美垂直居中**
要在 `y` 处垂直居中文本，通常需要偏移 "大写高度"（大写字母的高度）的一半。

```java
float centerY = rect.getMidY() - metrics.getCapHeight() / 2f;
canvas.drawString("HELLO", rect.getLeft(), centerY, font, paint);
```

## 高级文本：段落

对于比单个单词或单行更复杂的文本，使用 **Paragraph** API。它处理：
- 自动换行
- 一个文本块中的多种样式（粗体、斜体、颜色）
- 从右到左（RTL）文本
- 表情符号支持

详见 [**Paragraph API 参考**](api/Paragraph.md)。

## 交互式文本：TextLine

如果需要单行文本但需要知道每个字符的确切位置（例如，用于文本输入框中的光标或选区），请使用 `TextLine`。

```java
TextLine line = TextLine.make("Interact with me", font);

// 获取视觉属性
float width = line.getWidth();
float height = line.getHeight();

// 点击测试：获取像素坐标处的字符索引
int charIndex = line.getOffsetAtCoord(45.0f);

// 获取字符索引的像素坐标
float xCoord = line.getCoordAtOffset(5);

// 渲染
canvas.drawTextLine(line, 20, 50, paint);
```

### 视觉示例

**交互式文本行：**
查看 [`examples/scenes/src/TextLineScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextLineScene.java) 了解光标定位、点击测试和多脚本文本布局的演示。

**文本效果：**
查看 [`examples/scenes/src/TextBlobScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextBlobScene.java) 了解路径文本、波浪文本和自定义定位的示例。

## 最佳实践

1.  **缓存字体/字体样式：** 创建 `Typeface` 涉及解析文件，可能很慢。将它们保存在静态缓存或主题管理器中。
2.  **使用提示/抗锯齿：** 对于屏幕上的小文本，确保在 `Paint` 中启用抗锯齿以保持可读性。
3.  **先测量后绘制：** 使用 `font.measureTextWidth(string)` 在将文本实际绘制到画布之前计算布局。