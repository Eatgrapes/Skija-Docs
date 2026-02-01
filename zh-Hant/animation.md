# Skija 中的動畫

在 Skija 中，「動畫」根據你想要達成的目標，可以指三種不同的事情：

1.  **程式化動畫：** 使用程式碼移動形狀或改變顏色（例如，遊戲迴圈）。
2.  **Lottie (Skottie)：** 播放從 After Effects 匯出的高品質向量動畫。
3.  **動態圖片：** 播放 GIF 或 WebP 圖片。

## 1. 程式化動畫（「遊戲迴圈」）

Skija 是一個「立即模式」渲染器。這意味著它不會記住你昨天在哪裡畫了一個圓圈。要移動一個圓圈，你只需要在今天把它畫在不同的位置。

要建立動畫，你需要依賴你的視窗庫（如 JWM 或 LWJGL）來重複呼叫你的 `draw` 函數。

### 模式

1.  **取得時間：** 使用 `System.nanoTime()` 取得當前時間。
2.  **計算狀態：** 根據時間決定你的物件應該在哪裡。
3.  **繪製：** 渲染該幀。
4.  **請求下一幀：** 告訴視窗立即再次刷新。

### 範例：移動一個圓圈

```java
// 儲存狀態的變數
long startTime = System.nanoTime();

public void onPaint(Canvas canvas) {
    // 1. 根據時間計算進度（0.0 到 1.0）
    long now = System.nanoTime();
    float time = (now - startTime) / 1e9f; // 時間（秒）
    
    // 每秒移動 100 像素
    float x = 50 + (time * 100) % 500; 
    float y = 100 + (float) Math.sin(time * 5) * 50; // 上下浮動

    // 2. 繪製
    Paint paint = new Paint().setColor(0xFFFF0000); // 紅色
    canvas.drawCircle(x, y, 20, paint);

    // 3. 請求下一幀（方法取決於你的視窗庫）
    window.requestFrame(); 
}
```

## 2. Lottie 動畫 (Skottie)

對於複雜的向量動畫（如 UI 載入器、圖示），Skija 使用 **Skottie** 模組。這比手動繪製所有內容要高效得多。

有關如何載入和控制 Lottie 檔案的詳細資訊，請參閱 [**動畫 API 參考**](api/Animation.md)。

## 3. 動態圖片 (GIF / WebP)

要播放標準的動態圖片格式如 GIF 或 WebP，你可以使用 `Codec` 類別來提取幀。

有關解碼和播放多幀圖片的詳細資訊，請參閱 [**編解碼器 API 參考**](api/Codec.md)。

---

## 效能提示

- **不要在迴圈中建立物件：** 重複使用 `Paint`、`Rect` 和 `Path` 物件。每秒 60 次建立新的 Java 物件會觸發垃圾回收器並導致卡頓。
- **謹慎使用 `saveLayer`：** 它的開銷很大。
- **垂直同步：** 確保你的視窗庫啟用了垂直同步，以防止畫面撕裂。