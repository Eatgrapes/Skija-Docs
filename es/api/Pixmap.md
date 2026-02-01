# Referencia de la API: Pixmap

La clase `Pixmap` representa una imagen raster en memoria. Proporciona acceso directo a los datos de píxeles y métodos para leer, escribir y manipular píxeles.

## Descripción general

Un `Pixmap` combina `ImageInfo` (ancho, alto, tipo de color, tipo alfa, espacio de color) con los datos reales de píxeles en memoria. A diferencia de `Image`, `Pixmap` permite el acceso directo al búfer de píxeles.

## Creación

- `make(info, buffer, rowBytes)`: Crea un `Pixmap` que envuelve el `ByteBuffer` proporcionado.
- `make(info, addr, rowBytes)`: Crea un `Pixmap` que envuelve la dirección de memoria nativa proporcionada.

## Gestión de datos

- `reset()`: Limpia el `Pixmap` a un estado nulo.
- `reset(info, buffer, rowBytes)`: Restablece el `Pixmap` para envolver el nuevo búfer proporcionado.
- `setColorSpace(colorSpace)`: Actualiza el espacio de color del `Pixmap`.
- `extractSubset(subsetPtr, area)`: Extrae un subconjunto del `Pixmap` en la memoria apuntada por `subsetPtr`.
- `extractSubset(buffer, area)`: Extrae un subconjunto del `Pixmap` en el `ByteBuffer` proporcionado.

## Propiedades

- `getInfo()`: Devuelve el `ImageInfo` que describe el `Pixmap` (ancho, alto, tipo de color, etc.).
- `getRowBytes()`: Devuelve el número de bytes por fila.
- `getAddr()`: Devuelve la dirección nativa de los datos de píxeles.
- `getRowBytesAsPixels()`: Devuelve el número de píxeles por fila (solo para ciertos tipos de color).
- `computeByteSize()`: Calcula el tamaño total en bytes de los datos de píxeles.
- `computeIsOpaque()`: Devuelve verdadero si el `Pixmap` es opaco.
- `getBuffer()`: Devuelve un `ByteBuffer` que envuelve los datos de píxeles.

## Acceso a píxeles

### Acceso a un solo píxel

- `getColor(x, y)`: Devuelve el color del píxel en `(x, y)` como un entero (ARGB).
- `getColor4f(x, y)`: Devuelve el color del píxel en `(x, y)` como un `Color4f`.
- `getAlphaF(x, y)`: Devuelve el componente alfa del píxel en `(x, y)` como un flotante.
- `getAddr(x, y)`: Devuelve la dirección nativa del píxel en `(x, y)`.

### Operaciones masivas de píxeles

- `readPixels(info, addr, rowBytes)`: Copia píxeles del `Pixmap` a la memoria de destino.
- `readPixels(pixmap)`: Copia píxeles a otro `Pixmap`.
- `scalePixels(dstPixmap, samplingMode)`: Escala los píxeles para ajustarse al `Pixmap` de destino usando el modo de muestreo especificado.
- `erase(color)`: Rellena todo el `Pixmap` con el color especificado.
- `erase(color, subset)`: Rellena un área específica del `Pixmap` con el color especificado.

## Ejemplo

### Modificación de píxeles

```java
// Crear un nuevo Pixmap N32 (RGBA/BGRA estándar)
try (var pixmap = new Pixmap()) {
    // Asignar memoria para 100x100 píxeles
    pixmap.reset(ImageInfo.makeN32Premul(100, 100), Unpooled.malloc(100 * 100 * 4), 100 * 4);
    
    // Rellenar con blanco
    pixmap.erase(0xFFFFFFFF);

    // Establecer un píxel en rojo en (10, 10)
    // Nota: La manipulación directa de bytes podría ser más rápida para operaciones masivas,
    // pero las API erase/readPixels son más fáciles.
    // La API Pixmap de Skija no expone un simple setPixel(x,y,color) por razones de rendimiento
    // en la API administrada, pero puedes escribir directamente en el ByteBuffer.
    ByteBuffer buffer = pixmap.getBuffer();
    int offset = (10 * 100 + 10) * 4; // y * ancho + x * bpp
    buffer.putInt(offset, 0xFFFF0000); // ARGB (Rojo)
    
    // Crear una imagen a partir de este pixmap para dibujarla
    try (var image = Image.makeFromRaster(pixmap)) {
        canvas.drawImage(image, 0, 0);
    }
}
```

### Lectura de píxeles

```java
// Suponiendo que tienes un Pixmap 'pixmap'
int width = pixmap.getInfo().getWidth();
int height = pixmap.getInfo().getHeight();

// Obtener color en coordenada específica
int color = pixmap.getColor(50, 50);
System.out.println("Color en 50,50: " + Integer.toHexString(color));

// Iterar sobre todos los píxeles (¡ten en cuenta el rendimiento en Java!)
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        if (pixmap.getAlphaF(x, y) > 0.5f) {
            // Encontró un píxel no transparente
        }
    }
}
```