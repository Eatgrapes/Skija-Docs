# API-Referenz: ImageFilter

`ImageFilter`-Objekte werden verwendet, um bildweite Effekte während des Zeichnens anzuwenden, wie Unschärfe, Schatten oder Farbtransformationen. Sie werden über `setImageFilter()` auf einen [`Paint`](Paint.md) angewendet.

## Statische Fabrikmethoden

### Häufige Effekte

- `makeBlur(sigmaX, sigmaY, tileMode)`: Erzeugt eine Gaußsche Unschärfe.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: Erzeugt einen Schlagschatten.
- `makeDropShadowOnly(dx, dy, sigmaX, sigmaY, color)`: Zeichnet nur den Schatten.
- `makeColorFilter(colorFilter, input)`: Wendet einen [`ColorFilter`](Effects.md#color-filters) auf ein Bild an.

### Kombination & Komposition

- `makeCompose(outer, inner)`: Verkettet zwei Filter.
- `makeMerge(filters[])`: Verschmilzt mehrere Filter unter Verwendung von SrcOver-Blending.
- `makeArithmetic(k1, k2, k3, k4, enforcePM, bg, fg)`: Kombiniert zwei Eingaben mit einer arithmetischen Formel.
- `makeBlend(blendMode, bg, fg)`: Mischt zwei Eingaben unter Verwendung eines [`BlendMode`](#).

### Geometrische & Abtasteffekte

- `makeOffset(dx, dy, input)`: Verschiebt die Eingabe um einen Offset.
- `makeMatrixTransform(matrix, sampling, input)`: Wendet eine Matrixtransformation an.
- `makeCrop(rect, tileMode, input)`: Schneidet den Eingabefilter zu.
- `makeTile(src, dst, input)`: Kachelt den Quellbereich in das Ziel.

### Fortgeschritten

- `makeRuntimeShader(builder, childName, input)`: Wendet einen benutzerdefinierten [SkSL](runtime-effect.md)-Shader als Filter an.
- `makeDisplacementMap(xChan, yChan, scale, displacement, color)`: Verschiebt Pixel basierend auf einem anderen Bild.
- `makeMatrixConvolution(...)`: Wendet einen NxM-Faltungskernel an.
- `makeLighting(...)`: Verschiedene Beleuchtungsfilter (Distant, Point, Spot).

## Verwendung

```java
Paint paint = new Paint()
    .setImageFilter(ImageFilter.makeBlur(5f, 5f, FilterTileMode.CLAMP));

canvas.drawRect(Rect.makeWH(100, 100), paint);
```