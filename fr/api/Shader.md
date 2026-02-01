# Référence API : Shader

Les shaders définissent la couleur de chaque pixel en fonction de sa position sur le canevas. Ils sont principalement utilisés pour les dégradés, les motifs et le bruit. Les shaders sont assignés à un objet `Paint` via `paint.setShader(shader)`.

## Dégradés

Les dégradés sont le type de shader le plus courant. Skija prend en charge plusieurs types :

### Dégradé linéaire
Crée une transition fluide entre deux points.

**Exemple visuel :**
Voir [`examples/scenes/src/ShadersScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadersScene.java) pour des exemples de dégradés linéaires, radiaux, circulaires et coniques, ainsi que des shaders de bruit.

```java
Shader linear = Shader.makeLinearGradient(
    0, 0, 100, 100,      // x0, y0, x1, y1
    new int[] { 0xFFFF0000, 0xFF0000FF } // Couleurs (Rouge à Bleu)
);
```

### Dégradé radial
Crée une transition circulaire à partir d'un point central.

```java
Shader radial = Shader.makeRadialGradient(
    50, 50, 30,          // centre x, y, rayon
    new int[] { 0xFFFFFFFF, 0xFF000000 } // Couleurs (Blanc à Noir)
);
```

### Dégradé circulaire (Sweep)
Crée une transition qui balaie autour d'un point central (comme une roue de couleurs).

```java
Shader sweep = Shader.makeSweepGradient(
    50, 50,              // centre x, y
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFFFF0000 }
);
```

### Dégradé conique à deux points
Crée une transition entre deux cercles (utile pour des effets d'éclairage 3D ou des reflets).

```java
Shader conical = Shader.makeTwoPointConicalGradient(
    30, 30, 10,          // début x, y, rayon
    70, 70, 40,          // fin x, y, rayon
    new int[] { 0xFFFF0000, 0xFF0000FF }
);
```

## Bruit et motifs

### Bruit de Perlin
Génère des textures qui ressemblent à des nuages, du marbre ou du feu.

```java
// Bruit fractal
Shader noise = Shader.makeFractalNoise(
    0.05f, 0.05f,        // baseFrequencyX, baseFrequencyY
    4,                   // numOctaves
    0.0f                 // seed
);

// Turbulence
Shader turb = Shader.makeTurbulence(0.05f, 0.05f, 4, 0.0f);
```

### Shader d'image
Transforme une `Image` en un shader qui peut être répété ou utilisé pour remplir des formes.

```java
// Accès via la classe Image
Shader imageShader = image.makeShader(
    FilterTileMode.REPEAT, 
    FilterTileMode.REPEAT, 
    SamplingMode.DEFAULT
);
```

## Composition et modification

- `Shader.makeBlend(mode, dst, src)` : Combine deux shaders en utilisant un mode de fusion.
- `shader.makeWithLocalMatrix(matrix)` : Applique une transformation au système de coordonnées du shader.
- `shader.makeWithColorFilter(filter)` : Applique un filtre de couleur à la sortie du shader.

## Modes de répétition (`FilterTileMode`)

Lorsqu'un shader (comme un dégradé ou une image) doit remplir une zone plus grande que ses limites définies :
- `CLAMP` : Utilise la couleur du bord pour remplir le reste.
- `REPEAT` : Répète le motif.
- `MIRROR` : Répète le motif en le reflétant aux bords.
- `DECAL` : Affiche de la transparence en dehors des limites.