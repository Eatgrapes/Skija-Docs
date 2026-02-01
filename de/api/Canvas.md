# API-Referenz: Canvas

Die `Canvas`-Klasse ist der zentrale Punkt für alle Zeichenoperationen in Skija. Sie verwaltet den Zeichenzustand, einschließlich Transformationen und Clipping.

## Überblick

Ein `Canvas` hält nicht die Pixel selbst; es ist eine Schnittstelle, die Zeichenbefehle an ein Ziel wie eine `Surface` oder ein `Bitmap` weiterleitet.

## Zustandsverwaltung

Der Canvas verwaltet einen Stapel von Zuständen. Sie können den aktuellen Zustand (Matrix und Clip) speichern und später wiederherstellen.

- `save()`: Legt eine Kopie der aktuellen Matrix und des Clips auf den Stapel. Gibt die Speicheranzahl zurück.
- `restore()`: Holt den obersten Eintrag vom Stapel und setzt Matrix und Clip auf den vorherigen Zustand zurück.
- `restoreToCount(count)`: Stellt einen bestimmten Speicherstand wieder her.
- `getSaveCount()`: Gibt die aktuelle Stapeltiefe zurück.

### Ebenen (Layers)

Ebenen erstellen einen Off-Screen-Puffer für Zeichenoperationen, der bei der Wiederherstellung wieder auf den Haupt-Canvas kompositiert wird.

- `saveLayer(rect, paint)`: Speichert den Zustand und leitet das Zeichnen auf eine Ebene um. Das `paint` steuert Alpha/Blending der Ebene beim Zurückkompositieren.
- `saveLayerAlpha(rect, alpha)`: Vereinfachte Version nur für die Änderung der Deckkraft.
- `saveLayer(SaveLayerRec)`: Erweiterte Ebenenkontrolle (Hintergründe, Tile-Modi).

```java
// Create a blur filter
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
SaveLayerRec rec = new SaveLayerRec(null, null, blur);

canvas.saveLayer(rec);
    // Everything drawn here will appear on top of a blurred background
    // (creating a "frosted glass" effect)
    canvas.drawRect(Rect.makeWH(200, 200), new Paint().setColor(0x80FFFFFF));
canvas.restore();
```

## Transformationen

Transformationen beeinflussen alle nachfolgenden Zeichenoperationen.

- `translate(dx, dy)`: Verschiebt den Ursprung.
- `scale(sx, sy)`: Skaliert Koordinaten.
- `rotate(degrees)`: Dreht um den aktuellen Ursprung.
- `skew(sx, sy)`: Verzerrt das Koordinatensystem.
- `concat(matrix)`: Multipliziert mit einer benutzerdefinierten `Matrix33` oder `Matrix44`.
- `setMatrix(matrix)`: Ersetzt die aktuelle Matrix vollständig.
- `resetMatrix()`: Setzt auf die Identitätsmatrix zurück.
- `getLocalToDevice()`: Gibt die aktuelle Gesamttransformationsmatrix zurück.

## Clipping

Clipping schränkt den Bereich ein, in dem gezeichnet werden kann.

- `clipRect(rect, mode, antiAlias)`: Beschneidet auf ein Rechteck.
- `clipRRect(rrect, mode, antiAlias)`: Beschneidet auf ein abgerundetes Rechteck.
- `clipPath(path, mode, antiAlias)`: Beschneidet auf einen Pfad.
- `clipRegion(region, mode)`: Beschneidet auf eine Region (pixelausgerichtet).

## Zeichenmethoden

**Visuelles Beispiel:**


### Grundlegende Primitiven

```java
// Draw a point (pixel or circle depending on paint cap)
canvas.drawPoint(50, 50, new Paint().setColor(0xFF0000FF).setStrokeWidth(5));

// Draw a line
canvas.drawLine(10, 10, 100, 100, paint);

// Draw a rectangle (outline or fill depending on paint mode)
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);

// Draw a circle
canvas.drawCircle(100, 100, 40, paint);

// Draw an oval
canvas.drawOval(Rect.makeXYWH(50, 50, 100, 50), paint);

// Draw a rounded rectangle (radii can be complex)
canvas.drawRRect(RRect.makeXYWH(50, 50, 100, 100, 10), paint);

// Draw an arc (pie slice or stroke)
// startAngle: 0 is right, sweepAngle: clockwise degrees
canvas.drawArc(Rect.makeXYWH(50, 50, 100, 100), 0, 90, true, paint);
```

