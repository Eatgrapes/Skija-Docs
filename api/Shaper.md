# API Reference: Shaper (Text Shaping)

The `Shaper` class is responsible for **Text Shaping**: the process of converting a string of Unicode characters into a set of positioned glyphs from a font.

## Overview

Text shaping is necessary for:
- **Ligatures**: Converting "f" + "i" into a single "fi" glyph.
- **Kerning**: Adjusting the space between specific character pairs (like "AV").
- **Complex Scripts**: Handling Arabic, Devanagari, or Thai, where glyph shapes change based on their neighbors.
- **BiDi**: Handling mixed Left-to-Right (Latin) and Right-to-Left (Arabic/Hebrew) text.

## Basic Shaping

To simply get a `TextBlob` (a set of positioned glyphs) that you can draw, use the `shape()` method.

```java
try (Shaper shaper = Shaper.make()) {
    Font font = new Font(typeface, 24);
    
    // Simple shaping (no width limit)
    TextBlob blob = shaper.shape("Hello, Skija!", font);
    
    canvas.drawTextBlob(blob, 20, 50, paint);
}
```

## Wrapping and Multi-line Shaping

`Shaper` can also calculate line breaks based on a maximum width.

```java
float maxWidth = 300f;
TextBlob multiLineBlob = shaper.shape(
    "This is a long sentence that will be wrapped by the shaper.",
    font,
    maxWidth
);

// Note: The resulting TextBlob contains all lines positioned correctly relative to each other.
canvas.drawTextBlob(multiLineBlob, 20, 100, paint);
```

## Shaping Options

You can control the shaping behavior (e.g., text direction) using `ShapingOptions`.

```java
ShapingOptions options = ShapingOptions.DEFAULT.withLeftToRight(false); // RTL
TextBlob blob = shaper.shape("مرحبا", font, options, Float.POSITIVE_INFINITY, Point.ZERO);
```

## Advanced Shaping (RunHandler)

If you need full control over the shaping process (e.g., to implement your own text selection or custom multi-style layout), you can use a `RunHandler`.

```java
shaper.shape(text, font, ShapingOptions.DEFAULT, maxWidth, new RunHandler() {
    @Override
    public void beginLine() { ... }

    @Override
    public void runInfo(RunInfo info) {
        // Get info about the current run of glyphs
        System.out.println("Glyph count: " + info.getGlyphCount());
    }

    @Override
    public void commitRunInfo() { ... }

    @Override
    public Point commitLine() { return Point.ZERO; }

    // ... more methods ...
});
```

## Performance

- **Caching**: Text shaping is a computationally expensive operation (involving HarfBuzz). If your text is static, shape it once and store the resulting `TextBlob`.
- **Shaper Instance**: Creating a `Shaper` involves initializing HarfBuzz. It is recommended to create one `Shaper` instance and reuse it throughout your application (it is generally safe to reuse, but check thread-safety if using multiple threads).

## Shaper vs. Paragraph

- **Use `Shaper`** for high-performance, single-style text blocks, or when you need low-level access to glyphs.
- **Use [Paragraph](Paragraph.md)** for rich text (different colors/fonts in one block), complex UI layouts, and standard text-editor behavior.
