# Справочник API: RuntimeEffect и SkSL

`RuntimeEffect` — это вход в **SkSL** (Skia Shading Language), мощный язык, позволяющий писать пользовательские фрагментные шейдеры, выполняющиеся непосредственно на GPU.

## Изучение SkSL

SkSL очень похож на GLSL, но оптимизирован для переносимости между всеми бэкендами Skia.

- **[Официальная документация SkSL](https://skia.org/docs/user/sksl/)**: Исчерпывающее руководство по синтаксису и возможностям SkSL.
- **[Skia Fiddle](https://fiddle.skia.org/)**: Интерактивная площадка, где можно писать и тестировать код SkSL прямо в браузере.
- **[The Book of Shaders](https://thebookofshaders.com/)**: Хотя книга написана для GLSL, концепции и большая часть кода применимы к SkSL напрямую.

## Загрузка скриптов SkSL

Хотя вы *можете* встраивать SkSL в виде строк в Java, гораздо лучше хранить шейдеры в отдельных файлах `.sksl` для лучшей подсветки синтаксиса и удобства поддержки.

### Рекомендуемый подход

```java
public class ShaderLoader {
    public static Shader loadShader(String path) throws IOException {
        String sksl = Files.readString(Path.of(path));
        RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
        return effect.makeShader(null);
    }
}
```

## Написание кода на SkSL

Шейдер на SkSL должен содержать функцию `main`.

```glsl
// my_shader.sksl
uniform float iTime;
uniform vec2  iResolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    return vec4(uv.x, uv.y, sin(iTime) * 0.5 + 0.5, 1.0);
}
```

## Ключевые моменты

### Координаты
`fragCoord`, передаваемый в `main`, находится в **локальных координатах холста**. Если вам нужны нормализованные UV-координаты (от 0.0 до 1.0), вы должны передать разрешение как uniform и разделить координаты самостоятельно.

### Точность
- `float`: 32-битное число с плавающей запятой.
- `half`: 16-битное число с плавающей запятой. Используйте `half` для цветов и простых эффектов, чтобы повысить производительность на мобильных GPU.

### Предумноженная альфа (Premultiplied Alpha)
Skia ожидает, что шейдеры возвращают цвета в формате **предумноженной альфы**. Если вы возвращаете альфа-значение меньше 1.0, вы должны умножить компоненты R, G и B на это значение альфы.

```glsl
vec4 main(vec2 p) {
    float alpha = 0.5;
    vec3 color = vec3(1.0, 0.0, 0.0); // Красный
    return vec4(color * alpha, alpha); // Корректный формат с предумноженной альфой
}
```

## Анимация шейдеров (Uniforms)

Чтобы анимировать шейдер, объявите переменные `uniform` в коде SkSL и обновляйте их из Java каждый кадр.

### 1. Код SkSL
```glsl
// rainbow.sksl
uniform float iTime;
uniform float iWidth;
uniform float iHeight;

vec4 main(vec2 fragCoord) {
    // Нормализация координат к 0..1
    vec2 uv = fragCoord / vec2(iWidth, iHeight);
    
    // Создание движущегося радужного паттерна
    float r = sin(uv.x * 6.28 + iTime) * 0.5 + 0.5;
    float g = sin(uv.y * 6.28 + iTime + 2.0) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 6.28 + iTime + 4.0) * 0.5 + 0.5;
    
    return vec4(r, g, b, 1.0);
}
```

### 2. Код Java
Используйте `Data` или `ByteBuffer` для передачи значений uniform. Порядок должен соответствовать порядку объявления в SkSL.

```java
// Компилируем эффект один раз
RuntimeEffect effect = RuntimeEffect.makeForShader(skslCode);

// В цикле анимации:
long now = System.nanoTime();
float time = (now - startTime) / 1e9f;

// Создаем буфер для uniforms: 3 float * 4 байта = 12 байт
// Skija ожидает порядок байт Little Endian для uniforms
try (Data uniforms = Data.makeFromBytes(ByteBuffer.allocate(12)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putFloat(time)          // iTime
        .putFloat(500f)          // iWidth
        .putFloat(500f)          // iHeight
        .array())) 
{
    // Создаем новый шейдер с обновленными uniforms
    try (Shader shader = effect.makeShader(uniforms, null, null)) {
        Paint p = new Paint().setShader(shader);
        canvas.drawPaint(p); // Заливка экрана
    }
}
```

## RuntimeEffectBuilder

Ручная упаковка байтовых массивов для uniforms подвержена ошибкам. `RuntimeEffectBuilder` упрощает этот процесс, позволяя задавать uniforms по имени.

```java
RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
RuntimeEffectBuilder builder = new RuntimeEffectBuilder(effect);

// Задаем uniforms по имени (с проверкой типов)
builder.setUniform("iTime", 1.5f);
builder.setUniform("iResolution", 800f, 600f);
builder.setUniform("iColor", new float[] { 1, 0, 0, 1 }); // vec4

// Создаем Shader/ColorFilter/Blender
Shader shader = builder.makeShader();
```