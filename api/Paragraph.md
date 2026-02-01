# API Reference: Paragraph (Rich Text Layout)

For any text that requires more than a single line or multiple styles (e.g., a word in **bold** followed by one in *italic*), Skija provides the **Paragraph** API. It handles complex layout tasks like line wrapping, RTL support, and multi-script text.

## The Three Pillars of Paragraphs

Creating a paragraph involves three main steps:
1.  **`FontCollection`**: Defines where the paragraph gets its fonts.
2.  **`ParagraphStyle`**: Defines global settings (alignment, max lines, ellipsis).
3.  **`ParagraphBuilder`**: The "assembles" the text and styles.

## 1. Setting up the FontCollection

The `FontCollection` is the font manager for your paragraphs. You must tell it which `FontMgr` to use.

```java
FontCollection fc = new FontCollection();
fc.setDefaultFontManager(FontMgr.getDefault());
```

## 2. Global Styling (ParagraphStyle)

This defines how the entire block of text behaves.

```java
ParagraphStyle style = new ParagraphStyle();
style.setAlignment(Alignment.CENTER);
style.setMaxLinesCount(3);
style.setEllipsis("..."); // Shows if text is too long
```

## 3. Assembling Rich Text (ParagraphBuilder)

The `ParagraphBuilder` uses a stack-based styling approach. You "push" a style, add text, and "pop" it to return to the previous style.

```java
ParagraphBuilder builder = new ParagraphBuilder(style, fc);

// Add some default text
builder.pushStyle(new TextStyle().setColor(0xFF000000).setFontSize(16f));
builder.addText("Skija is ");

// Add some bold text
builder.pushStyle(new TextStyle().setColor(0xFF4285F4).setFontWeight(FontWeight.BOLD));
builder.addText("Powerful");
builder.popStyle(); // Back to default 16pt black

builder.addText(" and easy to use.");
```

## 4. Layout and Rendering

A `Paragraph` needs to be "laid out" (measured and wrapped) before it can be drawn. This requires a specific width.

```java
Paragraph p = builder.build();

// Layout the text to fit within 300 pixels
p.layout(300);

// Draw it at (x, y)
p.paint(canvas, 20, 20);
```

## Essential Methods

- `p.getHeight()`: Get the total height of the laid out text.
- `p.getLongestLine()`: Get the width of the longest line.
- `p.getLineNumber()`: How many lines the text wrapped into.
- `p.getRectsForRange(...)`: Get bounding boxes for a selection (useful for highlighting text).

## Performance and Best Practices

1.  **Reuse FontCollection:** You typically only need one `FontCollection` for your entire app.
2.  **Layout is where the work is:** `p.layout()` is the most expensive part because it involves measuring every glyph and calculating line breaks. If your text doesn't change and the width is the same, don't call it again.
3.  **Text Metrics:** Use `p.getLineMetrics()` if you need detailed information about each line's position and height for advanced UI layouts.
4.  **Placeholders:** You can use `builder.addPlaceholder()` to leave space for inline images or UI widgets within the text flow.
