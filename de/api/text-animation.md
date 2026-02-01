# Fortgeschrittene Typografie: Clipping & Animation

Skija bietet leistungsstarke Werkzeuge nicht nur zum Zeichnen von statischem Text, sondern auch, um Text als geometrisches Objekt für Clipping, Maskierung und Animation zu verwenden.

## Text als Clip (Maskierung)

Um Text als Maske zu verwenden (z.B. um ein Bild *innerhalb* der Buchstaben anzuzeigen), kann man nicht einfach "auf den Text clippen". Stattdessen muss der Text zuerst in einen `Path` umgewandelt werden.

### 1. Den Pfad aus dem Text erhalten
Verwende `Font.getPath()`, um die geometrische Umrisslinie bestimmter Glyphen zu erhalten.

```java
Font font = new Font(typeface, 100);
short[] glyphs = font.getStringGlyphs("MASK");

// Den Pfad für diese Glyphen erhalten
// Hinweis: getPaths gibt ein Array von Pfaden zurück (einen pro Glyphe)
// Oft möchte man sie kombinieren oder einfach sequenziell zeichnen
Point[] positions = font.getPositions(glyphs, new Point(50, 150)); // Text positionieren

Path textPath = new Path();
for (int i = 0; i < glyphs.length; i++) {
    Path glyphPath = font.getPath(glyphs[i]);
    if (glyphPath != null) {
        // Den Glyphenpfad an seine Position verschieben und zum Hauptpfad hinzufügen
        glyphPath.transform(Matrix33.makeTranslate(positions[i].getX(), positions[i].getY()));
        textPath.addPath(glyphPath);
    }
}
```

### 2. Die Leinwand clippen
Sobald man den `Path` hat, kann die Leinwand geclippt werden.

```java
canvas.save();
canvas.clipPath(textPath);

// Jetzt das Bild (oder den Farbverlauf, oder das Muster) zeichnen
// Es wird nur innerhalb der Buchstaben "MASK" erscheinen
canvas.drawImage(myImage, 0, 0);

canvas.restore();
```

## Text animieren

Skija ermöglicht hochperformante Textanimation, indem es über `TextBlob` Low-Level-Zugriff auf die Glyphenpositionierung bietet.

### 1. Pro-Glyphen-Animation (Wellenförmiger Text)
Anstatt einen String zu zeichnen, berechnet man die Position jedes Zeichens manuell.

```java
String text = "Wavy Text";
short[] glyphs = font.getStringGlyphs(text);
float[] widths = font.getWidths(glyphs);

// Positionen für jede Glyphe berechnen
Point[] positions = new Point[glyphs.length];
float x = 50;
float time = (System.currentTimeMillis() % 1000) / 1000f; // 0.0 bis 1.0

for (int i = 0; i < glyphs.length; i++) {
    // Sinuswellen-Animation
    float yOffset = (float) Math.sin((x / 50.0) + (time * Math.PI * 2)) * 10;
    
    positions[i] = new Point(x, 100 + yOffset);
    x += widths[i];
}

// Einen TextBlob aus diesen expliziten Positionen erstellen
TextBlob blob = TextBlob.makeFromPos(glyphs, positions, font);

// Ihn zeichnen
canvas.drawTextBlob(blob, 0, 0, paint);
```

### 2. Text auf einem Pfad (RSXform)
Für Text, der einer Kurve folgt (und sich dreht, um der Kurve zu entsprechen), verwende `RSXform` (Rotation Scale Translate Transform).

```java
// Siehe 'TextBlob.makeFromRSXform' in der API
// Dies erlaubt es, eine Rotation und Position für jede einzelne Glyphe unabhängig anzugeben.
```

## Variable Fonts
Wenn man eine variable Schriftart (wie `Inter-Variable.ttf`) hat, kann man ihr Gewicht oder ihre Neigung sanft animieren.

```java
// 1. Eine FontVariation-Instanz erstellen
FontVariation weight = new FontVariation("wght", 400 + (float)Math.sin(time) * 300); // Gewicht 100 bis 700

// 2. Eine spezifische Typeface aus der variablen Basis erstellen
Typeface currentFace = variableTypeface.makeClone(weight);

// 3. Eine Font erstellen und zeichnen
Font font = new Font(currentFace, 40);
canvas.drawString("Breathing Text", 50, 50, font, paint);
```

## Zusammenfassung

- **Clipping:** Text -> Glyphen -> Path -> `canvas.clipPath()`.
- **Wellenförmiger/Bewegter Text:** `Point[]` Positionen manuell berechnen und `TextBlob.makeFromPos()` verwenden.
- **Text auf Pfad:** `TextBlob.makeFromRSXform()` verwenden.
- **Gewichts/Stil-Animation:** Variable Fonts und `makeClone(FontVariation)` verwenden.