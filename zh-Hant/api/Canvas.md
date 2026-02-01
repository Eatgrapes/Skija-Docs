# API 參考：Canvas

`Canvas` 類別是 Skija 中所有繪圖操作的核心點。它管理繪圖狀態，包括變換和裁剪。

## 概述

`Canvas` 本身不持有像素；它是一個介面，將繪圖指令導向目的地，例如 `Surface` 或 `Bitmap`。

## 狀態管理

Canvas 維護一個狀態堆疊。您可以儲存當前狀態（矩陣和裁剪）並稍後恢復。

- `save()`: 將當前矩陣和裁剪的副本推入堆疊。返回儲存計數。
- `restore()`: 彈出堆疊並將矩陣和裁剪重置為先前的狀態。
- `restoreToCount(count)`: 恢復到特定的儲存計數。
- `getSaveCount()`: 返回當前堆疊深度。

### 圖層

圖層建立一個離屏緩衝區用於繪圖，然後在恢復時合成回主畫布。

- `saveLayer(rect, paint)`: 儲存狀態並將繪圖重定向到一個圖層。`paint` 控制圖層合成回來時的透明度/混合。
- `saveLayerAlpha(rect, alpha)`: 僅改變透明度的簡化版本。
- `saveLayer(SaveLayerRec)`: 進階圖層控制（背景、平鋪模式）。

```java
// 建立模糊濾鏡
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
SaveLayerRec rec = new SaveLayerRec(null, null, blur);

canvas.saveLayer(rec);
    // 在此繪製的所有內容將出現在模糊背景之上
    // （建立「磨砂玻璃」效果）
    canvas.drawRect(Rect.makeWH(200, 200), new Paint().setColor(0x80FFFFFF));
canvas.restore();
```

## 變換

變換影響所有後續的繪圖操作。

- `translate(dx, dy)`: 移動原點。
- `scale(sx, sy)`: 縮放座標。
- `rotate(degrees)`: 繞當前原點旋轉。
- `skew(sx, sy)`: 傾斜座標系。
- `concat(matrix)`: 乘以自定義的 `Matrix33` 或 `Matrix44`。
- `setMatrix(matrix)`: 完全替換當前矩陣。
- `resetMatrix()`: 重置為單位矩陣。
- `getLocalToDevice()`: 返回當前總變換矩陣。

## 裁剪

裁剪限制可以進行繪圖的區域。

- `clipRect(rect, mode, antiAlias)`: 裁剪到矩形。
- `clipRRect(rrect, mode, antiAlias)`: 裁剪到圓角矩形。
- `clipPath(path, mode, antiAlias)`: 裁剪到路徑。
- `clipRegion(region, mode)`: 裁剪到區域（像素對齊）。

## 繪圖方法



### 基本圖形

```java
// 繪製一個點（根據畫筆的 Cap 決定是像素還是圓形）
canvas.drawPoint(50, 50, new Paint().setColor(0xFF0000FF).setStrokeWidth(5));

// 繪製一條線
canvas.drawLine(10, 10, 100, 100, paint);

// 繪製一個矩形（輪廓或填充取決於畫筆模式）
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);

// 繪製一個圓形
canvas.drawCircle(100, 100, 40, paint);

// 繪製一個橢圓
canvas.drawOval(Rect.makeXYWH(50, 50, 100, 50), paint);

// 繪製一個圓角矩形（半徑可以很複雜）
canvas.drawRRect(RRect.makeXYWH(50, 50, 100, 100, 10), paint);

// 繪製一個弧形（扇形或描邊）
// startAngle: 0 表示右方，sweepAngle: 順時針角度
canvas.drawArc(Rect.makeXYWH(50, 50, 100, 100), 0, 90, true, paint);
```

- `drawPoint(x, y, paint)`: 繪製單個點。
- `drawPoints(points, paint)`: 繪製點集合（或根據畫筆 Cap 決定是線/多邊形）。
- `drawLine(x0, y0, x1, y1, paint)`: 繪製線段。
- `drawLines(points, paint)`: 為每對點繪製獨立的線段。
- `drawRect(rect, paint)`: 繪製矩形。
- `drawOval(rect, paint)`: 繪製橢圓。
- `drawCircle(x, y, radius, paint)`: 繪製圓形。
- `drawRRect(rrect, paint)`: 繪製圓角矩形。
- `drawDRRect(outer, inner, paint)`: 繪製兩個圓角矩形之間的區域（環形）。
- `drawArc(rect, startAngle, sweepAngle, useCenter, paint)`: 繪製楔形（扇形）或弧形描邊。
- `drawPath(path, paint)`: 繪製路徑。
- `drawRegion(region, paint)`: 繪製特定區域。

