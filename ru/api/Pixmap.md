# Справочник API: Pixmap

Класс `Pixmap` представляет растровое изображение в памяти. Он предоставляет прямой доступ к данным пикселей и методы для чтения, записи и манипулирования пикселями.

## Обзор

`Pixmap` связывает `ImageInfo` (ширина, высота, тип цвета, тип альфа-канала, цветовое пространство) с фактическими данными пикселей в памяти. В отличие от `Image`, `Pixmap` позволяет напрямую обращаться к буферу пикселей.

## Создание

- `make(info, buffer, rowBytes)`: Создает `Pixmap`, оборачивающий предоставленный `ByteBuffer`.
- `make(info, addr, rowBytes)`: Создает `Pixmap`, оборачивающий предоставленный адрес в нативной памяти.

## Управление данными

- `reset()`: Очищает `Pixmap`, приводя его в нулевое состояние.
- `reset(info, buffer, rowBytes)`: Сбрасывает `Pixmap` для обертывания нового предоставленного буфера.
- `setColorSpace(colorSpace)`: Обновляет цветовое пространство `Pixmap`.
- `extractSubset(subsetPtr, area)`: Извлекает подмножество `Pixmap` в память, на которую указывает `subsetPtr`.
- `extractSubset(buffer, area)`: Извлекает подмножество `Pixmap` в предоставленный `ByteBuffer`.

## Свойства

- `getInfo()`: Возвращает `ImageInfo`, описывающий `Pixmap` (ширина, высота, тип цвета и т.д.).
- `getRowBytes()`: Возвращает количество байт на строку.
- `getAddr()`: Возвращает нативный адрес данных пикселей.
- `getRowBytesAsPixels()`: Возвращает количество пикселей на строку (только для определенных типов цвета).
- `computeByteSize()`: Вычисляет общий размер данных пикселей в байтах.
- `computeIsOpaque()`: Возвращает true, если `Pixmap` непрозрачен.
- `getBuffer()`: Возвращает `ByteBuffer`, оборачивающий данные пикселей.

## Доступ к пикселям

### Доступ к отдельному пикселю

- `getColor(x, y)`: Возвращает цвет пикселя в `(x, y)` в виде целого числа (ARGB).
- `getColor4f(x, y)`: Возвращает цвет пикселя в `(x, y)` в виде `Color4f`.
- `getAlphaF(x, y)`: Возвращает альфа-компонент пикселя в `(x, y)` в виде числа с плавающей запятой.
- `getAddr(x, y)`: Возвращает нативный адрес пикселя в `(x, y)`.

### Массовые операции с пикселями

- `readPixels(info, addr, rowBytes)`: Копирует пиксели из `Pixmap` в целевую память.
- `readPixels(pixmap)`: Копирует пиксели в другой `Pixmap`.
- `scalePixels(dstPixmap, samplingMode)`: Масштабирует пиксели, чтобы они соответствовали целевому `Pixmap`, используя указанный режим сэмплирования.
- `erase(color)`: Заполняет весь `Pixmap` указанным цветом.
- `erase(color, subset)`: Заполняет указанную область `Pixmap` указанным цветом.

## Пример

### Изменение пикселей

```java
// Создаем новый Pixmap формата N32 (стандартный RGBA/BGRA)
try (var pixmap = new Pixmap()) {
    // Выделяем память для 100x100 пикселей
    pixmap.reset(ImageInfo.makeN32Premul(100, 100), Unpooled.malloc(100 * 100 * 4), 100 * 4);
    
    // Заполняем белым цветом
    pixmap.erase(0xFFFFFFFF);

    // Устанавливаем пиксель в красный цвет в точке (10, 10)
    // Примечание: Прямая манипуляция байтами может быть быстрее для массовых операций,
    // но API erase/readPixels проще в использовании.
    // Skija Pixmap не предоставляет простой метод setPixel(x,y,color) по соображениям производительности
    // в управляемом API, но вы можете писать напрямую в ByteBuffer.
    ByteBuffer buffer = pixmap.getBuffer();
    int offset = (10 * 100 + 10) * 4; // y * ширина + x * bpp
    buffer.putInt(offset, 0xFFFF0000); // ARGB (Красный)
    
    // Создаем изображение из этого pixmap для его отрисовки
    try (var image = Image.makeFromRaster(pixmap)) {
        canvas.drawImage(image, 0, 0);
    }
}
```

### Чтение пикселей

```java
// Предположим, у вас есть Pixmap 'pixmap'
int width = pixmap.getInfo().getWidth();
int height = pixmap.getInfo().getHeight();

// Получаем цвет в определенной координате
int color = pixmap.getColor(50, 50);
System.out.println("Цвет в 50,50: " + Integer.toHexString(color));

// Итерируемся по всем пикселям (учитывайте производительность в Java!)
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        if (pixmap.getAlphaF(x, y) > 0.5f) {
            // Найден непрозрачный пиксель
        }
    }
}
```