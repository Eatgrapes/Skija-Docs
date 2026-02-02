# Справочник API: ImageInfo

`ImageInfo` описывает размеры в пикселях и кодировку. Используется для создания и описания структуры памяти поверхностей, изображений и растровых картинок.

## Конструкторы и фабричные методы

- `new ImageInfo(width, height, colorType, alphaType)`
- `new ImageInfo(width, height, colorType, alphaType, colorSpace)`
- `makeN32(width, height, alphaType)`: 32-битный тип цвета по умолчанию для платформы.
- `makeS32(width, height, alphaType)`: N32 с цветовым пространством sRGB.
- `makeN32Premul(width, height)`: N32 с предварительно умноженным альфа-каналом.
- `makeA8(width, height)`: Только 8-битный альфа-канал.

## Методы

- `getWidth()` / `getHeight()`: Размеры в пикселях.
- `getColorType()`: Формат пикселя (например, `RGBA_8888`).
- `getColorAlphaType()`: Кодировка альфа-канала (`PREMUL`, `UNPREMUL`, `OPAQUE`).
- `getColorSpace()`: Диапазон и линейность цвета.
- `getBounds()`: Возвращает `IRect` от (0,0) до (ширина, высота).
- `getBytesPerPixel()`: Количество байт на один пиксель.
- `getMinRowBytes()`: Минимальное количество байт, необходимое для одной строки пикселей.
- `isEmpty()`: Возвращает `true`, если ширина или высота <= 0.

## Функциональное изменение

`ImageInfo` является неизменяемым. Используйте эти методы для создания изменённых копий:

- `withWidthHeight(w, h)`
- `withColorType(type)`
- `withColorAlphaType(type)`
- `withColorSpace(cs)`