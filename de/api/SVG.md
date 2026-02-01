# API-Referenz: SVG

Während Skia in erster Linie eine Low-Level-Zeichenengine ist, enthält Skija ein SVG-Modul, das es Ihnen ermöglicht, direkt mit SVG-Dateien zu arbeiten. Dies ist ideal für Icons, einfache Illustrationen und Logos.

## Laden und Rendern

SVG in Skija wird durch die Klasse `SVGDOM` verwaltet.

```java
import io.github.humbleui.skija.svg.SVGDOM;

// 1. SVG-Daten laden
Data svgData = Data.makeFromFileName("assets/logo.svg");
SVGDOM svg = new SVGDOM(svgData);

// 2. Die Viewport-Größe definieren
// Das ist wichtig! SVGs haben oft keine feste Größe.
svg.setContainerSize(200, 200);

// 3. Auf eine Canvas rendern
svg.render(canvas);
```

## Skalieren von SVGs

Da SVGs vektorbasiert sind, können Sie sie auf jede Größe skalieren, ohne an Qualität zu verlieren. Ändern Sie einfach `setContainerSize` oder verwenden Sie `canvas.scale()` vor dem Rendern.

```java
canvas.save();
canvas.translate(100, 100);
canvas.scale(2.0f, 2.0f); // Doppelt so groß machen
svg.render(canvas);
canvas.restore();
```

## Zugriff auf das Wurzelelement

Sie können das Wurzel-`<svg>`-Element abrufen, um die ursprünglichen Abmessungen oder andere Metadaten abzufragen.

```java
SVGSVG root = svg.getRoot();
if (root != null) {
    Point size = root.getIntrinsicSize(); // Die im SVG definierte Größe abrufen
}
```

## Performance-Tipp: Der "Raster-Cache"

Das Rendern eines SVGs kann überraschend aufwändig sein, weil Skia die XML-ähnliche Struktur parsen und jedes Mal viele Zeichenbefehle ausführen muss.

**Beste Praxis:** Wenn Sie ein Icon haben, das oft angezeigt wird (wie ein Ordner-Icon in einem Dateimanager), rufen Sie nicht `svg.render()` für jede Instanz auf. Rendern Sie es stattdessen einmal in ein Off-Screen-`Image` und zeichnen Sie dieses Bild.

```java
// Dies einmal tun
Surface cache = Surface.makeRasterN32Premul(width, height);
svg.render(cache.getCanvas());
Image cachedIcon = cache.makeImageSnapshot();

// Dies in Ihrer Render-Schleife verwenden
canvas.drawImage(cachedIcon, x, y);
```

## Einschränkungen

Die Skija-SVG-Implementierung ist eine "Teilmenge" der vollständigen SVG-Spezifikation. Sie unterstützt die meisten gängigen Funktionen (Formen, Pfade, Füllungen, Farbverläufe), kann aber Schwierigkeiten haben mit:
- Komplexem CSS-Styling
- Skripting (JavaScript innerhalb von SVG)
- Einigen obskuren Filtereffekten

Für die meisten UI-Icons und Logos funktioniert es perfekt.