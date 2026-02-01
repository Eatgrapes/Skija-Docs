# API-Referenz: Matrix

Skija verwendet `Matrix33` (3x3-Matrix) für 2D-Transformationen und `Matrix44` (4x4-Matrix) für 3D-Transformationen. In den meisten 2D-Kontexten (Canvas, Shader, Path) ist `Matrix33` der Standard.

## Matrix33 (3x3)

Eine 3x3-Matrix, die hauptsächlich für 2D-affine Transformationen (Translation, Skalierung, Rotation, Scherung) verwendet wird.

### Erstellung (Statische Fabrikmethoden)

Die gängigste Art, eine Matrix zu erstellen, sind statische Fabrikmethoden.

```java
// Einheitsmatrix
Matrix33 identity = Matrix33.IDENTITY;

// Translation
Matrix33 translate = Matrix33.makeTranslate(100, 50);

// Skalierung
Matrix33 scale = Matrix33.makeScale(2.0f);        // Gleichmäßig
Matrix33 scaleXY = Matrix33.makeScale(2.0f, 0.5f); // Ungleichmäßig

// Rotation (Grad)
Matrix33 rotate = Matrix33.makeRotate(45);
Matrix33 rotatePivot = Matrix33.makeRotate(45, 50, 50); // Rotation um (50, 50)

// Scherung
Matrix33 skew = Matrix33.makeSkew(0.5f, 0.0f);
```

### Verkettung (Multiplikation)

Matrixmultiplikation ist die Methode, um Transformationen zu kombinieren. Die Reihenfolge ist wichtig! `A.makeConcat(B)` bedeutet im Allgemeinen "Wende B an, dann wende A an".

```java
// Ergebnis = Translate * Rotate * Scale
Matrix33 combined = Matrix33.makeTranslate(100, 100)
    .makeConcat(Matrix33.makeRotate(45))
    .makeConcat(Matrix33.makeScale(2));
```

### Vor-Skalierung

Hilfsmethode, um eine Skalierung *vor* der aktuellen Matrix anzuwenden.

```java
Matrix33 m = Matrix33.IDENTITY.makePreScale(2, 2);
```

### Konvertierung

- `asMatrix44()`: Konvertiert die 3x3-Matrix in eine 4x4-Matrix (z-Ebene als Identität).

## Matrix44 (4x4)

Wird für 3D-Transformationen verwendet (z.B. `Canvas.concat(Matrix44)`).

### Erstellung

```java
// Einheitsmatrix
Matrix44 identity = Matrix44.IDENTITY;

// Benutzerdefiniert
Matrix44 m = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

### Operationen

- `makeConcat(Matrix44 other)`: Matrizen multiplizieren.
- `makeInverse()`: Gibt die inverse Matrix zurück (oder null, wenn nicht invertierbar).
- `makeTranspose()`: Gibt die transponierte Matrix zurück.
- `asMatrix33()`: Lässt die Z-Komponente weg und gibt eine 3x3-Matrix zurück.

## Beispiel: Manuelle Transformation

Während `Canvas` über `translate`, `rotate` usw. verfügt, muss man manchmal eine Matrix manuell berechnen, zum Beispiel für `Shader.makeWithLocalMatrix()`.

```java
// Erstelle einen Farbverlauf, der um 45 Grad gedreht und 2x skaliert ist
Matrix33 localMatrix = Matrix33.makeRotate(45).makeConcat(Matrix33.makeScale(2));

Shader shader = Shader.makeLinearGradient(
    0, 0, 100, 100, 
    new int[] { 0xFF000000, 0xFFFFFFFF },
    null,
    GradientStyle.DEFAULT.withLocalMatrix(localMatrix)
);
```