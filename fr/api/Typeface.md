# Référence API : Typeface

La classe `Typeface` représente un design de police spécifique (par exemple, "Helvetica Bold"). C'est le point d'accès aux données du fichier de police et elle est utilisée pour créer des instances de `Font`.

## Création

### Depuis un fichier
Charge une police depuis un chemin de fichier.

```java
// Charge la première police du fichier (index 0)
Typeface face = Typeface.makeFromFile("fonts/Inter-Regular.ttf");

// Charge un index de police spécifique depuis une collection (TTC)
Typeface faceIndex = Typeface.makeFromFile("fonts/Collection.ttc", 1);
```

### Depuis des données
Charge une police depuis un objet `Data` (mémoire).

```java
Data data = Data.makeFromFileName("fonts/font.ttf");
Typeface face = Typeface.makeFromData(data);
```

### Depuis un nom (système)
Tente de trouver une police système par son nom.

```java
// "Arial", "Times New Roman", etc.
Typeface system = Typeface.makeFromName("Arial", FontStyle.NORMAL);
```

## Propriétés

- `getFamilyName()` : Retourne le nom de la famille (par exemple, "Inter").
- `getFontStyle()` : Retourne le `FontStyle` (graisse, largeur, inclinaison).
- `isBold()` : Vrai si la graisse est >= 600.
- `isItalic()` : Vrai si l'inclinaison n'est pas droite.
- `isFixedPitch()` : Vrai si les caractères ont la même largeur (monospace).
- `getUnitsPerEm()` : Retourne le nombre d'unités de police par em.
- `getBounds()` : Retourne la boîte englobante de tous les glyphes de la police.

## Accès aux glyphes

- `getStringGlyphs(string)` : Convertit une chaîne Java en un tableau d'IDs de glyphes (`short[]`).
- `getUTF32Glyph(codePoint)` : Retourne l'ID du glyphe pour un point de code Unicode unique.
- `getGlyphsCount()` : Retourne le nombre total de glyphes dans la police.

## Tables

Accès avancé aux tables brutes TrueType/OpenType.

- `getTableTags()` : Retourne une liste de tous les tags de table dans la police (par exemple, "head", "cmap", "glyf").
- `getTableData(tag)` : Retourne les données brutes d'une table spécifique sous forme d'objet `Data`.
- `getTableSize(tag)` : Retourne la taille d'une table spécifique.

## Clonage (Polices variables)

Pour les polices variables, vous pouvez créer un clone de la police avec des valeurs d'axe spécifiques.

```java
// Crée une instance de variation (par exemple, Graisse = 500)
FontVariation weight = new FontVariation("wght", 500);

// Clone la police avec cette variation
Typeface medium = variableFace.makeClone(weight);
```