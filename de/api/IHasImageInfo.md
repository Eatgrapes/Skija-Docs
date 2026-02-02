# API-Referenz: IHasImageInfo

`IHasImageInfo` ist eine Schnittstelle, die von Klassen implementiert wird, die über zugehörige [`ImageInfo`](ImageInfo.md) verfügen, wie z.B. `Surface`, `Image`, `Bitmap` und `Pixmap`.

## Methoden

- `getImageInfo()`: Gibt das vollständige [`ImageInfo`](ImageInfo.md)-Objekt zurück.
- `getWidth()`: Bequemlichkeitsmethode für `getImageInfo().getWidth()`.
- `getHeight()`: Bequemlichkeitsmethode für `getImageInfo().getHeight()`.
- `getColorInfo()`: Gibt die `ColorInfo` (ColorType, AlphaType, ColorSpace) zurück.
- `getColorType()`: Gibt den `ColorType` zurück.
- `getAlphaType()`: Gibt den `ColorAlphaType` zurück.
- `getColorSpace()`: Gibt den `ColorSpace` zurück.
- `getBytesPerPixel()`: Anzahl der Bytes, die pro Pixel benötigt werden.
- `isEmpty()`: Gibt `true` zurück, wenn die Breite oder Höhe null ist.
- `isOpaque()`: Gibt `true` zurück, wenn garantiert alle Pixel deckend sind.