# API 参考：矩阵

Skija 使用 `Matrix33`（3x3 矩阵）进行 2D 变换，使用 `Matrix44`（4x4 矩阵）进行 3D 变换。在大多数 2D 上下文（Canvas、Shader、Path）中，`Matrix33` 是标准矩阵。

## Matrix33 (3x3)

主要用于 2D 仿射变换（平移、缩放、旋转、倾斜）的 3x3 矩阵。

### 创建（静态工厂方法）

创建矩阵最常用的方式是使用静态工厂方法。

```java
// 单位矩阵
Matrix33 identity = Matrix33.IDENTITY;

// 平移
Matrix33 translate = Matrix33.makeTranslate(100, 50);

// 缩放
Matrix33 scale = Matrix33.makeScale(2.0f);        // 均匀缩放
Matrix33 scaleXY = Matrix33.makeScale(2.0f, 0.5f); // 非均匀缩放

// 旋转（角度）
Matrix33 rotate = Matrix33.makeRotate(45);
Matrix33 rotatePivot = Matrix33.makeRotate(45, 50, 50); // 围绕点 (50, 50) 旋转

// 倾斜
Matrix33 skew = Matrix33.makeSkew(0.5f, 0.0f);
```

### 连接（乘法）

矩阵乘法是组合变换的方式。顺序很重要！`A.makeConcat(B)` 通常表示“先应用 B，再应用 A”。

```java
// 结果 = 平移 * 旋转 * 缩放
Matrix33 combined = Matrix33.makeTranslate(100, 100)
    .makeConcat(Matrix33.makeRotate(45))
    .makeConcat(Matrix33.makeScale(2));
```

### 预缩放

在当前矩阵*之前*应用缩放的辅助方法。

```java
Matrix33 m = Matrix33.IDENTITY.makePreScale(2, 2);
```

### 转换

- `asMatrix44()`：将 3x3 矩阵转换为 4x4 矩阵（z 平面为单位矩阵）。

## Matrix44 (4x4)

用于 3D 变换（例如 `Canvas.concat(Matrix44)`）。

### 创建

```java
// 单位矩阵
Matrix44 identity = Matrix44.IDENTITY;

// 自定义矩阵
Matrix44 m = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

### 操作

- `makeConcat(Matrix44 other)`：矩阵乘法。
- `makeInverse()`：返回逆矩阵（如果不可逆则返回 null）。
- `makeTranspose()`：返回转置矩阵。
- `asMatrix33()`：丢弃 Z 分量，返回 3x3 矩阵。

## 示例：手动变换

虽然 `Canvas` 有 `translate`、`rotate` 等方法，但有时需要手动计算矩阵，例如用于 `Shader.makeWithLocalMatrix()`。

```java
// 创建一个旋转 45 度并缩放 2 倍的渐变
Matrix33 localMatrix = Matrix33.makeRotate(45).makeConcat(Matrix33.makeScale(2));

Shader shader = Shader.makeLinearGradient(
    0, 0, 100, 100, 
    new int[] { 0xFF000000, 0xFFFFFFFF },
    null,
    GradientStyle.DEFAULT.withLocalMatrix(localMatrix)
);
```