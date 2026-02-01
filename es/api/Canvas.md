# Referencia de la API: Canvas

La clase `Canvas` es el punto central para todas las operaciones de dibujo en Skija. Gestiona el estado de dibujo, incluyendo transformaciones y recorte.

## Descripción general

Un `Canvas` no contiene los píxeles en sí; es una interfaz que dirige los comandos de dibujo a un destino, como una `Surface` o un `Bitmap`.

## Gestión del estado

El Canvas mantiene una pila de estados. Puedes guardar el estado actual (matriz y recorte) y restaurarlo más tarde.

- `save()`: Empuja una copia de la matriz y recorte actuales a la pila. Devuelve el contador de guardado.
- `restore()`: Saca un elemento de la pila y restablece la matriz y el recorte al estado anterior.
- `restoreToCount(count)`: Restaura a un contador de guardado específico.
- `getSaveCount()`: Devuelve la profundidad actual de la pila.

### Capas

Las capas crean un búfer fuera de pantalla para dibujar, que luego se compone de nuevo en el lienzo principal al restaurar.

- `saveLayer(rect, paint)`: Guarda el estado y redirige el dibujo a una capa. El `paint` controla el alfa/mezcla de la capa cuando se compone de nuevo.
- `saveLayerAlpha(rect, alpha)`: Versión simplificada solo para cambiar la opacidad.
- `saveLayer(SaveLayerRec)`: Control avanzado de capas (fondos, modos de mosaico).

```java
// Crear un filtro de desenfoque
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
SaveLayerRec rec = new SaveLayerRec(null, null, blur);

canvas.saveLayer(rec);
    // Todo lo dibujado aquí aparecerá sobre un fondo desenfocado
    // (creando un efecto de "vidrio esmerilado")
    canvas.drawRect(Rect.makeWH(200, 200), new Paint().setColor(0x80FFFFFF));
canvas.restore();
```

## Transformaciones

Las transformaciones afectan a todas las operaciones de dibujo posteriores.

- `translate(dx, dy)`: Mueve el origen.
- `scale(sx, sy)`: Escala las coordenadas.
- `rotate(degrees)`: Rota alrededor del origen actual.
- `skew(sx, sy)`: Sesga el sistema de coordenadas.
- `concat(matrix)`: Multiplica por una `Matrix33` o `Matrix44` personalizada.
- `setMatrix(matrix)`: Reemplaza completamente la matriz actual.
- `resetMatrix()`: Restablece a la matriz identidad.
- `getLocalToDevice()`: Devuelve la matriz de transformación total actual.

## Recorte

El recorte restringe el área donde puede ocurrir el dibujo.

- `clipRect(rect, mode, antiAlias)`: Recorta a un rectángulo.
- `clipRRect(rrect, mode, antiAlias)`: Recorta a un rectángulo redondeado.
- `clipPath(path, mode, antiAlias)`: Recorta a una ruta.
- `clipRegion(region, mode)`: Recorta a una región (alineada a píxeles).

## Métodos de dibujo

**Ejemplo visual:**
Consulta [`examples/scenes/src/GeometryScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/GeometryScene.java) para ver demostraciones de primitivas de dibujo.

![Primitivas del Canvas](../images/canvas_primitives.png)

### Primitivas básicas

```java
// Dibuja un punto (píxel o círculo dependiendo del estilo de línea del paint)
canvas.drawPoint(50, 50, new Paint().setColor(0xFF0000FF).setStrokeWidth(5));

// Dibuja una línea
canvas.drawLine(10, 10, 100, 100, paint);

// Dibuja un rectángulo (contorno o relleno dependiendo del modo del paint)
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);

// Dibuja un círculo
canvas.drawCircle(100, 100, 40, paint);

// Dibuja un óvalo
canvas.drawOval(Rect.makeXYWH(50, 50, 100, 50), paint);

// Dibuja un rectángulo redondeado (los radios pueden ser complejos)
canvas.drawRRect(RRect.makeXYWH(50, 50, 100, 100, 10), paint);

// Dibuja un arco (porción de tarta o trazo)
// startAngle: 0 es a la derecha, sweepAngle: grados en sentido horario
canvas.drawArc(Rect.makeXYWH(50, 50, 100, 100), 0, 90, true, paint);
```

- `drawPoint(x, y, paint)`: Dibuja un solo punto.
- `drawPoints(points, paint)`: Dibuja una colección de puntos (o líneas/polígonos dependiendo del estilo de línea del paint).
- `drawLine(x0, y0, x1, y1, paint)`: Dibuja un segmento de línea.
- `drawLines(points, paint)`: Dibuja segmentos de línea separados para cada par de puntos.
- `drawRect(rect, paint)`: Dibuja un rectángulo.
- `drawOval(rect, paint)`: Dibuja un óvalo.
- `drawCircle(x, y, radius, paint)`: Dibuja un círculo.
- `drawRRect(rrect, paint)`: Dibuja un rectángulo redondeado.
- `drawDRRect(outer, inner, paint)`: Dibuja el área entre dos rectángulos redondeados (anillo).
- `drawArc(rect, startAngle, sweepAngle, useCenter, paint)`: Dibuja una cuña (porción de tarta) o un trazo de arco.
- `drawPath(path, paint)`: Dibuja una ruta.
- `drawRegion(region, paint)`: Dibuja una región específica.

### Rellenos y limpiezas

```java
// Rellena todo el lienzo/capa con un color específico (se mezcla con el contenido existente)
canvas.drawColor(0x80FF0000); // Superposición roja al 50%

