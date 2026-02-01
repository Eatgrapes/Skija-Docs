# Referencia de API: RuntimeEffect y SkSL

`RuntimeEffect` es la puerta de entrada a **SkSL** (Skia Shading Language), un lenguaje potente que te permite escribir sombreadores de fragmentos personalizados que se ejecutan directamente en la GPU.

## Aprendiendo SkSL

SkSL es muy similar a GLSL pero optimizado para portabilidad en todos los backends de Skia.

- **[Documentación Oficial de SkSL](https://skia.org/docs/user/sksl/)**: La guía definitiva de sintaxis y características de SkSL.
- **[Skia Fiddle](https://fiddle.skia.org/)**: Un entorno interactivo donde puedes escribir y probar código SkSL en tu navegador.
- **[The Book of Shaders](https://thebookofshaders.com/)**: Aunque está escrito para GLSL, los conceptos y la mayor parte del código son directamente aplicables a SkSL.

## Cargando Scripts SkSL

Si bien *puedes* codificar SkSL como cadenas en Java, es mucho mejor mantener tus sombreadores en archivos `.sksl` separados para un mejor resaltado de sintaxis y mantenibilidad.

### Patrón Recomendado

```java
public class ShaderLoader {
    public static Shader loadShader(String path) throws IOException {
        String sksl = Files.readString(Path.of(path));
        RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
        return effect.makeShader(null);
    }
}
```

## Escribiendo SkSL

Un sombreador SkSL debe tener una función `main`.

```glsl
// my_shader.sksl
uniform float iTime;
uniform vec2  iResolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    return vec4(uv.x, uv.y, sin(iTime) * 0.5 + 0.5, 1.0);
}
```

## Consideraciones Clave

### Coordenadas
El `fragCoord` pasado a `main` está en **coordenadas locales del lienzo**. Si necesitas UVs normalizadas (0.0 a 1.0), debes pasar la resolución como un uniforme y dividir las coordenadas tú mismo.

### Precisión
- `float`: punto flotante de 32 bits.
- `half`: punto flotante de 16 bits. Usa `half` para colores y efectos simples para mejorar el rendimiento en GPUs móviles.

### Alfa Premultiplicado
Skia espera que los sombreadores devuelvan colores en formato **alfa premultiplicado**. Si devuelves un alfa menor que 1.0, debes multiplicar los componentes R, G y B por ese valor alfa.

```glsl
vec4 main(vec2 p) {
    float alpha = 0.5;
    vec3 color = vec3(1.0, 0.0, 0.0); // Rojo
    return vec4(color * alpha, alpha); // Alfa Premultiplicado Correcto
}
```

## Animando Sombreadores (Uniforms)

Para animar un sombreador, declaras variables `uniform` en tu código SkSL y las actualizas desde Java en cada fotograma.

### 1. Código SkSL
```glsl
// rainbow.sksl
uniform float iTime;
uniform float iWidth;
uniform float iHeight;

vec4 main(vec2 fragCoord) {
    // Normalizar coordenadas a 0..1
    vec2 uv = fragCoord / vec2(iWidth, iHeight);
    
    // Crear un patrón de arcoíris en movimiento
    float r = sin(uv.x * 6.28 + iTime) * 0.5 + 0.5;
    float g = sin(uv.y * 6.28 + iTime + 2.0) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 6.28 + iTime + 4.0) * 0.5 + 0.5;
    
    return vec4(r, g, b, 1.0);
}
```

### 2. Código Java
Usas `Data` o `ByteBuffer` para pasar valores uniformes. El orden debe coincidir con el orden de declaración en SkSL.

```java
// Compilar el efecto una vez
RuntimeEffect effect = RuntimeEffect.makeForShader(skslCode);

// En tu bucle de animación:
long now = System.nanoTime();
float time = (now - startTime) / 1e9f;

// Crear un búfer para uniforms: 3 floats * 4 bytes = 12 bytes
// Skija espera orden de bytes Little Endian para uniforms
try (Data uniforms = Data.makeFromBytes(ByteBuffer.allocate(12)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putFloat(time)          // iTime
        .putFloat(500f)          // iWidth
        .putFloat(500f)          // iHeight
        .array())) 
{
    // Crear un nuevo sombreador con uniforms actualizados
    try (Shader shader = effect.makeShader(uniforms, null, null)) {
        Paint p = new Paint().setShader(shader);
        canvas.drawPaint(p); // Llenar la pantalla
    }
}
```

## RuntimeEffectBuilder

Empaquetar manualmente arreglos de bytes para uniforms puede ser propenso a errores. `RuntimeEffectBuilder` simplifica esto permitiéndote establecer uniforms por nombre.

```java
RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
RuntimeEffectBuilder builder = new RuntimeEffectBuilder(effect);

// Establecer uniforms por nombre (tipado seguro)
builder.setUniform("iTime", 1.5f);
builder.setUniform("iResolution", 800f, 600f);
builder.setUniform("iColor", new float[] { 1, 0, 0, 1 }); // vec4

// Crear Shader/ColorFilter/Blender
Shader shader = builder.makeShader();
```