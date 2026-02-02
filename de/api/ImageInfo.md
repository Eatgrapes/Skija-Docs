# API-Referenz: ImageInfo

`ImageInfo` beschreibt Pixelabmessungen und -kodierung. Es wird verwendet, um den Speicherlayout von Oberflächen, Bildern und Bitmaps zu erstellen und zu beschreiben.

## Konstruktoren & Fabriken

- `new ImageInfo(width, height, colorType, alphaType)`
- `new ImageInfo(width, height, colorType, alphaType, colorSpace)`
- `makeN32(width, height, alphaType)`: Plattformstandard 32-Bit-Farbtyp.
- `makeS32(width, height, alphaType)`: N32 mit sRGB-Farbraum.
- `makeN32Premul(width, height)`: N32 mit premultipliziertem Alpha.
- `makeA8(width, height)`: Nur 8-Bit-Alpha.

## Methoden

- `getWidth()` / `getHeight()`: Pixelabmessungen.
- `getColorType()`: Pixelformat (z.B. `RGBA_8888`).
- `getColorAlphaType()`: Alpha-Kodierung (`PREMUL`, `UNPREMUL`, `OPAQUE`).
- `getColorSpace()`: Farbbereich und Linearität.
- `getBounds()`: Gibt ein `IRect` von (0,0) bis (Breite, Höhe) zurück.
- `getBytesPerPixel()`: Anzahl Bytes für einen Pixel.
- `getMinRowBytes()`: Minimale Bytes, die für eine Pixelzeile benötigt werden.
- `isEmpty()`: Gibt `true` zurück, wenn Breite oder Höhe <= 0 ist.

## Funktionale Modifikation

`ImageInfo` ist unveränderlich. Verwenden Sie diese Methoden, um modifizierte Kopien zu erstellen:

- `withWidthHeight(w, h)`
- `withColorType(type)`
- `withColorAlphaType(type)`
- `withColorSpace(cs)`