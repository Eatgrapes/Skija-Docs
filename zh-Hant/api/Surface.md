# API 參考：Surface

`Surface` 類別是所有繪圖指令的目的地。它管理像素記憶體（在 CPU 或 GPU 上），並提供用於繪圖的 `Canvas`。

## 概述

`Surface` 負責：
1.  保存像素資料（或管理 GPU 紋理）。
2.  提供 `Canvas` 介面來繪製到該資料中。
3.  將當前內容快照成 `Image`。

## 建立 Surface

### 1. 點陣圖 Surface（CPU）
最簡單的 surface。像素存在於標準系統記憶體（RAM）中。最適合生成圖像、伺服器端渲染或測試。

```java
// 標準 32 位元 RGBA surface
Surface raster = Surface.makeRasterN32Premul(800, 600);

// 使用自訂 ImageInfo（例如，用於 HDR 的 F16 色彩）
ImageInfo info = new ImageInfo(800, 600, ColorType.RGBA_F16, AlphaType.PREMUL);
Surface hdrSurface = Surface.makeRaster(info);
```

### 2. GPU Surface（渲染目標）
用於硬體加速渲染。你需要一個 `DirectContext`（OpenGL/Metal/Vulkan 上下文）。

```java
DirectContext context = ...; // 你的 GPU 上下文

// 在 GPU 上建立一個由 Skia 管理的新紋理
Surface gpuSurface = Surface.makeRenderTarget(
    context,
    false,             // Budgeted？（Skia 是否應將此計入其快取限制？）
    ImageInfo.makeN32Premul(800, 600)
);
```

### 3. 包裝現有的 OpenGL/Metal 紋理
如果你將 Skija 整合到現有的遊戲引擎或視窗系統（如 LWJGL 或 JWM）中，視窗通常會提供一個「framebuffer」或「texture」ID。你包裝這個 ID，以便 Skija 可以直接繪製到螢幕上。

```java
// OpenGL 範例
int framebufferId = 0; // 預設螢幕緩衝區
BackendRenderTarget renderTarget = BackendRenderTarget.makeGL(
    800, 600,          // 寬度, 高度
    0,                 // 取樣數（0 表示無 MSAA）
    8,                 // 模板位元
    framebufferId,
    BackendRenderTarget.FRAMEBUFFER_FORMAT_GR_GL_RGBA8
);

Surface screenSurface = Surface.wrapBackendRenderTarget(
    context,
    renderTarget,
    SurfaceOrigin.BOTTOM_LEFT, // OpenGL 座標從左下角開始
    ColorType.RGBA_8888,
    ColorSpace.getSRGB(),
    null // SurfaceProps
);
```

### 4. 包裝點陣圖像素（互操作）
如果你有來自其他函式庫（如視訊幀解碼器）的 `ByteBuffer` 或指標，可以直接包裝它而無需複製。

```java
long pixelPtr = ...; // 指向記憶體的原生指標
int rowBytes = width * 4; // 每行位元組數

Surface wrap = Surface.wrapPixels(
    ImageInfo.makeN32Premul(width, height),
    pixelPtr,
    rowBytes
);
```

### 5. 空 Surface
建立一個不執行任何操作的 surface。適用於測量或測試，無需分配記憶體。

```java
Surface nullSurface = Surface.makeNull(100, 100);
```

## 建立快照（`Image`）

從 `Surface` 建立不可變的 `Image` 是一個低成本操作（寫入時複製）。

```java
// 這不會立即複製像素！
// 它實際上「分叉」了 surface。未來對 'surface' 的繪製不會影響 'snapshot'。
Image snapshot = surface.makeImageSnapshot();

// 現在你可以使用 'snapshot' 繪製到另一個 surface 或儲存到磁碟。
```

## 與內容互動

```java
// 取得畫布進行繪製
Canvas canvas = surface.getCanvas();
canvas.drawCircle(50, 50, 20, paint);

// 將像素讀回點陣圖
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));
if (surface.readPixels(bitmap, 0, 0)) {
    // 像素成功讀取
}

// 將點陣圖的像素寫入 surface
surface.writePixels(bitmap, 10, 10);

// 將指令刷新到 GPU（對 GPU surface 很重要）
surface.flush();
```

- `getCanvas()`：返回用於繪圖的畫布。
- `readPixels(bitmap, x, y)`：從 GPU/CPU 讀取像素到點陣圖。
- `writePixels(bitmap, x, y)`：將點陣圖的像素寫入 surface。
- `flush()`：確保所有待處理的 GPU 指令都發送到驅動程式。
- `notifyContentWillChange()`：如果你直接修改底層像素記憶體（繞過 Canvas），請呼叫此方法。
- `getRecordingContext()`：返回支援此 surface 的 `DirectContext`（如果有的話）。