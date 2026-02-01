# Couleurs et Transparence Alpha

Comprendre comment Skija gère les couleurs et la transparence est essentiel pour obtenir des résultats visuels corrects, en particulier lors du mélange de plusieurs calques ou images.

## Représentation des Couleurs

Dans Skija, les couleurs sont le plus souvent représentées sous forme d'entiers 32 bits au format **ARGB**.

- **A (Alpha)**: bits 24-31
- **R (Rouge)**: bits 16-23
- **G (Vert)**: bits 8-15
- **B (Bleu)**: bits 0-7

Vous pouvez utiliser la classe utilitaire `Color` pour manipuler ces valeurs en toute sécurité :

```java
int myColor = Color.makeARGB(255, 66, 133, 244); // Bleu opaque
int transparentRed = Color.withA(0xFFFF0000, 128); // Rouge 50% transparent
```

## Type Alpha : Pré-multiplié vs. Direct

L'un des concepts les plus importants dans Skia est le **Type Alpha** (`ColorAlphaType`).

### Pré-multiplié (`PREMUL`)
C'est le format **par défaut et recommandé** pour le rendu. Dans ce format, les composantes RVB sont déjà multipliées par la valeur alpha.
- **Pourquoi ?** Cela rend le mélange beaucoup plus rapide et évite les "bordures sombres" lors du filtrage ou de la mise à l'échelle des images.
- **Exemple** : Un blanc 50% transparent (Alpha=128, R=255, G=255, B=255) devient (128, 128, 128, 128) dans l'espace pré-multiplié.

### Non pré-multiplié (`UNPREMUL`)
Également appelé "Alpha direct". Les composantes RVB sont indépendantes de l'alpha. C'est ainsi que la plupart des fichiers image (comme PNG) stockent les données.
- **Exemple** : Le même blanc 50% transparent reste (128, 255, 255, 255).

## Espaces Colorimétriques

Skija est conscient des espaces colorimétriques. Bien que vous puissiez travailler avec du RVB "naïf" brut, pour des résultats professionnels, vous devez spécifier un `ColorSpace`.

- `ColorSpace.getSRGB()` : L'espace colorimétrique standard pour le web et la plupart des écrans.
- `ColorSpace.getDisplayP3()` : Pour les écrans à gamme étendue (comme les Mac et iPhone modernes).

Lors de la création d'une `Surface` ou du chargement d'une `Image`, tenez toujours compte de l'espace colorimétrique pour garantir une apparence cohérente sur différents appareils.

## Bonnes Pratiques

1.  **Utilisez toujours l'Alpha Pré-multiplié** pour le rendu actif et la composition.
2.  **Utilisez `Color4f`** lorsque vous avez besoin de couleurs haute précision (virgule flottante) ou que vous travaillez avec des espaces colorimétriques à gamme étendue.
3.  **Soyez attentif au Mode Alpha** lors de la capture d'instantanés ou de la lecture de pixels ; vous devrez peut-être convertir de `PREMUL` à `UNPREMUL` si vous prévoyez de sauvegarder les données dans un PNG standard.