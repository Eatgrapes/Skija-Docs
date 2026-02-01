# Colors and Alpha Transparency

Understanding how Skija handles colors and transparency is essential for achieving correct visual results, especially when blending multiple layers or images.

## Color Representation

In Skija, colors are most commonly represented as 32-bit integers in **ARGB** format.

- **A (Alpha)**: bits 24-31
- **R (Red)**: bits 16-23
- **G (Green)**: bits 8-15
- **B (Blue)**: bits 0-7

You can use the `Color` utility class to manipulate these values safely:

```java
int myColor = Color.makeARGB(255, 66, 133, 244); // Opaque Blue
int transparentRed = Color.withA(0xFFFF0000, 128); // 50% Transparent Red
```

## Alpha Type: Premultiplied vs. Straight

One of the most important concepts in Skia is the **Alpha Type** (`ColorAlphaType`).

### Premultiplied (`PREMUL`)
This is the **default and recommended** format for rendering. In this format, the RGB components are already multiplied by the alpha value.
- **Why?** It makes blending much faster and prevents "dark edges" when filtering or scaling images.
- **Example**: A 50% transparent white (Alpha=128, R=255, G=255, B=255) becomes (128, 128, 128, 128) in premultiplied space.

### Unpremultiplied (`UNPREMUL`)
Also known as "Straight Alpha". RGB components are independent of alpha. This is how most image files (like PNG) store data.
- **Example**: The same 50% transparent white remains (128, 255, 255, 255).

## Color Spaces

Skija is color-space aware. While you can work with raw "naive" RGB, for professional results, you should specify a `ColorSpace`.

- `ColorSpace.getSRGB()`: The standard color space for the web and most monitors.
- `ColorSpace.getDisplayP3()`: For wide-gamut displays (like modern Macs and iPhones).

When creating a `Surface` or loading an `Image`, always consider the color space to ensure consistent appearance across different devices.

## Best Practices

1.  **Always use Premultiplied Alpha** for active rendering and composition.
2.  **Use `Color4f`** when you need high-precision colors (floating point) or are working with wide-gamut color spaces.
3.  **Be mindful of the Alpha Mode** when capturing snapshots or reading pixels; you may need to convert from `PREMUL` to `UNPREMUL` if you intend to save the data to a standard PNG.
