# API 參考：TextBlob 與 Builder

`TextBlob` 是一組字形（glyphs）的不可變、最佳化表示。在 Skija 中，如果文字佈局（字形位置）不變，這是繪製文字最快的方式。

## TextBlob

`TextBlob` 將字形、位置和字體組合成一個可重複使用的單一物件。

### 屬性
- `getBounds()`：返回 blob 的保守邊界框。
- `getUniqueId()`：返回用於快取的唯一識別碼。
- `serializeToData()`：將 blob 序列化為 `Data` 物件。

### 從位置建立
如果您已經計算好字形位置（例如使用 `Shaper` 或手動計算），可以直接建立 blob。

```java
// 僅水平位置（y 為常數）
TextBlob blob = TextBlob.makeFromPosH(glyphs, xPositions, y, font);

// 每個字形的完整 (x, y) 位置
TextBlob blob2 = TextBlob.makeFromPos(glyphs, points, font);

// 每個字形的 RSXform（旋轉 + 縮放 + 平移）
TextBlob blob3 = TextBlob.makeFromRSXform(glyphs, xforms, font);
```

### 繪製
```java
canvas.drawTextBlob(blob, x, y, paint);
```

---

## TextBlobBuilder

`TextBlobBuilder` 允許您透過附加多個文字「區塊」（runs）來建構 `TextBlob`。一個「區塊」是指共享相同字體（Font）和繪製樣式（Paint）的一系列字形。

### 基本用法

```java
TextBlobBuilder builder = new TextBlobBuilder();

// 附加一個文字區塊
builder.appendRun(font, "Hello ", 0, 0);

// 附加另一個區塊（例如不同樣式或位置）
builder.appendRun(boldFont, "World!", 100, 0);

// 建構不可變的 TextBlob
TextBlob blob = builder.build();
```

### 進階附加方法
- `appendRun(font, glyphs, x, y, bounds)`：附加具有共享原點的字形。
- `appendRunPosH(...)`：附加具有明確 X 位置的字形。
- `appendRunPos(...)`：附加具有明確 (X, Y) 位置的字形。
- `appendRunRSXform(...)`：附加具有完整仿射變換（旋轉/縮放）的字形。

### 效能提示
如果您需要多次繪製相同的文字段落（即使畫布移動），請建立一次 `TextBlob` 並重複使用。這樣可以避免重新計算字形位置和形狀。