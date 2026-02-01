# API-Referenz: Paragraph (Rich-Text-Layout)

Für jeden Text, der mehr als eine einzelne Zeile oder mehrere Stile erfordert (z. B. ein Wort in **Fettschrift** gefolgt von einem in *Kursivschrift*), bietet Skija die **Paragraph**-API. Sie übernimmt komplexe Layout-Aufgaben wie Zeilenumbruch, RTL-Unterstützung und mehrsprachigen Text.

## Die drei Säulen von Paragraphs

Die Erstellung eines Paragraphs umfasst drei Hauptschritte:
1.  **`FontCollection`**: Definiert, woher der Paragraph seine Schriftarten bezieht.
2.  **`ParagraphStyle`**: Definiert globale Einstellungen (Ausrichtung, maximale Zeilen, Ellipse).
3.  **`ParagraphBuilder`**: Der "Zusammenbauer" für Text und Stile.

## 1. Einrichten der FontCollection

Die `FontCollection` ist der Schriftarten-Manager für Ihre Paragraphs. Sie müssen ihr mitteilen, welchen `FontMgr` sie verwenden soll.

```java
FontCollection fc = new FontCollection();
fc.setDefaultFontManager(FontMgr.getDefault());
```

## 2. Globale Formatierung (ParagraphStyle)

Dies definiert, wie der gesamte Textblock sich verhält.

```java
ParagraphStyle style = new ParagraphStyle();
style.setAlignment(Alignment.CENTER);
style.setMaxLinesCount(3);
style.setEllipsis("..."); // Wird angezeigt, wenn der Text zu lang ist
```

## 3. Zusammenbau von Rich Text (ParagraphBuilder)

Der `ParagraphBuilder` verwendet einen stapelbasierten Ansatz für Stile. Sie "pushen" einen Stil, fügen Text hinzu und "poppen" ihn, um zum vorherigen Stil zurückzukehren.

```java
ParagraphBuilder builder = new ParagraphBuilder(style, fc);

// Standardtext hinzufügen
builder.pushStyle(new TextStyle().setColor(0xFF000000).setFontSize(16f));
builder.addText("Skija ist ");

// Fettgedruckten Text hinzufügen
builder.pushStyle(new TextStyle().setColor(0xFF4285F4).setFontWeight(FontWeight.BOLD));
builder.addText("Leistungsstark");
builder.popStyle(); // Zurück zu Standard (16pt, schwarz)

builder.addText(" und einfach zu verwenden.");
```

## 4. Layout und Rendering

Ein `Paragraph` muss "gelayoutet" (gemessen und umgebrochen) werden, bevor er gezeichnet werden kann. Dafür ist eine bestimmte Breite erforderlich.

```java
Paragraph p = builder.build();

// Text so layouten, dass er in 300 Pixel passt
p.layout(300);

// An Position (x, y) zeichnen
p.paint(canvas, 20, 20);
```

## Wesentliche Methoden

- `p.getHeight()`: Ermittelt die Gesamthöhe des gelayouteten Texts.
- `p.getLongestLine()`: Ermittelt die Breite der längsten Zeile.
- `p.getLineNumber()`: Wie viele Zeilen der Text umbrochen hat.
- `p.getRectsForRange(...)`: Ermittelt Begrenzungsrahmen für eine Auswahl (nützlich für Textmarkierungen).

## Leistung und Best Practices

1.  **FontCollection wiederverwenden:** Sie benötigen typischerweise nur eine `FontCollection` für Ihre gesamte App.
2.  **Layout ist die Hauptarbeit:** `p.layout()` ist der aufwändigste Teil, da er jedes Glyph misst und Zeilenumbrüche berechnet. Wenn sich Ihr Text nicht ändert und die Breite gleich bleibt, rufen Sie es nicht erneut auf.
3.  **Textmetriken:** Verwenden Sie `p.getLineMetrics()`, wenn Sie detaillierte Informationen über Position und Höhe jeder Zeile für erweiterte UI-Layouts benötigen.
4.  **Platzhalter:** Sie können `builder.addPlaceholder()` verwenden, um Platz für Inline-Bilder oder UI-Widgets innerhalb des Textflusses freizulassen.