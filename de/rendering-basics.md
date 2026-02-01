# Rendering-Grundlagen

Dieser Leitfaden behandelt die grundlegenden Konzepte des Renderings mit Skija, von der Erstellung einer Zeichenoberfläche bis zur Ausführung grundlegender Zeichenoperationen.

## Die Surface und der Canvas

In Skia (und Skija) findet das gesamte Zeichnen auf einem **Canvas** statt. Ein Canvas benötigt jedoch ein Ziel, in das gezeichnet wird, das von einer **Surface** bereitgestellt wird.

### Off-Screen-Rendering (Raster)

Der einfachste Einstieg ist die Erstellung einer Raster-Surface (im Speicher). Dies ist ideal zum Generieren von Bildern, für serverseitiges Rendering oder zum Testen.

```java
// Erstelle eine 100x100 Pixel große Surface mit dem Standard-N32-Farbformat (normalerweise RGBA oder BGRA)
Surface surface = Surface.makeRasterN32Premul(100, 100);

// Hole den Canvas von der Surface
Canvas canvas = surface.getCanvas();
```

Das `Canvas`-Objekt ist Ihre primäre Schnittstelle zum Zeichnen. Es verwaltet den aktuellen Zustand (Transformationen, Clipping) und stellt die Zeichenmethoden bereit.

## Verwendung von Paint

Während der `Canvas` definiert, *wo* und *was* gezeichnet wird, definiert das `Paint`-Objekt, *wie* es gezeichnet wird. Ein `Paint`-Objekt enthält Informationen über Farben, Strichstile, Blending-Modi und verschiedene Effekte.

```java
Paint paint = new Paint();
paint.setColor(0xFFFF0000); // Vollständig deckendes Rot
```

### Arbeiten mit Farben

Farben werden in Skija als 32-Bit-Ganzzahlen im **ARGB**-Format dargestellt:
- `0x` gefolgt von `FF` (Alpha), `RR` (Rot), `GG` (Grün), `BB` (Blau).
- `0xFFFF0000` ist Deckendes Rot.
- `0xFF00FF00` ist Deckendes Grün.
- `0xFF0000FF` ist Deckendes Blau.
- `0x80000000` ist Halbtransparentes Schwarz.

## Grundlegende Zeichenoperationen

Der `Canvas` bietet viele Methoden zum Zeichnen von Primitiven.

```java
// Zeichne einen Kreis bei (50, 50) mit Radius 30
canvas.drawCircle(50, 50, 30, paint);

// Zeichne eine einfache Linie
canvas.drawLine(10, 10, 90, 90, paint);

// Zeichne ein Rechteck
canvas.drawRect(Rect.makeXYWH(10, 10, 80, 80), paint);
```

## Erfassen und Speichern der Ausgabe

Nach dem Zeichnen auf einer Surface möchten Sie das Ergebnis oft als Bilddatei speichern.

```java
// 1. Erstelle eine Momentaufnahme des aktuellen Surface-Inhalts als Image
Image image = surface.makeImageSnapshot();

// 2. Kodiere das Bild in ein bestimmtes Format (z.B. PNG)
Data pngData = image.encodeToData(EncodedImageFormat.PNG);

// 3. Konvertiere die Daten in einen ByteBuffer zum Schreiben
ByteBuffer pngBytes = pngData.toByteBuffer();

// 4. Schreibe in eine Datei mit Standard-Java-I/O
try {
    java.nio.file.Path path = java.nio.file.Path.of("output.png");
    Files.write(path, pngBytes.array());
} catch (IOException e) {
    e.printStackTrace();
}
```

### Lesen von Pixeln (Bildschirmaufnahme)

Wenn Sie die Rohpixeldaten von der Surface benötigen (z.B. zur Verarbeitung oder Inspektion), ohne sie in ein Bildformat zu kodieren:

```java
// Erstelle eine Bitmap zum Speichern des Ergebnisses
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Lese Pixel von der Surface in die Bitmap
// Liest die gesamte Surface, wenn die Größen übereinstimmen
surface.readPixels(bitmap, 0, 0);

// Für einen bestimmten Bereich (z.B. 50x50 Bereich beginnend bei 10, 10)
Bitmap region = new Bitmap();
region.allocPixels(ImageInfo.makeN32Premul(50, 50));
surface.readPixels(region, 10, 10);
```

## Verkettete API

Viele Skija-Setter geben `this` zurück, was eine fließende, Builder-ähnliche API ermöglicht:

```java
Paint strokePaint = new Paint()
    .setColor(0xFF1D7AA2)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(2f)
    .setAntiAlias(true);
```