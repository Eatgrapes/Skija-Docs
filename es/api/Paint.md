# Referencia de la API: Paint

La clase `Paint` define el estilo, color y efectos utilizados al dibujar en un `Canvas`. Es un objeto ligero que puede reutilizarse en múltiples llamadas de dibujo.

## Propiedades Principales

### Color y Transparencia

- `setColor(int color)`: Establece el color ARGB.
- `setAlpha(int alpha)`: Establece solo el componente alfa (transparencia) (0-255).
- `setColor4f(Color4f color, ColorSpace space)`: Establece el color usando valores de punto flotante para mayor precisión.

### Estilo

- `setMode(PaintMode mode)`: Determina si la pintura rellena el interior de una forma (`FILL`), traza el contorno (`STROKE`), o ambos (`STROKE_AND_FILL`).
- `setStrokeWidth(float width)`: Establece el grosor del trazo.
- `setStrokeCap(PaintStrokeCap cap)`: Define la forma de los extremos de una línea trazada (BUTT, ROUND, SQUARE).
- `setStrokeJoin(PaintStrokeJoin join)`: Define cómo se unen los segmentos trazados (MITER, ROUND, BEVEL).

### Suavizado de Bordes (Anti-aliasing)

- `setAntiAlias(boolean enabled)`: Habilita o deshabilita el suavizado de bordes. Muy recomendado para la mayoría del dibujo de UI.

## Efectos y Shaders

Los objetos `Paint` pueden mejorarse con varios efectos para crear visuales complejos.

### Shaders (Degradados y Patrones)

Los shaders definen el color de cada píxel basándose en su posición.
- `setShader(Shader shader)`: Aplica un degradado lineal, degradado radial o patrón de imagen.

### Filtros de Color

Los filtros de color modifican los colores de la fuente antes de ser dibujados.
- `setColorFilter(ColorFilter filter)`: Aplica matrices de color, modos de mezcla o transformaciones de luma.

### Filtros de Máscara (Desenfoques)

Los filtros de máscara afectan al canal alfa del dibujo.
- `setMaskFilter(MaskFilter filter)`: Se usa principalmente para crear desenfoques y sombras.

### Filtros de Imagen

Los filtros de imagen son más complejos y pueden afectar el resultado completo del dibujo.
- `setImageFilter(ImageFilter filter)`: Se usa para desenfoques, sombras paralelas y combinar múltiples efectos.

## Ejemplo de Uso

```java
Paint paint = new Paint()
    .setColor(0xFF4285F4)
    .setAntiAlias(true)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(4f)
    .setStrokeJoin(PaintStrokeJoin.ROUND);

canvas.drawRect(Rect.makeXYWH(10, 10, 100, 100), paint);
```

## Nota sobre Rendimiento

Crear un objeto `Paint` es relativamente rápido, pero modificarlo frecuentemente en un bucle ajustado puede tener cierta sobrecarga. Generalmente se recomienda preparar los objetos `Paint` una vez y reutilizarlos durante el renderizado si sus propiedades no cambian.