# API 參考：編解碼器（解碼與動畫）

雖然 `Image.makeDeferredFromEncodedBytes()` 適用於簡單的靜態圖片，但當你需要更多解碼過程的控制權，或是處理**動畫圖片**（GIF、動態 WebP）時，就需要使用 `Codec` 類別。

## 載入編解碼器

`Codec` 代表圖片在轉換為像素前的「來源」。

```java
Data data = Data.makeFromFileName("animations/loading.gif");
Codec codec = Codec.makeFromData(data);
```

## 基本解碼

從編解碼器取得單一靜態影格：

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(codec.getImageInfo()); // 準備記憶體
codec.readPixels(bmp); // 將資料解碼至點陣圖
```

## 處理動畫

這是 `Codec` 的強項。它允許你遍歷 GIF 或 WebP 的影格。

```java
int frameCount = codec.getFrameCount();
int loopCount = codec.getRepetitionCount(); // -1 表示無限循環

for (int i = 0; i < frameCount; i++) {
    // 1. 取得此特定影格的資訊（持續時間等）
    AnimationFrameInfo info = codec.getFrameInfo(i);
    int duration = info.getDuration(); // 單位為毫秒
    
    // 2. 解碼影格
    Bitmap frameBmp = new Bitmap();
    frameBmp.allocPixels(codec.getImageInfo());
    codec.readPixels(frameBmp, i);
    
    // 3. 對影格進行處理...
}
```

## 進階解碼選項

### 解碼時縮放
如果你有一張 4K 圖片但只需要 200x200 的大小，可以告訴編解碼器在解碼過程中進行縮放。這比解碼完整圖片後再縮放快得多，且使用的記憶體更少。

```java
ImageInfo smallInfo = ImageInfo.makeN32Premul(200, 200);
Bitmap smallBmp = new Bitmap();
smallBmp.allocPixels(smallInfo);

codec.readPixels(smallBmp); // 一步完成解碼與縮放！
```

## 重要注意事項

- **串流倒帶：** 某些編解碼器（取決於來源資料）無法倒帶。如果你需要多次解碼影格，將 `Data` 保留在記憶體中會更安全。
- **色彩空間：** 編解碼器會嘗試遵循圖片內嵌的色彩空間。你可以透過提供不同的 `ImageInfo` 給 `readPixels` 來覆寫此行為。
- **記憶體：** `Codec` 本身很小，但你解碼到的 `Bitmap` 物件可能非常龐大。請盡可能重複使用點陣圖。