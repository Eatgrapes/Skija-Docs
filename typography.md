# Typography and Text

Text is one of the most complex parts of any graphics library. Skija provides a high-level API to handle everything from simple labels to complex multi-line text layout.

## The Typeface (The "What")

A `Typeface` represents a specific font file (like "Inter-Bold.ttf"). It defines the shape of the glyphs.

### Loading Typefaces
You can load them from files, resources, or the system font manager.

```java
// From a file
Typeface inter = Typeface.makeFromFile("fonts/Inter.ttf");

// From system (safe way)
Typeface sans = FontMgr.getDefault().matchFamilyStyle("sans-serif", FontStyle.NORMAL);
```

**Common Pitfall:** Don't assume a font exists on the user's system. Always provide a fallback or bundle your fonts as resources.

## The Font (The "How")

A `Font` takes a `Typeface` and gives it a size and other rendering attributes.

```java
Font font = new Font(inter, 14f);
```

### Positioning Text: Font Metrics

If you want to center text or align it precisely, you need to understand `FontMetrics`.

```java
FontMetrics metrics = font.getMetrics();
// metrics.getAscent()  -> Distance from baseline to top (negative)
// metrics.getDescent() -> Distance from baseline to bottom (positive)
// metrics.getLeading() -> Suggested space between lines
```

**Example: Perfect Vertical Centering**
To center text vertically at `y`, you usually want to offset it by half the height of the "cap height" (height of capital letters).

```java
float centerY = rect.getMidY() - metrics.getCapHeight() / 2f;
canvas.drawString("HELLO", rect.getLeft(), centerY, font, paint);
```

## Advanced Text: Paragraph

For anything more complex than a single word or line, use the **Paragraph** API. It handles:
- Line wrapping
- Multiple styles (bold, italic, colors) in one block
- Right-to-Left (RTL) text
- Emoji support

See [**Paragraph API Reference**](api/Paragraph.md) for details.

## Interactive Text: TextLine

If you need a single line of text but need to know exactly where each character is (e.g., for a cursor or selection in a text input), use `TextLine`.

```java
TextLine line = TextLine.make("Interact with me", font);

// Get visual properties
float width = line.getWidth();
float height = line.getHeight();

// Hit-testing: Get character index at a pixel coordinate
int charIndex = line.getOffsetAtCoord(45.0f);

// Get pixel coordinate for a character index
float xCoord = line.getCoordAtOffset(5);

// Rendering
canvas.drawTextLine(line, 20, 50, paint);
```

### Visual Examples

**Interactive Text Line:**
See [`examples/scenes/src/TextLineScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextLineScene.java) for a demo of cursor positioning, hit-testing, and multi-script text layout.

**Text Blob Effects:**
See [`examples/scenes/src/TextBlobScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextBlobScene.java) for examples of text-on-path, wavy text, and custom positioning.

## Best Practices

1.  **Cache your Fonts/Typefaces:** Creating a `Typeface` involves parsing a file and can be slow. Keep them in a static cache or a theme manager.
2.  **Use Hinting/Anti-aliasing:** For small text on screens, ensure anti-aliasing is enabled in your `Paint` to keep it readable.
3.  **Measure before Drawing:** Use `font.measureTextWidth(string)` to calculate layouts before you actually commit to drawing them on the canvas.