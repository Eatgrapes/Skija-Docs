# Référence API : IHasImageInfo

`IHasImageInfo` est une interface implémentée par les classes qui ont une [`ImageInfo`](ImageInfo.md) associée, telles que `Surface`, `Image`, `Bitmap` et `Pixmap`.

## Méthodes

- `getImageInfo()` : Retourne l'objet [`ImageInfo`](ImageInfo.md) complet.
- `getWidth()` : Raccourci pour `getImageInfo().getWidth()`.
- `getHeight()` : Raccourci pour `getImageInfo().getHeight()`.
- `getColorInfo()` : Retourne le `ColorInfo` (ColorType, AlphaType, ColorSpace).
- `getColorType()` : Retourne le `ColorType`.
- `getAlphaType()` : Retourne le `ColorAlphaType`.
- `getColorSpace()` : Retourne le `ColorSpace`.
- `getBytesPerPixel()` : Nombre d'octets requis par pixel.
- `isEmpty()` : Retourne `true` si la largeur ou la hauteur est zéro.
- `isOpaque()` : Retourne `true` si tous les pixels sont garantis d'être opaques.