# API-Referenz: Paint

Die `Paint`-Klasse definiert den Stil, die Farbe und die Effekte, die beim Zeichnen auf einer `Canvas` verwendet werden. Es ist ein leichtgewichtiges Objekt, das über mehrere Zeichenaufrufe hinweg wiederverwendet werden kann.

## Kerneigenschaften

### Farbe und Transparenz

- `setColor(int color)`: Setzt die ARGB-Farbe.
- `setAlpha(int alpha)`: Setzt nur die Alpha-Komponente (Transparenz) (0-255).
- `setColor4f(Color4f color, ColorSpace space)`: Setzt die Farbe mit Fließkommawerten für höhere Präzision.

### Stil

- `setMode(PaintMode mode)`: Legt fest, ob die Farbe das Innere einer Form füllt (`FILL`), die Kontur zeichnet (`STROKE`) oder beides (`STROKE_AND_FILL`).
- `setStrokeWidth(float width)`: Setzt die Dicke des Strichs.
- `setStrokeCap(PaintStrokeCap cap)`: Definiert die Form der Enden einer gezeichneten Linie (BUTT, ROUND, SQUARE).
- `setStrokeJoin(PaintStrokeJoin join)`: Definiert, wie gezeichnete Segmente verbunden werden (MITER, ROUND, BEVEL).

### Kantenglättung (Anti-Aliasing)

- `setAntiAlias(boolean enabled)`: Aktiviert oder deaktiviert die Kantenglättung. Für die meisten UI-Zeichnungen dringend empfohlen.

## Effekte und Shader

`Paint`-Objekte können mit verschiedenen Effekten erweitert werden, um komplexe visuelle Darstellungen zu erzeugen.

### Shader (Verläufe und Muster)

Shader definieren die Farbe jedes Pixels basierend auf seiner Position.
- `setShader(Shader shader)`: Wendet einen linearen Verlauf, radialen Verlauf oder ein Bildmuster an.

### Farbfilter

Farbfilter modifizieren die Farben der Quelle, bevor sie gezeichnet werden.
- `setColorFilter(ColorFilter filter)`: Wendet Farbmatrizen, Mischmodi oder Luma-Transformationen an.

### Maskenfilter (Weichzeichner)

Maskenfilter beeinflussen den Alpha-Kanal der Zeichnung.
- `setMaskFilter(MaskFilter filter)`: Wird hauptsächlich zum Erzeugen von Weichzeichnungen und Schatten verwendet.

### Bildfilter

Bildfilter sind komplexer und können das gesamte Zeichnungsergebnis beeinflussen.
- `setImageFilter(ImageFilter filter)`: Wird für Weichzeichnungen, Schlagschatten und die Kombination mehrerer Effekte verwendet.

## Verwendungsbeispiel

```java
Paint paint = new Paint()
    .setColor(0xFF4285F4)
    .setAntiAlias(true)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(4f)
    .setStrokeJoin(PaintStrokeJoin.ROUND);

canvas.drawRect(Rect.makeXYWH(10, 10, 100, 100), paint);
```

## Hinweis zur Leistung

Das Erstellen eines `Paint`-Objekts ist relativ schnell, aber häufige Änderungen in einer engen Schleife können zu gewissem Overhead führen. Im Allgemeinen wird empfohlen, Ihre `Paint`-Objekte einmal vorzubereiten und während des Rendering-Vorgangs wiederzuverwenden, wenn sich ihre Eigenschaften nicht ändern.