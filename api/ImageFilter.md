# API Reference: ImageFilter

`ImageFilter` objects are used to apply image-level effects during drawing, such as blurs, shadows, or color transformations. They are applied to a [`Paint`](Paint.md) via `setImageFilter()`.

## Static Factories

### Common Effects

- `makeBlur(sigmaX, sigmaY, tileMode)`: Creates a Gaussian blur.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: Creates a drop shadow.
- `makeDropShadowOnly(dx, dy, sigmaX, sigmaY, color)`: Renders only the shadow.
- `makeColorFilter(colorFilter, input)`: Applies a [`ColorFilter`](Effects.md#color-filters) to an image.

### Combination & Composition

- `makeCompose(outer, inner)`: Chains two filters together.
- `makeMerge(filters[])`: Merges multiple filters using SrcOver blending.
- `makeArithmetic(k1, k2, k3, k4, enforcePM, bg, fg)`: Combines two inputs using an arithmetic formula.
- `makeBlend(blendMode, bg, fg)`: Blends two inputs using a [`BlendMode`](#).

### Geometric & Sampling

- `makeOffset(dx, dy, input)`: Shifts the input by an offset.
- `makeMatrixTransform(matrix, sampling, input)`: Applies a matrix transformation.
- `makeCrop(rect, tileMode, input)`: Crops the input filter.
- `makeTile(src, dst, input)`: Tiles the source region into the destination.

### Advanced

- `makeRuntimeShader(builder, childName, input)`: Applies a custom [SkSL](runtime-effect.md) shader as a filter.
- `makeDisplacementMap(xChan, yChan, scale, displacement, color)`: Displaces pixels based on another image.
- `makeMatrixConvolution(...)`: Applies an NxM convolution kernel.
- `makeLighting(...)`: Various lighting filters (Distant, Point, Spot).

## Usage

```java
Paint paint = new Paint()
    .setImageFilter(ImageFilter.makeBlur(5f, 5f, FilterTileMode.CLAMP));

canvas.drawRect(Rect.makeWH(100, 100), paint);
``` 