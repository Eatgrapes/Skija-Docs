# API Reference: Typeface

The `Typeface` class represents a specific typeface design (e.g., "Helvetica Bold"). It is the handle to the font file data and is used to create `Font` instances.

## Creation

### From File
Loads a typeface from a file path.

```java
// Load the first font in the file (index 0)
Typeface face = Typeface.makeFromFile("fonts/Inter-Regular.ttf");

// Load a specific font index from a collection (TTC)
Typeface faceIndex = Typeface.makeFromFile("fonts/Collection.ttc", 1);
```

### From Data
Loads a typeface from a `Data` object (memory).

```java
Data data = Data.makeFromFileName("fonts/font.ttf");
Typeface face = Typeface.makeFromData(data);
```

### From Name (System)
Attempts to find a system font by name.

```java
// "Arial", "Times New Roman", etc.
Typeface system = Typeface.makeFromName("Arial", FontStyle.NORMAL);
```

## Properties

- `getFamilyName()`: Returns the family name (e.g., "Inter").
- `getFontStyle()`: Returns the `FontStyle` (weight, width, slant).
- `isBold()`: True if weight >= 600.
- `isItalic()`: True if slant is not upright.
- `isFixedPitch()`: True if characters have the same width (monospaced).
- `getUnitsPerEm()`: Returns the number of font units per em.
- `getBounds()`: Returns the bounding box of all glyphs in the font.

## Glyph Access

- `getStringGlyphs(string)`: Converts a Java String to an array of glyph IDs (`short[]`).
- `getUTF32Glyph(codePoint)`: Returns the glyph ID for a single Unicode code point.
- `getGlyphsCount()`: Returns the total number of glyphs in the typeface.

## Tables

Advanced access to raw TrueType/OpenType tables.

- `getTableTags()`: Returns a list of all table tags in the font (e.g., "head", "cmap", "glyf").
- `getTableData(tag)`: Returns the raw data of a specific table as a `Data` object.
- `getTableSize(tag)`: Returns the size of a specific table.

## Cloning (Variable Fonts)

For variable fonts, you can create a clone of the typeface with specific axis values.

```java
// Create a variation instance (e.g., Weight = 500)
FontVariation weight = new FontVariation("wght", 500);

// Clone the typeface with this variation
Typeface medium = variableFace.makeClone(weight);
```
