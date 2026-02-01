# Referencia de la API: Efectos (Filtros)

Skija proporciona tres tipos de filtros que se pueden aplicar mediante `Paint`: **MaskFilter**, **ColorFilter** e **ImageFilter**. Comprender la diferencia es clave para lograr el efecto visual deseado.

## 1. MaskFilter
**Modificación del canal alfa.** Afecta a la máscara (geometría) antes de que se coloree. Solo ve los valores alfa.

### Desenfoque Gaussiano
El uso más común es crear bordes suaves o brillos simples.

```java
// Sigma es aproximadamente 1/3 del radio de desenfoque
MaskFilter blur = MaskFilter.makeBlur(FilterBlurMode.NORMAL, 5.0f);
paint.setMaskFilter(blur);
```

**Modos:**
- `NORMAL`: Desenfoca tanto el interior como el exterior.
- `SOLID`: Mantiene la forma original opaca, desenfoca solo el exterior.
- `OUTER`: Solo la parte desenfocada fuera de la forma.
- `INNER`: Solo la parte desenfocada dentro de la forma.

---

## 2. ColorFilter
**Modificación del espacio de color.** Transforma el color de cada píxel de forma independiente.

### Matriz de Color
Útil para escala de grises, sepia o cambio de color.

```java
ColorFilter grayscale = ColorFilter.makeMatrix(ColorMatrix.grayscale());
paint.setColorFilter(grayscale);
```

### Filtro de Color por Modo de Fusión
Tiñe todo con un color específico.

```java
ColorFilter tint = ColorFilter.makeBlend(0xFF4285F4, BlendMode.SRC_ATOP);
```

---

## 3. ImageFilter (Efectos de Píxeles)

`ImageFilter` opera sobre los píxeles del dibujo (o su fondo). Se utilizan comúnmente para desenfoques, sombras y efectos de iluminación.

### Filtros Básicos
- `makeBlur(sigmaX, sigmaY, tileMode)`: Desenfoque gaussiano.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: Dibuja contenido + sombra.
- `makeDropShadowOnly(...)`: Dibuja solo la sombra (sin contenido).
- `makeDilate(rx, ry)`: Expande áreas brillantes (morfología).
- `makeErode(rx, ry)`: Expande áreas oscuras (morfología).
- `makeOffset(dx, dy)`: Desplaza el contenido.
- `makeTile(src, dst)`: Repite el contenido en mosaico.

### Composición
- `makeCompose(outer, inner)`: Aplica el filtro `inner`, luego `outer`.
- `makeMerge(filters)`: Combina los resultados de múltiples filtros (por ejemplo, dibujar varias sombras).
- `makeBlend(mode, bg, fg)`: Mezcla dos filtros usando un `BlendMode`.
- `makeArithmetic(k1, k2, k3, k4, bg, fg)`: Combinación personalizada de píxeles: `k1*fg*bg + k2*fg + k3*bg + k4`.

### Color y Shaders
- `makeColorFilter(cf, input)`: Aplica un `ColorFilter` al resultado del filtro de imagen.
- `makeShader(shader)`: Rellena la región del filtro con un `Shader` (por ejemplo, gradiente o ruido).
- `makeRuntimeShader(builder, ...)`: Utiliza un shader SkSL personalizado como filtro de imagen.

### Iluminación (Material Design)
Simula la luz reflejada en una superficie definida por el canal alfa (alfa = altura).
- `makeDistantLitDiffuse(...)`
- `makePointLitDiffuse(...)`
- `makeSpotLitDiffuse(...)`
- `makeDistantLitSpecular(...)`
- `makePointLitSpecular(...)`
- `makeSpotLitSpecular(...)`

### Ejemplo: Vidrio Esmerilado (Desenfoque de Fondo)
Para desenfocar lo que está *detrás* de una capa, usa `Canvas.saveLayer` con un filtro de fondo.

```java
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
// El argumento 'paint' es nulo (sin alfa/fusión para la capa en sí)
// El argumento 'backdrop' es el filtro de desenfoque
canvas.saveLayer(new SaveLayerRec(null, null, blur));
    canvas.drawRect(rect, new Paint().setColor(0x40FFFFFF)); // Blanco semitransparente
canvas.restore();
```

