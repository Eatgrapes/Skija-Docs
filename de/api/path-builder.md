# API-Referenz: PathBuilder

`PathBuilder` ist die moderne, empfohlene Methode, um `Path`-Objekte in Skija zu konstruieren. Es bietet eine flüssige API und ist speziell für die Pfadkonstruktion entworfen, wodurch der Erstellungsprozess vom unveränderlichen `Path`-Ergebnis getrennt wird.

## Grundlegende Befehle

Bewegung und Linien:
- `moveTo(x, y)`: Startet eine neue Kontur.
- `lineTo(x, y)`: Fügt ein Liniensegment hinzu.
- `polylineTo(points)`: Fügt mehrere Liniensegmente hinzu.
- `closePath()`: Schließt die aktuelle Kontur.

Relative Befehle (Versatz vom aktuellen Punkt):
- `rMoveTo(dx, dy)`
- `rLineTo(dx, dy)`

## Kurven

Quadratische Bézier (1 Kontrollpunkt):
- `quadTo(x1, y1, x2, y2)`: Absolute Koordinaten.
- `rQuadTo(dx1, dy1, dx2, dy2)`: Relative Koordinaten.

Kubische Bézier (2 Kontrollpunkte):
- `cubicTo(x1, y1, x2, y2, x3, y3)`: Absolut.
- `rCubicTo(dx1, dy1, dx2, dy2, dx3, dy3)`: Relativ.

Konisch (Quadratisch mit Gewichtung):
- `conicTo(x1, y1, x2, y2, w)`: Nützlich für exakte Kreise/Ellipsen.
- `rConicTo(...)`: Relative Version.

## Bögen

- `arcTo(oval, startAngle, sweepAngle, forceMoveTo)`: Fügt einen Bogen hinzu, der auf das gegebene Oval beschränkt ist.
- `tangentArcTo(p1, p2, radius)`: Fügt einen Bogen hinzu, der tangential zu den Linien (aktuell -> p1) und (p1 -> p2) verläuft.
- `ellipticalArcTo(...)`: Fügt einen SVG-Stil-Bogen hinzu.

## Formen hinzufügen

`PathBuilder` ermöglicht das Hinzufügen ganzer Formen als neue Konturen.

- `addRect(rect, direction, startIndex)`
- `addOval(rect, direction, startIndex)`
- `addCircle(x, y, radius, direction)`
- `addRRect(rrect, direction, startIndex)`: Abgerundetes Rechteck.
- `addPolygon(points, close)`: Fügt eine Punktfolge als Kontur hinzu.
- `addPath(path, mode)`: Hängt die Konturen eines anderen Pfads an diesen an.

## Transformationen (Builder-Zustand)

Diese Methoden beeinflussen die Punkte, die sich *aktuell* im Builder befinden.

- `offset(dx, dy)`: Verschiebt alle vorhandenen Punkte im Builder.
- `transform(matrix)`: Wendet eine Matrix auf alle vorhandenen Punkte an.

## Builder-Verwaltung

- `reset()`: Setzt den Builder auf einen leeren Zustand zurück (behält Speicher).
- `incReserve(points, verbs)`: Reserviert Speicher vorab, um Größenänderungen während des Baus zu vermeiden.
- `setFillMode(mode)`: Setzt die Füllregel (`WINDING`, `EVEN_ODD`, etc.).
- `setVolatile(boolean)`: Gibt einen Hinweis, dass der resultierende Pfad nicht zwischengespeichert werden sollte (nützlich für einmalige Animationspfade).

## Ausgabemethoden

- **`snapshot()`**: Gibt einen `Path` zurück und behält den Builder-Zustand bei.
- **`detach()`**: Gibt einen `Path` zurück und setzt den Builder zurück (am effizientesten).
- **`build()`**: Gibt einen `Path` zurück und schließt den Builder (kann danach nicht mehr verwendet werden).

## Beispiel: Grundlegende Erstellung

```java
Path path = new PathBuilder()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath()
    .snapshot(); // Gibt den Path zurück
```

## Beispiel: Transformationen

```java
PathBuilder builder = new PathBuilder();

builder.addRect(Rect.makeXYWH(0, 0, 100, 100))
       .offset(10, 10)
       .transform(Matrix33.makeRotate(45));

Path p = builder.detach(); // Gibt Pfad zurück und setzt Builder zurück
```

## Visuelles Beispiel

Siehe [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) für verschiedene Pfadkombinationen und Füllregeln.