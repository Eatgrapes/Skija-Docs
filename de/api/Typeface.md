# API-Referenz: Typeface

Die Klasse `Typeface` repräsentiert ein spezifisches Schriftdesign (z. B. "Helvetica Bold"). Sie ist der Zugriffspunkt auf die Font-Dateidaten und wird verwendet, um `Font`-Instanzen zu erstellen.

## Erstellung

### Aus Datei
Lädt eine Typeface aus einem Dateipfad.

```java
// Lade den ersten Font in der Datei (Index 0)
Typeface face = Typeface.makeFromFile("fonts/Inter-Regular.ttf");

// Lade einen spezifischen Font-Index aus einer Sammlung (TTC)
Typeface faceIndex = Typeface.makeFromFile("fonts/Collection.ttc", 1);
```

### Aus Daten
Lädt eine Typeface aus einem `Data`-Objekt (Speicher).

```java
Data data = Data.makeFromFileName("fonts/font.ttf");
Typeface face = Typeface.makeFromData(data);
```

### Aus Name (System)
Versucht, einen Systemfont anhand des Namens zu finden.

```java
// "Arial", "Times New Roman", etc.
Typeface system = Typeface.makeFromName("Arial", FontStyle.NORMAL);
```

## Eigenschaften

- `getFamilyName()`: Gibt den Familiennamen zurück (z. B. "Inter").
- `getFontStyle()`: Gibt den `FontStyle` zurück (Gewicht, Breite, Neigung).
- `isBold()`: True, wenn das Gewicht >= 600 ist.
- `isItalic()`: True, wenn die Neigung nicht aufrecht ist.
- `isFixedPitch()`: True, wenn alle Zeichen die gleiche Breite haben (monospaced).
- `getUnitsPerEm()`: Gibt die Anzahl der Font-Einheiten pro Em zurück.
- `getBounds()`: Gibt die Begrenzungsbox aller Glyphen im Font zurück.

## Glyphen-Zugriff

- `getStringGlyphs(string)`: Konvertiert einen Java-String in ein Array von Glyphen-IDs (`short[]`).
- `getUTF32Glyph(codePoint)`: Gibt die Glyphen-ID für einen einzelnen Unicode-Codepunkt zurück.
- `getGlyphsCount()`: Gibt die Gesamtzahl der Glyphen in der Typeface zurück.

## Tabellen

Erweiterter Zugriff auf rohe TrueType/OpenType-Tabellen.

- `getTableTags()`: Gibt eine Liste aller Tabellen-Tags im Font zurück (z. B. "head", "cmap", "glyf").
- `getTableData(tag)`: Gibt die Rohdaten einer spezifischen Tabelle als `Data`-Objekt zurück.
- `getTableSize(tag)`: Gibt die Größe einer spezifischen Tabelle zurück.

## Klonen (Variable Fonts)

Für variable Fonts können Sie einen Klon der Typeface mit spezifischen Achsenwerten erstellen.

```java
// Erstelle eine Variationsinstanz (z. B. Gewicht = 500)
FontVariation weight = new FontVariation("wght", 500);

// Klone die Typeface mit dieser Variation
Typeface medium = variableFace.makeClone(weight);
```