## Resumen Comparativo

| Tipo de Filtro | Afecta a | Uso Común |
| :--- | :--- | :--- |
| **MaskFilter** | Solo alfa | Desenfoques simples, brillos |
| **ColorFilter** | Color del píxel | Escala de grises, tintes, contraste |
| **ImageFilter** | Píxel completo | Sombras paralelas, desenfoques complejos, composición |

## 4. Blender (Mezcla Avanzada)

Mientras que `BlendMode` proporciona mezclas Porter-Duff estándar (como `SRC_OVER`, `MULTIPLY`), la clase `Blender` permite mezclas personalizadas programables.

Se asigna un blender a un paint usando `paint.setBlender(blender)`.

### Blender Aritmético
Permite definir una combinación lineal de píxeles de origen y destino:
`resultado = k1 * src * dst + k2 * src + k3 * dst + k4`

```java
// Ejemplo: Linear Dodge (Add) se puede aproximar
Blender b = Blender.makeArithmetic(0, 1, 1, 0, false);
paint.setBlender(b);
```

### Blender en Tiempo de Ejecución (SkSL)
¡Puedes escribir tu propia función de mezcla en SkSL! El shader recibe los colores `src` y `dst` y debe devolver el resultado.

```java
String sksl = "vec4 main(vec4 src, vec4 dst) {" +
              "  return src * dst;" + // Multiplicación simple
              "}";
RuntimeEffect effect = RuntimeEffect.makeForBlender(sksl);
Blender myBlender = effect.makeBlender(null);
paint.setBlender(myBlender);
```

## 5. PathEffect (Modificadores de Trazo)

`PathEffect` modifica la geometría de un trazado *antes* de que se dibuje (se trace o se rellene). Se usa comúnmente para líneas discontinuas, esquinas redondeadas o rugosidad orgánica.

### Métodos de Creación

**1. Discreto (Rugosidad)**
Divide el trazado en segmentos y los desplaza aleatoriamente.
- `makeDiscrete(segLength, dev, seed)`:
    - `segLength`: Longitud de los segmentos.
    - `dev`: Desviación máxima (variación).
    - `seed`: Semilla aleatoria.

```java
PathEffect rough = PathEffect.makeDiscrete(10f, 4f, 0);
paint.setPathEffect(rough);
```

**2. Esquina (Redondeo)**
Redondea las esquinas afiladas.
- `makeCorner(radius)`: Radio de la esquina redondeada.

```java
PathEffect round = PathEffect.makeCorner(20f);
```

**3. Guión (Líneas Discontinuas)**
Crea líneas discontinuas o punteadas.
- `makeDash(intervals, phase)`:
    - `intervals`: Array de longitudes de encendido/apagado (debe tener longitud par).
    - `phase`: Desplazamiento dentro de los intervalos.

```java
// 10px ENCENDIDO, 5px APAGADO
PathEffect dash = PathEffect.makeDash(new float[] { 10f, 5f }, 0f);
```

**4. Path1D (Sello a lo largo del trazado)**
Sella una forma a lo largo del trazado (como un pincel).
- `makePath1D(path, advance, phase, style)`

```java
Path shape = new Path().addCircle(0, 0, 3);
PathEffect dots = PathEffect.makePath1D(shape, 10f, 0f, PathEffect1DStyle.TRANSLATE);
```

**5. Path2D (Matriz)**
Transforma la geometría del trazado mediante una matriz.
- `makePath2D(matrix, path)`

**6. Line2D**
- `makeLine2D(width, matrix)`

### Composición

Puedes combinar múltiples efectos de trazado.

- `makeSum(second)`: Dibuja *ambos* efectos (por ejemplo, relleno + trazo).
- `makeCompose(inner)`: Aplica primero `inner`, luego `this` (por ejemplo, contorno rugoso -> discontinuo).

```java
PathEffect dashed = PathEffect.makeDash(new float[] {10, 5}, 0);
PathEffect corner = PathEffect.makeCorner(10);

// Redondea las esquinas, LUEGO hace la línea discontinua
PathEffect composed = dashed.makeCompose(corner);
```