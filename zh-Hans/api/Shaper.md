# API 参考：Shaper（文本整形）

`Shaper` 类负责**文本整形**：将 Unicode 字符字符串转换为字体中一组定位字形（glyph）的过程。

## 概述

文本整形是必要的，用于：
- **连字**：将 "f" + "i" 转换为单个 "fi" 字形。
- **字距调整**：调整特定字符对（如 "AV"）之间的间距。
- **复杂文字**：处理阿拉伯文、天城文或泰文等字形会随相邻字符而变化的文字。
- **双向文本**：处理混合的左到右（拉丁文）和右到左（阿拉伯文/希伯来文）文本。

## 基础整形

要简单地获取一个可用于绘制的 `TextBlob`（一组定位字形），请使用 `shape()` 方法。

```java
try (Shaper shaper = Shaper.make()) {
    Font font = new Font(typeface, 24);
    
    // 简单整形（无宽度限制）
    TextBlob blob = shaper.shape("Hello, Skija!", font);
    
    canvas.drawTextBlob(blob, 20, 50, paint);
}
```

## 换行与多行整形

`Shaper` 还可以根据最大宽度计算换行。

```java
float maxWidth = 300f;
TextBlob multiLineBlob = shaper.shape(
    "This is a long sentence that will be wrapped by the shaper.",
    font,
    maxWidth
);

// 注意：生成的 TextBlob 包含所有行，且各行相对于彼此正确定位。
canvas.drawTextBlob(multiLineBlob, 20, 100, paint);
```

## 整形选项

您可以使用 `ShapingOptions` 来控制整形行为（例如文本方向）。

```java
ShapingOptions options = ShapingOptions.DEFAULT.withLeftToRight(false); // 从右到左
TextBlob blob = shaper.shape("مرحبا", font, options, Float.POSITIVE_INFINITY, Point.ZERO);
```

## 高级整形（RunHandler）

如果您需要完全控制整形过程（例如，为了实现自己的文本选择或自定义多样式布局），可以使用 `RunHandler`。

```java
shaper.shape(text, font, ShapingOptions.DEFAULT, maxWidth, new RunHandler() {
    @Override
    public void beginLine() { ... }

    @Override
    public void runInfo(RunInfo info) {
        // 获取当前字形序列的信息
        System.out.println("Glyph count: " + info.getGlyphCount());
    }

    @Override
    public void commitRunInfo() { ... }

    @Override
    public Point commitLine() { return Point.ZERO; }

    // ... 更多方法 ...
});
```

## 性能

- **缓存**：文本整形是一项计算密集型操作（涉及 HarfBuzz）。如果您的文本是静态的，请将其整形一次并存储生成的 `TextBlob`。
- **Shaper 实例**：创建 `Shaper` 涉及初始化 HarfBuzz。建议创建一个 `Shaper` 实例并在整个应用程序中重复使用（通常可以安全地重复使用，但如果使用多线程，请检查线程安全性）。

## Shaper 与 Paragraph 对比

- **使用 `Shaper`** 用于高性能、单一风格的文本块，或者当您需要低级访问字形时。
- **使用 [Paragraph](Paragraph.md)** 用于富文本（一个块中有不同的颜色/字体）、复杂的 UI 布局以及标准的文本编辑器行为。