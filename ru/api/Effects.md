# Справочник API: Эффекты (Фильтры)

Skija предоставляет три типа фильтров, которые можно применять через `Paint`: **MaskFilter**, **ColorFilter** и **ImageFilter**. Понимание разницы между ними — ключ к достижению желаемого визуального эффекта.

## 1. MaskFilter
**Модификация альфа-канала.** Влияет на маску (геометрию) до её окрашивания. Видит только значения альфа-канала.

### Размытие по Гауссу
Наиболее часто используется для создания мягких краёв или простого свечения.

```java
// Сигма примерно равна 1/3 радиуса размытия
MaskFilter blur = MaskFilter.makeBlur(FilterBlurMode.NORMAL, 5.0f);
paint.setMaskFilter(blur);
```

**Режимы:**
- `NORMAL`: Размывает внутри и снаружи.
- `SOLID`: Сохраняет исходную форму непрозрачной, размывает только снаружи.
- `OUTER`: Только размытая часть снаружи формы.
- `INNER`: Только размытая часть внутри формы.

---

## 2. ColorFilter
**Модификация цветового пространства.** Преобразует цвет каждого пикселя независимо.

### Цветовая матрица
Полезна для оттенков серого, сепии или сдвига цвета.

```java
ColorFilter grayscale = ColorFilter.makeMatrix(ColorMatrix.grayscale());
paint.setColorFilter(grayscale);
```

### Цветовой фильтр режима наложения
Тонирует всё определённым цветом.

```java
ColorFilter tint = ColorFilter.makeBlend(0xFF4285F4, BlendMode.SRC_ATOP);
```

---

## 3. ImageFilter (Пиксельные эффекты)

`ImageFilter` работает с пикселями рисунка (или его фона). Обычно используется для размытия, теней и эффектов освещения.

### Базовые фильтры
- `makeBlur(sigmaX, sigmaY, tileMode)`: Размытие по Гауссу.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: Рисует содержимое + тень.
- `makeDropShadowOnly(...)`: Рисует только тень (без содержимого).
- `makeDilate(rx, ry)`: Расширяет светлые области (морфология).
- `makeErode(rx, ry)`: Расширяет тёмные области (морфология).
- `makeOffset(dx, dy)`: Сдвигает содержимое.
- `makeTile(src, dst)`: Заполняет область тайлами.

### Композиция
- `makeCompose(outer, inner)`: Применяет сначала `inner`, затем `outer`.
- `makeMerge(filters)`: Объединяет результаты нескольких фильтров (например, рисование нескольких теней).
- `makeBlend(mode, bg, fg)`: Накладывает два фильтра с использованием `BlendMode`.
- `makeArithmetic(k1, k2, k3, k4, bg, fg)`: Пользовательская комбинация пикселей: `k1*fg*bg + k2*fg + k3*bg + k4`.

### Цвет и шейдеры
- `makeColorFilter(cf, input)`: Применяет `ColorFilter` к результату фильтра изображения.
- `makeShader(shader)`: Заполняет область фильтра `Shader` (например, градиентом или шумом).
- `makeRuntimeShader(builder, ...)`: Использует пользовательский шейдер SkSL в качестве фильтра изображения.

### Освещение (Material Design)
Имитирует отражение света от поверхности, определённой альфа-каналом (альфа = высота).
- `makeDistantLitDiffuse(...)`
- `makePointLitDiffuse(...)`
- `makeSpotLitDiffuse(...)`
- `makeDistantLitSpecular(...)`
- `makePointLitSpecular(...)`
- `makeSpotLitSpecular(...)`

### Пример: Матовое стекло (Размытие фона)
Чтобы размыть то, что находится *позади* слоя, используйте `Canvas.saveLayer` с фоновым фильтром.

```java
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
// Аргумент 'paint' равен null (без альфа/наложения для самого слоя)
// Аргумент 'backdrop' — это фильтр размытия
canvas.saveLayer(new SaveLayerRec(null, null, blur));
    canvas.drawRect(rect, new Paint().setColor(0x40FFFFFF)); // Полупрозрачный белый
canvas.restore();
```

