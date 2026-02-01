# API-Referenz: Animation (Skottie)

Die `Animation`-Klasse (in `io.github.humbleui.skija.skottie`) bietet Unterstützung für das Laden und Rendern von Lottie-Animationen.

## Überblick

Skottie ist ein leistungsstarker Lottie-Player für Skia. Die `Animation`-Klasse ermöglicht es Ihnen, Lottie-Animationen aus Dateien, Strings oder Daten zu laden und bestimmte Frames auf eine `Canvas` zu rendern.

## Erstellung

- `makeFromString(data)`: Erstellt eine `Animation` aus einem JSON-String.
- `makeFromFile(path)`: Erstellt eine `Animation` aus einem Dateipfad.
- `makeFromData(data)`: Erstellt eine `Animation` aus einem `Data`-Objekt.

## Rendering

- `render(canvas)`: Zeichnet den aktuellen Frame auf die Canvas bei `(0, 0)` mit der natürlichen Größe der Animation.
- `render(canvas, offset)`: Zeichnet den aktuellen Frame an der angegebenen `(x, y)`-Verschiebung.
- `render(canvas, left, top)`: Zeichnet den aktuellen Frame an den angegebenen Koordinaten.
- `render(canvas, dst, renderFlags)`: Zeichnet den aktuellen Frame, skaliert auf das Ziel-`Rect`.

## Steuerung der Wiedergabe

Um einen bestimmten Frame zu rendern, müssen Sie zunächst zu ihm springen.

- `seek(t)`: Springt zu einer normalisierten Zeit `t` im Bereich `[0..1]`.
- `seek(t, ic)`: Springt zu einer normalisierten Zeit `t` mit einem `InvalidationController`.
- `seekFrame(t)`: Springt zu einem bestimmten Frame-Index `t` (relativ zu `duration * fps`).
- `seekFrameTime(t)`: Springt zu einer bestimmten Zeit `t` in Sekunden.

## Eigenschaften

- `getDuration()`: Gibt die Gesamtdauer der Animation in Sekunden zurück.
- `getFPS()`: Gibt die Bildrate (Frames pro Sekunde) zurück.
- `getInPoint()`: Gibt den In-Point (Startframe) in Frame-Index-Einheiten zurück.
- `getOutPoint()`: Gibt den Out-Point (Endframe) in Frame-Index-Einheiten zurück.
- `getVersion()`: Gibt die Lottie-Versionszeichenkette zurück.
- `getSize()`: Gibt die natürliche Größe der Animation als `Point` zurück.
- `getWidth()`: Gibt die Breite der Animation zurück.
- `getHeight()`: Gibt die Höhe der Animation zurück.

## Beispiel

```java
// Animation aus Ressourcen oder Dateisystem laden
try (var anim = Animation.makeFromFile("loading.json")) {
    
    // Animationsinformationen abrufen
    float duration = anim.getDuration(); // in Sekunden
    float width = anim.getWidth();
    float height = anim.getHeight();

    // Auf das Rendering vorbereiten
    anim.seek(0.5f); // Zur Mitte der Animation springen (50%)

    // Auf Canvas rendern
    // Nimmt an, dass Sie eine Canvas-Instanz 'canvas' haben
    canvas.save();
    canvas.translate(100, 100); // Position der Animation
    anim.render(canvas);
    canvas.restore();
}
```