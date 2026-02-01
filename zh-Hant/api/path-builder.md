# API 參考：PathBuilder

`PathBuilder` 是 Skija 中構建 `Path` 物件的現代推薦方式。它提供了流暢的 API，專為路徑構建而設計，將構建過程與不可變的 `Path` 結果分離。

## 基本指令

移動與直線：
- `moveTo(x, y)`：開始一個新的輪廓。
- `lineTo(x, y)`：添加一條線段。
- `polylineTo(points)`：添加多條線段。
- `closePath()`：關閉當前輪廓。

相對指令（相對於當前點的偏移）：
- `rMoveTo(dx, dy)`
- `rLineTo(dx, dy)`

## 曲線

二次貝塞爾曲線（1 個控制點）：
- `quadTo(x1, y1, x2, y2)`：絕對座標。
- `rQuadTo(dx1, dy1, dx2, dy2)`：相對座標。

三次貝塞爾曲線（2 個控制點）：
- `cubicTo(x1, y1, x2, y2, x3, y3)`：絕對座標。
- `rCubicTo(dx1, dy1, dx2, dy2, dx3, dy3)`：相對座標。

圓錐曲線（帶權重的二次曲線）：
- `conicTo(x1, y1, x2, y2, w)`：適用於精確的圓形/橢圓。
- `rConicTo(...)`：相對版本。

## 弧線

- `arcTo(oval, startAngle, sweepAngle, forceMoveTo)`：添加一個限制在給定橢圓內的弧線。
- `tangentArcTo(p1, p2, radius)`：添加與線段（當前點 -> p1）和（p1 -> p2）相切的弧線。
- `ellipticalArcTo(...)`：添加 SVG 風格的弧線。

## 添加形狀

`PathBuilder` 允許將整個形狀作為新輪廓添加。

- `addRect(rect, direction, startIndex)`
- `addOval(rect, direction, startIndex)`
- `addCircle(x, y, radius, direction)`
- `addRRect(rrect, direction, startIndex)`：圓角矩形。
- `addPolygon(points, close)`：將一系列點作為輪廓添加。
- `addPath(path, mode)`：將另一個路徑的輪廓附加到此路徑。

## 變換（建構器狀態）

這些方法會影響建構器中*當前*的點。

- `offset(dx, dy)`：平移建構器中所有現有的點。
- `transform(matrix)`：對所有現有的點應用矩陣變換。

## 建構器管理

- `reset()`：將建構器清空至初始狀態（保留記憶體）。
- `incReserve(points, verbs)`：預先分配記憶體，避免建構過程中重新調整大小。
- `setFillMode(mode)`：設定填充規則（`WINDING`、`EVEN_ODD` 等）。
- `setVolatile(boolean)`：提示結果路徑不應被快取（適用於一次性動畫路徑）。

## 輸出方法

- **`snapshot()`**：返回一個 `Path` 並保持建構器狀態不變。
- **`detach()`**：返回一個 `Path` 並重置建構器（最有效率）。
- **`build()`**：返回一個 `Path` 並關閉建構器（之後無法再使用）。

## 範例：基本建構

```java
Path path = new PathBuilder()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath()
    .snapshot(); // 返回 Path
```

## 範例：變換

```java
PathBuilder builder = new PathBuilder();

builder.addRect(Rect.makeXYWH(0, 0, 100, 100))
       .offset(10, 10)
       .transform(Matrix33.makeRotate(45));

Path p = builder.detach(); // 返回路徑並重置建構器
```

## 視覺範例

查看 [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) 以了解各種路徑組合和填充規則。