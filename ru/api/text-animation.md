# Продвинутая типографика: Обрезка и анимация

Skija предоставляет мощные инструменты не только для рисования статичного текста, но и для использования текста как геометрического объекта для обрезки, маскирования и анимации.

## Текст как обтравочный контур (маска)

Чтобы использовать текст как маску (например, чтобы показать изображение *внутри* букв), нельзя просто "обрезать по тексту". Вместо этого нужно сначала преобразовать текст в `Path`.

### 1. Получение контура из текста
Используйте `Font.getPath()`, чтобы получить геометрический контур конкретных глифов.

```java
Font font = new Font(typeface, 100);
short[] glyphs = font.getStringGlyphs("MASK");

// Получаем контур для этих глифов
// Примечание: getPaths возвращает массив контуров (по одному на глиф)
// Обычно их нужно объединить или просто рисовать последовательно
Point[] positions = font.getPositions(glyphs, new Point(50, 150)); // Позиционируем текст

Path textPath = new Path();
for (int i = 0; i < glyphs.length; i++) {
    Path glyphPath = font.getPath(glyphs[i]);
    if (glyphPath != null) {
        // Смещаем контур глифа в его позицию и добавляем к основному контуру
        glyphPath.transform(Matrix33.makeTranslate(positions[i].getX(), positions[i].getY()));
        textPath.addPath(glyphPath);
    }
}
```

### 2. Обрезка холста
Как только у вас есть `Path`, вы можете обрезать холст.

```java
canvas.save();
canvas.clipPath(textPath);

// Теперь рисуем изображение (или градиент, или паттерн)
// Оно появится только внутри букв "MASK"
canvas.drawImage(myImage, 0, 0);

canvas.restore();
```

## Анимация текста

Skija позволяет создавать высокопроизводительную анимацию текста, предоставляя низкоуровневый доступ к позиционированию глифов через `TextBlob`.

### 1. Анимация отдельных глифов (волнообразный текст)
Вместо рисования строки вы рассчитываете позицию каждого символа вручную.

```java
String text = "Wavy Text";
short[] glyphs = font.getStringGlyphs(text);
float[] widths = font.getWidths(glyphs);

// Рассчитываем позиции для каждого глифа
Point[] positions = new Point[glyphs.length];
float x = 50;
float time = (System.currentTimeMillis() % 1000) / 1000f; // от 0.0 до 1.0

for (int i = 0; i < glyphs.length; i++) {
    // Анимация синусоидальной волны
    float yOffset = (float) Math.sin((x / 50.0) + (time * Math.PI * 2)) * 10;
    
    positions[i] = new Point(x, 100 + yOffset);
    x += widths[i];
}

// Создаем TextBlob из этих явных позиций
TextBlob blob = TextBlob.makeFromPos(glyphs, positions, font);

// Рисуем его
canvas.drawTextBlob(blob, 0, 0, paint);
```

### 2. Текст вдоль пути (RSXform)
Для текста, следующего по кривой (и поворачивающегося в соответствии с кривой), используйте `RSXform` (преобразование вращения, масштабирования и перемещения).

```java
// Смотрите 'TextBlob.makeFromRSXform' в API
// Это позволяет задать вращение и позицию для каждого отдельного глифа независимо.
```

## Переменные шрифты
Если у вас есть переменный шрифт (например, `Inter-Variable.ttf`), вы можете плавно анимировать его насыщенность или наклон.

```java
// 1. Создаем экземпляр FontVariation
FontVariation weight = new FontVariation("wght", 400 + (float)Math.sin(time) * 300); // Насыщенность от 100 до 700

// 2. Создаем конкретный Typeface из переменной основы
Typeface currentFace = variableTypeface.makeClone(weight);

// 3. Создаем Font и рисуем
Font font = new Font(currentFace, 40);
canvas.drawString("Breathing Text", 50, 50, font, paint);
```

## Итог

- **Обрезка:** Преобразование Текст -> Глифы -> Контур -> `canvas.clipPath()`.
- **Волнообразный/движущийся текст:** Вручную рассчитываем массив позиций `Point[]` и используем `TextBlob.makeFromPos()`.
- **Текст вдоль пути:** Используем `TextBlob.makeFromRSXform()`.
- **Анимация насыщенности/стиля:** Используем Переменные шрифты и `makeClone(FontVariation)`.