# API 參考：Region

`Region` 類別代表畫布上的一個複雜區域，類似於 `Path`，但由**整數**座標定義。Region 針對布林運算（如交集、聯集、差集）以及測試點或矩形是否在區域內進行了高度優化。

## 概述

與使用浮點座標且可包含曲線的 `Path` 不同，`Region` 本質上是一組水平掃描線。它在碰撞測試和裁剪方面非常高效。

## 建立與修改 Region

```java
// 建立一個空的 region
Region region = new Region();

// 將其設定為一個矩形
region.setRect(new IRect(0, 0, 100, 100));

// 從 Path 設定
// (需要一個 'clip' region 來定義最大邊界)
Path path = new Path().addCircle(50, 50, 40);
Region clip = new Region();
clip.setRect(new IRect(0, 0, 200, 200));
region.setPath(path, clip);
```

## 布林運算

`Region` 的強大之處在於它能夠使用邏輯運算子組合多個區域。

```java
Region regionA = new Region();
regionA.setRect(new IRect(0, 0, 100, 100));

Region regionB = new Region();
regionB.setRect(new IRect(50, 50, 150, 150));

// 交集：結果是重疊區域 (50, 50, 100, 100)
regionA.op(regionB, RegionOp.INTERSECT);

// 聯集：結果是兩個區域的合併區域
regionA.op(regionB, RegionOp.UNION);

// 差集：從 A 中移除 B
regionA.op(regionB, RegionOp.DIFFERENCE);
```

可用的運算 (`RegionOp`)：
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A
- `REPLACE`: B

## 碰撞測試

您可以檢查一個點或矩形是否在 region 內。

```java
if (region.contains(10, 10)) {
    // 點在區域內
}

if (region.quickReject(new IRect(200, 200, 300, 300))) {
    // 矩形肯定在區域外
}
```

## 與 Canvas 一起使用

您可以使用 `Region` 來裁剪 `Canvas`。

```java
canvas.clipRegion(region);
```

**注意：** `Region` 的運算（如 `setPath`）嚴格基於整數。曲線將由小步長近似。對於高精度渲染，建議使用 `Path`。`Region` 最適合用於複雜的 UI 碰撞測試或像素對齊的裁剪遮罩。