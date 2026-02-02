# Référence API : Couleur & Encodage

Cette page couvre la représentation des couleurs en haute précision, les formats de pixels, l'interprétation de la transparence (alpha) et les espaces colorimétriques.

---

## Color4f

`Color4f` représente une couleur en utilisant quatre valeurs flottantes (RGBA), chacune étant généralement comprise entre 0.0 et 1.0. Cela permet une précision bien supérieure à celle des entiers 8 bits traditionnels.

### Constructeurs

- `new Color4f(r, g, b, a)`
- `new Color4f(r, g, b)`: Couleur opaque (alpha = 1.0).
- `new Color4f(int color)`: Convertit un entier ARGB 8888 standard en composantes flottantes.

### Méthodes

- `toColor()`: Reconvertit en un entier ARGB 8888.
- `makeLerp(other, weight)`: Effectue une interpolation linéaire entre deux couleurs.

### Exemple

```java
Color4f red = new Color4f(1f, 0f, 0f, 1f);
Color4f halfTransparentBlue = new Color4f(0f, 0f, 1f, 0.5f);

// Utilisation dans Paint
Paint paint = new Paint().setColor4f(red, ColorSpace.getSRGB());
```

---

## ColorType

`ColorType` décrit comment les bits sont organisés dans un pixel (par exemple, l'ordre des canaux et la profondeur de bits).

### Types courants

- `RGBA_8888`: 8 bits par canal, rouge en premier.
- `BGRA_8888`: 8 bits par canal, bleu en premier (courant sous Windows).
- `N32`: Format natif 32 bits pour la plateforme actuelle (correspond généralement à RGBA ou BGRA).
- `F16`: 16 bits en demi-précision (flottant) par canal (High Dynamic Range).
- `GRAY_8`: un seul canal 8 bits pour les niveaux de gris.
- `ALPHA_8`: un seul canal 8 bits pour les masques de transparence.

---

## ColorAlphaType

`ColorAlphaType` décrit comment le canal alpha doit être interprété.

- `OPAQUE`: Tous les pixels sont totalement opaques ; le canal alpha est ignoré.
- `PREMUL`: Les composantes de couleur sont multipliées par alpha (standard pour les performances de Skia).
- `UNPREMUL`: Les composantes de couleur sont indépendantes de l'alpha.

---

## ColorSpace

`ColorSpace` définit l'étendue (gamut) et la linéarité des couleurs.

### Espaces colorimétriques courants

- `ColorSpace.getSRGB()`: L'espace colorimétrique standard pour le web et la plupart des écrans.
- `ColorSpace.getSRGBLinear()`: sRGB avec une fonction de transfert linéaire (utile pour les calculs/mélanges).
- `ColorSpace.getDisplayP3()`: Espace colorimétrique à large gamme utilisé par les appareils Apple modernes.

### Méthodes

- `isSRGB()`: Renvoie vrai si l'espace est sRGB.
- `isGammaLinear()`: Renvoie vrai si la fonction de transfert est linéaire.
- `convert(to, color)`: Convertit un `Color4f` de cet espace vers un autre.

### Exemple d'utilisation

```java
// Création d'une ImageInfo avec un encodage spécifique
ImageInfo info = new ImageInfo(
    800, 600, 
    ColorType.N32, 
    ColorAlphaType.PREMUL, 
    ColorSpace.getSRGB()
);
```