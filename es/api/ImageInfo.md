# Referencia de API: ImageInfo

`ImageInfo` describe las dimensiones en píxeles y la codificación. Se utiliza para crear y describir el diseño de memoria de superficies, imágenes y mapas de bits.

## Constructores y Métodos de Fábrica

- `new ImageInfo(width, height, colorType, alphaType)`
- `new ImageInfo(width, height, colorType, alphaType, colorSpace)`
- `makeN32(width, height, alphaType)`: Tipo de color de 32 bits predeterminado de la plataforma.
- `makeS32(width, height, alphaType)`: N32 con espacio de color sRGB.
- `makeN32Premul(width, height)`: N32 con alfa premultiplicado.
- `makeA8(width, height)`: Solo alfa de 8 bits.

## Métodos

- `getWidth()` / `getHeight()`: Dimensiones en píxeles.
- `getColorType()`: Formato de píxel (ej., `RGBA_8888`).
- `getColorAlphaType()`: Codificación alfa (`PREMUL`, `UNPREMUL`, `OPAQUE`).
- `getColorSpace()`: Rango de color y linealidad.
- `getBounds()`: Devuelve un `IRect` desde (0,0) hasta (ancho, alto).
- `getBytesPerPixel()`: Número de bytes para un píxel.
- `getMinRowBytes()`: Bytes mínimos requeridos para una fila de píxeles.
- `isEmpty()`: Devuelve `true` si el ancho o el alto es <= 0.

## Modificación Funcional

`ImageInfo` es inmutable. Utiliza estos métodos para crear copias modificadas:

- `withWidthHeight(w, h)`
- `withColorType(type)`
- `withColorAlphaType(type)`
- `withColorSpace(cs)`