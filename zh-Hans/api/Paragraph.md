# API 参考：段落（富文本布局）

对于任何需要多行或多样式（例如，**粗体**单词后接*斜体*单词）的文本，Skija 提供了**段落**API。它处理复杂的布局任务，如换行、RTL 支持和多脚本文本。

## 段落的三大支柱

创建段落涉及三个主要步骤：
1.  **`FontCollection`**：定义段落获取字体的来源。
2.  **`ParagraphStyle`**：定义全局设置（对齐方式、最大行数、省略号）。
3.  **`ParagraphBuilder`**：用于“组装”文本和样式。

## 1. 设置 FontCollection

`FontCollection` 是段落的字体管理器。你必须告诉它使用哪个 `FontMgr`。

```java
FontCollection fc = new FontCollection();
fc.setDefaultFontManager(FontMgr.getDefault());
```

## 2. 全局样式（ParagraphStyle）

这定义了整个文本块的行为。

```java
ParagraphStyle style = new ParagraphStyle();
style.setAlignment(Alignment.CENTER);
style.setMaxLinesCount(3);
style.setEllipsis("..."); // 如果文本过长则显示
```

## 3. 组装富文本（ParagraphBuilder）

`ParagraphBuilder` 使用基于堆栈的样式方法。你“推送”一个样式，添加文本，然后“弹出”它以返回到之前的样式。

```java
ParagraphBuilder builder = new ParagraphBuilder(style, fc);

// 添加一些默认文本
builder.pushStyle(new TextStyle().setColor(0xFF000000).setFontSize(16f));
builder.addText("Skija 是 ");

// 添加一些粗体文本
builder.pushStyle(new TextStyle().setColor(0xFF4285F4).setFontWeight(FontWeight.BOLD));
builder.addText("强大的");
builder.popStyle(); // 回到默认的 16pt 黑色

builder.addText(" 且易于使用。");
```

## 4. 布局与渲染

`Paragraph` 在绘制之前需要被“布局”（测量和换行）。这需要一个特定的宽度。

```java
Paragraph p = builder.build();

// 将文本布局以适应 300 像素的宽度
p.layout(300);

// 在 (x, y) 位置绘制
p.paint(canvas, 20, 20);
```

## 核心方法

- `p.getHeight()`：获取已布局文本的总高度。
- `p.getLongestLine()`：获取最长行的宽度。
- `p.getLineNumber()`：文本换行后的行数。
- `p.getRectsForRange(...)`：获取选定范围的边界框（适用于文本高亮）。

## 性能与最佳实践

1.  **重用 FontCollection**：通常整个应用只需要一个 `FontCollection`。
2.  **布局是主要开销**：`p.layout()` 是最耗时的部分，因为它涉及测量每个字形并计算换行。如果文本和宽度不变，请勿重复调用。
3.  **文本度量**：如果需要每行的详细位置和高度信息以进行高级 UI 布局，请使用 `p.getLineMetrics()`。
4.  **占位符**：可以使用 `builder.addPlaceholder()` 在文本流中为内联图像或 UI 组件预留空间。