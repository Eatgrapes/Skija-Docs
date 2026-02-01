# API Reference: Shader

Shaders define the color of each pixel based on its position on the canvas. They are primarily used for gradients, patterns, and noise. Shaders are assigned to a `Paint` object via `paint.setShader(shader)`.

## Gradients

Gradients are the most common type of shaders. Skija supports several types:

### Linear Gradient
Creates a smooth transition between two points.

**Visual Example:**
See [`examples/scenes/src/ShadersScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadersScene.java) for examples of linear, radial, sweep, and conical gradients, as well as noise shaders.

```java
Shader linear = Shader.makeLinearGradient(
    0, 0, 100, 100,      // x0, y0, x1, y1
    new int[] { 0xFFFF0000, 0xFF0000FF } // Colors (Red to Blue)
);
```

### Radial Gradient
Creates a circular transition from a center point.

```java
Shader radial = Shader.makeRadialGradient(
    50, 50, 30,          // center x, y, radius
    new int[] { 0xFFFFFFFF, 0xFF000000 } // Colors (White to Black)
);
```

### Sweep Gradient
Creates a transition that sweeps around a center point (like a color wheel).

```java
Shader sweep = Shader.makeSweepGradient(
    50, 50,              // center x, y
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFFFF0000 }
);
```

### Two-Point Conical Gradient
Creates a transition between two circles (useful for 3D-like lighting or flares).

```java
Shader conical = Shader.makeTwoPointConicalGradient(
    30, 30, 10,          // start x, y, radius
    70, 70, 40,          // end x, y, radius
    new int[] { 0xFFFF0000, 0xFF0000FF }
);
```

## Noise and Patterns

### Perlin Noise
Generates textures that look like clouds, marble, or fire.

```java
// Fractal Noise
Shader noise = Shader.makeFractalNoise(
    0.05f, 0.05f,        // baseFrequencyX, baseFrequencyY
    4,                   // numOctaves
    0.0f                 // seed
);

// Turbulence
Shader turb = Shader.makeTurbulence(0.05f, 0.05f, 4, 0.0f);
```

### Image Shader
Turns an `Image` into a shader that can be tiled or used to fill shapes.

```java
// Access via Image class
Shader imageShader = image.makeShader(
    FilterTileMode.REPEAT, 
    FilterTileMode.REPEAT, 
    SamplingMode.DEFAULT
);
```

## Composition and Modification

- `Shader.makeBlend(mode, dst, src)`: Combines two shaders using a blend mode.
- `shader.makeWithLocalMatrix(matrix)`: Applies a transformation to the shader's coordinate system.
- `shader.makeWithColorFilter(filter)`: Applies a color filter to the output of the shader.

## Tile Modes (`FilterTileMode`)

When a shader (like a gradient or image) needs to fill an area larger than its defined bounds:
- `CLAMP`: Uses the edge color to fill the rest.
- `REPEAT`: Repeats the pattern.
- `MIRROR`: Repeats the pattern, mirroring it at the edges.
- `DECAL`: Renders transparency outside the bounds.
