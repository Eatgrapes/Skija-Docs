# API-Referenz: Path

Die `Path`-Klasse repräsentiert komplexe, zusammengesetzte geometrische Pfade, die aus geraden Liniensegmenten, quadratischen Kurven und kubischen Kurven bestehen.

> **Hinweis:** Zum Erstellen neuer Pfade wird dringend empfohlen, [**PathBuilder**](path-builder.md) zu verwenden, anstatt Methoden direkt auf `Path` aufzurufen. `PathBuilder` bietet eine bessere fließende API und stellt sicher, dass der resultierende `Path` unveränderlich ist.

## Einen Pfad erstellen (Statische Fabrikmethoden)

Während `PathBuilder` für komplexe Pfade bevorzugt wird, bietet `Path` effiziente statische Fabrikmethoden für häufige Formen.

- `makeRect(rect)`: Erstellt einen Pfad aus einem Rechteck.
- `makeOval(rect)`: Erstellt einen Pfad aus einem Oval.
- `makeCircle(x, y, radius)`: Erstellt einen Pfad aus einem Kreis.
- `makeRRect(rrect)`: Erstellt einen Pfad aus einem abgerundeten Rechteck.
- `makeLine(p1, p2)`: Erstellt einen Pfad aus einem einzelnen Liniensegment.
- `makePolygon(points, closed)`: Erstellt einen Pfad aus einer Punktfolge.
- `makeFromSVGString(svgString)`: Parst einen SVG-Pfad-String (z.B. `"M10 10 L50 50 Z"`).

## Pfadinformationen & Metriken

- `getBounds()`: Gibt die konservative Begrenzungsbox zurück (schnell, gecached).
- `computeTightBounds()`: Gibt die präzise Begrenzungsbox zurück (langsamer).
- `isEmpty()`: Gibt true zurück, wenn der Pfad keine Verben enthält.
- `isConvex()`: Gibt true zurück, wenn der Pfad eine konvexe Form definiert.
- `isRect()`: Gibt das `Rect` zurück, wenn der Pfad ein einfaches Rechteck darstellt, sonst null.
- `isOval()`: Gibt die umschließende `Rect` zurück, wenn der Pfad ein Oval ist, sonst null.
- `isFinite()`: Gibt true zurück, wenn alle Punkte im Pfad endlich sind.

## Treffertests

- `contains(x, y)`: Gibt true zurück, wenn der angegebene Punkt innerhalb des Pfades liegt (basierend auf dem aktuellen Fülltyp).
- `conservativelyContainsRect(rect)`: Gibt true zurück, wenn das Rechteck definitiv innerhalb des Pfades liegt (schneller Ablehnungstest).

## Boolesche Operationen

Pfade können mit logischen Operationen kombiniert werden. Diese erstellen ein **neues** `Path`-Objekt.

```java
Path result = Path.makeCombining(pathA, pathB, PathOp.INTERSECT);
```

Verfügbare `PathOp`s:
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A

## Transformationen & Modifikation

Diese Methoden geben eine **neue** `Path`-Instanz mit der angewendeten Transformation zurück.

- `makeTransform(matrix)`: Wendet eine `Matrix33` auf alle Punkte im Pfad an.
- `makeOffset(dx, dy)`: Verschiebt den Pfad.
- `makeScale(s)`: Skaliert den Pfad.

## Interpolation (Morphing)

Sie können zwischen zwei kompatiblen Pfaden interpolieren (nützlich für Animationen).

```java
// Interpoliere 50% zwischen pathA und pathB
if (pathA.isInterpolatable(pathB)) {
    Path midPath = pathA.makeInterpolate(pathB, 0.5f);
}
```

## Serialisierung

- `serializeToBytes()`: Serialisiert den Pfad in ein Byte-Array.
- `makeFromBytes(bytes)`: Rekonstruiert einen Pfad aus Bytes.
- `dump()`: Gibt die Pfadstruktur auf die Standardausgabe aus (für Debugging).

## Messen und Iteration

- `PathMeasure`: Wird verwendet, um die Länge eines Pfades zu berechnen und Positionen/Tangenten entlang seiner Länge zu finden.
- `PathSegmentIterator`: Ermöglicht es, über die einzelnen Verben und Punkte zu iterieren, aus denen der Pfad besteht.

## Beispiel

```java
Path path = new Path()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath();

canvas.drawPath(path, paint);
```

## Fülltyp

Der Fülltyp bestimmt, welche Bereiche für Fülloperationen als "innen" betrachtet werden.
- `WINDING` (Standard): Verwendet die Windungszahlregel.
- `EVEN_ODD`: Verwendet die Even-Odd-Regel.
- `INVERSE_WINDING`: Invertiert die Windungsregel (füllt außen).
- `INVERSE_EVEN_ODD`: Invertiert die Even-Odd-Regel.

## Visuelles Beispiel

Siehe [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) für Beispiele zum Erstellen, Modifizieren und Kombinieren von Pfaden.
