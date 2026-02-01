# APIリファレンス: Matrix

Skijaは2D変換に`Matrix33`（3x3行列）、3D変換に`Matrix44`（4x4行列）を使用します。ほとんどの2Dコンテキスト（Canvas、Shader、Path）では、`Matrix33`が標準です。

## Matrix33 (3x3)

主に2Dアフィン変換（平行移動、拡大縮小、回転、スキュー）に使用される3x3行列です。

### 作成（静的ファクトリーメソッド）

行列を作成する最も一般的な方法は、静的ファクトリーメソッドを使用することです。

```java
// 単位行列
Matrix33 identity = Matrix33.IDENTITY;

// 平行移動
Matrix33 translate = Matrix33.makeTranslate(100, 50);

// 拡大縮小
Matrix33 scale = Matrix33.makeScale(2.0f);        // 均一
Matrix33 scaleXY = Matrix33.makeScale(2.0f, 0.5f); // 不均一

// 回転（度数法）
Matrix33 rotate = Matrix33.makeRotate(45);
Matrix33 rotatePivot = Matrix33.makeRotate(45, 50, 50); // (50, 50)を中心に回転

// スキュー
Matrix33 skew = Matrix33.makeSkew(0.5f, 0.0f);
```

### 連結（乗算）

行列の乗算は変換を組み合わせる方法です。順序が重要です！`A.makeConcat(B)`は一般的に「Bを適用し、次にAを適用する」ことを意味します。

```java
// 結果 = 平行移動 * 回転 * 拡大縮小
Matrix33 combined = Matrix33.makeTranslate(100, 100)
    .makeConcat(Matrix33.makeRotate(45))
    .makeConcat(Matrix33.makeScale(2));
```

### 事前スケーリング

現在の行列の*前に*スケールを適用するヘルパーメソッドです。

```java
Matrix33 m = Matrix33.IDENTITY.makePreScale(2, 2);
```

### 変換

- `asMatrix44()`: 3x3行列を4x4行列に変換します（z平面は単位行列）。

## Matrix44 (4x4)

3D変換（例：`Canvas.concat(Matrix44)`）に使用されます。

### 作成

```java
// 単位行列
Matrix44 identity = Matrix44.IDENTITY;

// カスタム
Matrix44 m = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

### 操作

- `makeConcat(Matrix44 other)`: 行列を乗算します。
- `makeInverse()`: 逆行列を返します（逆行列が存在しない場合はnull）。
- `makeTranspose()`: 転置行列を返します。
- `asMatrix33()`: Z成分を削除して3x3行列を返します。

## 例: 手動変換

`Canvas`には`translate`、`rotate`などのメソッドがありますが、例えば`Shader.makeWithLocalMatrix()`のために、手動で行列を計算する必要がある場合があります。

```java
// 45度回転し、2倍に拡大されたグラデーションを作成
Matrix33 localMatrix = Matrix33.makeRotate(45).makeConcat(Matrix33.makeScale(2));

Shader shader = Shader.makeLinearGradient(
    0, 0, 100, 100, 
    new int[] { 0xFF000000, 0xFFFFFFFF },
    null,
    GradientStyle.DEFAULT.withLocalMatrix(localMatrix)
);
```