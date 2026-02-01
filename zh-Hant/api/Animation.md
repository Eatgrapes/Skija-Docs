# API 參考：動畫 (Skottie)

`Animation` 類別（位於 `io.github.humbleui.skija.skottie`）提供載入和渲染 Lottie 動畫的支援。

## 概述

Skottie 是 Skia 的高效能 Lottie 播放器。`Animation` 類別允許你從檔案、字串或資料載入 Lottie 動畫，並將特定影格渲染到 `Canvas`。

## 建立

- `makeFromString(data)`：從 JSON 字串建立 `Animation`。
- `makeFromFile(path)`：從檔案路徑建立 `Animation`。
- `makeFromData(data)`：從 `Data` 物件建立 `Animation`。

## 渲染

- `render(canvas)`：以動畫的自然尺寸在 `(0, 0)` 位置將目前影格繪製到畫布。
- `render(canvas, offset)`：在指定的 `(x, y)` 偏移位置繪製目前影格。
- `render(canvas, left, top)`：在指定的座標位置繪製目前影格。
- `render(canvas, dst, renderFlags)`：將目前影格縮放至目標 `Rect` 並繪製。

## 控制播放

要渲染特定影格，必須先定位到該影格。

- `seek(t)`：定位到正規化時間 `t`（範圍 `[0..1]`）。
- `seek(t, ic)`：使用 `InvalidationController` 定位到正規化時間 `t`。
- `seekFrame(t)`：定位到特定影格索引 `t`（相對於 `duration * fps`）。
- `seekFrameTime(t)`：定位到特定時間 `t`（以秒為單位）。

## 屬性

- `getDuration()`：回傳動畫的總持續時間（以秒為單位）。
- `getFPS()`：回傳影格率（每秒影格數）。
- `getInPoint()`：以影格索引單位回傳入點（起始影格）。
- `getOutPoint()`：以影格索引單位回傳出點（結束影格）。
- `getVersion()`：回傳 Lottie 版本字串。
- `getSize()`：以 `Point` 形式回傳動畫的自然尺寸。
- `getWidth()`：回傳動畫的寬度。
- `getHeight()`：回傳動畫的高度。

## 範例

```java
// 從資源或檔案系統載入動畫
try (var anim = Animation.makeFromFile("loading.json")) {
    
    // 取得動畫資訊
    float duration = anim.getDuration(); // 以秒為單位
    float width = anim.getWidth();
    float height = anim.getHeight();

    // 準備渲染
    anim.seek(0.5f); // 定位到動畫的中間點（50%）

    // 渲染到畫布
    // 假設你有一個 Canvas 實例 'canvas'
    canvas.save();
    canvas.translate(100, 100); // 定位動畫位置
    anim.render(canvas);
    canvas.restore();
}
```