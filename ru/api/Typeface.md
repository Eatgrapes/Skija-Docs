# Справочник API: Typeface

Класс `Typeface` представляет конкретный дизайн шрифта (например, "Helvetica Bold"). Это дескриптор данных файла шрифта, используемый для создания экземпляров `Font`.

## Создание

### Из файла
Загружает шрифт из пути к файлу.

```java
// Загрузить первый шрифт в файле (индекс 0)
Typeface face = Typeface.makeFromFile("fonts/Inter-Regular.ttf");

// Загрузить конкретный индекс шрифта из коллекции (TTC)
Typeface faceIndex = Typeface.makeFromFile("fonts/Collection.ttc", 1);
```

### Из данных
Загружает шрифт из объекта `Data` (память).

```java
Data data = Data.makeFromFileName("fonts/font.ttf");
Typeface face = Typeface.makeFromData(data);
```

### По имени (системный)
Пытается найти системный шрифт по имени.

```java
// "Arial", "Times New Roman" и т.д.
Typeface system = Typeface.makeFromName("Arial", FontStyle.NORMAL);
```

## Свойства

- `getFamilyName()`: Возвращает название семейства (например, "Inter").
- `getFontStyle()`: Возвращает `FontStyle` (насыщенность, ширина, наклон).
- `isBold()`: Истина, если насыщенность >= 600.
- `isItalic()`: Истина, если наклон не прямой.
- `isFixedPitch()`: Истина, если символы имеют одинаковую ширину (моноширинный).
- `getUnitsPerEm()`: Возвращает количество единиц шрифта на em.
- `getBounds()`: Возвращает ограничивающий прямоугольник для всех глифов в шрифте.

## Доступ к глифам

- `getStringGlyphs(string)`: Преобразует строку Java в массив идентификаторов глифов (`short[]`).
- `getUTF32Glyph(codePoint)`: Возвращает идентификатор глифа для одной кодовой точки Unicode.
- `getGlyphsCount()`: Возвращает общее количество глифов в шрифте.

## Таблицы

Продвинутый доступ к сырым таблицам TrueType/OpenType.

- `getTableTags()`: Возвращает список всех тегов таблиц в шрифте (например, "head", "cmap", "glyf").
- `getTableData(tag)`: Возвращает сырые данные конкретной таблицы в виде объекта `Data`.
- `getTableSize(tag)`: Возвращает размер конкретной таблицы.

## Клонирование (переменные шрифты)

Для переменных шрифтов можно создать клон шрифта с конкретными значениями осей.

```java
// Создать экземпляр вариации (например, Насыщенность = 500)
FontVariation weight = new FontVariation("wght", 500);

// Клонировать шрифт с этой вариацией
Typeface medium = variableFace.makeClone(weight);
```