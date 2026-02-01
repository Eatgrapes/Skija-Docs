# API Reference: SamplingMode

`SamplingMode` is an interface that defines how pixels are sampled when an image is scaled, rotated, or transformed.

## Implementations

There are three main ways to specify sampling in Skija:

1.  **[`FilterMipmap`](#filtermipmap)**: Standard linear/nearest filtering with optional mipmaps.
2.  **[`CubicResampler`](CubicResampler.md)**: High-quality bicubic interpolation (Mitchell, Catmull-Rom).
3.  **`SamplingModeAnisotropic`**: High-quality filtering for textures viewed at sharp angles.

## Common Presets

- `SamplingMode.DEFAULT`: Nearest neighbor filtering (fastest, blocky).
- `SamplingMode.LINEAR`: Bilinear filtering (smooth, default for most uses).
- `SamplingMode.MITCHELL`: High-quality bicubic (smooth and sharp).
- `SamplingMode.CATMULL_ROM`: Very sharp bicubic.

## FilterMipmap

This is the most common sampling mode. It uses two parameters:

### FilterMode
- `NEAREST`: Samples the single closest pixel.
- `LINEAR`: Interpolates between the 4 closest pixels.

### MipmapMode
- `NONE`: No mipmaps used.
- `NEAREST`: Samples from the closest mipmap level.
- `LINEAR`: Interpolates between two mipmap levels (Trilinear filtering).

## Usage

```java
// Bilinear sampling
canvas.drawImage(img, 0, 0, SamplingMode.LINEAR, null);

// Nearest neighbor (pixel art style)
canvas.drawImage(img, 0, 0, SamplingMode.DEFAULT, null);

// High-quality bicubic
canvas.drawImage(img, 0, 0, CubicResampler.MITCHELL, null);
```
