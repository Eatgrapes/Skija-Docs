# Référence API : ImageFilter

Les objets `ImageFilter` sont utilisés pour appliquer des effets au niveau de l'image pendant le dessin, tels que des flous, des ombres ou des transformations de couleur. Ils sont appliqués à une [`Paint`](Paint.md) via `setImageFilter()`.

## Méthodes de Fabrication Statiques

### Effets Courants

- `makeBlur(sigmaX, sigmaY, tileMode)` : Crée un flou gaussien.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)` : Crée une ombre portée.
- `makeDropShadowOnly(dx, dy, sigmaX, sigmaY, color)` : Dessine uniquement l'ombre.
- `makeColorFilter(colorFilter, input)` : Applique un [`ColorFilter`](Effects.md#color-filters) à une image.

### Combinaison & Composition

- `makeCompose(outer, inner)` : Enchaîne deux filtres.
- `makeMerge(filters[])` : Fusionne plusieurs filtres en utilisant le mode de fusion SrcOver.
- `makeArithmetic(k1, k2, k3, k4, enforcePM, bg, fg)` : Combine deux entrées à l'aide d'une formule arithmétique.
- `makeBlend(blendMode, bg, fg)` : Fusionne deux entrées en utilisant un [`BlendMode`](#).

### Géométrie & Échantillonnage

- `makeOffset(dx, dy, input)` : Décale l'entrée d'un décalage.
- `makeMatrixTransform(matrix, sampling, input)` : Applique une transformation matricielle.
- `makeCrop(rect, tileMode, input)` : Recadre le filtre d'entrée.
- `makeTile(src, dst, input)` : Répète la région source dans la destination.

### Avancé

- `makeRuntimeShader(builder, childName, input)` : Applique un shader [SkSL](runtime-effect.md) personnalisé comme filtre.
- `makeDisplacementMap(xChan, yChan, scale, displacement, color)` : Déplace les pixels en fonction d'une autre image.
- `makeMatrixConvolution(...)` : Applique un noyau de convolution NxM.
- `makeLighting(...)` : Divers filtres d'éclairage (Distant, Point, Spot).

## Utilisation

```java
Paint paint = new Paint()
    .setImageFilter(ImageFilter.makeBlur(5f, 5f, FilterTileMode.CLAMP));

canvas.drawRect(Rect.makeWH(100, 100), paint);
```