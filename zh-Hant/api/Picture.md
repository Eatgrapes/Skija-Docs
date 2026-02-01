# API 參考：Picture 與 PictureRecorder

當你需要多次繪製相同的複雜場景——或者當你有一個不會變化的靜態背景時——你應該使用 `Picture`。它會將你的繪圖指令記錄成一種高度優化的格式，Skia 可以「重播」這個格式，這比每幀執行個別的 Java 呼叫要快得多。

## 工作流程

錄製一個 Picture 需要使用 `PictureRecorder` 來取得一個臨時的 `Canvas`。

```java
PictureRecorder recorder = new PictureRecorder();

// 1. 定義「剔除矩形」（你打算繪製的區域）
Canvas recordingCanvas = recorder.beginRecording(Rect.makeWH(500, 500));

// 2. 像平常一樣執行你的繪圖指令
Paint p = new Paint().setColor(0xFF4285F4);
recordingCanvas.drawCircle(250, 250, 100, p);
// ... 更多繪圖指令 ...

// 3. 停止錄製並取得 Picture 物件
Picture picture = recorder.finishRecordingAsPicture();
```

## PictureRecorder API

`PictureRecorder` 是用來捕捉指令的有狀態物件。

- `beginRecording(bounds)`：開始錄製。返回一個你可以繪製的 `Canvas`。所有傳送到這個畫布的繪圖指令都會被儲存。
- `getRecordingCanvas()`：返回目前正在錄製的畫布，如果不在錄製狀態則返回 `null`。
- `finishRecordingAsPicture()`：結束錄製並返回不可變的 `Picture` 物件。會使錄製畫布失效。
- `finishRecordingAsPicture(cullRect)`：結束錄製，但覆寫儲存在 Picture 中的剔除矩形。

## 建立 Picture（序列化）

- `makePlaceholder(cullRect)`：建立一個佔位符 Picture，它不繪製任何內容，但具有指定的邊界。
- `makeFromData(data)`：從 `Data` 物件（透過 `serializeToData` 建立）反序列化一個 Picture。

## 繪製 Picture

一旦你有了 `Picture` 物件，你就可以在任何其他 `Canvas` 上繪製它。

```java
canvas.drawPicture(picture);
```

## 為什麼要使用 Picture？

1.  **效能：** 如果你有 1,000 個繪圖呼叫，Java 每幀需要呼叫原生程式碼 1,000 次。如果你將它們錄製到一個 `Picture` 中，每幀就只需要 **一次** 原生呼叫。
2.  **執行緒安全：** 雖然 `Canvas` 與執行緒綁定，但 `Picture` 是不可變的，可以從任何執行緒繪製（儘管通常你會在主要的渲染執行緒上繪製它）。
3.  **細分快取：** Skia 可以快取 `Picture` 內部的複雜幾何圖形（例如路徑），這比對個別呼叫進行快取更有效率。

## 最佳實踐與陷阱

- **不要錄製所有東西：** 如果你的內容每幀都在變化（例如移動的角色），每次錄製一個新的 `Picture` 實際上可能*更慢*，因為錄製器本身有開銷。
- **Canvas 生命週期：** 從 `beginRecording()` 取得的 `Canvas` 只在呼叫 `finishRecordingAsPicture()` 之前有效。不要試圖保留它的參考！
- **記憶體：** Picture 會佔用原生記憶體。如果你建立了許多小的 Picture，請記得在不再需要時呼叫 `close()` 來釋放它們。