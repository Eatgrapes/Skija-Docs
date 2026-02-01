# API Reference: Effects (Filters)

Skija provides three types of filters that can be applied via `Paint`: **MaskFilter**, **ColorFilter**, and **ImageFilter**. Understanding the difference is key to achieving the desired visual effect.

## 1. MaskFilter
**Alpha-channel modification.** Affects the mask (geometry) before it's colorized. It only sees the alpha values.

### Gaussian Blur
The most common use is to create soft edges or simple glows.

```java
// Sigma is roughly 1/3 of the blur radius
MaskFilter blur = MaskFilter.makeBlur(FilterBlurMode.NORMAL, 5.0f);
paint.setMaskFilter(blur);
```

**Modes:**
- `NORMAL`: Blurs inside and outside.
- `SOLID`: Keeps the original shape opaque, blurs only outside.
- `OUTER`: Only the blurred part outside the shape.
- `INNER`: Only the blurred part inside the shape.

---

## 2. ColorFilter
**Color-space modification.** Transforms the color of each pixel independently.

### Color Matrix
Useful for grayscale, sepia, or color shifting.

```java
ColorFilter grayscale = ColorFilter.makeMatrix(ColorMatrix.grayscale());
paint.setColorFilter(grayscale);
```

### Blend Mode Color Filter
Tints everything with a specific color.

```java
ColorFilter tint = ColorFilter.makeBlend(0xFF4285F4, BlendMode.SRC_ATOP);
```

---

## 3. ImageFilter (Pixel Effects)

`ImageFilter` operates on the pixels of the drawing (or its background). They are commonly used for blurs, shadows, and lighting effects.

### Basic Filters
- `makeBlur(sigmaX, sigmaY, tileMode)`: Gaussian blur.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: Draws content + shadow.
- `makeDropShadowOnly(...)`: Draws only the shadow (no content).
- `makeDilate(rx, ry)`: Expands bright areas (morphology).
- `makeErode(rx, ry)`: Expands dark areas (morphology).
- `makeOffset(dx, dy)`: Shifts the content.
- `makeTile(src, dst)`: Tiles the content.

### Composition
- `makeCompose(outer, inner)`: Applies `inner` filter, then `outer`.
- `makeMerge(filters)`: Combines results of multiple filters (e.g., drawing several shadows).
- `makeBlend(mode, bg, fg)`: Blends two filters using a `BlendMode`.
- `makeArithmetic(k1, k2, k3, k4, bg, fg)`: Custom pixel combination: `k1*fg*bg + k2*fg + k3*bg + k4`.

### Color & Shaders
- `makeColorFilter(cf, input)`: Applies a `ColorFilter` to the image filter result.
- `makeShader(shader)`: Fills the filter region with a `Shader` (e.g., gradient or noise).
- `makeRuntimeShader(builder, ...)`: Uses a custom SkSL shader as an image filter.

### Lighting (Material Design)
Simulates light reflecting off a surface defined by the alpha channel (alpha = height).
- `makeDistantLitDiffuse(...)`
- `makePointLitDiffuse(...)`
- `makeSpotLitDiffuse(...)`
- `makeDistantLitSpecular(...)`
- `makePointLitSpecular(...)`
- `makeSpotLitSpecular(...)`

### Example: Frosted Glass (Background Blur)
To blur what's *behind* a layer, use `Canvas.saveLayer` with a backdrop filter.

```java
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
// The 'paint' argument is null (no alpha/blending for layer itself)
// The 'backdrop' argument is the blur filter
canvas.saveLayer(new SaveLayerRec(null, null, blur));
    canvas.drawRect(rect, new Paint().setColor(0x40FFFFFF)); // Semi-transparent white
canvas.restore();
```

## Summary Comparison

| Filter Type | Affects | Common Usage |
| :--- | :--- | :--- |
| **MaskFilter** | Alpha only | Simple blurs, glows |
| **ColorFilter** | Pixel Color | Grayscale, tints, contrast |
| **ImageFilter** | Entire Pixel | Drop shadows, complex blurs, composition |

## 4. Blender (Advanced Blending)

While `BlendMode` provides standard Porter-Duff blending (like `SRC_OVER`, `MULTIPLY`), the `Blender` class allows for programmable custom blending.

You assign a blender to a paint using `paint.setBlender(blender)`.

### Arithmetic Blender
This allows you to define a linear combination of source and destination pixels:
`result = k1 * src * dst + k2 * src + k3 * dst + k4`

```java
// Example: Linear Dodge (Add) can be approximated
Blender b = Blender.makeArithmetic(0, 1, 1, 0, false);
paint.setBlender(b);
```

### Runtime Blender (SkSL)
You can write your own blend function in SkSL! The shader receives `src` and `dst` colors and must return the result.

```java
String sksl = "vec4 main(vec4 src, vec4 dst) {" +
              "  return src * dst;" + // Simple Multiply
              "}";
RuntimeEffect effect = RuntimeEffect.makeForBlender(sksl);
Blender myBlender = effect.makeBlender(null);
paint.setBlender(myBlender);
```

## 5. PathEffect (Stroke Modifiers)

`PathEffect` modifies the geometry of a path *before* it is drawn (stroked or filled). It is commonly used for dashed lines, rounded corners, or organic roughness.

### Creation Methods

**1. Discrete (Roughness)**
Breaks the path into segments and randomly displaces them.
- `makeDiscrete(segLength, dev, seed)`:
    - `segLength`: Length of segments.
    - `dev`: Maximum deviation (jitter).
    - `seed`: Random seed.

```java
PathEffect rough = PathEffect.makeDiscrete(10f, 4f, 0);
paint.setPathEffect(rough);
```

**2. Corner (Rounding)**
Rounds off sharp corners.
- `makeCorner(radius)`: Radius of the rounded corner.

```java
PathEffect round = PathEffect.makeCorner(20f);
```

**3. Dash (Dashed Lines)**
Creates dashed or dotted lines.
- `makeDash(intervals, phase)`:
    - `intervals`: Array of on/off lengths (must be even length).
    - `phase`: Offset into the intervals.

```java
// 10px ON, 5px OFF
PathEffect dash = PathEffect.makeDash(new float[] { 10f, 5f }, 0f);
```

**4. Path1D (Stamp Path)**
Stamps a shape along the path (like a brush).
- `makePath1D(path, advance, phase, style)`

```java
Path shape = new Path().addCircle(0, 0, 3);
PathEffect dots = PathEffect.makePath1D(shape, 10f, 0f, PathEffect1DStyle.TRANSLATE);
```

**5. Path2D (Matrix)**
Transforms the path geometry by a matrix.
- `makePath2D(matrix, path)`

**6. Line2D**
- `makeLine2D(width, matrix)`

### Composition

You can combine multiple path effects.

- `makeSum(second)`: Draws *both* effects (e.g., fill + stroke).
- `makeCompose(inner)`: Applies `inner` first, then `this` (e.g., rough outline -> dashed).

```java
PathEffect dashed = PathEffect.makeDash(new float[] {10, 5}, 0);
PathEffect corner = PathEffect.makeCorner(10);

// Round the corners, THEN dash the line
PathEffect composed = dashed.makeCompose(corner);
```


