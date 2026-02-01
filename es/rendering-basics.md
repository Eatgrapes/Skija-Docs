# Conceptos Básicos de Renderizado

Esta guía cubre los conceptos fundamentales del renderizado con Skija, desde crear una superficie de dibujo hasta realizar operaciones básicas de dibujo.

## La Superficie y el Lienzo

En Skia (y Skija), todo el dibujo ocurre en un **Lienzo (Canvas)**. Sin embargo, un Lienzo necesita un destino en el cual dibujar, el cual es proporcionado por una **Superficie (Surface)**.

### Renderizado Fuera de Pantalla (Ráster)

La forma más simple de comenzar es creando una superficie ráster (en memoria). Esto es ideal para generar imágenes, renderizado del lado del servidor o pruebas.

```java
// Crear una superficie de 100x100 píxeles usando el formato de color N32 predeterminado (usualmente RGBA o BGRA)
Surface surface = Surface.makeRasterN32Premul(100, 100);

// Obtener el Lienzo (Canvas) desde la superficie
Canvas canvas = surface.getCanvas();
```

El objeto `Canvas` es tu interfaz principal para dibujar. Mantiene el estado actual (transformaciones, recorte) y proporciona los métodos de dibujo.

## Usando Pintura (Paint)

Mientras que el `Canvas` define *dónde* y *qué* dibujar, el objeto `Paint` define *cómo* dibujarlo. Un objeto `Paint` contiene información sobre colores, estilos de trazo, modos de mezcla y varios efectos.

```java
Paint paint = new Paint();
paint.setColor(0xFFFF0000); // Rojo completamente opaco
```

### Trabajando con Colores

Los colores en Skija se representan como enteros de 32 bits en formato **ARGB**:
- `0x` seguido de `FF` (Alfa), `RR` (Rojo), `GG` (Verde), `BB` (Azul).
- `0xFFFF0000` es Rojo Opaco.
- `0xFF00FF00` es Verde Opaco.
- `0xFF0000FF` es Azul Opaco.
- `0x80000000` es Negro Semi-transparente.

## Operaciones Básicas de Dibujo

El `Canvas` proporciona muchos métodos para dibujar primitivas.

```java
// Dibujar un círculo en (50, 50) con radio 30
canvas.drawCircle(50, 50, 30, paint);

// Dibujar una línea simple
canvas.drawLine(10, 10, 90, 90, paint);

// Dibujar un rectángulo
canvas.drawRect(Rect.makeXYWH(10, 10, 80, 80), paint);
```

## Capturando y Guardando la Salida

Después de dibujar en una superficie, a menudo querrás guardar el resultado como un archivo de imagen.

```java
// 1. Tomar una instantánea del contenido actual de la superficie como una Imagen
Image image = surface.makeImageSnapshot();

// 2. Codificar la imagen en un formato específico (ej., PNG)
Data pngData = image.encodeToData(EncodedImageFormat.PNG);

// 3. Convertir los datos a un ByteBuffer para escritura
ByteBuffer pngBytes = pngData.toByteBuffer();

// 4. Escribir a un archivo usando E/S estándar de Java
try {
    java.nio.file.Path path = java.nio.file.Path.of("output.png");
    Files.write(path, pngBytes.array());
} catch (IOException e) {
    e.printStackTrace();
}
```

### Leyendo Píxeles (Captura de Pantalla)

Si necesitas los datos de píxeles sin procesar de la superficie (ej., para procesamiento o inspección) sin codificarlos a un formato de imagen:

```java
// Crear un mapa de bits (bitmap) para almacenar el resultado
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Leer píxeles de la superficie hacia el mapa de bits
// Esto lee toda la superficie si los tamaños coinciden
surface.readPixels(bitmap, 0, 0);

// Para una región específica (ej., área de 50x50 comenzando en 10, 10)
Bitmap region = new Bitmap();
region.allocPixels(ImageInfo.makeN32Premul(50, 50));
surface.readPixels(region, 10, 10);
```

## API Encadenada

Muchos métodos *setter* de Skija devuelven `this`, permitiendo una API fluida, estilo constructor:

```java
Paint strokePaint = new Paint()
    .setColor(0xFF1D7AA2)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(2f)
    .setAntiAlias(true);
```