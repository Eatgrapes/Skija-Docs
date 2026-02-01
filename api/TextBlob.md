# API Reference: TextBlob & Builder

A `TextBlob` is an immutable, optimized representation of a set of glyphs. It is the fastest way to draw text in Skija if the text layout (position of glyphs) does not change.

## TextBlob

`TextBlob` combines glyphs, positions, and fonts into a single object that can be reused.

### Properties
- `getBounds()`: Returns the conservative bounding box of the blob.
- `getUniqueId()`: Returns a unique identifier for caching.
- `serializeToData()`: Serializes the blob to a `Data` object.

### Creation from Positions
If you have already calculated glyph positions (e.g., using `Shaper` or manually), you can create a blob directly.

```java
// Horizontal positions only (y is constant)
TextBlob blob = TextBlob.makeFromPosH(glyphs, xPositions, y, font);

// Full (x, y) positions for each glyph
TextBlob blob2 = TextBlob.makeFromPos(glyphs, points, font);

// RSXform (Rotation + Scale + Translate) for each glyph
TextBlob blob3 = TextBlob.makeFromRSXform(glyphs, xforms, font);
```

### Drawing
```java
canvas.drawTextBlob(blob, x, y, paint);
```

---

## TextBlobBuilder

`TextBlobBuilder` allows you to construct a `TextBlob` by appending multiple "runs" of text. A "run" is a sequence of glyphs that share the same Font and Paint.

### Basic Usage

```java
TextBlobBuilder builder = new TextBlobBuilder();

// Append a run of text
builder.appendRun(font, "Hello ", 0, 0);

// Append another run (e.g., different style or position)
builder.appendRun(boldFont, "World!", 100, 0);

// Build the immutable TextBlob
TextBlob blob = builder.build();
```

### Advanced Appending
- `appendRun(font, glyphs, x, y, bounds)`: Appends glyphs with a shared origin.
- `appendRunPosH(...)`: Appends glyphs with explicit X positions.
- `appendRunPos(...)`: Appends glyphs with explicit (X, Y) positions.
- `appendRunRSXform(...)`: Appends glyphs with full affine transformations (rotation/scale).

### Performance Tip
If you are drawing the same paragraph of text multiple times (even if the canvas moves), create a `TextBlob` once and reuse it. This avoids re-calculating glyph positions and shapes.
