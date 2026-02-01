# Référence API : Paint

La classe `Paint` définit le style, la couleur et les effets utilisés lors du dessin sur un `Canvas`. C'est un objet léger qui peut être réutilisé pour plusieurs appels de dessin.

## Propriétés principales

### Couleur et transparence

- `setColor(int color)` : Définit la couleur ARGB.
- `setAlpha(int alpha)` : Définit uniquement le composant alpha (transparence) (0-255).
- `setColor4f(Color4f color, ColorSpace space)` : Définit la couleur en utilisant des valeurs à virgule flottante pour une plus grande précision.

### Style

- `setMode(PaintMode mode)` : Détermine si la peinture remplit l'intérieur d'une forme (`FILL`), trace le contour (`STROKE`), ou les deux (`STROKE_AND_FILL`).
- `setStrokeWidth(float width)` : Définit l'épaisseur du trait.
- `setStrokeCap(PaintStrokeCap cap)` : Définit la forme des extrémités d'une ligne tracée (BUTT, ROUND, SQUARE).
- `setStrokeJoin(PaintStrokeJoin join)` : Définit comment les segments tracés sont joints (MITER, ROUND, BEVEL).

### Anticrénelage

- `setAntiAlias(boolean enabled)` : Active ou désactive le lissage des bords. Fortement recommandé pour la plupart des dessins d'interface utilisateur.

## Effets et nuanceurs

Les objets `Paint` peuvent être améliorés avec divers effets pour créer des visuels complexes.

### Nuanceurs (Dégradés et motifs)

Les nuanceurs définissent la couleur de chaque pixel en fonction de sa position.
- `setShader(Shader shader)` : Applique un dégradé linéaire, un dégradé radial ou un motif d'image.

### Filtres de couleur

Les filtres de couleur modifient les couleurs de la source avant qu'elles ne soient dessinées.
- `setColorFilter(ColorFilter filter)` : Applique des matrices de couleur, des modes de fusion ou des transformations de luminance.

### Filtres de masque (Flous)

Les filtres de masque affectent le canal alpha du dessin.
- `setMaskFilter(MaskFilter filter)` : Utilisé principalement pour créer des flous et des ombres.

### Filtres d'image

Les filtres d'image sont plus complexes et peuvent affecter l'ensemble du résultat du dessin.
- `setImageFilter(ImageFilter filter)` : Utilisé pour les flous, les ombres portées et la combinaison de plusieurs effets.

## Exemple d'utilisation

```java
Paint paint = new Paint()
    .setColor(0xFF4285F4)
    .setAntiAlias(true)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(4f)
    .setStrokeJoin(PaintStrokeJoin.ROUND);

canvas.drawRect(Rect.makeXYWH(10, 10, 100, 100), paint);
```

## Note sur les performances

La création d'un objet `Paint` est relativement rapide, mais le modifier fréquemment dans une boucle serrée peut entraîner une certaine surcharge. Il est généralement recommandé de préparer vos objets `Paint` une fois et de les réutiliser pendant le rendu si leurs propriétés ne changent pas.