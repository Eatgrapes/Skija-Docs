# 渲染基礎

本指南涵蓋使用 Skija 進行渲染的基本概念，從創建繪圖表面到執行基本繪圖操作。

## 表面與畫布

在 Skia（以及 Skija）中，所有繪圖都在 **Canvas** 上進行。然而，Canvas 需要一個繪製目標，這由 **Surface** 提供。

### 離屏渲染（點陣圖）

最簡單的開始方式是創建一個點陣圖（記憶體中）表面。這非常適合生成圖像、伺服器端渲染或測試。

```java
// 使用預設的 N32 色彩格式（通常是 RGBA 或 BGRA）創建一個 100x100 像素的表面
Surface surface = Surface.makeRasterN32Premul(100, 100);

// 從表面獲取 Canvas
Canvas canvas = surface.getCanvas();
```

`Canvas` 物件是您進行繪圖的主要介面。它維護當前狀態（變換、裁剪）並提供繪圖方法。

## 使用 Paint

雖然 `Canvas` 定義了*在哪裡*和*繪製什麼*，但 `Paint` 物件定義了*如何*繪製。`Paint` 物件保存有關顏色、筆觸樣式、混合模式以及各種效果的資訊。

```java
Paint paint = new Paint();
paint.setColor(0xFFFF0000); // 完全不透明的紅色
```

### 處理顏色

Skija 中的顏色以 **ARGB** 格式的 32 位元整數表示：
- `0x` 後接 `FF`（Alpha）、`RR`（紅色）、`GG`（綠色）、`BB`（藍色）。
- `0xFFFF0000` 是不透明的紅色。
- `0xFF00FF00` 是不透明的綠色。
- `0xFF0000FF` 是不透明的藍色。
- `0x80000000` 是半透明的黑色。

## 基本繪圖操作

`Canvas` 提供了許多繪製基本圖形的方法。

```java
// 在 (50, 50) 處繪製半徑為 30 的圓
canvas.drawCircle(50, 50, 30, paint);

// 繪製一條簡單的線
canvas.drawLine(10, 10, 90, 90, paint);

// 繪製一個矩形
canvas.drawRect(Rect.makeXYWH(10, 10, 80, 80), paint);
```

## 擷取與保存輸出

在表面上繪製後，您通常希望將結果保存為圖像檔案。

```java
// 1. 將當前表面內容快照為 Image
Image image = surface.makeImageSnapshot();

// 2. 將圖像編碼為特定格式（例如 PNG）
Data pngData = image.encodeToData(EncodedImageFormat.PNG);

// 3. 將資料轉換為 ByteBuffer 以便寫入
ByteBuffer pngBytes = pngData.toByteBuffer();

// 4. 使用標準 Java I/O 寫入檔案
try {
    java.nio.file.Path path = java.nio.file.Path.of("output.png");
    Files.write(path, pngBytes.array());
} catch (IOException e) {
    e.printStackTrace();
}
```

### 讀取像素（畫面擷取）

如果您需要從表面獲取原始像素數據（例如用於處理或檢查）而不將其編碼為圖像格式：

```java
// 創建一個 Bitmap 來儲存結果
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));

// 從表面讀取像素到 bitmap 中
// 如果尺寸匹配，這會讀取整個表面
surface.readPixels(bitmap, 0, 0);

// 對於特定區域（例如，從 10, 10 開始的 50x50 區域）
Bitmap region = new Bitmap();
region.allocPixels(ImageInfo.makeN32Premul(50, 50));
surface.readPixels(region, 10, 10);
```

## 鏈式 API

許多 Skija 的 setter 方法返回 `this`，允許使用流暢的建構器風格 API：

```java
Paint strokePaint = new Paint()
    .setColor(0xFF1D7AA2)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(2f)
    .setAntiAlias(true);
```