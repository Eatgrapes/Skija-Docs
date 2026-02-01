# Справочник API: Canvas

Класс `Canvas` является центральной точкой для всех операций рисования в Skija. Он управляет состоянием рисования, включая преобразования и отсечение.

## Обзор

`Canvas` не хранит сами пиксели; это интерфейс, который направляет команды рисования к месту назначения, такому как `Surface` или `Bitmap`.

## Управление состоянием

Canvas поддерживает стек состояний. Вы можете сохранить текущее состояние (матрицу и отсечение) и восстановить его позже.

- `save()`: Помещает копию текущей матрицы и отсечения в стек. Возвращает счетчик сохранений.
- `restore()`: Извлекает состояние из стека и сбрасывает матрицу и отсечение к предыдущему состоянию.
- `restoreToCount(count)`: Восстанавливает состояние до определенного счетчика сохранений.
- `getSaveCount()`: Возвращает текущую глубину стека.

### Слои

Слои создают внеэкранный буфер для рисования, который затем композируется обратно на основной холст при восстановлении.

- `saveLayer(rect, paint)`: Сохраняет состояние и перенаправляет рисование в слой. `paint` управляет альфа/смешиванием слоя при композиции обратно.
- `saveLayerAlpha(rect, alpha)`: Упрощенная версия только для изменения прозрачности.
- `saveLayer(SaveLayerRec)`: Расширенный контроль над слоем (фоны, режимы тайлов).

```java
// Создание фильтра размытия
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
SaveLayerRec rec = new SaveLayerRec(null, null, blur);

canvas.saveLayer(rec);
    // Все, что нарисовано здесь, появится поверх размытого фона
    // (создавая эффект "матового стекла")
    canvas.drawRect(Rect.makeWH(200, 200), new Paint().setColor(0x80FFFFFF));
canvas.restore();
```

## Преобразования

Преобразования влияют на все последующие операции рисования.

- `translate(dx, dy)`: Перемещает начало координат.
- `scale(sx, sy)`: Масштабирует координаты.
- `rotate(degrees)`: Поворачивает вокруг текущего начала координат.
- `skew(sx, sy)`: Наклоняет систему координат.
- `concat(matrix)`: Умножает на пользовательскую `Matrix33` или `Matrix44`.
- `setMatrix(matrix)`: Полностью заменяет текущую матрицу.
- `resetMatrix()`: Сбрасывает к единичной матрице.
- `getLocalToDevice()`: Возвращает текущую общую матрицу преобразования.

## Отсечение

Отсечение ограничивает область, в которой может происходить рисование.

- `clipRect(rect, mode, antiAlias)`: Отсекает по прямоугольнику.
- `clipRRect(rrect, mode, antiAlias)`: Отсекает по скругленному прямоугольнику.
- `clipPath(path, mode, antiAlias)`: Отсекает по пути.
- `clipRegion(region, mode)`: Отсекает по региону (выровненному по пикселям).

## Методы рисования

**Визуальный пример:**
Смотрите [`examples/scenes/src/GeometryScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/GeometryScene.java) для демонстрации рисования примитивов.

![Примитивы Canvas](../images/canvas_primitives.png)

### Базовые примитивы

```java
// Нарисовать точку (пиксель или круг в зависимости от конца кисти)
canvas.drawPoint(50, 50, new Paint().setColor(0xFF0000FF).setStrokeWidth(5));

// Нарисовать линию
canvas.drawLine(10, 10, 100, 100, paint);

// Нарисовать прямоугольник (контур или заливка в зависимости от режима кисти)
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);

// Нарисовать круг
canvas.drawCircle(100, 100, 40, paint);

// Нарисовать овал
canvas.drawOval(Rect.makeXYWH(50, 50, 100, 50), paint);

// Нарисовать скругленный прямоугольник (радиусы могут быть сложными)
canvas.drawRRect(RRect.makeXYWH(50, 50, 100, 100, 10), paint);

// Нарисовать дугу (сектор или обводку)
// startAngle: 0 - справа, sweepAngle: градусы по часовой стрелке
canvas.drawArc(Rect.makeXYWH(50, 50, 100, 100), 0, 90, true, paint);
```

- `drawPoint(x, y, paint)`: Рисует одну точку.
- `drawPoints(points, paint)`: Рисует набор точек (или линии/многоугольники в зависимости от конца кисти).
- `drawLine(x0, y0, x1, y1, paint)`: Рисует отрезок линии.
- `drawLines(points, paint)`: Рисует отдельные отрезки линий для каждой пары точек.
- `drawRect(rect, paint)`: Рисует прямоугольник.
- `drawOval(rect, paint)`: Рисует овал.
- `drawCircle(x, y, radius, paint)`: Рисует круг.
- `drawRRect(rrect, paint)`: Рисует скругленный прямоугольник.
- `drawDRRect(outer, inner, paint)`: Рисует область между двумя скругленными прямоугольниками (кольцо).
- `drawArc(rect, startAngle, sweepAngle, useCenter, paint)`: Рисует сектор (дольку пирога) или обводку дуги.
- `drawPath(path, paint)`: Рисует путь.
- `drawRegion(region, paint)`: Рисует определенный регион.

### Заливки и очистка

```java
// Залить весь холст/слой определенным цветом (смешивается с существующим содержимым)
canvas.drawColor(0x80FF0000); // 50% красное наложение

