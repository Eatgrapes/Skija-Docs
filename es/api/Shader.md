# Referencia de API: Shader

Los shaders definen el color de cada píxel según su posición en el lienzo. Se utilizan principalmente para degradados, patrones y ruido. Los shaders se asignan a un objeto `Paint` mediante `paint.setShader(shader)`.

## Degradados

Los degradados son el tipo más común de shaders. Skija admite varios tipos:

### Degradado lineal
Crea una transición suave entre dos puntos.

**Ejemplo visual:**
Consulta [`examples/scenes/src/ShadersScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadersScene.java) para ver ejemplos de degradados lineales, radiales, de barrido y cónicos, así como shaders de ruido.

```java
Shader linear = Shader.makeLinearGradient(
    0, 0, 100, 100,      // x0, y0, x1, y1
    new int[] { 0xFFFF0000, 0xFF0000FF } // Colores (Rojo a Azul)
);
```

### Degradado radial
Crea una transición circular desde un punto central.

```java
Shader radial = Shader.makeRadialGradient(
    50, 50, 30,          // centro x, y, radio
    new int[] { 0xFFFFFFFF, 0xFF000000 } // Colores (Blanco a Negro)
);
```

### Degradado de barrido (Sweep)
Crea una transición que barre alrededor de un punto central (como una rueda de colores).

```java
Shader sweep = Shader.makeSweepGradient(
    50, 50,              // centro x, y
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFFFF0000 }
);
```

### Degradado cónico de dos puntos
Crea una transición entre dos círculos (útil para efectos de iluminación o destellos 3D).

```java
Shader conical = Shader.makeTwoPointConicalGradient(
    30, 30, 10,          // inicio x, y, radio
    70, 70, 40,          // fin x, y, radio
    new int[] { 0xFFFF0000, 0xFF0000FF }
);
```

## Ruido y Patrones

### Ruido de Perlin
Genera texturas que parecen nubes, mármol o fuego.

```java
// Ruido Fractal
Shader noise = Shader.makeFractalNoise(
    0.05f, 0.05f,        // baseFrequencyX, baseFrequencyY
    4,                   // numOctaves
    0.0f                 // seed
);

// Turbulencia
Shader turb = Shader.makeTurbulence(0.05f, 0.05f, 4, 0.0f);
```

### Shader de Imagen
Convierte una `Image` en un shader que puede ser repetido (tiled) o usado para rellenar formas.

```java
// Acceso a través de la clase Image
Shader imageShader = image.makeShader(
    FilterTileMode.REPEAT, 
    FilterTileMode.REPEAT, 
    SamplingMode.DEFAULT
);
```

## Composición y Modificación

- `Shader.makeBlend(mode, dst, src)`: Combina dos shaders usando un modo de fusión (blend mode).
- `shader.makeWithLocalMatrix(matrix)`: Aplica una transformación al sistema de coordenadas del shader.
- `shader.makeWithColorFilter(filter)`: Aplica un filtro de color a la salida del shader.

## Modos de Repetición (`FilterTileMode`)

Cuando un shader (como un degradado o imagen) necesita rellenar un área mayor que sus límites definidos:
- `CLAMP`: Usa el color del borde para rellenar el resto.
- `REPEAT`: Repite el patrón.
- `MIRROR`: Repite el patrón, reflejándolo en los bordes.
- `DECAL`: Renderiza transparencia fuera de los límites.