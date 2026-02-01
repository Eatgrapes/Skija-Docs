# API-Referenz: PathMeasure

`PathMeasure` wird verwendet, um die Länge eines Pfads zu berechnen und die Position und Tangente an einer bestimmten Entfernung entlang des Pfads zu finden.

## Überblick

Ein `PathMeasure`-Objekt wird mit einem [`Path`](Path.md) initialisiert. Es durchläuft die Konturen des Pfads. Wenn der Pfad mehrere Konturen hat, können Sie mit `nextContour()` zur nächsten wechseln.

## Konstruktoren

- `new PathMeasure()`: Erstellt einen leeren `PathMeasure`.
- `new PathMeasure(path)`: Initialisiert mit dem angegebenen Pfad.
- `new PathMeasure(path, forceClosed)`: Wenn `forceClosed` true ist, wird der Pfad so behandelt, als wäre er geschlossen, auch wenn er es nicht ist.
- `new PathMeasure(path, forceClosed, resScale)`: `resScale` steuert die Genauigkeit der Messung (Standard ist 1.0).

## Methoden

### Zustandsverwaltung

- `setPath(path, forceClosed)`: Setzt das Maß mit einem neuen Pfad zurück.
- `nextContour()`: Wechselt zur nächsten Kontur im Pfad. Gibt `true` zurück, falls eine existiert.
- `isClosed()`: Gibt `true` zurück, wenn die aktuelle Kontur geschlossen ist.

### Messungen

- `getLength()`: Gibt die Gesamtlänge der aktuellen Kontur zurück.
- `getPosition(distance)`: Gibt den `Point` an der angegebenen Entfernung entlang des Pfads zurück.
- `getTangent(distance)`: Gibt die Tangente (als `Point`-Vektor) an der angegebenen Entfernung zurück.
- `getRSXform(distance)`: Gibt die `RSXform` an der angegebenen Entfernung zurück.
- `getMatrix(distance, getPosition, getTangent)`: Gibt eine `Matrix33` zurück, die die Position und/oder Tangente an der Entfernung darstellt.

### Extraktion

- `getSegment(startD, endD, dst, startWithMoveTo)`: Gibt das Segment des Pfads zwischen `startD` und `endD` in den bereitgestellten `PathBuilder` zurück.

## Beispiel

```java
Path path = Path.makeCircle(100, 100, 50);
PathMeasure measure = new PathMeasure(path);

float length = measure.getLength();
Point pos = measure.getPosition(length / 2); // Punkt auf halbem Weg abrufen
Point tan = measure.getTangent(length / 2);   // Richtung an diesem Punkt abrufen
```