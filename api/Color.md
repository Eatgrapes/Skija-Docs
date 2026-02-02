# API Reference: Color & Encoding

This page covers high-precision color representation, pixel formats, alpha interpretation, and color spaces.

---

## Color4f

`Color4f` represents a color using four floating-point values (RGBA), each typically ranging from 0.0 to 1.0. This allows for much higher precision than traditional 8-bit integers.

### Constructors

- `new Color4f(r, g, b, a)`
- `new Color4f(r, g, b)`: Opaque color (alpha = 1.0).
- `new Color4f(int color)`: Converts a standard ARGB 8888 integer to float components.

### Methods

- `toColor()`: Converts back to an ARGB 8888 integer.
- `makeLerp(other, weight)`: Linearly interpolates between two colors.

### Example

```java
Color4f red = new Color4f(1f, 0f, 0f, 1f);
Color4f halfTransparentBlue = new Color4f(0f, 0f, 1f, 0.5f);

// Usage in Paint
Paint paint = new Paint().setColor4f(red, ColorSpace.getSRGB());
```

---

## ColorType

`ColorType` describes how bits are arranged in a pixel (e.g., channel order and bit depth).

### Common Types

- `RGBA_8888`: 8 bits per channel, red first.
- `BGRA_8888`: 8 bits per channel, blue first (common on Windows).
- `N32`: Native 32-bit format for the current platform (usually maps to RGBA or BGRA).
- `F16`: 16-bit half-float per channel (High Dynamic Range).
- `GRAY_8`: single 8-bit channel for grayscale.
- `ALPHA_8`: single 8-bit channel for transparency masks.

---

## ColorAlphaType

`ColorAlphaType` describes how the alpha channel should be interpreted.

- `OPAQUE`: All pixels are fully opaque; alpha channel is ignored.
- `PREMUL`: Color components are multiplied by alpha (Standard for Skia performance).
- `UNPREMUL`: Color components are independent of alpha.

---

## ColorSpace

`ColorSpace` defines the range (gamut) and linearity of colors.

### Common Color Spaces

- `ColorSpace.getSRGB()`: The standard color space for web and most monitors.
- `ColorSpace.getSRGBLinear()`: sRGB with a linear transfer function (useful for math/blending).
- `ColorSpace.getDisplayP3()`: Wide gamut color space used by modern Apple devices.

### Methods

- `isSRGB()`: Returns true if the space is sRGB.
- `isGammaLinear()`: Returns true if the transfer function is linear.
- `convert(to, color)`: Converts a `Color4f` from this space to another.

### Usage Example

```java
// Creating an ImageInfo with specific encoding
ImageInfo info = new ImageInfo(
    800, 600, 
    ColorType.N32, 
    ColorAlphaType.PREMUL, 
    ColorSpace.getSRGB()
);
``` 