# API-Referenz: Shaper (Text-Shaping)

Die `Shaper`-Klasse ist für **Text-Shaping** zuständig: den Prozess der Umwandlung einer Zeichenkette aus Unicode-Zeichen in einen Satz positionierter Glyphen aus einer Schriftart.

## Überblick

Text-Shaping ist notwendig für:
- **Ligaturen**: Umwandlung von "f" + "i" in eine einzelne "fi"-Glyphe.
- **Kerning**: Anpassung des Abstands zwischen bestimmten Zeichenpaaren (wie "AV").
- **Komplexe Schriften**: Behandlung von Arabisch, Devanagari oder Thai, bei denen sich die Glyphenform basierend auf ihren Nachbarn ändert.
- **BiDi**: Behandlung von gemischtem Links-nach-Rechts- (Latein) und Rechts-nach-Links-Text (Arabisch/Hebräisch).

## Grundlegendes Shaping

Um einfach einen `TextBlob` (einen Satz positionierter Glyphen) zu erhalten, den Sie zeichnen können, verwenden Sie die Methode `shape()`.

```java
try (Shaper shaper = Shaper.make()) {
    Font font = new Font(typeface, 24);
    
    // Einfaches Shaping (keine Breitenbegrenzung)
    TextBlob blob = shaper.shape("Hello, Skija!", font);
    
    canvas.drawTextBlob(blob, 20, 50, paint);
}
```

## Umbruch und mehrzeiliges Shaping

`Shaper` kann auch Zeilenumbrüche basierend auf einer maximalen Breite berechnen.

```java
float maxWidth = 300f;
TextBlob multiLineBlob = shaper.shape(
    "This is a long sentence that will be wrapped by the shaper.",
    font,
    maxWidth
);

// Hinweis: Der resultierende TextBlob enthält alle Zeilen korrekt zueinander positioniert.
canvas.drawTextBlob(multiLineBlob, 20, 100, paint);
```

## Shaping-Optionen

Sie können das Shaping-Verhalten (z.B. Textrichtung) mit `ShapingOptions` steuern.

```java
ShapingOptions options = ShapingOptions.DEFAULT.withLeftToRight(false); // RTL
TextBlob blob = shaper.shape("مرحبا", font, options, Float.POSITIVE_INFINITY, Point.ZERO);
```

## Erweitertes Shaping (RunHandler)

Wenn Sie volle Kontrolle über den Shaping-Prozess benötigen (z.B. zur Implementierung eigener Textauswahl oder eines benutzerdefinierten Layouts mit mehreren Stilen), können Sie einen `RunHandler` verwenden.

```java
shaper.shape(text, font, ShapingOptions.DEFAULT, maxWidth, new RunHandler() {
    @Override
    public void beginLine() { ... }

    @Override
    public void runInfo(RunInfo info) {
        // Informationen über den aktuellen Glyphenlauf erhalten
        System.out.println("Glyph count: " + info.getGlyphCount());
    }

    @Override
    public void commitRunInfo() { ... }

    @Override
    public Point commitLine() { return Point.ZERO; }

    // ... weitere Methoden ...
});
```

## Leistung

- **Caching**: Text-Shaping ist eine rechenintensive Operation (unter Einbeziehung von HarfBuzz). Wenn Ihr Text statisch ist, shapen Sie ihn einmal und speichern Sie den resultierenden `TextBlob`.
- **Shaper-Instanz**: Das Erstellen eines `Shaper` beinhaltet die Initialisierung von HarfBuzz. Es wird empfohlen, eine `Shaper`-Instanz zu erstellen und sie in Ihrer gesamten Anwendung wiederzuverwenden (die Wiederverwendung ist im Allgemeinen sicher, aber überprüfen Sie die Thread-Sicherheit bei Verwendung mehrerer Threads).

## Shaper vs. Paragraph

- **Verwenden Sie `Shaper`** für hochleistungsfähige, einheitlich formatierte Textblöcke oder wenn Sie Low-Level-Zugriff auf Glyphen benötigen.
- **Verwenden Sie [Paragraph](Paragraph.md)** für Rich Text (verschiedene Farben/Schriftarten in einem Block), komplexe UI-Layouts und Standardverhalten von Texteditoren.