# Référence API : Matrice

Skija utilise `Matrix33` (matrice 3x3) pour les transformations 2D et `Matrix44` (matrice 4x4) pour les transformations 3D. Dans la plupart des contextes 2D (Canvas, Shader, Path), `Matrix33` est la norme.

## Matrix33 (3x3)

Une matrice 3x3 principalement utilisée pour les transformations affines 2D (translation, mise à l'échelle, rotation, inclinaison).

### Création (Méthodes statiques)

La manière la plus courante de créer une matrice est d'utiliser les méthodes statiques.

```java
// Matrice identité
Matrix33 identity = Matrix33.IDENTITY;

// Translation
Matrix33 translate = Matrix33.makeTranslate(100, 50);

// Mise à l'échelle
Matrix33 scale = Matrix33.makeScale(2.0f);        // Uniforme
Matrix33 scaleXY = Matrix33.makeScale(2.0f, 0.5f); // Non uniforme

// Rotation (degrés)
Matrix33 rotate = Matrix33.makeRotate(45);
Matrix33 rotatePivot = Matrix33.makeRotate(45, 50, 50); // Rotation autour de (50, 50)

// Inclinaison
Matrix33 skew = Matrix33.makeSkew(0.5f, 0.0f);
```

### Concaténation (Multiplication)

La multiplication de matrices est la façon de combiner des transformations. L'ordre compte ! `A.makeConcat(B)` signifie généralement "Appliquer B, puis appliquer A".

```java
// Résultat = Translation * Rotation * Mise à l'échelle
Matrix33 combined = Matrix33.makeTranslate(100, 100)
    .makeConcat(Matrix33.makeRotate(45))
    .makeConcat(Matrix33.makeScale(2));
```

### Pré-mise à l'échelle

Une aide pour appliquer une mise à l'échelle *avant* la matrice actuelle.

```java
Matrix33 m = Matrix33.IDENTITY.makePreScale(2, 2);
```

### Conversion

- `asMatrix44()` : Convertit la matrice 3x3 en matrice 4x4 (identité sur le plan Z).

## Matrix44 (4x4)

Utilisée pour les transformations 3D (par exemple, `Canvas.concat(Matrix44)`).

### Création

```java
// Identité
Matrix44 identity = Matrix44.IDENTITY;

// Personnalisée
Matrix44 m = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

### Opérations

- `makeConcat(Matrix44 other)` : Multiplie les matrices.
- `makeInverse()` : Retourne la matrice inverse (ou null si non inversible).
- `makeTranspose()` : Retourne la matrice transposée.
- `asMatrix33()` : Supprime la composante Z pour retourner une matrice 3x3.

## Exemple : Transformation manuelle

Bien que `Canvas` ait `translate`, `rotate`, etc., il est parfois nécessaire de calculer une matrice manuellement, par exemple pour `Shader.makeWithLocalMatrix()`.

```java
// Créer un dégradé qui est tourné de 45 degrés et mis à l'échelle 2x
Matrix33 localMatrix = Matrix33.makeRotate(45).makeConcat(Matrix33.makeScale(2));

Shader shader = Shader.makeLinearGradient(
    0, 0, 100, 100, 
    new int[] { 0xFF000000, 0xFFFFFFFF },
    null,
    GradientStyle.DEFAULT.withLocalMatrix(localMatrix)
);
```