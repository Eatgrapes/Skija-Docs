# Referencia de API: IHasImageInfo

`IHasImageInfo` es una interfaz implementada por clases que tienen un [`ImageInfo`](ImageInfo.md) asociado, como `Surface`, `Image`, `Bitmap` y `Pixmap`.

## Métodos

- `getImageInfo()`: Devuelve el objeto [`ImageInfo`](ImageInfo.md) completo.
- `getWidth()`: Atajo para `getImageInfo().getWidth()`.
- `getHeight()`: Atajo para `getImageInfo().getHeight()`.
- `getColorInfo()`: Devuelve el `ColorInfo` (ColorType, AlphaType, ColorSpace).
- `getColorType()`: Devuelve el `ColorType`.
- `getAlphaType()`: Devuelve el `ColorAlphaType`.
- `getColorSpace()`: Devuelve el `ColorSpace`.
- `getBytesPerPixel()`: Número de bytes requeridos por píxel.
- `isEmpty()`: Devuelve `true` si el ancho o el alto es cero.
- `isOpaque()`: Devuelve `true` si se garantiza que todos los píxeles son opacos.