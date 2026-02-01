# API Reference: RuntimeEffect & SkSL

`RuntimeEffect` is the gateway to **SkSL** (Skia Shading Language), a powerful language that allows you to write custom fragment shaders that run directly on the GPU.

## Learning SkSL

SkSL is very similar to GLSL but optimized for portability across all Skia backends.

- **[Official SkSL Documentation](https://skia.org/docs/user/sksl/)**: The definitive guide to SkSL syntax and features.
- **[Skia Fiddle](https://fiddle.skia.org/)**: An interactive playground where you can write and test SkSL code in your browser.
- **[The Book of Shaders](https://thebookofshaders.com/)**: While written for GLSL, the concepts and most of the code are directly applicable to SkSL.

## Loading SkSL Scripts

While you *can* hardcode SkSL as strings in Java, it is much better to keep your shaders in separate `.sksl` files for better syntax highlighting and maintainability.

### Recommended Pattern

```java
public class ShaderLoader {
    public static Shader loadShader(String path) throws IOException {
        String sksl = Files.readString(Path.of(path));
        RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
        return effect.makeShader(null);
    }
}
```

## Writing SkSL

A shader SkSL must have a `main` function.

```glsl
// my_shader.sksl
uniform float iTime;
uniform vec2  iResolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    return vec4(uv.x, uv.y, sin(iTime) * 0.5 + 0.5, 1.0);
}
```

## Key Considerations

### Coordinates
The `fragCoord` passed to `main` is in **local canvas coordinates**. If you need normalized UVs (0.0 to 1.0), you should pass the resolution as a uniform and divide the coordinates yourself.

### Precision
- `float`: 32-bit floating point.
- `half`: 16-bit floating point. Use `half` for colors and simple effects to improve performance on mobile GPUs.

### Premultiplied Alpha
Skia expects shaders to return colors in **premultiplied alpha** format. If you return an alpha less than 1.0, you must multiply the R, G, and B components by that alpha value.

```glsl
vec4 main(vec2 p) {
    float alpha = 0.5;
    vec3 color = vec3(1.0, 0.0, 0.0); // Red
    return vec4(color * alpha, alpha); // Correct Premultiplied Alpha
}
```

## Animating Shaders (Uniforms)

To animate a shader, you declare `uniform` variables in your SkSL code and update them from Java every frame.

### 1. SkSL Code
```glsl
// rainbow.sksl
uniform float iTime;
uniform float iWidth;
uniform float iHeight;

vec4 main(vec2 fragCoord) {
    // Normalize coordinates to 0..1
    vec2 uv = fragCoord / vec2(iWidth, iHeight);
    
    // Create a moving rainbow pattern
    float r = sin(uv.x * 6.28 + iTime) * 0.5 + 0.5;
    float g = sin(uv.y * 6.28 + iTime + 2.0) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 6.28 + iTime + 4.0) * 0.5 + 0.5;
    
    return vec4(r, g, b, 1.0);
}
```

### 2. Java Code
You use `Data` or `ByteBuffer` to pass uniform values. The order must match the declaration order in SkSL.

```java
// Compile the effect once
RuntimeEffect effect = RuntimeEffect.makeForShader(skslCode);

// In your animation loop:
long now = System.nanoTime();
float time = (now - startTime) / 1e9f;

// Create a buffer for uniforms: 3 floats * 4 bytes = 12 bytes
// Skija expects Little Endian byte order for uniforms
try (Data uniforms = Data.makeFromBytes(ByteBuffer.allocate(12)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putFloat(time)          // iTime
        .putFloat(500f)          // iWidth
        .putFloat(500f)          // iHeight
        .array())) 
{
    // Create a new shader with updated uniforms
    try (Shader shader = effect.makeShader(uniforms, null, null)) {
        Paint p = new Paint().setShader(shader);
        canvas.drawPaint(p); // Fill the screen
    }
}
```

## RuntimeEffectBuilder

Manually packing byte arrays for uniforms can be error-prone. `RuntimeEffectBuilder` simplifies this by allowing you to set uniforms by name.

```java
RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
RuntimeEffectBuilder builder = new RuntimeEffectBuilder(effect);

// Set uniforms by name (type safe)
builder.setUniform("iTime", 1.5f);
builder.setUniform("iResolution", 800f, 600f);
builder.setUniform("iColor", new float[] { 1, 0, 0, 1 }); // vec4

// Create Shader/ColorFilter/Blender
Shader shader = builder.makeShader();
```