## Сравнительная таблица

| Тип фильтра | Влияет на | Типичное применение |
| :--- | :--- | :--- |
| **MaskFilter** | Только альфа | Простые размытия, свечение |
| **ColorFilter** | Цвет пикселя | Оттенки серого, тонирование, контраст |
| **ImageFilter** | Весь пиксель | Падающие тени, сложные размытия, композиция |

## 4. Blender (Продвинутое наложение)

В то время как `BlendMode` предоставляет стандартное наложение Портера-Даффа (например, `SRC_OVER`, `MULTIPLY`), класс `Blender` позволяет создавать программируемое пользовательское наложение.

Вы назначаете блендер для кисти с помощью `paint.setBlender(blender)`.

### Арифметический блендер
Позволяет определить линейную комбинацию исходных и конечных пикселей:
`result = k1 * src * dst + k2 * src + k3 * dst + k4`

```java
// Пример: Линейное осветление (Add) можно аппроксимировать
Blender b = Blender.makeArithmetic(0, 1, 1, 0, false);
paint.setBlender(b);
```

### Runtime Blender (SkSL)
Вы можете написать собственную функцию наложения на SkSL! Шейдер получает цвета `src` и `dst` и должен вернуть результат.

```java
String sksl = "vec4 main(vec4 src, vec4 dst) {" +
              "  return src * dst;" + // Простое умножение
              "}";
RuntimeEffect effect = RuntimeEffect.makeForBlender(sksl);
Blender myBlender = effect.makeBlender(null);
paint.setBlender(myBlender);
```

## 5. PathEffect (Модификаторы обводки)

`PathEffect` изменяет геометрию контура *перед* его отрисовкой (обводкой или заливкой). Обычно используется для пунктирных линий, скруглённых углов или органической шероховатости.

### Методы создания

**1. Discrete (Шероховатость)**
Разбивает контур на сегменты и случайным образом смещает их.
- `makeDiscrete(segLength, dev, seed)`:
    - `segLength`: Длина сегментов.
    - `dev`: Максимальное отклонение (дрожание).
    - `seed`: Сид для случайных чисел.

```java
PathEffect rough = PathEffect.makeDiscrete(10f, 4f, 0);
paint.setPathEffect(rough);
```

**2. Corner (Скругление)**
Скругляет острые углы.
- `makeCorner(radius)`: Радиус скруглённого угла.

```java
PathEffect round = PathEffect.makeCorner(20f);
```

**3. Dash (Пунктирные линии)**
Создаёт пунктирные или точечные линии.
- `makeDash(intervals, phase)`:
    - `intervals`: Массив длин включения/выключения (должен быть чётной длины).
    - `phase`: Смещение в массиве интервалов.

```java
// 10px ВКЛ, 5px ВЫКЛ
PathEffect dash = PathEffect.makeDash(new float[] { 10f, 5f }, 0f);
```

**4. Path1D (Штамп по контуру)**
Штампует фигуру вдоль контура (как кисть).
- `makePath1D(path, advance, phase, style)`

```java
Path shape = new Path().addCircle(0, 0, 3);
PathEffect dots = PathEffect.makePath1D(shape, 10f, 0f, PathEffect1DStyle.TRANSLATE);
```

**5. Path2D (Матрица)**
Преобразует геометрию контура с помощью матрицы.
- `makePath2D(matrix, path)`

**6. Line2D**
- `makeLine2D(width, matrix)`

### Композиция

Можно комбинировать несколько эффектов контура.

- `makeSum(second)`: Рисует *оба* эффекта (например, заливка + обводка).
- `makeCompose(inner)`: Применяет сначала `inner`, затем `this` (например, шероховатый контур -> пунктир).

```java
PathEffect dashed = PathEffect.makeDash(new float[] {10, 5}, 0);
PathEffect corner = PathEffect.makeCorner(10);

// Сначала скруглить углы, ЗАТЕМ сделать линию пунктирной
PathEffect composed = dashed.makeCompose(corner);
```