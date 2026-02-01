# Тени в Skija

Skija предоставляет два различных способа рисования теней: **2D Drop Shadows** (через ImageFilters) и **3D Elevation Shadows** (через ShadowUtils).

## 1. 2D Drop Shadows (ImageFilter)

Это стандартный способ добавить тень к конкретной операции рисования. Тень повторяет форму рисуемой геометрии или изображения.

```java
ImageFilter shadow = ImageFilter.makeDropShadow(
    2.0f, 2.0f,   // Смещение (dx, dy)
    3.0f, 3.0f,   // Размытие (sigmaX, sigmaY)
    0x80000000    // Цвет тени (50% прозрачный черный)
);

Paint paint = new Paint().setImageFilter(shadow);
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
```

### Только тень (Drop Shadow Only)
Если нужно нарисовать только тень без исходного объекта (например, для сложного наслоения), используйте `makeDropShadowOnly`.

---

## 2. 3D Elevation Shadows (ShadowUtils)

`ShadowUtils` предоставляет более физически точную модель тени, аналогичную Material Design elevation. Он вычисляет, как источник света в определенной 3D позиции отбрасывает тень от "окклюдера" (Path) на плоскость холста.

### Базовое использование

```java
Path path = new Path().addRect(Rect.makeXYWH(50, 50, 100, 100));

// Z-плоскость: высота объекта.
// Обычно постоянна для плоских UI-элементов: (0, 0, elevation)
Point3 elevation = new Point3(0, 0, 10.0f);

// Позиция света: 3D координаты относительно холста
Point3 lightPos = new Point3(250, 0, 600);

float lightRadius = 800.0f;
int ambientColor = 0x10000000;
int spotColor = 0x30000000;

ShadowUtils.drawShadow(
    canvas,
    path,
    elevation,
    lightPos,
    lightRadius,
    ambientColor,
    spotColor,
    ShadowUtilsFlag.TRANSPARENT_OCCLUDER
);

// Примечание: drawShadow рисует ТОЛЬКО тень.
// Сам объект нужно нарисовать отдельно:
canvas.drawPath(path, new Paint().setColor(0xFFFFFFFF));
```

### Ambient vs. Spot Shadow
- **Ambient Shadow**: Мягкая, ненаправленная тень, вызванная рассеянным светом.
- **Spot Shadow**: Направленная тень, вызванная конкретным положением источника света.
Сочетание обоих создает реалистичный эффект глубины.

### Флаги теней
- `TRANSPARENT_OCCLUDER`: Используйте, если ваш объект полупрозрачный, чтобы тень не обрезалась под объектом.
- `GEOMETRIC_ONLY`: Оптимизация, если не требуется высококачественное размытие.
- `DIRECTIONAL_LIGHT`: Рассматривает свет как бесконечно удаленный (как солнечный свет).

## Сравнение

| Особенность | Drop Shadow (ImageFilter) | Elevation Shadow (ShadowUtils) |
| :--- | :--- | :--- |
| **Модель** | 2D Гауссово размытие | 3D Перспективная проекция |
| **Производительность** | Быстро (кэшируется Skia) | Сложнее, но хорошо оптимизировано |
| **Использование** | Устанавливается в `Paint` | Прямой вызов `ShadowUtils` |
| **Лучше всего для** | Текст, простые свечения UI, иконки | Кнопки Material Design, карточки, эффекты глубины |

## Визуальный пример

Чтобы увидеть эти тени в действии, запустите пример приложения **Scenes** и выберите сцену **ShadowUtils**.

**Исходный код:** [`examples/scenes/src/ShadowUtilsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadowUtilsScene.java)

*Рисунок: Сравнение различных флагов ShadowUtils и позиций света.*