- `drawPoint(x, y, paint)`: Zeichnet einen einzelnen Punkt.
- `drawPoints(points, paint)`: Zeichnet eine Sammlung von Punkten (oder Linien/Polygonen, abhängig von der Pinselspitze).
- `drawLine(x0, y0, x1, y1, paint)`: Zeichnet ein Liniensegment.
- `drawLines(points, paint)`: Zeichnet separate Liniensegmente für jedes Punktepaar.
- `drawRect(rect, paint)`: Zeichnet ein Rechteck.
- `drawOval(rect, paint)`: Zeichnet eine Ellipse.
- `drawCircle(x, y, radius, paint)`: Zeichnet einen Kreis.
- `drawRRect(rrect, paint)`: Zeichnet ein abgerundetes Rechteck.
- `drawDRRect(outer, inner, paint)`: Zeichnet den Bereich zwischen zwei abgerundeten Rechtecken (Ring).
- `drawArc(rect, startAngle, sweepAngle, useCenter, paint)`: Zeichnet einen Kreisausschnitt (Tortenstück) oder einen Bogenstrich.
- `drawPath(path, paint)`: Zeichnet einen Pfad.
- `drawRegion(region, paint)`: Zeichnet eine bestimmte Region.

### Füllungen & Löschungen

```java
// Fill the entire canvas/layer with a specific color (blends with existing content)
canvas.drawColor(0x80FF0000); // 50% Red overlay

// Clear the entire canvas to transparent (replaces content, no blending)
canvas.clear(0x00000000);

// Fill the current clip with a specific paint
// Useful for filling the screen with a Shader or complex Paint effect
canvas.drawPaint(new Paint().setShader(myGradient));
```

- `clear(color)`: Füllt den gesamten Clip-Bereich mit einer Farbe (ersetzt Pixel, ignoriert Blending).
- `drawColor(color, mode)`: Füllt den Clip mit einer Farbe (respektiert Blending).
- `drawPaint(paint)`: Füllt den Clip mit dem angegebenen Pinsel (nützlich zum Füllen mit einem Shader).

### Bilder & Bitmaps

```java
// Draw image at (0, 0)
canvas.drawImage(image, 0, 0);

// Draw image scaled to a specific rectangle
canvas.drawImageRect(image, Rect.makeXYWH(0, 0, 200, 200));

// Draw 9-slice image (scalable UI element)
// center: the middle scalable region of the source image
// dst: the target rectangle to draw into
canvas.drawImageNine(image, IRect.makeLTRB(10, 10, 20, 20), Rect.makeXYWH(0, 0, 100, 50), FilterMode.LINEAR, null);
```

- `drawImage(image, x, y, paint)`: Zeichnet ein Bild an Koordinaten.
- `drawImageRect(image, src, dst, sampling, paint, strict)`: Zeichnet einen Teil eines Bildes, skaliert auf ein Zielrechteck.
- `drawImageNine(image, center, dst, filter, paint)`: Zeichnet ein skalierbares 9-Slice-Bild.
- `drawBitmap(bitmap, x, y, paint)`: Zeichnet eine Bitmap (Rasterdaten).

### Text

```java
// Simple text drawing
canvas.drawString("Hello World", 50, 50, font, paint);

// Advanced text drawing using TextBlob (pre-calculated layout)
canvas.drawTextBlob(blob, 50, 50, paint);

// Drawing a TextLine (from Shaper)
canvas.drawTextLine(line, 50, 50, paint);
```

- `drawString(string, x, y, font, paint)`: Zeichnet eine einfache Zeichenkette.
- `drawTextBlob(blob, x, y, paint)`: Zeichnet einen vorberechneten Text-Blob.
- `drawTextLine(line, x, y, paint)`: Zeichnet eine geformte `TextLine`.

### Erweiterte Zeichenoperationen

```java
// Draw a triangle mesh (e.g., for custom 3D effects or warping)
canvas.drawVertices(
    new Point[] { new Point(0, 0), new Point(100, 0), new Point(50, 100) },
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF }, // Per-vertex colors
    null, // No texture coordinates
    null, // No indices (use vertices in order)
    BlendMode.MODULATE,
    new Paint()
);

// Draw a drop shadow for a rectangle
// (Simpler than creating a shadow filter manually)
canvas.drawRectShadow(
    Rect.makeXYWH(50, 50, 100, 100),
    5, 5,  // dx, dy
    10,    // blur
    0,     // spread
    0x80000000 // Shadow color
);
```

- `drawPicture(picture)`: Spielt eine aufgezeichnete `Picture` ab.
- `drawDrawable(drawable)`: Zeichnet ein dynamisches `Drawable`-Objekt.
- `drawVertices(positions, colors, texCoords, indices, mode, paint)`: Zeichnet ein Dreiecksnetz.
- `drawPatch(cubics, colors, texCoords, mode, paint)`: Zeichnet einen Coons-Patch.
- `drawRectShadow(rect, dx, dy, blur, spread, color)`: Hilfsfunktion zum Zeichnen eines einfachen Schlagschattens.

## Pixelzugriff

```java
// Read pixels from the canvas into a bitmap
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));
canvas.readPixels(bmp, 0, 0); // Read starting from (0,0) on canvas

// Write pixels back to the canvas
canvas.writePixels(bmp, 50, 50);
```

- `readPixels(bitmap, srcX, srcY)`: Liest Pixel vom Canvas in eine Bitmap.
- `writePixels(bitmap, x, y)`: Schreibt Pixel von einer Bitmap auf den Canvas.