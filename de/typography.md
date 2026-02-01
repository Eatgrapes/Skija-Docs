# Typografie und Text

Text ist einer der komplexesten Teile jeder Grafikbibliothek. Skija bietet eine High-Level-API, um alles von einfachen Beschriftungen bis hin zu komplexem mehrzeiligem Textlayout zu handhaben.

## Die Typeface (Das "Was")

Eine `Typeface` repräsentiert eine bestimmte Schriftartdatei (wie "Inter-Bold.ttf"). Sie definiert die Form der Glyphen.

### Typefaces laden
Sie können sie aus Dateien, Ressourcen oder dem System-Schriftarten-Manager laden.

```java
// From a file
Typeface inter = Typeface.makeFromFile("fonts/Inter.ttf");

// From system (safe way)
Typeface sans = FontMgr.getDefault().matchFamilyStyle("sans-serif", FontStyle.NORMAL);
```

**Häufige Fehlerquelle:** Gehen Sie nicht davon aus, dass eine Schriftart auf dem System des Benutzers existiert. Stellen Sie immer einen Fallback bereit oder binden Sie Ihre Schriftarten als Ressourcen ein.

## Die Font (Das "Wie")

Eine `Font` nimmt eine `Typeface` und verleiht ihr eine Größe und andere Darstellungsattribute.

```java
Font font = new Font(inter, 14f);
```

### Textpositionierung: Font-Metriken

Wenn Sie Text zentrieren oder präzise ausrichten möchten, müssen Sie `FontMetrics` verstehen.

```java
FontMetrics metrics = font.getMetrics();
// metrics.getAscent()  -> Abstand von der Grundlinie nach oben (negativ)
// metrics.getDescent() -> Abstand von der Grundlinie nach unten (positiv)
// metrics.getLeading() -> Vorgeschlagener Abstand zwischen den Zeilen
```

**Beispiel: Perfekte vertikale Zentrierung**
Um Text vertikal bei `y` zu zentrieren, möchten Sie ihn normalerweise um die Hälfte der Höhe der "Cap Height" (Höhe der Großbuchstaben) versetzen.

```java
float centerY = rect.getMidY() - metrics.getCapHeight() / 2f;
canvas.drawString("HELLO", rect.getLeft(), centerY, font, paint);
```

## Fortgeschrittener Text: Paragraph

Für alles, was komplexer ist als ein einzelnes Wort oder eine Zeile, verwenden Sie die **Paragraph**-API. Sie behandelt:
- Zeilenumbruch
- Mehrere Stile (fett, kursiv, Farben) in einem Block
- Rechts-nach-links (RTL) Text
- Emoji-Unterstützung

Siehe [**Paragraph API Referenz**](api/Paragraph.md) für Details.

## Interaktiver Text: TextLine

Wenn Sie eine einzelne Textzeile benötigen, aber genau wissen müssen, wo sich jedes Zeichen befindet (z.B. für einen Cursor oder eine Auswahl in einem Texteingabefeld), verwenden Sie `TextLine`.

```java
TextLine line = TextLine.make("Interact with me", font);

// Visuelle Eigenschaften abrufen
float width = line.getWidth();
float height = line.getHeight();

// Hit-Testing: Zeichenindex an einer Pixelkoordinate abrufen
int charIndex = line.getOffsetAtCoord(45.0f);

// Pixelkoordinate für einen Zeichenindex abrufen
float xCoord = line.getCoordAtOffset(5);

// Darstellung
canvas.drawTextLine(line, 20, 50, paint);
```

### Visuelle Beispiele

**Interaktive Textzeile:**
Siehe [`examples/scenes/src/TextLineScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextLineScene.java) für eine Demo zur Cursorpositionierung, Hit-Testing und mehrsprachigem Textlayout.

**Text Blob Effekte:**
Siehe [`examples/scenes/src/TextBlobScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextBlobScene.java) für Beispiele zu Text-auf-Pfad, welligem Text und benutzerdefinierter Positionierung.

## Best Practices

1.  **Cachen Sie Ihre Fonts/Typefaces:** Das Erstellen einer `Typeface` beinhaltet das Parsen einer Datei und kann langsam sein. Bewahren Sie sie in einem statischen Cache oder einem Theme-Manager auf.
2.  **Verwenden Sie Hinting/Anti-Aliasing:** Für kleinen Text auf Bildschirmen stellen Sie sicher, dass Anti-Aliasing in Ihrer `Paint` aktiviert ist, um die Lesbarkeit zu erhalten.
3.  **Messen vor dem Zeichnen:** Verwenden Sie `font.measureTextWidth(string)`, um Layouts zu berechnen, bevor Sie sie tatsächlich auf die Leinwand zeichnen.