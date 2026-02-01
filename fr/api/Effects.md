# Référence API : Effets (Filtres)

Skija fournit trois types de filtres applicables via `Paint` : **MaskFilter**, **ColorFilter** et **ImageFilter**. Comprendre la différence est essentiel pour obtenir l'effet visuel souhaité.

## 1. MaskFilter
**Modification du canal alpha.** Affecte le masque (géométrie) avant qu'il ne soit colorisé. Il ne voit que les valeurs alpha.

### Flou gaussien
L'utilisation la plus courante est de créer des bords doux ou des lueurs simples.

```java
// Sigma correspond environ à 1/3 du rayon de flou
MaskFilter blur = MaskFilter.makeBlur(FilterBlurMode.NORMAL, 5.0f);
paint.setMaskFilter(blur);
```

**Modes :**
- `NORMAL` : Floute à l'intérieur et à l'extérieur.
- `SOLID` : Garde la forme originale opaque, floute uniquement l'extérieur.
- `OUTER` : Seule la partie floutée à l'extérieur de la forme.
- `INNER` : Seule la partie floutée à l'intérieur de la forme.

---

## 2. ColorFilter
**Modification de l'espace colorimétrique.** Transforme la couleur de chaque pixel indépendamment.

### Matrice de couleur
Utile pour les effets de niveaux de gris, sépia ou décalage de couleur.

```java
ColorFilter grayscale = ColorFilter.makeMatrix(ColorMatrix.grayscale());
paint.setColorFilter(grayscale);
```

### Filtre de couleur par mode de fusion
Teinte tout avec une couleur spécifique.

```java
ColorFilter tint = ColorFilter.makeBlend(0xFF4285F4, BlendMode.SRC_ATOP);
```

---

## 3. ImageFilter (Effets sur les pixels)

`ImageFilter` opère sur les pixels du dessin (ou de son arrière-plan). Ils sont couramment utilisés pour les flous, les ombres et les effets d'éclairage.

### Filtres de base
- `makeBlur(sigmaX, sigmaY, tileMode)` : Flou gaussien.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)` : Dessine le contenu + l'ombre.
- `makeDropShadowOnly(...)` : Dessine uniquement l'ombre (pas le contenu).
- `makeDilate(rx, ry)` : Dilate les zones claires (morphologie).
- `makeErode(rx, ry)` : Dilate les zones sombres (morphologie).
- `makeOffset(dx, dy)` : Déplace le contenu.
- `makeTile(src, dst)` : Répète le contenu en mosaïque.

### Composition
- `makeCompose(outer, inner)` : Applique le filtre `inner`, puis `outer`.
- `makeMerge(filters)` : Combine les résultats de plusieurs filtres (par exemple, dessiner plusieurs ombres).
- `makeBlend(mode, bg, fg)` : Fusionne deux filtres en utilisant un `BlendMode`.
- `makeArithmetic(k1, k2, k3, k4, bg, fg)` : Combinaison personnalisée de pixels : `k1*fg*bg + k2*fg + k3*bg + k4`.

### Couleur et nuanceurs (Shaders)
- `makeColorFilter(cf, input)` : Applique un `ColorFilter` au résultat du filtre d'image.
- `makeShader(shader)` : Remplit la région du filtre avec un `Shader` (par exemple, un dégradé ou du bruit).
- `makeRuntimeShader(builder, ...)` : Utilise un nuanceur SkSL personnalisé comme filtre d'image.

### Éclairage (Material Design)
Simule la lumière réfléchie par une surface définie par le canal alpha (alpha = hauteur).
- `makeDistantLitDiffuse(...)`
- `makePointLitDiffuse(...)`
- `makeSpotLitDiffuse(...)`
- `makeDistantLitSpecular(...)`
- `makePointLitSpecular(...)`
- `makeSpotLitSpecular(...)`

### Exemple : Verre dépoli (Flou d'arrière-plan)
Pour flouter ce qui se trouve *derrière* un calque, utilisez `Canvas.saveLayer` avec un filtre d'arrière-plan (backdrop filter).

```java
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
// L'argument 'paint' est null (pas d'alpha/fusion pour le calque lui-même)
// L'argument 'backdrop' est le filtre de flou
canvas.saveLayer(new SaveLayerRec(null, null, blur));
    canvas.drawRect(rect, new Paint().setColor(0x40FFFFFF)); // Blanc semi-transparent
