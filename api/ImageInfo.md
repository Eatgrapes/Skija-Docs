# API Reference: ImageInfo

`ImageInfo` describes pixel dimensions and encoding. It is used to create and describe the memory layout of surfaces, images, and bitmaps.

## Constructors & Factories

- `new ImageInfo(width, height, colorType, alphaType)`
- `new ImageInfo(width, height, colorType, alphaType, colorSpace)`
- `makeN32(width, height, alphaType)`: Platform-default 32-bit color type.
- `makeS32(width, height, alphaType)`: N32 with sRGB color space.
- `makeN32Premul(width, height)`: N32 with Premultiplied alpha.
- `makeA8(width, height)`: 8-bit alpha only.

## Methods

- `getWidth()` / `getHeight()`: Pixel dimensions.
- `getColorType()`: Pixel format (e.g., `RGBA_8888`).
- `getColorAlphaType()`: Alpha encoding (`PREMUL`, `UNPREMUL`, `OPAQUE`).
- `getColorSpace()`: Color range and linearity.
- `getBounds()`: Returns an `IRect` from (0,0) to (width, height).
- `getBytesPerPixel()`: Number of bytes for one pixel.
- `getMinRowBytes()`: Minimum bytes required for one row of pixels.
- `isEmpty()`: Returns `true` if width or height is <= 0.

## Functional Modification

`ImageInfo` is immutable. Use these methods to create modified copies:

- `withWidthHeight(w, h)`
- `withColorType(type)`
- `withColorAlphaType(type)`
- `withColorSpace(cs)` 