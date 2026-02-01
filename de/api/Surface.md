# API-Referenz: Surface

Die `Surface`-Klasse ist das Ziel für alle Zeichenbefehle. Sie verwaltet den Pixelspeicher (auf CPU oder GPU) und stellt das `Canvas` bereit, das Sie zum Zeichnen verwenden.

## Überblick

Eine `Surface` ist verantwortlich für:
1.  Das Halten der Pixeldaten (oder das Verwalten der GPU-Textur).
2.  Das Bereitstellen einer `Canvas`-Schnittstelle, um in diese Daten zu zeichnen.
3.  Das Erstellen eines Schnappschusses (`Image`) des aktuellen Inhalts.

## Erstellen einer Surface

### 1. Raster-Surface (CPU)
Die einfachste Surface. Pixel befinden sich im Standardsystemspeicher (RAM). Am besten geeignet zum Generieren von Bildern, serverseitigem Rendern oder zum Testen.

```java
// Standard 32-bit RGBA-Surface
Surface raster = Surface.makeRasterN32Premul(800, 600);

// Mit benutzerdefinierter ImageInfo (z.B. F16-Farbe für HDR)
ImageInfo info = new ImageInfo(800, 600, ColorType.RGBA_F16, AlphaType.PREMUL);
Surface hdrSurface = Surface.makeRaster(info);
```

### 2. GPU-Surface (Renderziel)
Wird für hardwarebeschleunigtes Rendern verwendet. Sie benötigen einen `DirectContext` (OpenGL/Metal/Vulkan-Kontext).

```java
DirectContext context = ...; // Ihr GPU-Kontext

// Erstellt eine neue Textur auf der GPU, die von Skia verwaltet wird
Surface gpuSurface = Surface.makeRenderTarget(
    context,
    false,             // Budgeted? (Sollte Skia dies gegen sein Cache-Limit zählen?)
    ImageInfo.makeN32Premul(800, 600)
);
```

### 3. Einbinden bestehender OpenGL/Metal-Texturen
Wenn Sie Skija in eine bestehende Game-Engine oder ein Fenstersystem (wie LWJGL oder JWM) integrieren, stellt das Fenster normalerweise eine "Framebuffer"- oder "Textur"-ID bereit. Diese binden Sie ein, damit Skija direkt auf den Bildschirm zeichnen kann.

```java
// OpenGL-Beispiel
int framebufferId = 0; // Standard-Bildschirmpuffer
BackendRenderTarget renderTarget = BackendRenderTarget.makeGL(
    800, 600,          // Breite, Höhe
    0,                 // Sample-Anzahl (0 für kein MSAA)
    8,                 // Stencil-Bits
    framebufferId,
    BackendRenderTarget.FRAMEBUFFER_FORMAT_GR_GL_RGBA8
);

Surface screenSurface = Surface.wrapBackendRenderTarget(
    context,
    renderTarget,
    SurfaceOrigin.BOTTOM_LEFT, // OpenGL-Koordinaten beginnen unten links
    ColorType.RGBA_8888,
    ColorSpace.getSRGB(),
    null // SurfaceProps
);
```

### 4. Einbinden von Raster-Pixeln (Interop)
Wenn Sie einen `ByteBuffer` oder Zeiger von einer anderen Bibliothek haben (z.B. von einem Videoframe-Decoder), können Sie ihn direkt einbinden, ohne ihn zu kopieren.

```java
long pixelPtr = ...; // Nativer Zeiger auf den Speicher
int rowBytes = width * 4; // Bytes pro Zeile

Surface wrap = Surface.wrapPixels(
    ImageInfo.makeN32Premul(width, height),
    pixelPtr,
    rowBytes
);
```

### 5. Null-Surface
Erstellt eine Surface, die nichts tut. Nützlich zum Messen oder Testen ohne Speicherzuweisung.

```java
Surface nullSurface = Surface.makeNull(100, 100);
```

## Erstellen von Schnappschüssen (`Image`)

Das Erstellen eines unveränderlichen `Image` aus einer `Surface` ist eine kostengünstige Operation (Copy-on-Write).

```java
// Dies kopiert die Pixel nicht sofort!
// Es "verzweigt" effektiv die Surface. Zukünftige Zeichenoperationen auf 'surface' beeinflussen 'snapshot' nicht.
Image snapshot = surface.makeImageSnapshot();

// Sie können 'snapshot' jetzt verwenden, um auf eine andere Surface zu zeichnen oder auf die Festplatte zu speichern.
```

## Interaktion mit dem Inhalt

```java
// Holt das Canvas zum Zeichnen
Canvas canvas = surface.getCanvas();
canvas.drawCircle(50, 50, 20, paint);

// Liest Pixel zurück in eine Bitmap
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));
if (surface.readPixels(bitmap, 0, 0)) {
    // Pixel erfolgreich gelesen
}

// Schreibt Pixel von einer Bitmap auf die Surface
surface.writePixels(bitmap, 10, 10);

// Sendet Befehle an die GPU (wichtig für GPU-Surfaces)
surface.flush();
```

- `getCanvas()`: Gibt das Canvas zum Zeichnen zurück.
- `readPixels(bitmap, x, y)`: Liest Pixel von der GPU/CPU zurück in eine Bitmap.
- `writePixels(bitmap, x, y)`: Schreibt Pixel von einer Bitmap auf die Surface.
- `flush()`: Stellt sicher, dass alle ausstehenden GPU-Befehle an den Treiber gesendet werden.
- `notifyContentWillChange()`: Rufen Sie dies auf, wenn Sie den zugrundeliegenden Pixelspeicher direkt ändern (unter Umgehung des Canvas).
- `getRecordingContext()`: Gibt den `DirectContext` zurück, der diese Surface unterstützt (falls vorhanden).