canvas.restore();
```

## Comparaison récapitulative

| Type de filtre | Affecte | Utilisation courante |
| :--- | :--- | :--- |
| **MaskFilter** | Alpha uniquement | Flous simples, lueurs |
| **ColorFilter** | Couleur des pixels | Niveaux de gris, teintes, contraste |
| **ImageFilter** | Pixel entier | Ombres portées, flous complexes, composition |

## 4. Blender (Fusion avancée)

Alors que `BlendMode` fournit des fusions Porter-Duff standard (comme `SRC_OVER`, `MULTIPLY`), la classe `Blender` permet une fusion personnalisée programmable.

Vous assignez un blender à un paint en utilisant `paint.setBlender(blender)`.

### Blender arithmétique
Permet de définir une combinaison linéaire des pixels source et destination :
`result = k1 * src * dst + k2 * src + k3 * dst + k4`

```java
// Exemple : Linear Dodge (Add) peut être approximé
Blender b = Blender.makeArithmetic(0, 1, 1, 0, false);
paint.setBlender(b);
```

### Blender d'exécution (SkSL)
Vous pouvez écrire votre propre fonction de fusion en SkSL ! Le nuanceur reçoit les couleurs `src` et `dst` et doit retourner le résultat.

```java
String sksl = "vec4 main(vec4 src, vec4 dst) {" +
              "  return src * dst;" + // Simple Multiplication
              "}";
RuntimeEffect effect = RuntimeEffect.makeForBlender(sksl);
Blender myBlender = effect.makeBlender(null);
paint.setBlender(myBlender);
```

## 5. PathEffect (Modificateurs de trait)

`PathEffect` modifie la géométrie d'un chemin *avant* qu'il ne soit dessiné (tracé ou rempli). Il est couramment utilisé pour les lignes pointillées, les coins arrondis ou une rugosité organique.

### Méthodes de création

**1. Discret (Rugosité)**
Découpe le chemin en segments et les déplace aléatoirement.
- `makeDiscrete(segLength, dev, seed)` :
    - `segLength` : Longueur des segments.
    - `dev` : Déviation maximale (tremblement).
    - `seed` : Graine aléatoire.

```java
PathEffect rough = PathEffect.makeDiscrete(10f, 4f, 0);
paint.setPathEffect(rough);
```

**2. Coin (Arrondi)**
Arrondit les coins aigus.
- `makeCorner(radius)` : Rayon du coin arrondi.

```java
PathEffect round = PathEffect.makeCorner(20f);
```

**3. Tiret (Lignes pointillées)**
Crée des lignes pointillées ou en tirets.
- `makeDash(intervals, phase)` :
    - `intervals` : Tableau des longueurs ON/OFF (doit avoir une longueur paire).
    - `phase` : Décalage dans les intervalles.

```java
// 10px ON, 5px OFF
PathEffect dash = PathEffect.makeDash(new float[] { 10f, 5f }, 0f);
```

**4. Path1D (Tampon le long du chemin)**
Tamponne une forme le long du chemin (comme un pinceau).
- `makePath1D(path, advance, phase, style)`

```java
Path shape = new Path().addCircle(0, 0, 3);
PathEffect dots = PathEffect.makePath1D(shape, 10f, 0f, PathEffect1DStyle.TRANSLATE);
```

**5. Path2D (Matrice)**
Transforme la géométrie du chemin par une matrice.
- `makePath2D(matrix, path)`

**6. Line2D**
- `makeLine2D(width, matrix)`

### Composition

Vous pouvez combiner plusieurs effets de chemin.

- `makeSum(second)` : Dessine *les deux* effets (par exemple, remplissage + trait).
- `makeCompose(inner)` : Applique d'abord `inner`, puis `this` (par exemple, contour rugueux -> pointillé).

```java
PathEffect dashed = PathEffect.makeDash(new float[] {10, 5}, 0);
PathEffect corner = PathEffect.makeCorner(10);

// Arrondir les coins, PUIS pointiller la ligne
PathEffect composed = dashed.makeCompose(corner);
```