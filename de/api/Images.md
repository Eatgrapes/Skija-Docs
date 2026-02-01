# Bilder und Bitmaps

Die Verarbeitung von Bildern in Skija umfasst zwei Hauptklassen: `Image` und `Bitmap`. Obwohl sie ähnlich erscheinen, dienen sie unterschiedlichen Zwecken.

## Image vs. Bitmap

- **`Image`**: Stell dir dies als eine schreibgeschützte, potenziell GPU-gestützte Textur vor. Es ist für das Zeichnen auf eine Leinwand optimiert.
- **`Bitmap`**: Dies ist ein veränderbares, CPU-seitiges Array von Pixeln. Du verwendest dies, wenn du programmgesteuert einzelne Pixel bearbeiten musst.

## Ein Bild laden

Der häufigste Weg, ein Bild zu erhalten, ist, es aus kodierten Bytes (PNG, JPEG, etc.) zu laden.

```java
byte[] bytes = Files.readAllBytes(Path.of("photo.jpg"));
Image img = Image.makeDeferredFromEncodedBytes(bytes);
```

**Tipp:** `makeDeferredFromEncodedBytes` ist "lazy" – es decodiert die Pixel erst beim ersten tatsächlichen Zeichnen, was Speicher und Zeit während des anfänglichen Ladens spart.

### Erstellen aus Pixeln (Raster)

Wenn du Rohpixeldaten hast (z.B. von einer anderen Bibliothek oder prozedural generiert):

```java
// Von einem Data-Objekt (umschließt nativen Speicher oder Byte-Array)
Image img = Image.makeRasterFromData(
    ImageInfo.makeN32Premul(100, 100),
    data,
    rowBytes
);

// Von einer Bitmap (kopiert oder teilt Pixel)
Image img = Image.makeRasterFromBitmap(bitmap);

// Von einem Pixmap (kopiert Pixel)
Image img = Image.makeRasterFromPixmap(pixmap);
```

## Kodieren (Bilder speichern)

Um ein `Image` in einer Datei oder einem Stream zu speichern, musst du es kodieren. Skija bietet `EncoderJPEG`, `EncoderPNG` und `EncoderWEBP` für eine feingranulare Kontrolle.

```java
// Einfache Kodierung (Standardeinstellungen)
Data pngData = EncoderPNG.encode(image);
Data jpgData = EncoderJPEG.encode(image); // Standardqualität 100

// Erweiterte Kodierung (mit Optionen)
EncodeJPEGOptions jpgOpts = new EncodeJPEGOptions()
    .setQuality(80)
    .setAlphaMode(EncodeJPEGAlphaMode.IGNORE);

Data compressed = EncoderJPEG.encode(image, jpgOpts);

// WebP-Kodierung
EncodeWEBPOptions webpOpts = new EncodeWEBPOptions()
    .setQuality(90)
    .setCompression(EncodeWEBPCompressionMode.LOSSY); // oder LOSSLESS

Data webp = EncoderWEBP.encode(image, webpOpts);
```

## Auf einer Leinwand zeichnen

Das Zeichnen eines Bildes ist einfach, aber achte auf **Sampling**.

```java
canvas.drawImage(img, 10, 10);
```

### Sampling-Modi

Wenn du ein Bild skalierst, musst du entscheiden, wie es abgetastet werden soll:
- `SamplingMode.DEFAULT`: Nächster Nachbar. Schnell, sieht aber bei Skalierung blockig aus.
- `SamplingMode.LINEAR`: Bilineare Filterung. Glatt, kann aber etwas unscharf sein.
- `SamplingMode.MITCHELL`: Hochwertige kubische Neuabtastung. Großartig für das Verkleinern.

```java
canvas.drawImageRect(img, Rect.makeWH(200, 200), SamplingMode.LINEAR, null, true);
```

## Shader aus Bildern erstellen

Du kannst ein Bild als Muster (z.B. für einen gekachelten Hintergrund) verwenden, indem du es in einen Shader umwandelst.

```java
Shader pattern = img.makeShader(FilterTileMode.REPEAT, FilterTileMode.REPEAT);
paint.setShader(pattern);
canvas.drawPaint(paint); // Füllt die gesamte Leinwand mit dem gekachelten Bild
```

## Arbeiten mit Pixeln (Bitmap)

Wenn du ein Bild Pixel für Pixel von Grund auf generieren musst:

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Jetzt kannst du in diese Bitmap mit einer Canvas zeichnen
Canvas c = new Canvas(bmp);
c.clear(0xFFFFFFFF);
// ... zeichne Dinge ...

// Oder auf Rohpixel zugreifen (fortgeschritten)
ByteBuffer pixels = bmp.peekPixels();
```

## Auf Pixeldaten zugreifen (Sampling)

Um Pixel aus einem `Image` oder einer `Surface` zu lesen, verwende die Methode `readPixels`.

### Vollständiges Bild-Sampling
```java
// Erstelle eine Bitmap, um die Pixel zu halten
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(width, height));

// Lese alle Pixel aus dem Bild in die Bitmap
image.readPixels(bmp);
```

### Bereichs-Sampling
Du kannst ein bestimmtes Teilrechteck des Bildes lesen, indem du einen (x, y)-Offset angibst.

```java
// Wir wollen nur eine 50x50-Region
Bitmap regionBmp = new Bitmap();
regionBmp.allocPixels(ImageInfo.makeN32Premul(50, 50));

// Lese ab (100, 100) im Quellbild
// erfasst effektiv das Rechteck {100, 100, 150, 150}
image.readPixels(regionBmp, 100, 100); 
```

## OpenGL / Metal-Interoperabilität

Skija ermöglicht es dir, `Image`-Objekte direkt aus vorhandenen GPU-Texturen zu erstellen. Dies ist nützlich für die Integration mit anderen Grafikbibliotheken (wie LWJGL).

### Ein Image aus einer OpenGL-Textur erstellen

```java
// Du benötigst einen DirectContext für GPU-Operationen
DirectContext context = ...; 

// Angenommen, du hast eine OpenGL-Textur-ID von woanders
int textureId = 12345;

Image glImage = Image.adoptGLTextureFrom(
    context, 
    textureId, 
    GL30.GL_TEXTURE_2D, 
    512, 512, 
    GL30.GL_RGBA8, 
    SurfaceOrigin.BOTTOM_LEFT, 
    ColorType.RGBA_8888
);

// Jetzt kannst du diese Textur mit Skija zeichnen
canvas.drawImage(glImage, 0, 0);
```

**Hinweis:** Beim Übernehmen einer Textur geht Skija von der Eigentümerschaft aus. Wenn du sie umschließen möchtest, ohne die Eigentümerschaft zu übernehmen, suche nach `makeFromTexture`-Varianten (falls verfügbar) oder verwalte die Lebensdauer sorgfältig.

## Performance-Fallen

1.  **Decodieren im UI-Thread:** Das Decodieren großer Bilder kann langsam sein. Mache es im Hintergrund.
2.  **Textur-Uploads:** Wenn du ein GPU-Backend (wie OpenGL) verwendest, muss Skia ein CPU-seitiges `Image` beim ersten Zeichnen auf die GPU hochladen. Bei großen Texturen kann dies zu einem Frame-Drop führen.
3.  **Große Bitmaps:** Bitmaps leben im Java-Heap und im nativen Speicher. Sei vorsichtig mit großen Dimensionen (z.B. 8k-Texturen), da sie schnell zu OutOfMemory-Fehlern führen können.