# 圖片與點陣圖

在 Skija 中處理圖片主要涉及兩個類別：`Image` 和 `Bitmap`。雖然它們看起來相似，但用途不同。

## Image 與 Bitmap 的區別

- **`Image`**：可將其視為唯讀、可能由 GPU 支援的紋理。它針對繪製到畫布上進行了優化。
- **`Bitmap`**：這是一個可變的、位於 CPU 端的像素陣列。當你需要以程式方式編輯單個像素時，會使用此類別。

## 載入圖片

獲取圖片最常見的方式是從編碼的位元組（PNG、JPEG 等）載入。

```java
byte[] bytes = Files.readAllBytes(Path.of("photo.jpg"));
Image img = Image.makeDeferredFromEncodedBytes(bytes);
```

**提示：** `makeDeferredFromEncodedBytes` 是「延遲」的——它不會解碼像素，直到你第一次實際繪製它為止，這在初始載入時節省了記憶體和時間。

### 從像素（點陣）建立

如果你有原始像素資料（例如，來自其他函式庫或程序化生成）：

```java
// 從 Data 物件建立（包裝原生記憶體或位元組陣列）
Image img = Image.makeRasterFromData(
    ImageInfo.makeN32Premul(100, 100),
    data,
    rowBytes
);

// 從 Bitmap 建立（複製或共享像素）
Image img = Image.makeRasterFromBitmap(bitmap);

// 從 Pixmap 建立（複製像素）
Image img = Image.makeRasterFromPixmap(pixmap);
```

## 編碼（儲存圖片）

要將 `Image` 儲存到檔案或串流，你必須對其進行編碼。Skija 提供了 `EncoderJPEG`、`EncoderPNG` 和 `EncoderWEBP` 以進行細粒度控制。

```java
// 簡單編碼（預設設定）
Data pngData = EncoderPNG.encode(image);
Data jpgData = EncoderJPEG.encode(image); // 預設品質 100

// 進階編碼（帶選項）
EncodeJPEGOptions jpgOpts = new EncodeJPEGOptions()
    .setQuality(80)
    .setAlphaMode(EncodeJPEGAlphaMode.IGNORE);

Data compressed = EncoderJPEG.encode(image, jpgOpts);

// WebP 編碼
EncodeWEBPOptions webpOpts = new EncodeWEBPOptions()
    .setQuality(90)
    .setCompression(EncodeWEBPCompressionMode.LOSSY); // 或 LOSSLESS

Data webp = EncoderWEBP.encode(image, webpOpts);
```

## 在畫布上繪製

繪製圖片很簡單，但要注意**取樣**。

```java
canvas.drawImage(img, 10, 10);
```

### 取樣模式

當你縮放圖片時，需要決定如何取樣：
- `SamplingMode.DEFAULT`：最近鄰取樣。速度快，但縮放時看起來有塊狀感。
- `SamplingMode.LINEAR`：雙線性過濾。平滑，但可能有點模糊。
- `SamplingMode.MITCHELL`：高品質立方重取樣。非常適合縮小。

```java
canvas.drawImageRect(img, Rect.makeWH(200, 200), SamplingMode.LINEAR, null, true);
```

## 從圖片建立著色器

你可以將圖片用作圖案（例如，用於平鋪背景），方法是將其轉換為著色器。

```java
Shader pattern = img.makeShader(FilterTileMode.REPEAT, FilterTileMode.REPEAT);
paint.setShader(pattern);
canvas.drawPaint(paint); // 用平鋪的圖片填充整個畫布
```

## 處理像素（Bitmap）

如果你需要逐像素從頭生成圖片：

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));

// 現在你可以使用 Canvas 在此點陣圖上繪製
Canvas c = new Canvas(bmp);
c.clear(0xFFFFFFFF);
// ... 繪製內容 ...

// 或者存取原始像素（進階）
ByteBuffer pixels = bmp.peekPixels();
```

## 存取像素資料（取樣）

要從 `Image` 或 `Surface` 讀取像素，請使用 `readPixels` 方法。

### 完整圖片取樣
```java
// 建立一個點陣圖來保存像素
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(width, height));

// 將圖片中的所有像素讀取到點陣圖中
image.readPixels(bmp);
```

### 區域取樣
你可以透過提供 (x, y) 偏移量來讀取圖片的特定子矩形區域。

```java
// 我們只需要一個 50x50 的區域
Bitmap regionBmp = new Bitmap();
regionBmp.allocPixels(ImageInfo.makeN32Premul(50, 50));

// 從源圖片的 (100, 100) 開始讀取
// 有效地捕獲矩形 {100, 100, 150, 150}
image.readPixels(regionBmp, 100, 100); 
```

## OpenGL / Metal 互通性

Skija 允許你直接從現有的 GPU 紋理建立 `Image` 物件。這對於與其他圖形函式庫（如 LWJGL）整合非常有用。

### 從 OpenGL 紋理建立圖片

```java
// 你需要一個 DirectContext 來進行 GPU 操作
DirectContext context = ...; 

// 假設你從其他地方獲得了一個 OpenGL 紋理 ID
int textureId = 12345;

Image glImage = Image.adoptGLTextureFrom(
    context, 
    textureId, 
    GL30.GL_TEXTURE_2D, 
    512, 512, 
    GL30.GL_RGBA8, 
    SurfaceOrigin.BOTTOM_LEFT, 
    ColorType.RGBA_8888
);

// 現在你可以使用 Skija 繪製此紋理
canvas.drawImage(glImage, 0, 0);
```

**注意：** 當採用紋理時，Skija 會假設所有權。如果你想在不取得所有權的情況下包裝它，請尋找 `makeFromTexture` 變體（如果可用）或仔細管理生命週期。

## 效能陷阱

1.  **在 UI 執行緒上解碼：** 解碼大圖片可能很慢。請在背景執行緒中進行。
2.  **紋理上傳：** 如果你使用 GPU 後端（如 OpenGL），第一次繪製 CPU 端的 `Image` 時，Skia 必須將其上傳到 GPU。對於大型紋理，這可能導致掉幀。
3.  **大型點陣圖：** 點陣圖存在於 Java 的堆積和原生記憶體中。對於大尺寸（例如 8k 紋理）要小心，因為它們可能很快導致記憶體不足錯誤。