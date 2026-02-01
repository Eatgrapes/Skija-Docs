# API-Referenz: TextBlob & Builder

Ein `TextBlob` ist eine unveränderliche, optimierte Darstellung einer Menge von Glyphen. Es ist die schnellste Möglichkeit, Text in Skija zu zeichnen, wenn das Textlayout (Position der Glyphen) sich nicht ändert.

## TextBlob

`TextBlob` kombiniert Glyphen, Positionen und Schriftarten in einem einzigen Objekt, das wiederverwendet werden kann.

### Eigenschaften
- `getBounds()`: Gibt die konservative Begrenzungsbox des Blobs zurück.
- `getUniqueId()`: Gibt einen eindeutigen Bezeichner für das Caching zurück.
- `serializeToData()`: Serialisiert den Blob in ein `Data`-Objekt.

### Erstellung aus Positionen
Wenn Sie bereits Glyphenpositionen berechnet haben (z.B. mit `Shaper` oder manuell), können Sie einen Blob direkt erstellen.

```java
// Nur horizontale Positionen (y ist konstant)
TextBlob blob = TextBlob.makeFromPosH(glyphs, xPositions, y, font);

// Volle (x, y) Positionen für jede Glyphe
TextBlob blob2 = TextBlob.makeFromPos(glyphs, points, font);

// RSXform (Rotation + Skalierung + Translation) für jede Glyphe
TextBlob blob3 = TextBlob.makeFromRSXform(glyphs, xforms, font);
```

### Zeichnen
```java
canvas.drawTextBlob(blob, x, y, paint);
```

---

## TextBlobBuilder

`TextBlobBuilder` ermöglicht es Ihnen, einen `TextBlob` durch Anhängen mehrerer "Runs" (Abschnitte) von Text zu konstruieren. Ein "Run" ist eine Sequenz von Glyphen, die dieselbe Schriftart und denselben Paint teilen.

### Grundlegende Verwendung

```java
TextBlobBuilder builder = new TextBlobBuilder();

// Einen Text-Run anhängen
builder.appendRun(font, "Hello ", 0, 0);

// Einen weiteren Run anhängen (z.B. mit anderem Stil oder Position)
builder.appendRun(boldFont, "World!", 100, 0);

// Den unveränderlichen TextBlob erstellen
TextBlob blob = builder.build();
```

### Fortgeschrittenes Anhängen
- `appendRun(font, glyphs, x, y, bounds)`: Hängt Glyphen mit einem gemeinsamen Ursprung an.
- `appendRunPosH(...)`: Hängt Glyphen mit expliziten X-Positionen an.
- `appendRunPos(...)`: Hängt Glyphen mit expliziten (X, Y) Positionen an.
- `appendRunRSXform(...)`: Hängt Glyphen mit vollständigen affinen Transformationen (Rotation/Skalierung) an.

### Performance-Tipp
Wenn Sie denselben Textabschnitt mehrmals zeichnen (selbst wenn sich die Leinwand bewegt), erstellen Sie den `TextBlob` einmal und verwenden Sie ihn wieder. Dies vermeidet die Neuberechnung von Glyphenpositionen und -formen.