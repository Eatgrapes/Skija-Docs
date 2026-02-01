# API-Referenz: Pixmap

Die `Pixmap`-Klasse repräsentiert ein Rasterbild im Speicher. Sie bietet direkten Zugriff auf Pixeldaten und Methoden zum Lesen, Schreiben und Manipulieren von Pixeln.

## Übersicht

Ein `Pixmap` kombiniert `ImageInfo` (Breite, Höhe, Farbtyp, Alphatyp, Farbraum) mit den tatsächlichen Pixeldaten im Speicher. Im Gegensatz zu `Image` erlaubt `Pixmap` direkten Zugriff auf den Pixelpuffer.

## Erstellung

- `make(info, buffer, rowBytes)`: Erstellt ein `Pixmap`, das den bereitgestellten `ByteBuffer` umschließt.
- `make(info, addr, rowBytes)`: Erstellt ein `Pixmap`, das die bereitgestellte native Speicheradresse umschließt.

## Datenverwaltung

- `reset()`: Setzt das `Pixmap` auf einen Null-Zustand zurück.
- `reset(info, buffer, rowBytes)`: Setzt das `Pixmap` zurück, um den neuen bereitgestellten Puffer zu umschließen.
- `setColorSpace(colorSpace)`: Aktualisiert den Farbraum des `Pixmap`.
- `extractSubset(subsetPtr, area)`: Extrahiert einen Teilbereich des `Pixmap` in den Speicher, auf den `subsetPtr` zeigt.
- `extractSubset(buffer, area)`: Extrahiert einen Teilbereich des `Pixmap` in den bereitgestellten `ByteBuffer`.

## Eigenschaften

- `getInfo()`: Gibt die `ImageInfo` zurück, die das `Pixmap` beschreibt (Breite, Höhe, Farbtyp, etc.).
- `getRowBytes()`: Gibt die Anzahl der Bytes pro Zeile zurück.
- `getAddr()`: Gibt die native Adresse der Pixeldaten zurück.
- `getRowBytesAsPixels()`: Gibt die Anzahl der Pixel pro Zeile zurück (nur für bestimmte Farbtypen).
- `computeByteSize()`: Berechnet die gesamte Byte-Größe der Pixeldaten.
- `computeIsOpaque()`: Gibt true zurück, wenn das `Pixmap` undurchsichtig ist.
- `getBuffer()`: Gibt einen `ByteBuffer` zurück, der die Pixeldaten umschließt.

## Pixelzugriff

### Einzelpixel-Zugriff

- `getColor(x, y)`: Gibt die Farbe des Pixels bei `(x, y)` als Integer (ARGB) zurück.
- `getColor4f(x, y)`: Gibt die Farbe des Pixels bei `(x, y)` als `Color4f` zurück.
- `getAlphaF(x, y)`: Gibt die Alpha-Komponente des Pixels bei `(x, y)` als Float zurück.
- `getAddr(x, y)`: Gibt die native Adresse des Pixels bei `(x, y)` zurück.

### Massenpixel-Operationen

- `readPixels(info, addr, rowBytes)`: Kopiert Pixel vom `Pixmap` in den Zielspeicher.
- `readPixels(pixmap)`: Kopiert Pixel in ein anderes `Pixmap`.
- `scalePixels(dstPixmap, samplingMode)`: Skaliert die Pixel, um in das Ziel-`Pixmap` zu passen, unter Verwendung des angegebenen Abtastmodus.
- `erase(color)`: Füllt das gesamte `Pixmap` mit der angegebenen Farbe.
- `erase(color, subset)`: Füllt einen bestimmten Bereich des `Pixmap` mit der angegebenen Farbe.

## Beispiel

### Pixel modifizieren

```java
// Create a new N32 (standard RGBA/BGRA) Pixmap
try (var pixmap = new Pixmap()) {
    // Allocate memory for 100x100 pixels
    pixmap.reset(ImageInfo.makeN32Premul(100, 100), Unpooled.malloc(100 * 100 * 4), 100 * 4);
    
    // Fill with white
    pixmap.erase(0xFFFFFFFF);

    // Set a pixel to red at (10, 10)
    // Note: Direct byte manipulation might be faster for bulk operations, 
    // but erase/readPixels are easier APIs.
    // Skija Pixmap doesn't expose a simple setPixel(x,y,color) for performance reasons
    // in the managed API, but you can write to the ByteBuffer directly.
    ByteBuffer buffer = pixmap.getBuffer();
    int offset = (10 * 100 + 10) * 4; // y * width + x * bpp
    buffer.putInt(offset, 0xFFFF0000); // ARGB (Red)
    
    // Create an image from this pixmap to draw it
    try (var image = Image.makeFromRaster(pixmap)) {
        canvas.drawImage(image, 0, 0);
    }
}
```

### Pixel lesen

```java
// Assuming you have a Pixmap 'pixmap'
int width = pixmap.getInfo().getWidth();
int height = pixmap.getInfo().getHeight();

// Get color at specific coordinate
int color = pixmap.getColor(50, 50);
System.out.println("Color at 50,50: " + Integer.toHexString(color));

// Iterate over all pixels (be mindful of performance in Java!)
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        if (pixmap.getAlphaF(x, y) > 0.5f) {
            // Found a non-transparent pixel
        }
    }
}
```