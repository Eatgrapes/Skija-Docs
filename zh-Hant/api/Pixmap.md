# API 參考：Pixmap

`Pixmap` 類別代表記憶體中的點陣圖像。它提供對像素資料的直接存取，以及讀取、寫入和操作像素的方法。

## 概述

`Pixmap` 將 `ImageInfo`（寬度、高度、色彩類型、透明度類型、色彩空間）與記憶體中的實際像素資料配對。與 `Image` 不同，`Pixmap` 允許直接存取像素緩衝區。

## 建立

- `make(info, buffer, rowBytes)`：建立一個包裝所提供 `ByteBuffer` 的 `Pixmap`。
- `make(info, addr, rowBytes)`：建立一個包裝所提供原生記憶體位址的 `Pixmap`。

## 管理資料

- `reset()`：將 `Pixmap` 清除為空狀態。
- `reset(info, buffer, rowBytes)`：重設 `Pixmap` 以包裝新提供的緩衝區。
- `setColorSpace(colorSpace)`：更新 `Pixmap` 的色彩空間。
- `extractSubset(subsetPtr, area)`：將 `Pixmap` 的子集提取到 `subsetPtr` 指向的記憶體中。
- `extractSubset(buffer, area)`：將 `Pixmap` 的子集提取到提供的 `ByteBuffer` 中。

## 屬性

- `getInfo()`：返回描述 `Pixmap` 的 `ImageInfo`（寬度、高度、色彩類型等）。
- `getRowBytes()`：返回每行的位元組數。
- `getAddr()`：返回像素資料的原生位址。
- `getRowBytesAsPixels()`：返回每行的像素數（僅適用於特定色彩類型）。
- `computeByteSize()`：計算像素資料的總位元組大小。
- `computeIsOpaque()`：如果 `Pixmap` 不透明則返回 true。
- `getBuffer()`：返回包裝像素資料的 `ByteBuffer`。

## 存取像素

### 單一像素存取

- `getColor(x, y)`：返回 `(x, y)` 處像素的顏色作為整數（ARGB）。
- `getColor4f(x, y)`：返回 `(x, y)` 處像素的顏色作為 `Color4f`。
- `getAlphaF(x, y)`：返回 `(x, y)` 處像素的透明度分量作為浮點數。
- `getAddr(x, y)`：返回 `(x, y)` 處像素的原生位址。

### 批次像素操作

- `readPixels(info, addr, rowBytes)`：將像素從 `Pixmap` 複製到目標記憶體。
- `readPixels(pixmap)`：將像素複製到另一個 `Pixmap`。
- `scalePixels(dstPixmap, samplingMode)`：使用指定的取樣模式將像素縮放以適應目標 `Pixmap`。
- `erase(color)`：使用指定顏色填充整個 `Pixmap`。
- `erase(color, subset)`：使用指定顏色填充 `Pixmap` 的特定區域。

## 範例

### 修改像素

```java
// 建立一個新的 N32（標準 RGBA/BGRA）Pixmap
try (var pixmap = new Pixmap()) {
    // 為 100x100 像素分配記憶體
    pixmap.reset(ImageInfo.makeN32Premul(100, 100), Unpooled.malloc(100 * 100 * 4), 100 * 4);
    
    // 用白色填充
    pixmap.erase(0xFFFFFFFF);

    // 在 (10, 10) 處將一個像素設為紅色
    // 注意：對於批次操作，直接位元組操作可能更快，
    // 但 erase/readPixels 是更簡單的 API。
    // Skija Pixmap 在託管 API 中出於效能考量未公開簡單的 setPixel(x,y,color) 方法，
    // 但你可以直接寫入 ByteBuffer。
    ByteBuffer buffer = pixmap.getBuffer();
    int offset = (10 * 100 + 10) * 4; // y * width + x * bpp
    buffer.putInt(offset, 0xFFFF0000); // ARGB (Red)
    
    // 從此 pixmap 建立圖像以進行繪製
    try (var image = Image.makeFromRaster(pixmap)) {
        canvas.drawImage(image, 0, 0);
    }
}
```

### 讀取像素

```java
// 假設你有一個 Pixmap 'pixmap'
int width = pixmap.getInfo().getWidth();
int height = pixmap.getInfo().getHeight();

// 取得特定座標的顏色
int color = pixmap.getColor(50, 50);
System.out.println("Color at 50,50: " + Integer.toHexString(color));

// 遍歷所有像素（注意 Java 中的效能！）
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        if (pixmap.getAlphaF(x, y) > 0.5f) {
            // 找到非透明像素
        }
    }
}
```