// Limpia todo el lienzo a transparente (reemplaza el contenido, sin mezcla)
canvas.clear(0x00000000);

// Rellena el recorte actual con un paint específico
// Útil para llenar la pantalla con un Shader o efecto Paint complejo
canvas.drawPaint(new Paint().setShader(myGradient));
```

- `clear(color)`: Rellena toda la región de recorte con un color (reemplaza píxeles, ignora la mezcla).
- `drawColor(color, mode)`: Rellena el recorte con un color (respeta la mezcla).
- `drawPaint(paint)`: Rellena el recorte con el paint dado (útil para rellenar con un Shader).

### Imágenes y mapas de bits

```java
// Dibuja imagen en (0, 0)
canvas.drawImage(image, 0, 0);

// Dibuja imagen escalada a un rectángulo específico
canvas.drawImageRect(image, Rect.makeXYWH(0, 0, 200, 200));

// Dibuja imagen de 9-slice (elemento de UI escalable)
// center: la región escalable central de la imagen fuente
// dst: el rectángulo destino donde dibujar
canvas.drawImageNine(image, IRect.makeLTRB(10, 10, 20, 20), Rect.makeXYWH(0, 0, 100, 50), FilterMode.LINEAR, null);
```

- `drawImage(image, x, y, paint)`: Dibuja una imagen en coordenadas.
- `drawImageRect(image, src, dst, sampling, paint, strict)`: Dibuja un subconjunto de una imagen escalado a un rectángulo destino.
- `drawImageNine(image, center, dst, filter, paint)`: Dibuja una imagen escalable de 9-slice.
- `drawBitmap(bitmap, x, y, paint)`: Dibuja un mapa de bits (datos raster).

### Texto

```java
// Dibujo de texto simple
canvas.drawString("Hello World", 50, 50, font, paint);

// Dibujo de texto avanzado usando TextBlob (diseño precalculado)
canvas.drawTextBlob(blob, 50, 50, paint);

// Dibujando una TextLine (de Shaper)
canvas.drawTextLine(line, 50, 50, paint);
```

- `drawString(string, x, y, font, paint)`: Dibuja una cadena simple.
- `drawTextBlob(blob, x, y, paint)`: Dibuja un blob de texto precalculado.
- `drawTextLine(line, x, y, paint)`: Dibuja una `TextLine` con forma.

### Dibujo avanzado

```java
// Dibuja una malla de triángulos (por ejemplo, para efectos 3D personalizados o deformaciones)
canvas.drawVertices(
    new Point[] { new Point(0, 0), new Point(100, 0), new Point(50, 100) },
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF }, // Colores por vértice
    null, // Sin coordenadas de textura
    null, // Sin índices (usa vértices en orden)
    BlendMode.MODULATE,
    new Paint()
);

// Dibuja una sombra paralela para un rectángulo
// (Más simple que crear un filtro de sombra manualmente)
canvas.drawRectShadow(
    Rect.makeXYWH(50, 50, 100, 100),
    5, 5,  // dx, dy
    10,    // desenfoque
    0,     // extensión
    0x80000000 // Color de la sombra
);
```

- `drawPicture(picture)`: Reproduce una `Picture` grabada.
- `drawDrawable(drawable)`: Dibuja un objeto `Drawable` dinámico.
- `drawVertices(positions, colors, texCoords, indices, mode, paint)`: Dibuja una malla de triángulos.
- `drawPatch(cubics, colors, texCoords, mode, paint)`: Dibuja un parche de Coons.
- `drawRectShadow(rect, dx, dy, blur, spread, color)`: Ayudante para dibujar una sombra paralela simple.

## Acceso a píxeles

```java
// Lee píxeles del lienzo a un mapa de bits
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));
canvas.readPixels(bmp, 0, 0); // Lee empezando desde (0,0) en el lienzo

// Escribe píxeles de vuelta al lienzo
canvas.writePixels(bmp, 50, 50);
```

- `readPixels(bitmap, srcX, srcY)`: Lee píxeles del lienzo a un mapa de bits.
- `writePixels(bitmap, x, y)`: Escribe píxeles de un mapa de bits al lienzo.