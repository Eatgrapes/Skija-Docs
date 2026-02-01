# Référence API : SamplingMode

`SamplingMode` est une interface qui définit comment les pixels sont échantillonnés lorsqu'une image est mise à l'échelle, tournée ou transformée.

## Implémentations

Il existe trois principales façons de spécifier l'échantillonnage dans Skija :

1.  **[`FilterMipmap`](#filtermipmap)** : Filtrage linéaire/au plus proche standard avec mipmaps optionnelles.
2.  **[`CubicResampler`](CubicResampler.md)** : Interpolation bicubique de haute qualité (Mitchell, Catmull-Rom).
3.  **`SamplingModeAnisotropic`** : Filtrage de haute qualité pour les textures vues sous des angles prononcés.

## Présélections courantes

- `SamplingMode.DEFAULT` : Filtrage au plus proche voisin (le plus rapide, en blocs).
- `SamplingMode.LINEAR` : Filtrage bilinéaire (lisse, par défaut pour la plupart des usages).
- `SamplingMode.MITCHELL` : Bicubique de haute qualité (lisse et net).
- `SamplingMode.CATMULL_ROM` : Bicubique très net.

## FilterMipmap

C'est le mode d'échantillonnage le plus courant. Il utilise deux paramètres :

### FilterMode
- `NEAREST` : Échantillonne le pixel unique le plus proche.
- `LINEAR` : Interpole entre les 4 pixels les plus proches.

### MipmapMode
- `NONE` : Aucune mipmap utilisée.
- `NEAREST` : Échantillonne à partir du niveau de mipmap le plus proche.
- `LINEAR` : Interpole entre deux niveaux de mipmap (filtrage trilinéaire).

## Utilisation

```java
// Échantillonnage bilinéaire
canvas.drawImage(img, 0, 0, SamplingMode.LINEAR, null);

// Plus proche voisin (style pixel art)
canvas.drawImage(img, 0, 0, SamplingMode.DEFAULT, null);

// Bicubique de haute qualité
canvas.drawImage(img, 0, 0, CubicResampler.MITCHELL, null);
```