# API-Referenz: TextLine

`TextLine` repräsentiert eine einzelne Zeile formatierten Textes. Sie wird typischerweise vom `Shaper` erstellt und stellt Metriken sowie Treffertest-Funktionen bereit, die für den Bau von Texteditoren oder interaktiven Beschriftungen essenziell sind.

## Erstellung

```java
// Eine einzelne Textzeile formatieren
TextLine line = TextLine.make("Hello World", font);
```

## Metriken

- `getAscent()`: Abstand von der Grundlinie zur Oberseite des höchsten Glyphs (negativ).
- `getDescent()`: Abstand von der Grundlinie zur Unterseite des tiefsten Glyphs (positiv).
- `getCapHeight()`: Höhe der Großbuchstaben.
- `getXHeight()`: Höhe des Kleinbuchstabens 'x'.
- `getWidth()`: Gesamte Vorrückbreite (advance width) der Zeile.
- `getHeight()`: Gesamthöhe (descent - ascent).

## Treffertest (Interaktion)

`TextLine` bietet Methoden, um zwischen Pixelkoordinaten und Zeichenpositionen zu wechseln.

```java
// 1. Position von Koordinate ermitteln (Klicken)
float x = mouseEvent.getX();
int offset = line.getOffsetAtCoord(x); // Gibt UTF-16 Zeichenindex zurück
// 'offset' liegt am nächsten am Mauszeiger

// 2. Koordinate von Position ermitteln (Cursorplatzierung)
float cursorX = line.getCoordAtOffset(offset);
// Zeichne einen Cursor bei (cursorX, baseline)
```

- `getOffsetAtCoord(x)`: Nächstgelegener Zeichenoffset.
- `getLeftOffsetAtCoord(x)`: Zeichenoffset streng links davon.
- `getCoordAtOffset(offset)`: Pixel-X-Koordinate für einen gegebenen Zeichenindex.

## Darstellung

```java
// Sie können die Zeile direkt zeichnen
canvas.drawTextLine(line, x, y, paint);

// Oder den TextBlob für manuellere Kontrolle extrahieren
try (TextBlob blob = line.getTextBlob()) {
    canvas.drawTextBlob(blob, x, y, paint);
}
```

## Lebenszyklus
`TextLine` implementiert `Managed`. Schließen Sie sie immer, wenn Sie fertig sind, um native Ressourcen freizugeben.

```java
try (TextLine line = TextLine.make(text, font)) {
    // ... verwende line ...
}
```