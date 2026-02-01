# Справочник API: PathMeasure

`PathMeasure` используется для вычисления длины пути, а также для нахождения позиции и касательной в любой заданной точке пути.

## Обзор

Объект `PathMeasure` инициализируется с помощью [`Path`](Path.md). Он проходит по контурам пути. Если путь содержит несколько контуров, вы можете перейти к следующему с помощью `nextContour()`.

## Конструкторы

- `new PathMeasure()`: Создает пустой `PathMeasure`.
- `new PathMeasure(path)`: Инициализирует с указанным путем.
- `new PathMeasure(path, forceClosed)`: Если `forceClosed` равен true, путь считается замкнутым, даже если это не так.
- `new PathMeasure(path, forceClosed, resScale)`: `resScale` управляет точностью измерения (по умолчанию 1.0).

## Методы

### Управление состоянием

- `setPath(path, forceClosed)`: Сбрасывает измерение с новым путем.
- `nextContour()`: Переходит к следующему контуру в пути. Возвращает `true`, если он существует.
- `isClosed()`: Возвращает `true`, если текущий контур замкнут.

### Измерения

- `getLength()`: Возвращает общую длину текущего контура.
- `getPosition(distance)`: Возвращает `Point` на указанном расстоянии вдоль пути.
- `getTangent(distance)`: Возвращает касательную (как вектор `Point`) на указанном расстоянии.
- `getRSXform(distance)`: Возвращает `RSXform` на указанном расстоянии.
- `getMatrix(distance, getPosition, getTangent)`: Возвращает `Matrix33`, представляющую позицию и/или касательную на расстоянии.

### Извлечение

- `getSegment(startD, endD, dst, startWithMoveTo)`: Возвращает сегмент пути между `startD` и `endD` в предоставленный `PathBuilder`.

## Пример

```java
Path path = Path.makeCircle(100, 100, 50);
PathMeasure measure = new PathMeasure(path);

float length = measure.getLength();
Point pos = measure.getPosition(length / 2); // Получить точку на половине пути
Point tan = measure.getTangent(length / 2);   // Получить направление в этой точке
```