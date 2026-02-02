# Referencia de la API: ImageFilter

Los objetos `ImageFilter` se utilizan para aplicar efectos a nivel de imagen durante el dibujo, como desenfoques, sombras o transformaciones de color. Se aplican a un [`Paint`](Paint.md) mediante `setImageFilter()`.

## Fábricas Estáticas

### Efectos Comunes

- `makeBlur(sigmaX, sigmaY, tileMode)`: Crea un desenfoque gaussiano.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: Crea una sombra paralela.
- `makeDropShadowOnly(dx, dy, sigmaX, sigmaY, color)`: Renderiza solo la sombra.
- `makeColorFilter(colorFilter, input)`: Aplica un [`ColorFilter`](Effects.md#color-filters) a una imagen.

### Combinación y Composición

- `makeCompose(outer, inner)`: Encadena dos filtros.
- `makeMerge(filters[])`: Fusiona múltiples filtros usando la mezcla SrcOver.
- `makeArithmetic(k1, k2, k3, k4, enforcePM, bg, fg)`: Combina dos entradas usando una fórmula aritmética.
- `makeBlend(blendMode, bg, fg)`: Mezcla dos entradas usando un [`BlendMode`](#).

### Geométricos y de Muestreo

- `makeOffset(dx, dy, input)`: Desplaza la entrada por un offset.
- `makeMatrixTransform(matrix, sampling, input)`: Aplica una transformación matricial.
- `makeCrop(rect, tileMode, input)`: Recorta el filtro de entrada.
- `makeTile(src, dst, input)`: Repite la región de origen en el destino.

### Avanzados

- `makeRuntimeShader(builder, childName, input)`: Aplica un sombreador personalizado [SkSL](runtime-effect.md) como filtro.
- `makeDisplacementMap(xChan, yChan, scale, displacement, color)`: Desplaza píxeles basándose en otra imagen.
- `makeMatrixConvolution(...)`: Aplica un kernel de convolución NxM.
- `makeLighting(...)`: Varios filtros de iluminación (Distante, Puntual, Focalizada).

## Uso

```java
Paint paint = new Paint()
    .setImageFilter(ImageFilter.makeBlur(5f, 5f, FilterTileMode.CLAMP));

canvas.drawRect(Rect.makeWH(100, 100), paint);
```