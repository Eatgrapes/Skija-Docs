# API 參考：矩陣

Skija 使用 `Matrix33`（3x3 矩陣）進行 2D 變換，使用 `Matrix44`（4x4 矩陣）進行 3D 變換。在大多數 2D 情境（Canvas、Shader、Path）中，`Matrix33` 是標準。

## Matrix33 (3x3)

主要用於 2D 仿射變換（平移、縮放、旋轉、傾斜）的 3x3 矩陣。

### 建立（靜態工廠方法）

建立矩陣最常見的方式是使用靜態工廠方法。

```java
// 單位矩陣
Matrix33 identity = Matrix33.IDENTITY;

// 平移
Matrix33 translate = Matrix33.makeTranslate(100, 50);

// 縮放
Matrix33 scale = Matrix33.makeScale(2.0f);        // 均勻縮放
Matrix33 scaleXY = Matrix33.makeScale(2.0f, 0.5f); // 非均勻縮放

// 旋轉（角度）
Matrix33 rotate = Matrix33.makeRotate(45);
Matrix33 rotatePivot = Matrix33.makeRotate(45, 50, 50); // 繞點 (50, 50) 旋轉

// 傾斜
Matrix33 skew = Matrix33.makeSkew(0.5f, 0.0f);
```

### 串接（乘法）

矩陣乘法是組合變換的方式。順序很重要！`A.makeConcat(B)` 通常表示「先套用 B，再套用 A」。

```java
// 結果 = 平移 * 旋轉 * 縮放
Matrix33 combined = Matrix33.makeTranslate(100, 100)
    .makeConcat(Matrix33.makeRotate(45))
    .makeConcat(Matrix33.makeScale(2));
```

### 前置縮放

輔助方法，用於在當前矩陣*之前*套用縮放。

```java
Matrix33 m = Matrix33.IDENTITY.makePreScale(2, 2);
```

### 轉換

- `asMatrix44()`：將 3x3 矩陣轉換為 4x4 矩陣（z 平面為單位矩陣）。

## Matrix44 (4x4)

用於 3D 變換（例如 `Canvas.concat(Matrix44)`）。

### 建立

```java
// 單位矩陣
Matrix44 identity = Matrix44.IDENTITY;

// 自訂矩陣
Matrix44 m = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

### 運算

- `makeConcat(Matrix44 other)`：矩陣相乘。
- `makeInverse()`：返回逆矩陣（若不可逆則返回 null）。
- `makeTranspose()`：返回轉置矩陣。
- `asMatrix33()`：去除 Z 分量，返回 3x3 矩陣。

## 範例：手動變換

雖然 `Canvas` 有 `translate`、`rotate` 等方法，但有時需要手動計算矩陣，例如用於 `Shader.makeWithLocalMatrix()`。

```java
// 建立一個旋轉 45 度並縮放 2 倍的漸層
Matrix33 localMatrix = Matrix33.makeRotate(45).makeConcat(Matrix33.makeScale(2));

Shader shader = Shader.makeLinearGradient(
    0, 0, 100, 100, 
    new int[] { 0xFF000000, 0xFFFFFFFF },
    null,
    GradientStyle.DEFAULT.withLocalMatrix(localMatrix)
);
```