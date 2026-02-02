# Справочник API: ImageFilter

Объекты `ImageFilter` используются для применения эффектов на уровне изображения во время рисования, таких как размытие, тени или цветовые преобразования. Они применяются к [`Paint`](Paint.md) через метод `setImageFilter()`.

## Статические фабричные методы

### Распространённые эффекты

- `makeBlur(sigmaX, sigmaY, tileMode)`: Создаёт гауссово размытие.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: Создаёт отбрасываемую тень.
- `makeDropShadowOnly(dx, dy, sigmaX, sigmaY, color)`: Отображает только тень.
- `makeColorFilter(colorFilter, input)`: Применяет [`ColorFilter`](Effects.md#color-filters) к изображению.

### Комбинация и композиция

- `makeCompose(outer, inner)`: Объединяет два фильтра в цепочку.
- `makeMerge(filters[])`: Объединяет несколько фильтров, используя смешивание SrcOver.
- `makeArithmetic(k1, k2, k3, k4, enforcePM, bg, fg)`: Комбинирует два входных изображения с помощью арифметической формулы.
- `makeBlend(blendMode, bg, fg)`: Смешивает два входных изображения, используя [`BlendMode`](#).

### Геометрические и сэмплирующие

- `makeOffset(dx, dy, input)`: Сдвигает входное изображение на заданное смещение.
- `makeMatrixTransform(matrix, sampling, input)`: Применяет матричное преобразование.
- `makeCrop(rect, tileMode, input)`: Обрезает входной фильтр.
- `makeTile(src, dst, input)`: Заполняет область назначения тайлами из исходной области.

### Продвинутые

- `makeRuntimeShader(builder, childName, input)`: Применяет пользовательский шейдер [SkSL](runtime-effect.md) в качестве фильтра.
- `makeDisplacementMap(xChan, yChan, scale, displacement, color)`: Смещает пиксели на основе другого изображения.
- `makeMatrixConvolution(...)`: Применяет свёрточное ядро размером NxM.
- `makeLighting(...)`: Различные фильтры освещения (Distant, Point, Spot).

## Использование

```java
Paint paint = new Paint()
    .setImageFilter(ImageFilter.makeBlur(5f, 5f, FilterTileMode.CLAMP));

canvas.drawRect(Rect.makeWH(100, 100), paint);
```