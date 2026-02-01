# Справочник API: Drawable

Класс `Drawable` позволяет создавать пользовательские объекты для рисования, которые инкапсулируют собственную логику отрисовки и состояние. Он похож на `Picture`, но в то время как `Picture` — это статическая запись команд рисования, `Drawable` вызывает ваш Java-код во время рендеринга, что позволяет реализовать динамическое поведение.

## Обзор

Чтобы использовать `Drawable`, необходимо создать его подкласс и переопределить два метода:
1.  `onDraw(Canvas canvas)`: Логика рисования.
2.  `onGetBounds()`: Возвращает ограничивающую рамку рисунка.

## Создание пользовательского Drawable

```java
public class MyDrawable extends Drawable {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    @Override
    public void onDraw(Canvas canvas) {
        // Этот метод вызывается, когда требуется отрисовать drawable
        canvas.drawCircle(50, 50, 40, paint);
    }

    @Override
    public Rect onGetBounds() {
        // Возвращаем консервативные границы того, что рисуем
        return Rect.makeXYWH(10, 10, 80, 80);
    }
}
```

## Использование Drawable

Вы можете рисовать `Drawable` непосредственно на холсте или трансформировать его.

```java
MyDrawable drawable = new MyDrawable();

// Нарисовать в точке (0, 0)
drawable.draw(canvas);

// Нарисовать в точке (100, 100)
drawable.draw(canvas, 100, 100);

// Нарисовать с применением матрицы
drawable.draw(canvas, Matrix33.makeScale(2.0f));
```

Также у `Canvas` есть специальный метод для этого:
```java
canvas.drawDrawable(drawable);
```

## Состояние и инвалидация

`Drawable` имеет **ID поколения** (`getGenerationId()`), который позволяет клиентам кэшировать результат. Если ваш drawable изменяет своё внутреннее состояние (например, цвет или текст), вы должны вызвать `notifyDrawingChanged()`, чтобы инвалидировать кэш.

```java
public class TextDrawable extends Drawable {
    private String text = "Hello";
    
    public void setText(String newText) {
        this.text = newText;
        // Важно: сообщить Skija, что содержимое изменилось!
        notifyDrawingChanged();
    }
    
    // ... реализация onDraw ...
}
```

## Drawable vs. Picture

- **Picture**: Быстрое воспроизведение, неизменяемый, записывает команды один раз. Лучше всего подходит для сложного статического контента.
- **Drawable**: Динамичный, вызывает Java-код каждый кадр. Лучше всего подходит, когда логика определяет, что рисовать во время рендеринга, или для создания повторно используемых "виджетов".