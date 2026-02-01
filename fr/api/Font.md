# Référence API : Police & Gestion

La classe `Font` contrôle le rendu du texte, tandis que `FontMgr` gère la découverte des polices et `FontFeature` permet d'utiliser des fonctionnalités OpenType avancées.

## Font

Une `Font` prend un [`Typeface`](Typeface.md) et y ajoute la taille, l'échelle, l'inclinaison et les attributs de rendu.

### Création

```java
// Police par défaut (généralement sans empattement 12pt)
Font font = new Font();

// Typeface et taille personnalisées
Font font = new Font(typeface, 24f);

// Texte condensé/étendu ou oblique
Font font = new Font(typeface, 24f, 0.8f, -0.25f);
```

- `new Font()` : Initialise avec les valeurs par défaut.
- `new Font(typeface)` : Initialise avec un typeface spécifique et la taille par défaut.
- `new Font(typeface, size)` : Initialise avec un typeface et une taille spécifiques.
- `new Font(typeface, size, scaleX, skewX)` : Constructeur complet.

### Métriques & Espacement

- `getSize()` / `setSize(value)` : Taille typographique en points.
- `getScaleX()` / `setScaleX(value)` : Échelle horizontale (1.0 est normal).
- `getSkewX()` / `setSkewX(value)` : Inclinaison horizontale (0 est normal).
- `getMetrics()` : Retourne les [`FontMetrics`](#fontmetrics) détaillées.
- `getSpacing()` : Espacement de ligne recommandé (somme de l'ascendante, de la descendante et de l'interligne).

### Indicateurs de Rendu

Ils affectent la façon dont les glyphes sont pixellisés.

- `setSubpixel(boolean)` : Demande un positionnement sous-pixel pour un texte plus lisse.
- `setEdging(FontEdging)` : Contrôle l'anti-crénelage (`ALIAS`, `ANTI_ALIAS`, `SUBPIXEL_ANTI_ALIAS`).
- `setHinting(FontHinting)` : Contrôle l'ajustement du contour des glyphes (`NONE`, `SLIGHT`, `NORMAL`, `FULL`).
- `setEmboldened(boolean)` : Approche le gras en augmentant l'épaisseur du trait.
- `setBaselineSnapped(boolean)` : Aligne les lignes de base sur les positions des pixels.
- `setMetricsLinear(boolean)` : Demande des métriques linéairement évolutives (ignore l'hinting/l'arrondi).
- `setBitmapsEmbedded(boolean)` : Demande d'utiliser les bitmaps dans les polices au lieu des contours.

### Mesurer le Texte

```java
// Mesure simple de la largeur
float width = font.measureTextWidth("Hello");

// Obtenir le cadre de délimitation précis
Rect bounds = font.measureText("Hello");

// Mesurer la largeur avec des effets de peinture spécifiques
float width = font.measureTextWidth("Hello", paint);
```

- `measureText(string)` / `measureText(string, paint)` : Retourne le cadre de délimitation.
- `measureTextWidth(string)` / `measureTextWidth(string, paint)` : Retourne la largeur d'avance.
- `getWidths(glyphs)` : Récupère les avances pour chaque ID de glyphe.
- `getBounds(glyphs)` / `getBounds(glyphs, paint)` : Récupère les cadres de délimitation pour chaque ID de glyphe.

### Accès aux Glyphes

- `getStringGlyphs(string)` : Convertit le texte en un tableau d'IDs de glyphes.
- `getUTF32Glyph(unichar)` : Retourne l'ID de glyphe pour un seul caractère.
- `getUTF32Glyphs(uni)` : Retourne les IDs de glyphes pour un tableau de caractères.
- `getStringGlyphsCount(string)` : Retourne le nombre de glyphes représentés par le texte.
- `getPath(glyph)` : Retourne le contour [`Path`](Path.md) pour un seul glyphe.
- `getPaths(glyphs)` : Retourne les contours pour un tableau de glyphes.

---

## FontMgr

`FontMgr` (Gestionnaire de Polices) gère la découverte et le chargement des fichiers de police.

### Accéder au Gestionnaire

- `FontMgr.getDefault()` : Retourne le gestionnaire de polices global par défaut.

### Trouver des Typefaces

```java
FontMgr mgr = FontMgr.getDefault();

// Correspondance par nom et style
Typeface inter = mgr.matchFamilyStyle("Inter", FontStyle.BOLD);

// Correspondance avec des polices de secours système pour des caractères spécifiques (ex. Emoji)
Typeface emoji = mgr.matchFamilyStyleCharacter(null, FontStyle.NORMAL, null, "🧛".codePointAt(0));
```

- `matchFamilyStyle(familyName, style)` : Trouve le typeface correspondant le plus proche.
- `matchFamiliesStyle(families[], style)` : Essaie plusieurs noms de famille dans l'ordre.
- `matchFamilyStyleCharacter(familyName, style, bcp47[], character)` : Trouve une police qui prend en charge un caractère Unicode spécifique.
- `getFamiliesCount()` : Retourne le nombre de familles de polices disponibles sur le système.
- `getFamilyName(index)` : Retourne le nom d'une famille de polices.

### Charger des Polices

- `makeFromFile(path)` / `makeFromFile(path, ttcIndex)` : Charge une police depuis un fichier.
- `makeFromData(data)` / `makeFromData(data, ttcIndex)` : Charge une police depuis la mémoire.

---

## FontFeature

`FontFeature` active des fonctionnalités OpenType comme les ligatures, le crénage ou les glyphes alternatifs.

```java
// Activer des fonctionnalités spécifiques
FontFeature[] features = FontFeature.parse("cv06 cv07 +liga");

// Créer manuellement
FontFeature kernOff = new FontFeature("kern", 0);
```

- `FontFeature.parse(string)` : Analyse les fonctionnalités depuis une chaîne (ex. `"+liga -kern"`).
- `new FontFeature(tag)` : Active une fonctionnalité (valeur = 1).
- `new FontFeature(tag, value)` : Définit une fonctionnalité à une valeur spécifique.
- `new FontFeature(tag, value, start, end)` : Applique une fonctionnalité à une plage spécifique de texte.

---

## FontMetrics

Mesures détaillées mises à l'échelle par la taille de la police.

- `getTop()` / `getBottom()` : Extensions au-dessus/en dessous de la ligne de base (maximum).
- `getAscent()` / `getDescent()` : Extensions moyennes (l'ascendante est négative).
- `getLeading()` : Espace recommandé entre les lignes.
- `getCapHeight()` : Hauteur des lettres majuscules.
- `getXHeight()` : Hauteur des lettres minuscules.
- `getThickness()` / `getUnderlinePosition()` : Pour dessiner les soulignements.