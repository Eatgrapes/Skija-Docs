# Advanced Typography: Clipping & Animation

Skija provides powerful tools not just for drawing static text, but for using text as a geometric object for clipping, masking, and animation.

## Text as a Clip (Masking)

To use text as a mask (e.g., to show an image *inside* the letters), you cannot simply "clip to text". Instead, you must first convert the text into a `Path`.

### 1. Get the Path from Text
Use `Font.getPath()` to retrieve the geometric outline of specific glyphs.

```java
Font font = new Font(typeface, 100);
short[] glyphs = font.getStringGlyphs("MASK");

// Get the path for these glyphs
// Note: getPaths returns an array of paths (one per glyph)
// You often want to combine them or just draw them sequentially
Point[] positions = font.getPositions(glyphs, new Point(50, 150)); // Position the text

Path textPath = new Path();
for (int i = 0; i < glyphs.length; i++) {
    Path glyphPath = font.getPath(glyphs[i]);
    if (glyphPath != null) {
        // Offset the glyph path to its position and add to the main path
        glyphPath.transform(Matrix33.makeTranslate(positions[i].getX(), positions[i].getY()));
        textPath.addPath(glyphPath);
    }
}
```

### 2. Clip the Canvas
Once you have the `Path`, you can clip the canvas.

```java
canvas.save();
canvas.clipPath(textPath);

// Now draw the image (or gradient, or pattern)
// It will only appear inside the letters "MASK"
canvas.drawImage(myImage, 0, 0);

canvas.restore();
```

## Animating Text

Skija enables high-performance text animation by giving you low-level access to glyph positioning via `TextBlob`.

### 1. Per-Glyph Animation (Wavy Text)
Instead of drawing a string, you calculate the position of each character manually.

```java
String text = "Wavy Text";
short[] glyphs = font.getStringGlyphs(text);
float[] widths = font.getWidths(glyphs);

// Calculate positions for each glyph
Point[] positions = new Point[glyphs.length];
float x = 50;
float time = (System.currentTimeMillis() % 1000) / 1000f; // 0.0 to 1.0

for (int i = 0; i < glyphs.length; i++) {
    // Sine wave animation
    float yOffset = (float) Math.sin((x / 50.0) + (time * Math.PI * 2)) * 10;
    
    positions[i] = new Point(x, 100 + yOffset);
    x += widths[i];
}

// Create a TextBlob from these explicit positions
TextBlob blob = TextBlob.makeFromPos(glyphs, positions, font);

// Draw it
canvas.drawTextBlob(blob, 0, 0, paint);
```

### 2. Text on a Path (RSXform)
For text that follows a curve (and rotates to match the curve), use `RSXform` (Rotation Scale Translate Transform).

```java
// See 'TextBlob.makeFromRSXform' in the API
// This allows you to specify a rotation and position for every single glyph independently.
```

## Variable Fonts
If you have a variable font (like `Inter-Variable.ttf`), you can animate its weight or slant smoothly.

```java
// 1. Create a FontVariation instance
FontVariation weight = new FontVariation("wght", 400 + (float)Math.sin(time) * 300); // Weight 100 to 700

// 2. Create a specific Typeface from the variable base
Typeface currentFace = variableTypeface.makeClone(weight);

// 3. Create a Font and Draw
Font font = new Font(currentFace, 40);
canvas.drawString("Breathing Text", 50, 50, font, paint);
```

## Summary

- **Clipping:** Convert Text -> Glyphs -> Path -> `canvas.clipPath()`.
- **Wavy/Moving Text:** Calculate `Point[]` positions manually and use `TextBlob.makeFromPos()`.
- **Text on Path:** Use `TextBlob.makeFromRSXform()`.
- **Weight/Style Animation:** Use Variable Fonts and `makeClone(FontVariation)`.
