# Справочник API: IHasImageInfo

`IHasImageInfo` — это интерфейс, реализуемый классами, которые имеют связанный объект [`ImageInfo`](ImageInfo.md), такие как `Surface`, `Image`, `Bitmap` и `Pixmap`.

## Методы

- `getImageInfo()`: Возвращает полный объект [`ImageInfo`](ImageInfo.md).
- `getWidth()`: Удобный метод для `getImageInfo().getWidth()`.
- `getHeight()`: Удобный метод для `getImageInfo().getHeight()`.
- `getColorInfo()`: Возвращает `ColorInfo` (ColorType, AlphaType, ColorSpace).
- `getColorType()`: Возвращает `ColorType`.
- `getAlphaType()`: Возвращает `ColorAlphaType`.
- `getColorSpace()`: Возвращает `ColorSpace`.
- `getBytesPerPixel()`: Количество байт, требуемых на пиксель.
- `isEmpty()`: Возвращает `true`, если ширина или высота равны нулю.
- `isOpaque()`: Возвращает `true`, если все пиксели гарантированно непрозрачны.