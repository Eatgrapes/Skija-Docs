# API-Referenz: RuntimeEffect & SkSL

`RuntimeEffect` ist der Zugang zu **SkSL** (Skia Shading Language), einer leistungsstarken Sprache, mit der Sie benutzerdefinierte Fragment-Shader schreiben können, die direkt auf der GPU laufen.

## SkSL lernen

SkSL ist GLSL sehr ähnlich, aber für Portabilität über alle Skia-Backends optimiert.

- **[Offizielle SkSL-Dokumentation](https://skia.org/docs/user/sksl/)**: Der maßgebliche Leitfaden zur SkSL-Syntax und ihren Funktionen.
- **[Skia Fiddle](https://fiddle.skia.org/)**: Ein interaktiver Spielplatz, auf dem Sie SkSL-Code in Ihrem Browser schreiben und testen können.
- **[The Book of Shaders](https://thebookofshaders.com/)**: Obwohl für GLSL geschrieben, sind die Konzepte und der größte Teil des Codes direkt auf SkSL übertragbar.

## SkSL-Skripte laden

Während Sie SkSL *als* Strings in Java hartkodieren *können*, ist es viel besser, Ihre Shader in separaten `.sksl`-Dateien zu halten, um Syntax-Highlighting und Wartbarkeit zu verbessern.

### Empfohlenes Muster

```java
public class ShaderLoader {
    public static Shader loadShader(String path) throws IOException {
        String sksl = Files.readString(Path.of(path));
        RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
        return effect.makeShader(null);
    }
}
```

## SkSL schreiben

Ein Shader-SkSL muss eine `main`-Funktion haben.

```glsl
// my_shader.sksl
uniform float iTime;
uniform vec2  iResolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    return vec4(uv.x, uv.y, sin(iTime) * 0.5 + 0.5, 1.0);
}
```

## Wichtige Überlegungen

### Koordinaten
Das an `main` übergebene `fragCoord` befindet sich in **lokalen Canvas-Koordinaten**. Wenn Sie normalisierte UVs (0.0 bis 1.0) benötigen, sollten Sie die Auflösung als Uniform übergeben und die Koordinaten selbst teilen.

### Präzision
- `float`: 32-Bit-Gleitkommazahl.
- `half`: 16-Bit-Gleitkommazahl. Verwenden Sie `half` für Farben und einfache Effekte, um die Leistung auf mobilen GPUs zu verbessern.

### Premultiplied Alpha
Skia erwartet, dass Shader Farben im **Premultiplied Alpha**-Format zurückgeben. Wenn Sie einen Alpha-Wert kleiner als 1.0 zurückgeben, müssen Sie die R-, G- und B-Komponenten mit diesem Alpha-Wert multiplizieren.

```glsl
vec4 main(vec2 p) {
    float alpha = 0.5;
    vec3 color = vec3(1.0, 0.0, 0.0); // Rot
    return vec4(color * alpha, alpha); // Korrektes Premultiplied Alpha
}
```

## Shader animieren (Uniforms)

Um einen Shader zu animieren, deklarieren Sie `uniform`-Variablen in Ihrem SkSL-Code und aktualisieren sie von Java aus in jedem Frame.

### 1. SkSL-Code
```glsl
// rainbow.sksl
uniform float iTime;
uniform float iWidth;
uniform float iHeight;

vec4 main(vec2 fragCoord) {
    // Koordinaten auf 0..1 normalisieren
    vec2 uv = fragCoord / vec2(iWidth, iHeight);
    
    // Ein sich bewegendes Regenbogenmuster erstellen
    float r = sin(uv.x * 6.28 + iTime) * 0.5 + 0.5;
    float g = sin(uv.y * 6.28 + iTime + 2.0) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 6.28 + iTime + 4.0) * 0.5 + 0.5;
    
    return vec4(r, g, b, 1.0);
}
```

### 2. Java-Code
Sie verwenden `Data` oder `ByteBuffer`, um Uniform-Werte zu übergeben. Die Reihenfolge muss der Deklarationsreihenfolge in SkSL entsprechen.

```java
// Effekt einmal kompilieren
RuntimeEffect effect = RuntimeEffect.makeForShader(skslCode);

// In Ihrer Animationsschleife:
long now = System.nanoTime();
float time = (now - startTime) / 1e9f;

// Einen Puffer für Uniforms erstellen: 3 floats * 4 bytes = 12 bytes
// Skija erwartet Little Endian Byte-Reihenfolge für Uniforms
try (Data uniforms = Data.makeFromBytes(ByteBuffer.allocate(12)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putFloat(time)          // iTime
        .putFloat(500f)          // iWidth
        .putFloat(500f)          // iHeight
        .array())) 
{
    // Einen neuen Shader mit aktualisierten Uniforms erstellen
    try (Shader shader = effect.makeShader(uniforms, null, null)) {
        Paint p = new Paint().setShader(shader);
        canvas.drawPaint(p); // Den Bildschirm füllen
    }
}
```

## RuntimeEffectBuilder

Das manuelle Packen von Byte-Arrays für Uniforms kann fehleranfällig sein. `RuntimeEffectBuilder` vereinfacht dies, indem es Ihnen erlaubt, Uniforms per Namen zu setzen.

```java
RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
RuntimeEffectBuilder builder = new RuntimeEffectBuilder(effect);

// Uniforms per Namen setzen (typsicher)
builder.setUniform("iTime", 1.5f);
builder.setUniform("iResolution", 800f, 600f);
builder.setUniform("iColor", new float[] { 1, 0, 0, 1 }); // vec4

// Shader/ColorFilter/Blender erstellen
Shader shader = builder.makeShader();
```