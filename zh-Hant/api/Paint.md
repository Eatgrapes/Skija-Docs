# API 參考：Paint

`Paint` 類別定義了在 `Canvas` 上繪圖時使用的樣式、顏色和效果。它是一個輕量級物件，可以在多個繪圖呼叫中重複使用。

## 核心屬性

### 顏色與透明度

- `setColor(int color)`：設定 ARGB 顏色。
- `setAlpha(int alpha)`：僅設定 alpha（透明度）分量（0-255）。
- `setColor4f(Color4f color, ColorSpace space)`：使用浮點數值設定顏色以獲得更高精度。

### 樣式

- `setMode(PaintMode mode)`：決定繪製是填充形狀內部（`FILL`）、描繪輪廓（`STROKE`），還是兩者兼具（`STROKE_AND_FILL`）。
- `setStrokeWidth(float width)`：設定描邊的粗細。
- `setStrokeCap(PaintStrokeCap cap)`：定義描邊線條端點的形狀（BUTT、ROUND、SQUARE）。
- `setStrokeJoin(PaintStrokeJoin join)`：定義描邊線段如何連接（MITER、ROUND、BEVEL）。

### 抗鋸齒

- `setAntiAlias(boolean enabled)`：啟用或停用邊緣平滑。強烈建議在大多數 UI 繪製中使用。

## 效果與著色器

`Paint` 物件可以透過各種效果增強，以創建複雜的視覺效果。

### 著色器（漸層與圖案）

著色器根據每個像素的位置定義其顏色。
- `setShader(Shader shader)`：套用線性漸層、徑向漸層或圖像圖案。

### 顏色濾鏡

顏色濾鏡在繪製前修改來源的顏色。
- `setColorFilter(ColorFilter filter)`：套用顏色矩陣、混合模式或亮度轉換。

### 遮罩濾鏡（模糊）

遮罩濾鏡影響繪製的 alpha 通道。
- `setMaskFilter(MaskFilter filter)`：主要用於創建模糊和陰影效果。

### 圖像濾鏡

圖像濾鏡更為複雜，可以影響整個繪製結果。
- `setImageFilter(ImageFilter filter)`：用於模糊、投影以及組合多種效果。

## 使用範例

```java
Paint paint = new Paint()
    .setColor(0xFF4285F4)
    .setAntiAlias(true)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(4f)
    .setStrokeJoin(PaintStrokeJoin.ROUND);

canvas.drawRect(Rect.makeXYWH(10, 10, 100, 100), paint);
```

## 效能注意事項

創建 `Paint` 物件相對較快，但在緊密迴圈中頻繁修改可能會產生一些開銷。通常建議在屬性不變的情況下，預先準備好 `Paint` 物件並在渲染過程中重複使用。