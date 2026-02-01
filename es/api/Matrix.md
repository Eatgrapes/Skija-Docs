# Referencia de la API: Matrix

Skija utiliza `Matrix33` (matriz 3x3) para transformaciones 2D y `Matrix44` (matriz 4x4) para transformaciones 3D. En la mayoría de los contextos 2D (Canvas, Shader, Path), `Matrix33` es el estándar.

## Matrix33 (3x3)

Una matriz 3x3 utilizada principalmente para transformaciones afines 2D (traslación, escala, rotación, sesgo).

### Creación (Métodos de Fábrica Estáticos)

La forma más común de crear una matriz es utilizando métodos de fábrica estáticos.

```java
// Matriz identidad
Matrix33 identity = Matrix33.IDENTITY;

// Traslación
Matrix33 translate = Matrix33.makeTranslate(100, 50);

// Escala
Matrix33 scale = Matrix33.makeScale(2.0f);        // Uniforme
Matrix33 scaleXY = Matrix33.makeScale(2.0f, 0.5f); // No uniforme

// Rotación (grados)
Matrix33 rotate = Matrix33.makeRotate(45);
Matrix33 rotatePivot = Matrix33.makeRotate(45, 50, 50); // Rotar alrededor de (50, 50)

// Sesgo
Matrix33 skew = Matrix33.makeSkew(0.5f, 0.0f);
```

### Concatenación (Multiplicación)

La multiplicación de matrices es cómo se combinan transformaciones. ¡El orden importa! `A.makeConcat(B)` generalmente significa "Aplicar B, luego Aplicar A".

```java
// Resultado = Traslación * Rotación * Escala
Matrix33 combined = Matrix33.makeTranslate(100, 100)
    .makeConcat(Matrix33.makeRotate(45))
    .makeConcat(Matrix33.makeScale(2));
```

### Pre-escalado

Ayuda para aplicar una escala *antes* de la matriz actual.

```java
Matrix33 m = Matrix33.IDENTITY.makePreScale(2, 2);
```

### Conversión

- `asMatrix44()`: Convierte la matriz 3x3 en una matriz 4x4 (identidad en el plano z).

## Matrix44 (4x4)

Utilizada para transformaciones 3D (por ejemplo, `Canvas.concat(Matrix44)`).

### Creación

```java
// Identidad
Matrix44 identity = Matrix44.IDENTITY;

// Personalizada
Matrix44 m = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

### Operaciones

- `makeConcat(Matrix44 other)`: Multiplica matrices.
- `makeInverse()`: Devuelve la matriz inversa (o null si no es invertible).
- `makeTranspose()`: Devuelve la matriz transpuesta.
- `asMatrix33()`: Elimina el componente Z para devolver una matriz 3x3.

## Ejemplo: Transformación Manual

Aunque `Canvas` tiene `translate`, `rotate`, etc., a veces necesitas calcular una matriz manualmente, por ejemplo para `Shader.makeWithLocalMatrix()`.

```java
// Crear un gradiente que esté rotado 45 grados y escalado 2x
Matrix33 localMatrix = Matrix33.makeRotate(45).makeConcat(Matrix33.makeScale(2));

Shader shader = Shader.makeLinearGradient(
    0, 0, 100, 100, 
    new int[] { 0xFF000000, 0xFFFFFFFF },
    null,
    GradientStyle.DEFAULT.withLocalMatrix(localMatrix)
);
```