# API 參考：RuntimeEffect 與 SkSL

`RuntimeEffect` 是通往 **SkSL**（Skia 著色語言）的入口，這是一種強大的語言，允許你編寫直接在 GPU 上運行的自定義片段著色器。

## 學習 SkSL

SkSL 與 GLSL 非常相似，但針對所有 Skia 後端的可移植性進行了優化。

- **[官方 SkSL 文檔](https://skia.org/docs/user/sksl/)**: SkSL 語法和功能的權威指南。
- **[Skia Fiddle](https://fiddle.skia.org/)**: 一個互動式遊樂場，你可以在瀏覽器中編寫和測試 SkSL 代碼。
- **[The Book of Shaders](https://thebookofshaders.com/)**: 雖然是為 GLSL 編寫的，但其概念和大部分代碼可直接應用於 SkSL。

## 載入 SkSL 腳本

雖然你*可以*在 Java 中將 SkSL 硬編碼為字符串，但為了更好的語法高亮和可維護性，最好將著色器保存在單獨的 `.sksl` 文件中。

### 推薦模式

```java
public class ShaderLoader {
    public static Shader loadShader(String path) throws IOException {
        String sksl = Files.readString(Path.of(path));
        RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
        return effect.makeShader(null);
    }
}
```

## 編寫 SkSL

著色器 SkSL 必須有一個 `main` 函數。

```glsl
// my_shader.sksl
uniform float iTime;
uniform vec2  iResolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    return vec4(uv.x, uv.y, sin(iTime) * 0.5 + 0.5, 1.0);
}
```

## 關鍵注意事項

### 座標系
傳遞給 `main` 的 `fragCoord` 是**局部畫布座標**。如果你需要歸一化的 UV（0.0 到 1.0），你應該將分辨率作為 uniform 傳入，並自行對座標進行除法運算。

### 精度
- `float`: 32 位浮點數。
- `half`: 16 位浮點數。對於顏色和簡單效果，使用 `half` 以提高移動 GPU 上的性能。

### 預乘 Alpha
Skia 期望著色器返回**預乘 Alpha** 格式的顏色。如果你返回的 alpha 值小於 1.0，則必須將 R、G 和 B 分量乘以該 alpha 值。

```glsl
vec4 main(vec2 p) {
    float alpha = 0.5;
    vec3 color = vec3(1.0, 0.0, 0.0); // 紅色
    return vec4(color * alpha, alpha); // 正確的預乘 Alpha
}
```

## 動畫著色器（Uniforms）

要為著色器添加動畫，你需要在 SkSL 代碼中聲明 `uniform` 變量，並在 Java 中每幀更新它們。

### 1. SkSL 代碼
```glsl
// rainbow.sksl
uniform float iTime;
uniform float iWidth;
uniform float iHeight;

vec4 main(vec2 fragCoord) {
    // 將座標歸一化到 0..1
    vec2 uv = fragCoord / vec2(iWidth, iHeight);
    
    // 創建移動的彩虹圖案
    float r = sin(uv.x * 6.28 + iTime) * 0.5 + 0.5;
    float g = sin(uv.y * 6.28 + iTime + 2.0) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 6.28 + iTime + 4.0) * 0.5 + 0.5;
    
    return vec4(r, g, b, 1.0);
}
```

### 2. Java 代碼
你使用 `Data` 或 `ByteBuffer` 來傳遞 uniform 值。順序必須與 SkSL 中的聲明順序匹配。

```java
// 編譯 effect 一次
RuntimeEffect effect = RuntimeEffect.makeForShader(skslCode);

// 在你的動畫循環中：
long now = System.nanoTime();
float time = (now - startTime) / 1e9f;

// 為 uniforms 創建緩衝區：3 個浮點數 * 4 字節 = 12 字節
// Skija 期望 uniforms 使用小端字節序
try (Data uniforms = Data.makeFromBytes(ByteBuffer.allocate(12)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putFloat(time)          // iTime
        .putFloat(500f)          // iWidth
        .putFloat(500f)          // iHeight
        .array())) 
{
    // 使用更新的 uniforms 創建新的著色器
    try (Shader shader = effect.makeShader(uniforms, null, null)) {
        Paint p = new Paint().setShader(shader);
        canvas.drawPaint(p); // 填充屏幕
    }
}
```

## RuntimeEffectBuilder

手動打包 uniform 的字節數組容易出錯。`RuntimeEffectBuilder` 通過允許你按名稱設置 uniforms 來簡化此過程。

```java
RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
RuntimeEffectBuilder builder = new RuntimeEffectBuilder(effect);

// 按名稱設置 uniforms（類型安全）
builder.setUniform("iTime", 1.5f);
builder.setUniform("iResolution", 800f, 600f);
builder.setUniform("iColor", new float[] { 1, 0, 0, 1 }); // vec4

// 創建 Shader/ColorFilter/Blender
Shader shader = builder.makeShader();
```