# API 參考：Path

`Path` 類別代表由直線段、二次曲線和三次曲線組成的複雜複合幾何路徑。

> **注意：** 對於構建新路徑，強烈建議使用 [**PathBuilder**](path-builder.md)，而不是直接在 `Path` 上呼叫方法。`PathBuilder` 提供了更好的流暢 API，並確保生成的 `Path` 是不可變的。

## 構建路徑（靜態工廠方法）

雖然對於複雜路徑更推薦使用 `PathBuilder`，但 `Path` 為常見形狀提供了高效的靜態工廠方法。

- `makeRect(rect)`：從矩形建立路徑。
- `makeOval(rect)`：從橢圓建立路徑。
- `makeCircle(x, y, radius)`：從圓形建立路徑。
- `makeRRect(rrect)`：從圓角矩形建立路徑。
- `makeLine(p1, p2)`：從單一線段建立路徑。
- `makePolygon(points, closed)`：從一系列點建立路徑。
- `makeFromSVGString(svgString)`：解析 SVG 路徑字串（例如 `"M10 10 L50 50 Z"`）。

## 路徑資訊與度量

- `getBounds()`：返回保守的邊界框（快速，已快取）。
- `computeTightBounds()`：返回精確的邊界框（較慢）。
- `isEmpty()`：如果路徑不包含任何動詞，則返回 true。
- `isConvex()`：如果路徑定義了一個凸形狀，則返回 true。
- `isRect()`：如果路徑代表一個簡單矩形，則返回 `Rect`，否則返回 null。
- `isOval()`：如果路徑是一個橢圓，則返回邊界 `Rect`，否則返回 null。
- `isFinite()`：如果路徑中的所有點都是有限的，則返回 true。

## 點擊測試

- `contains(x, y)`：如果指定點在路徑內部（基於目前的填充類型），則返回 true。
- `conservativelyContainsRect(rect)`：如果矩形肯定在路徑內部，則返回 true（快速拒絕測試）。

## 布林運算

路徑可以使用邏輯運算進行組合。這些操作會建立一個**新的** `Path` 物件。

```java
Path result = Path.makeCombining(pathA, pathB, PathOp.INTERSECT);
```

可用的 `PathOp`：
- `DIFFERENCE`：A - B
- `INTERSECT`：A & B
- `UNION`：A | B
- `XOR`：(A | B) - (A & B)
- `REVERSE_DIFFERENCE`：B - A

## 變換與修改

這些方法返回一個套用了變換的**新** `Path` 實例。

- `makeTransform(matrix)`：將 `Matrix33` 套用到路徑中的所有點。
- `makeOffset(dx, dy)`：平移路徑。
- `makeScale(s)`：縮放路徑。

## 插值（變形）

您可以在兩個相容的路徑之間進行插值（適用於動畫）。

```java
// 在 pathA 和 pathB 之間插值 50%
if (pathA.isInterpolatable(pathB)) {
    Path midPath = pathA.makeInterpolate(pathB, 0.5f);
}
```

## 序列化

- `serializeToBytes()`：將路徑序列化為位元組陣列。
- `makeFromBytes(bytes)`：從位元組重建路徑。
- `dump()`：將路徑結構列印到標準輸出（用於除錯）。

## 測量與迭代

- `PathMeasure`：用於計算路徑長度並沿其長度尋找位置/切線。
- `PathSegmentIterator`：允許您迭代構成路徑的個別動詞和點。

## 範例

```java
Path path = new Path()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath();

canvas.drawPath(path, paint);
```

## 填充類型

填充類型決定了哪些區域在填充操作中被視為路徑的「內部」。
- `WINDING`（預設）：使用繞數規則。
- `EVEN_ODD`：使用奇偶規則。
- `INVERSE_WINDING`：反轉繞數規則（填充外部）。
- `INVERSE_EVEN_ODD`：反轉奇偶規則。

## 視覺範例

請參閱 [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) 以獲取建立、修改和組合路徑的範例。