### 填充與清除

```java
// 用特定顏色填充整個畫布/圖層（與現有內容混合）
canvas.drawColor(0x80FF0000); // 50% 紅色疊加

// 將整個畫布清除為透明（替換內容，無混合）
canvas.clear(0x00000000);

// 用特定畫筆填充當前裁剪區域
// 適用於用漸層或複雜畫筆效果填充螢幕
canvas.drawPaint(new Paint().setShader(myGradient));
```

- `clear(color)`: 用顏色填充整個裁剪區域（替換像素，忽略混合）。
- `drawColor(color, mode)`: 用顏色填充裁剪區域（尊重混合）。
- `drawPaint(paint)`: 用給定的畫筆填充裁剪區域（適用於用漸層填充）。

### 圖像與點陣圖

```java
// 在 (0, 0) 繪製圖像
canvas.drawImage(image, 0, 0);

// 將圖像縮放到特定矩形
canvas.drawImageRect(image, Rect.makeXYWH(0, 0, 200, 200));

// 繪製九宮格圖像（可縮放 UI 元素）
// center: 源圖像中可伸縮的中間區域
// dst: 要繪製到的目標矩形
canvas.drawImageNine(image, IRect.makeLTRB(10, 10, 20, 20), Rect.makeXYWH(0, 0, 100, 50), FilterMode.LINEAR, null);
```

- `drawImage(image, x, y, paint)`: 在座標處繪製圖像。
- `drawImageRect(image, src, dst, sampling, paint, strict)`: 繪製圖像的子集並縮放到目標矩形。
- `drawImageNine(image, center, dst, filter, paint)`: 繪製九宮格可縮放圖像。
- `drawBitmap(bitmap, x, y, paint)`: 繪製點陣圖（柵格數據）。

### 文字

```java
// 簡單文字繪製
canvas.drawString("Hello World", 50, 50, font, paint);

// 使用 TextBlob 進行進階文字繪製（預先計算的佈局）
canvas.drawTextBlob(blob, 50, 50, paint);

// 繪製 TextLine（來自 Shaper）
canvas.drawTextLine(line, 50, 50, paint);
```

- `drawString(string, x, y, font, paint)`: 繪製簡單字串。
- `drawTextBlob(blob, x, y, paint)`: 繪製預先計算的文字 blob。
- `drawTextLine(line, x, y, paint)`: 繪製已形塑的 `TextLine`。

### 進階繪圖

```java
// 繪製三角形網格（例如，用於自訂 3D 效果或扭曲）
canvas.drawVertices(
    new Point[] { new Point(0, 0), new Point(100, 0), new Point(50, 100) },
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF }, // 每個頂點的顏色
    null, // 無紋理座標
    null, // 無索引（按順序使用頂點）
    BlendMode.MODULATE,
    new Paint()
);

// 為矩形繪製陰影
// （比手動建立陰影濾鏡更簡單）
canvas.drawRectShadow(
    Rect.makeXYWH(50, 50, 100, 100),
    5, 5,  // dx, dy
    10,    // blur
    0,     // spread
    0x80000000 // 陰影顏色
);
```

- `drawPicture(picture)`: 重播已錄製的 `Picture`。
- `drawDrawable(drawable)`: 繪製動態 `Drawable` 物件。
- `drawVertices(positions, colors, texCoords, indices, mode, paint)`: 繪製三角形網格。
- `drawPatch(cubics, colors, texCoords, mode, paint)`: 繪製 Coons 補丁。
- `drawRectShadow(rect, dx, dy, blur, spread, color)`: 繪製簡單陰影的輔助方法。

## 像素存取

```java
// 從畫布讀取像素到點陣圖
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));
canvas.readPixels(bmp, 0, 0); // 從畫布的 (0,0) 開始讀取

// 將像素寫回畫布
canvas.writePixels(bmp, 50, 50);
```

- `readPixels(bitmap, srcX, srcY)`: 從畫布讀取像素到點陣圖。
- `writePixels(bitmap, x, y)`: 將點陣圖的像素寫入畫布。