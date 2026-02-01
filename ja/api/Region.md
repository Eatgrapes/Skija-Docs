# API リファレンス: Region

`Region` クラスは、`Path` と同様にキャンバス上の複雑な領域を表しますが、**整数**座標で定義されます。Region は、ブール演算（交差、和集合、差分など）や、点や矩形が領域内にあるかどうかのテストに高度に最適化されています。

## 概要

浮動小数点座標を使用し曲線を含むことができる `Path` とは異なり、`Region` は基本的に水平スキャンラインの集合です。ヒットテストやクリッピングに効率的です。

## Region の作成と変更

```java
// 空の Region を作成
Region region = new Region();

// 矩形に設定
region.setRect(new IRect(0, 0, 100, 100));

// Path から設定
// (最大境界を定義する 'clip' Region が必要)
Path path = new Path().addCircle(50, 50, 40);
Region clip = new Region();
clip.setRect(new IRect(0, 0, 200, 200));
region.setPath(path, clip);
```

## ブール演算

`Region` の強力さは、論理演算子を使用して複数の領域を結合できる点にあります。

```java
Region regionA = new Region();
regionA.setRect(new IRect(0, 0, 100, 100));

Region regionB = new Region();
regionB.setRect(new IRect(50, 50, 150, 150));

// 交差: 結果は重複領域 (50, 50, 100, 100)
regionA.op(regionB, RegionOp.INTERSECT);

// 和集合: 結果は両方の領域を合わせたもの
regionA.op(regionB, RegionOp.UNION);

// 差分: A から B を除去
regionA.op(regionB, RegionOp.DIFFERENCE);
```

利用可能な演算 (`RegionOp`):
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A
- `REPLACE`: B

## ヒットテスト

点または矩形が Region 内にあるかどうかを確認できます。

```java
if (region.contains(10, 10)) {
    // 点は領域内
}

if (region.quickReject(new IRect(200, 200, 300, 300))) {
    // 矩形は確実に領域の外側
}
```

## Canvas での使用

`Region` を使用して `Canvas` をクリップできます。

```java
canvas.clipRegion(region);
```

**注意:** `Region` の演算（`setPath` など）は厳密に整数ベースです。曲線は小さなステップで近似されます。高精度のレンダリングには `Path` を優先してください。`Region` は、複雑な UI のヒットテストやピクセル単位のクリッピングマスクに最適です。