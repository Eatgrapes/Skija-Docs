# API Reference: CubicResampler

`CubicResampler` is a type of [`SamplingMode`](SamplingMode.md) used for high-quality image scaling using bicubic interpolation.

## Overview

A cubic resampler is defined by two parameters, **B** and **C**, which control the shape of the cubic filter. Different values result in different characteristics (sharpness, ringing, etc.).

## Constants

`CubicResampler` provides two commonly used presets:

- `CubicResampler.MITCHELL`: (B=1/3, C=1/3). A good balance between sharpness and artifacts.
- `CubicResampler.CATMULL_ROM`: (B=0, C=1/2). Sharper than Mitchell, often used for downscaling.

## Parameters

- **B (Blur)**: Controls the "blurriness" of the filter.
- **C (Ringing)**: Controls the "ringing" or "halos" around edges.

## Usage

```java
// Use Mitchell resampler for high-quality scaling
canvas.drawImageRect(image, dstRect, CubicResampler.MITCHELL, null);

// Custom resampler
CubicResampler custom = new CubicResampler(0.2f, 0.4f);
canvas.drawImageRect(image, dstRect, custom, paint);
```

## References

- "Reconstruction Filters in Computer Graphics" (Mitchell & Netravali, 1988).
- [Bicubic Filtering Overview](https://entropymine.com/imageworsener/bicubic/)
