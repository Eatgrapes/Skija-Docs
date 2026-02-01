# API Reference: Paint

The `Paint` class defines the style, color, and effects used when drawing on a `Canvas`. It is a lightweight object that can be reused across multiple drawing calls.

## Core Properties

### Color and Transparency

- `setColor(int color)`: Sets the ARGB color.
- `setAlpha(int alpha)`: Sets only the alpha (transparency) component (0-255).
- `setColor4f(Color4f color, ColorSpace space)`: Sets the color using floating-point values for higher precision.

### Style

- `setMode(PaintMode mode)`: Determines if the paint fills the interior of a shape (`FILL`), strokes the outline (`STROKE`), or both (`STROKE_AND_FILL`).
- `setStrokeWidth(float width)`: Sets the thickness of the stroke.
- `setStrokeCap(PaintStrokeCap cap)`: Defines the shape of the ends of a stroked line (BUTT, ROUND, SQUARE).
- `setStrokeJoin(PaintStrokeJoin join)`: Defines how stroked segments are joined (MITER, ROUND, BEVEL).

### Anti-aliasing

- `setAntiAlias(boolean enabled)`: Enables or disables edge smoothing. Highly recommended for most UI drawing.

## Effects and Shaders

`Paint` objects can be enhanced with various effects to create complex visuals.

### Shaders (Gradients and Patterns)

Shaders define the color of each pixel based on its position.
- `setShader(Shader shader)`: Applies a linear gradient, radial gradient, or image pattern.

### Color Filters

Color filters modify the colors of the source before they are drawn.
- `setColorFilter(ColorFilter filter)`: Applies color matrices, blend modes, or luma transformations.

### Mask Filters (Blurs)

Mask filters affect the alpha channel of the drawing.
- `setMaskFilter(MaskFilter filter)`: Used primarily for creating blurs and shadows.

### Image Filters

Image filters are more complex and can affect the entire drawing result.
- `setImageFilter(ImageFilter filter)`: Used for blurs, dropshadows, and combining multiple effects.

## Usage Example

```java
Paint paint = new Paint()
    .setColor(0xFF4285F4)
    .setAntiAlias(true)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(4f)
    .setStrokeJoin(PaintStrokeJoin.ROUND);

canvas.drawRect(Rect.makeXYWH(10, 10, 100, 100), paint);
```

## Performance Note

Creating a `Paint` object is relatively fast, but modifying it frequently in a tight loop can have some overhead. It is generally recommended to prepare your `Paint` objects once and reuse them during rendering if their properties don't change.
