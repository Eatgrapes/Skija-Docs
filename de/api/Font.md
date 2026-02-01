# API-Referenz: Schriftarten & Verwaltung

Die `Font`-Klasse steuert, wie Text gerendert wird, während `FontMgr` die Schriftart-Erkennung verwaltet und `FontFeature` erweiterte OpenType-Funktionen ermöglicht.

## Font

Eine `Font` nimmt eine [`Typeface`](Typeface.md) und fügt Größe, Skalierung, Schrägstellung und Rendering-Attribute hinzu.

### Erstellung

```java
// Standardschriftart (normalerweise 12pt serifenlos)
Font font = new Font();

// Benutzerdefinierte Typeface und Größe
Font font = new Font(typeface, 24f);

// Schmal/Erweitert oder Schrägschrift
Font font = new Font(typeface, 24f, 0.8f, -0.25f);
```

- `new Font()`: Initialisiert mit Standardwerten.
- `new Font(typeface)`: Initialisiert mit einer bestimmten Typeface und Standardgröße.
- `new Font(typeface, size)`: Initialisiert mit bestimmter Typeface und Größe.
- `new Font(typeface, size, scaleX, skewX)`: Vollständiger Konstruktor.

### Metriken & Abstände

- `getSize()` / `setSize(value)`: Typografische Größe in Punkten.
- `getScaleX()` / `setScaleX(value)`: Horizontale Skalierung (1.0 ist normal).
- `getSkewX()` / `setSkewX(value)`: Horizontale Schrägstellung (0 ist normal).
- `getMetrics()`: Gibt detaillierte [`FontMetrics`](#fontmetrics) zurück.
- `getSpacing()`: Empfohlener Zeilenabstand (Summe aus Ascent, Descent und Leading).

### Rendering-Flags

Diese beeinflussen, wie Glyphen gerastert werden.

- `setSubpixel(boolean)`: Fordert Subpixel-Positionierung für glatteren Text an.
- `setEdging(FontEdging)`: Steuert Kantenglättung (`ALIAS`, `ANTI_ALIAS`, `SUBPIXEL_ANTI_ALIAS`).
- `setHinting(FontHinting)`: Steuert die Anpassung von Glyphenumrissen (`NONE`, `SLIGHT`, `NORMAL`, `FULL`).
- `setEmboldened(boolean)`: Nähert Fettschrift durch Erhöhung der Strichstärke an.
- `setBaselineSnapped(boolean)`: Rastert Grundlinien auf Pixelpositionen.
- `setMetricsLinear(boolean)`: Fordert linear skalierbare Metriken an (ignoriert Hinting/Rundung).
- `setBitmapsEmbedded(boolean)`: Fordert die Verwendung von Bitmaps in Schriftarten anstelle von Umrissen an.

### Textmessung

```java
// Einfache Breitenmessung
float width = font.measureTextWidth("Hello");

// Präzise Begrenzungsbox erhalten
Rect bounds = font.measureText("Hello");

// Breite mit spezifischen Paint-Effekten messen
float width = font.measureTextWidth("Hello", paint);
```

- `measureText(string)` / `measureText(string, paint)`: Gibt die Begrenzungsbox zurück.
- `measureTextWidth(string)` / `measureTextWidth(string, paint)`: Gibt die Vorrückbreite zurück.
- `getWidths(glyphs)`: Ruft Vorrückbreiten für jede Glyphen-ID ab.
- `getBounds(glyphs)` / `getBounds(glyphs, paint)`: Ruft Begrenzungsboxen für jede Glyphen-ID ab.

### Glyphen-Zugriff

- `getStringGlyphs(string)`: Konvertiert Text in ein Array von Glyphen-IDs.
- `getUTF32Glyph(unichar)`: Gibt die Glyphen-ID für ein einzelnes Zeichen zurück.
- `getUTF32Glyphs(uni)`: Gibt Glyphen-IDs für ein Array von Zeichen zurück.
- `getStringGlyphsCount(string)`: Gibt die Anzahl der durch den Text dargestellten Glyphen zurück.
- `getPath(glyph)`: Gibt den Umriss-[`Path`](Path.md) für eine einzelne Glyphe zurück.
- `getPaths(glyphs)`: Gibt Umrisse für ein Array von Glyphen zurück.

---

## FontMgr

`FontMgr` (Font Manager) verwaltet die Erkennung und das Laden von Schriftartdateien.

### Zugriff auf den Manager

- `FontMgr.getDefault()`: Gibt den globalen Standard-Schriftartmanager zurück.

### Typefaces finden

```java
FontMgr mgr = FontMgr.getDefault();

// Nach Name und Stil abgleichen
Typeface inter = mgr.matchFamilyStyle("Inter", FontStyle.BOLD);

// Mit System-Fallbacks für bestimmte Zeichen abgleichen (z.B. Emoji)
Typeface emoji = mgr.matchFamilyStyleCharacter(null, FontStyle.NORMAL, null, "🧛".codePointAt(0));
```

- `matchFamilyStyle(familyName, style)`: Findet die am besten passende Typeface.
- `matchFamiliesStyle(families[], style)`: Versucht mehrere Familiennamen in Reihenfolge.
- `matchFamilyStyleCharacter(familyName, style, bcp47[], character)`: Findet eine Schriftart, die ein bestimmtes Unicode-Zeichen unterstützt.
- `getFamiliesCount()`: Gibt die Anzahl der auf dem System verfügbaren Schriftfamilien zurück.
- `getFamilyName(index)`: Gibt den Namen einer Schriftfamilie zurück.

### Schriftarten laden

- `makeFromFile(path)` / `makeFromFile(path, ttcIndex)`: Lädt eine Schriftart aus einer Datei.
- `makeFromData(data)` / `makeFromData(data, ttcIndex)`: Lädt eine Schriftart aus dem Speicher.

---

## FontFeature

`FontFeature` aktiviert OpenType-Funktionen wie Ligaturen, Kerning oder Alternativzeichen.

```java
// Bestimmte Funktionen aktivieren
FontFeature[] features = FontFeature.parse("cv06 cv07 +liga");

// Manuell erstellen
FontFeature kernOff = new FontFeature("kern", 0);
```

- `FontFeature.parse(string)`: Parst Funktionen aus einem String (z.B. `"+liga -kern"`).
- `new FontFeature(tag)`: Aktiviert eine Funktion (Wert = 1).
- `new FontFeature(tag, value)`: Setzt eine Funktion auf einen bestimmten Wert.
- `new FontFeature(tag, value, start, end)`: Wendet eine Funktion auf einen bestimmten Textbereich an.

---

## FontMetrics

Detaillierte Messwerte, skaliert mit der Schriftgröße.

- `getTop()` / `getBottom()`: Ausdehnungen über/unter der Grundlinie (Maximum).
- `getAscent()` / `getDescent()`: Durchschnittliche Ausdehnungen (Ascent ist negativ).
- `getLeading()`: Empfohlener Abstand zwischen Zeilen.
- `getCapHeight()`: Höhe der Großbuchstaben.
- `getXHeight()`: Höhe der Kleinbuchstaben.
- `getThickness()` / `getUnderlinePosition()`: Zum Zeichnen von Unterstreichungen.