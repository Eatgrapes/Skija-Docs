# Справочник API: Матрицы

Skija использует `Matrix33` (матрица 3x3) для 2D-преобразований и `Matrix44` (матрица 4x4) для 3D-преобразований. В большинстве 2D-контекстов (Canvas, Shader, Path) стандартом является `Matrix33`.

## Matrix33 (3x3)

Матрица 3x3, в основном используемая для 2D аффинных преобразований (сдвиг, масштаб, поворот, наклон).

### Создание (Статические фабричные методы)

Наиболее распространенный способ создания матрицы — использование статических фабричных методов.

```java
// Единичная матрица
Matrix33 identity = Matrix33.IDENTITY;

// Сдвиг (трансляция)
Matrix33 translate = Matrix33.makeTranslate(100, 50);

// Масштаб
Matrix33 scale = Matrix33.makeScale(2.0f);        // Равномерный
Matrix33 scaleXY = Matrix33.makeScale(2.0f, 0.5f); // Неравномерный

// Поворот (в градусах)
Matrix33 rotate = Matrix33.makeRotate(45);
Matrix33 rotatePivot = Matrix33.makeRotate(45, 50, 50); // Поворот вокруг точки (50, 50)

// Наклон (скос)
Matrix33 skew = Matrix33.makeSkew(0.5f, 0.0f);
```

### Конкатенация (Умножение)

Умножение матриц — это способ комбинирования преобразований. Порядок имеет значение! `A.makeConcat(B)` обычно означает "Применить B, затем применить A".

```java
// Результат = Сдвиг * Поворот * Масштаб
Matrix33 combined = Matrix33.makeTranslate(100, 100)
    .makeConcat(Matrix33.makeRotate(45))
    .makeConcat(Matrix33.makeScale(2));
```

### Предварительное масштабирование

Вспомогательный метод для применения масштаба *перед* текущей матрицей.

```java
Matrix33 m = Matrix33.IDENTITY.makePreScale(2, 2);
```

### Преобразование

- `asMatrix44()`: Преобразует матрицу 3x3 в матрицу 4x4 (единичная матрица для плоскости Z).

## Matrix44 (4x4)

Используется для 3D-преобразований (например, `Canvas.concat(Matrix44)`).

### Создание

```java
// Единичная матрица
Matrix44 identity = Matrix44.IDENTITY;

// Пользовательская матрица
Matrix44 m = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

### Операции

- `makeConcat(Matrix44 other)`: Умножить матрицы.
- `makeInverse()`: Возвращает обратную матрицу (или null, если матрица необратима).
- `makeTranspose()`: Возвращает транспонированную матрицу.
- `asMatrix33()`: Отбрасывает Z-компонент и возвращает матрицу 3x3.

## Пример: Ручное преобразование

Хотя у `Canvas` есть методы `translate`, `rotate` и т.д., иногда необходимо вычислить матрицу вручную, например, для `Shader.makeWithLocalMatrix()`.

```java
// Создаем градиент, повернутый на 45 градусов и масштабированный в 2 раза
Matrix33 localMatrix = Matrix33.makeRotate(45).makeConcat(Matrix33.makeScale(2));

Shader shader = Shader.makeLinearGradient(
    0, 0, 100, 100, 
    new int[] { 0xFF000000, 0xFFFFFFFF },
    null,
    GradientStyle.DEFAULT.withLocalMatrix(localMatrix)
);
```