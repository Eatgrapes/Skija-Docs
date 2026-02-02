# Référence API : ImageInfo

`ImageInfo` décrit les dimensions en pixels et l'encodage. Il est utilisé pour créer et décrire la disposition en mémoire des surfaces, images et bitmaps.

## Constructeurs & Fabriques

- `new ImageInfo(width, height, colorType, alphaType)`
- `new ImageInfo(width, height, colorType, alphaType, colorSpace)`
- `makeN32(width, height, alphaType)` : Type de couleur 32 bits par défaut de la plateforme.
- `makeS32(width, height, alphaType)` : N32 avec l'espace colorimétrique sRGB.
- `makeN32Premul(width, height)` : N32 avec alpha prémultiplié.
- `makeA8(width, height)` : Alpha uniquement sur 8 bits.

## Méthodes

- `getWidth()` / `getHeight()` : Dimensions en pixels.
- `getColorType()` : Format de pixel (ex. `RGBA_8888`).
- `getColorAlphaType()` : Encodage alpha (`PREMUL`, `UNPREMUL`, `OPAQUE`).
- `getColorSpace()` : Gamme de couleurs et linéarité.
- `getBounds()` : Retourne un `IRect` de (0,0) à (width, height).
- `getBytesPerPixel()` : Nombre d'octets pour un pixel.
- `getMinRowBytes()` : Nombre minimum d'octets requis pour une ligne de pixels.
- `isEmpty()` : Retourne `true` si la largeur ou la hauteur est <= 0.

## Modification Fonctionnelle

`ImageInfo` est immuable. Utilisez ces méthodes pour créer des copies modifiées :

- `withWidthHeight(w, h)`
- `withColorType(type)`
- `withColorAlphaType(type)`
- `withColorSpace(cs)`