# API Reference: Matrix

Skija uses `Matrix33` (3x3 matrix) for 2D transformations and `Matrix44` (4x4 matrix) for 3D transformations. In most 2D context (Canvas, Shader, Path), `Matrix33` is the standard.

## Matrix33 (3x3)

A 3x3 matrix primarily used for 2D affine transformations (translation, scale, rotation, skew).

### Creation (Static Factories)

The most common way to create a matrix is using static factory methods.

```java
// Identity matrix
Matrix33 identity = Matrix33.IDENTITY;

// Translation
Matrix33 translate = Matrix33.makeTranslate(100, 50);

// Scale
Matrix33 scale = Matrix33.makeScale(2.0f);        // Uniform
Matrix33 scaleXY = Matrix33.makeScale(2.0f, 0.5f); // Non-uniform

// Rotation (degrees)
Matrix33 rotate = Matrix33.makeRotate(45);
Matrix33 rotatePivot = Matrix33.makeRotate(45, 50, 50); // Rotate around (50, 50)

// Skew
Matrix33 skew = Matrix33.makeSkew(0.5f, 0.0f);
```

### Concatenation (Multiplication)

Matrix multiplication is how you combine transformations. Order matters! `A.makeConcat(B)` generally means "Apply B, then Apply A".

```java
// Result = Translate * Rotate * Scale
Matrix33 combined = Matrix33.makeTranslate(100, 100)
    .makeConcat(Matrix33.makeRotate(45))
    .makeConcat(Matrix33.makeScale(2));
```

### Pre-Scaling

Helper to apply a scale *before* the current matrix.

```java
Matrix33 m = Matrix33.IDENTITY.makePreScale(2, 2);
```

### Conversion

- `asMatrix44()`: Converts the 3x3 matrix to a 4x4 matrix (z-plane identity).

## Matrix44 (4x4)

Used for 3D transformations (e.g., `Canvas.concat(Matrix44)`).

### Creation

```java
// Identity
Matrix44 identity = Matrix44.IDENTITY;

// Custom
Matrix44 m = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

### Operations

- `makeConcat(Matrix44 other)`: Multiply matrices.
- `makeInverse()`: Returns the inverse matrix (or null if not invertible).
- `makeTranspose()`: Returns the transposed matrix.
- `asMatrix33()`: Drops the Z component to return a 3x3 matrix.

## Example: Manual Transformation

While `Canvas` has `translate`, `rotate`, etc., sometimes you need to compute a matrix manually, for example for `Shader.makeWithLocalMatrix()`.

```java
// Create a gradient that is rotated 45 degrees and scaled 2x
Matrix33 localMatrix = Matrix33.makeRotate(45).makeConcat(Matrix33.makeScale(2));

Shader shader = Shader.makeLinearGradient(
    0, 0, 100, 100, 
    new int[] { 0xFF000000, 0xFFFFFFFF },
    null,
    GradientStyle.DEFAULT.withLocalMatrix(localMatrix)
);
```
