# API Reference: Font & Management

The `Font` class controls how text is rendered, while `FontMgr` handles font discovery and `FontFeature` enables advanced OpenType features.

## Font

A `Font` takes a [`Typeface`](Typeface.md) and adds size, scale, skew, and rendering attributes.

### Creation

```java
// Default font (usually 12pt sans-serif)
Font font = new Font();

// Custom typeface and size
Font font = new Font(typeface, 24f);

// Condensed/Expanded or Oblique text
Font font = new Font(typeface, 24f, 0.8f, -0.25f);
```

- `new Font()`: Initializes with default values.
- `new Font(typeface)`: Initializes with a specific typeface and default size.
- `new Font(typeface, size)`: Initializes with specific typeface and size.
- `new Font(typeface, size, scaleX, skewX)`: Full constructor.

### Metrics & Spacing

- `getSize()` / `setSize(value)`: Typographic size in points.
- `getScaleX()` / `setScaleX(value)`: Horizontal scale (1.0 is normal).
- `getSkewX()` / `setSkewX(value)`: Horizontal skew (0 is normal).
- `getMetrics()`: Returns detailed [`FontMetrics`](#fontmetrics).
- `getSpacing()`: Recommended line spacing (sum of ascent, descent, and leading).

### Rendering Flags

These affect how glyphs are rasterized.

- `setSubpixel(boolean)`: Requests sub-pixel positioning for smoother text.
- `setEdging(FontEdging)`: Controls anti-aliasing (`ALIAS`, `ANTI_ALIAS`, `SUBPIXEL_ANTI_ALIAS`).
- `setHinting(FontHinting)`: Controls glyph outline adjustment (`NONE`, `SLIGHT`, `NORMAL`, `FULL`).
- `setEmboldened(boolean)`: Approximates bold by increasing stroke width.
- `setBaselineSnapped(boolean)`: Snaps baselines to pixel positions.
- `setMetricsLinear(boolean)`: Requests linearly scalable metrics (ignores hinting/rounding).
- `setBitmapsEmbedded(boolean)`: Requests using bitmaps in fonts instead of outlines.

### Measuring Text

```java
// Simple width measurement
float width = font.measureTextWidth("Hello");

// Get precise bounding box
Rect bounds = font.measureText("Hello");

// Measure width with specific paint effects
float width = font.measureTextWidth("Hello", paint);
```

- `measureText(string)` / `measureText(string, paint)`: Returns the bounding box.
- `measureTextWidth(string)` / `measureTextWidth(string, paint)`: Returns the advance width.
- `getWidths(glyphs)`: Retrieves advances for each glyph ID.
- `getBounds(glyphs)` / `getBounds(glyphs, paint)`: Retrieves bounding boxes for each glyph ID.

### Glyph Access

- `getStringGlyphs(string)`: Converts text to an array of glyph IDs.
- `getUTF32Glyph(unichar)`: Returns the glyph ID for a single character.
- `getUTF32Glyphs(uni)`: Returns glyph IDs for an array of characters.
- `getStringGlyphsCount(string)`: Returns the number of glyphs represented by the text.
- `getPath(glyph)`: Returns the outline [`Path`](Path.md) for a single glyph.
- `getPaths(glyphs)`: Returns outlines for an array of glyphs.

---

## FontMgr

`FontMgr` (Font Manager) manages the discovery and loading of font files.

### Accessing the Manager

- `FontMgr.getDefault()`: Returns the global default font manager.

### Finding Typefaces

```java
FontMgr mgr = FontMgr.getDefault();

// Match by name and style
Typeface inter = mgr.matchFamilyStyle("Inter", FontStyle.BOLD);

// Match with system fallbacks for specific characters (e.g., Emoji)
Typeface emoji = mgr.matchFamilyStyleCharacter(null, FontStyle.NORMAL, null, "🧛".codePointAt(0));
```

- `matchFamilyStyle(familyName, style)`: Finds the closest matching typeface.
- `matchFamiliesStyle(families[], style)`: Tries multiple family names in order.
- `matchFamilyStyleCharacter(familyName, style, bcp47[], character)`: Finds a font that supports a specific Unicode character.
- `getFamiliesCount()`: Returns the number of font families available on the system.
- `getFamilyName(index)`: Returns the name of a font family.

### Loading Fonts

- `makeFromFile(path)` / `makeFromFile(path, ttcIndex)`: Loads a font from a file.
- `makeFromData(data)` / `makeFromData(data, ttcIndex)`: Loads a font from memory.

---

## FontFeature

`FontFeature` enables OpenType features like ligatures, kerning, or alternates.

```java
// Enable specific features
FontFeature[] features = FontFeature.parse("cv06 cv07 +liga");

// Create manually
FontFeature kernOff = new FontFeature("kern", 0);
```

- `FontFeature.parse(string)`: Parses features from a string (e.g., `"+liga -kern"`).
- `new FontFeature(tag)`: Enables a feature (value = 1).
- `new FontFeature(tag, value)`: Sets a feature to a specific value.
- `new FontFeature(tag, value, start, end)`: Applies a feature to a specific range of text.

---

## FontMetrics

Detailed measurements scaled by the font's size.

- `getTop()` / `getBottom()`: Extents above/below baseline (maximum).
- `getAscent()` / `getDescent()`: Average extents (ascent is negative).
- `getLeading()`: Recommended space between lines.
- `getCapHeight()`: Height of capital letters.
- `getXHeight()`: Height of lowercase letters.
- `getThickness()` / `getUnderlinePosition()`: For drawing underlines.