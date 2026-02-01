# API 参考：RuntimeEffect 与 SkSL

`RuntimeEffect` 是通往 **SkSL**（Skia 着色语言）的入口，这是一种强大的语言，允许你编写直接在 GPU 上运行的自定义片段着色器。

## 学习 SkSL

SkSL 与 GLSL 非常相似，但针对所有 Skia 后端的可移植性进行了优化。

- **[官方 SkSL 文档](https://skia.org/docs/user/sksl/)**: SkSL 语法和功能的权威指南。
- **[Skia Fiddle](https://fiddle.skia.org/)**: 一个交互式游乐场，你可以在浏览器中编写和测试 SkSL 代码。
- **[The Book of Shaders](https://thebookofshaders.com/)**: 虽然是为 GLSL 编写的，但其概念和大部分代码都直接适用于 SkSL。

## 加载 SkSL 脚本

虽然你*可以*在 Java 中将 SkSL 硬编码为字符串，但为了更好的语法高亮和可维护性，最好将着色器保存在单独的 `.sksl` 文件中。

### 推荐模式

```java
public class ShaderLoader {
    public static Shader loadShader(String path) throws IOException {
        String sksl = Files.readString(Path.of(path));
        RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
        return effect.makeShader(null);
    }
}
```

## 编写 SkSL

着色器 SkSL 必须有一个 `main` 函数。

```glsl
// my_shader.sksl
uniform float iTime;
uniform vec2  iResolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    return vec4(uv.x, uv.y, sin(iTime) * 0.5 + 0.5, 1.0);
}
```

## 关键注意事项

### 坐标
传递给 `main` 的 `fragCoord` 是**本地画布坐标**。如果你需要归一化的 UV（0.0 到 1.0），你应该将分辨率作为 uniform 传递，并自行对坐标进行除法运算。

### 精度
- `float`: 32 位浮点数。
- `half`: 16 位浮点数。对于颜色和简单效果，使用 `half` 可以提高移动 GPU 上的性能。

### 预乘 Alpha
Skia 期望着色器返回**预乘 Alpha** 格式的颜色。如果你返回的 alpha 值小于 1.0，则必须将 R、G 和 B 分量乘以该 alpha 值。

```glsl
vec4 main(vec2 p) {
    float alpha = 0.5;
    vec3 color = vec3(1.0, 0.0, 0.0); // 红色
    return vec4(color * alpha, alpha); // 正确的预乘 Alpha
}
```

## 着色器动画（Uniforms）

要为着色器添加动画效果，你需要在 SkSL 代码中声明 `uniform` 变量，并在每一帧从 Java 更新它们。

### 1. SkSL 代码
```glsl
// rainbow.sksl
uniform float iTime;
uniform float iWidth;
uniform float iHeight;

vec4 main(vec2 fragCoord) {
    // 将坐标归一化到 0..1
    vec2 uv = fragCoord / vec2(iWidth, iHeight);
    
    // 创建移动的彩虹图案
    float r = sin(uv.x * 6.28 + iTime) * 0.5 + 0.5;
    float g = sin(uv.y * 6.28 + iTime + 2.0) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 6.28 + iTime + 4.0) * 0.5 + 0.5;
    
    return vec4(r, g, b, 1.0);
}
```

### 2. Java 代码
使用 `Data` 或 `ByteBuffer` 传递 uniform 值。顺序必须与 SkSL 中的声明顺序匹配。

```java
// 编译一次效果
RuntimeEffect effect = RuntimeEffect.makeForShader(skslCode);

// 在你的动画循环中：
long now = System.nanoTime();
float time = (now - startTime) / 1e9f;

// 为 uniforms 创建缓冲区：3 个浮点数 * 4 字节 = 12 字节
// Skija 期望 uniforms 使用小端字节序
try (Data uniforms = Data.makeFromBytes(ByteBuffer.allocate(12)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putFloat(time)          // iTime
        .putFloat(500f)          // iWidth
        .putFloat(500f)          // iHeight
        .array())) 
{
    // 使用更新的 uniforms 创建新的着色器
    try (Shader shader = effect.makeShader(uniforms, null, null)) {
        Paint p = new Paint().setShader(shader);
        canvas.drawPaint(p); // 填充屏幕
    }
}
```

## RuntimeEffectBuilder

手动打包字节数组来传递 uniforms 容易出错。`RuntimeEffectBuilder` 通过允许你按名称设置 uniforms 来简化此过程。

```java
RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
RuntimeEffectBuilder builder = new RuntimeEffectBuilder(effect);

// 按名称设置 uniforms（类型安全）
builder.setUniform("iTime", 1.5f);
builder.setUniform("iResolution", 800f, 600f);
builder.setUniform("iColor", new float[] { 1, 0, 0, 1 }); // vec4

// 创建 Shader/ColorFilter/Blender
Shader shader = builder.makeShader();
```