// Очистить весь холст до прозрачного (заменяет содержимое, без смешивания)
canvas.clear(0x00000000);

// Залить текущую область отсечения определенной кистью
// Полезно для заполнения экрана шейдером или сложным эффектом кисти
canvas.drawPaint(new Paint().setShader(myGradient));
```

- `clear(color)`: Заполняет всю область отсечения цветом (заменяет пиксели, игнорирует смешивание).
- `drawColor(color, mode)`: Заполняет область отсечения цветом (учитывает смешивание).
- `drawPaint(paint)`: Заполняет область отсечения заданной кистью (полезно для заливки шейдером).

### Изображения и растры

```java
// Нарисовать изображение в точке (0, 0)
canvas.drawImage(image, 0, 0);

// Нарисовать изображение, масштабированное до определенного прямоугольника
canvas.drawImageRect(image, Rect.makeXYWH(0, 0, 200, 200));

// Нарисовать 9-секционное изображение (масштабируемый элемент интерфейса)
// center: средняя масштабируемая область исходного изображения
// dst: целевой прямоугольник для рисования
canvas.drawImageNine(image, IRect.makeLTRB(10, 10, 20, 20), Rect.makeXYWH(0, 0, 100, 50), FilterMode.LINEAR, null);
```

- `drawImage(image, x, y, paint)`: Рисует изображение по координатам.
- `drawImageRect(image, src, dst, sampling, paint, strict)`: Рисует часть изображения, масштабированную до прямоугольника назначения.
- `drawImageNine(image, center, dst, filter, paint)`: Рисует масштабируемое 9-секционное изображение.
- `drawBitmap(bitmap, x, y, paint)`: Рисует растровое изображение (растровые данные).

### Текст

```java
// Простое рисование текста
canvas.drawString("Hello World", 50, 50, font, paint);

// Продвинутое рисование текста с использованием TextBlob (предварительно рассчитанная верстка)
canvas.drawTextBlob(blob, 50, 50, paint);

// Рисование TextLine (из Shaper)
canvas.drawTextLine(line, 50, 50, paint);
```

- `drawString(string, x, y, font, paint)`: Рисует простую строку.
- `drawTextBlob(blob, x, y, paint)`: Рисует предварительно рассчитанный текстовый блок.
- `drawTextLine(line, x, y, paint)`: Рисует сформированную `TextLine`.

### Продвинутое рисование

```java
// Нарисовать треугольную сетку (например, для пользовательских 3D-эффектов или деформации)
canvas.drawVertices(
    new Point[] { new Point(0, 0), new Point(100, 0), new Point(50, 100) },
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF }, // Цвета для каждой вершины
    null, // Нет текстурных координат
    null, // Нет индексов (использовать вершины по порядку)
    BlendMode.MODULATE,
    new Paint()
);

// Нарисовать тень для прямоугольника
// (Проще, чем создавать фильтр тени вручную)
canvas.drawRectShadow(
    Rect.makeXYWH(50, 50, 100, 100),
    5, 5,  // dx, dy
    10,    // размытие
    0,     // расширение
    0x80000000 // Цвет тени
);
```

- `drawPicture(picture)`: Воспроизводит записанную `Picture`.
- `drawDrawable(drawable)`: Рисует динамический объект `Drawable`.
- `drawVertices(positions, colors, texCoords, indices, mode, paint)`: Рисует треугольную сетку.
- `drawPatch(cubics, colors, texCoords, mode, paint)`: Рисует патч Кунса.
- `drawRectShadow(rect, dx, dy, blur, spread, color)`: Вспомогательный метод для рисования простой тени.

## Доступ к пикселям

```java
// Прочитать пиксели с холста в растровое изображение
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));
canvas.readPixels(bmp, 0, 0); // Чтение, начиная с (0,0) на холсте

// Записать пиксели обратно на холст
canvas.writePixels(bmp, 50, 50);
```

- `readPixels(bitmap, srcX, srcY)`: Читает пиксели с холста в растровое изображение.
- `writePixels(bitmap, x, y)`: Записывает пиксели из растрового изображения на холст.