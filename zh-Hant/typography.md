# 文字排版與文本處理

文字是任何圖形庫中最複雜的部分之一。Skija 提供了一個高階 API，可處理從簡單標籤到複雜多行文本佈局的所有內容。

## 字型（The "What"）

`Typeface` 代表特定的字型檔案（如 "Inter-Bold.ttf"）。它定義了字形（glyphs）的形狀。

### 載入字型
您可以從檔案、資源或系統字型管理器中載入它們。

```java
// 從檔案載入
Typeface inter = Typeface.makeFromFile("fonts/Inter.ttf");

// 從系統載入（安全的方式）
Typeface sans = FontMgr.getDefault().matchFamilyStyle("sans-serif", FontStyle.NORMAL);
```

**常見陷阱：** 不要假設使用者的系統上存在某種字型。請務必提供備用字型，或將您的字型作為資源打包。

## 字體（The "How"）

`Font` 接收一個 `Typeface`，並賦予它大小和其他渲染屬性。

```java
Font font = new Font(inter, 14f);
```

### 文本定位：字體度量

如果您想居中對齊文本或精確定位，您需要了解 `FontMetrics`。

```java
FontMetrics metrics = font.getMetrics();
// metrics.getAscent()  -> 從基線到頂部的距離（負值）
// metrics.getDescent() -> 從基線到底部的距離（正值）
// metrics.getLeading() -> 建議的行間距
```

**範例：完美的垂直居中**
要在 `y` 位置垂直居中文本，通常需要偏移「大寫高度」（大寫字母的高度）的一半。

```java
float centerY = rect.getMidY() - metrics.getCapHeight() / 2f;
canvas.drawString("HELLO", rect.getLeft(), centerY, font, paint);
```

## 進階文本：段落

對於比單詞或單行更複雜的任何內容，請使用 **Paragraph** API。它處理：
- 自動換行
- 一個區塊內的多種樣式（粗體、斜體、顏色）
- 從右到左（RTL）文本
- 表情符號支援

詳情請參閱 [**Paragraph API 參考**](api/Paragraph.md)。

## 互動式文本：TextLine

如果您需要單行文本，但需要確切知道每個字符的位置（例如，用於文字輸入框中的游標或選取），請使用 `TextLine`。

```java
TextLine line = TextLine.make("Interact with me", font);

// 獲取視覺屬性
float width = line.getWidth();
float height = line.getHeight();

// 點擊測試：獲取像素座標處的字符索引
int charIndex = line.getOffsetAtCoord(45.0f);

// 獲取字符索引的像素座標
float xCoord = line.getCoordAtOffset(5);

// 渲染
canvas.drawTextLine(line, 20, 50, paint);
```

### 視覺範例

**互動式文本行：**
請參閱 [`examples/scenes/src/TextLineScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextLineScene.java)，以查看游標定位、點擊測試和多腳本文本佈局的演示。

**文本 Blob 效果：**
請參閱 [`examples/scenes/src/TextBlobScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextBlobScene.java)，以查看路徑文本、波浪文本和自定義定位的範例。

## 最佳實踐

1.  **快取您的字體/字型：** 建立 `Typeface` 涉及解析檔案，可能很慢。請將它們保存在靜態快取或主題管理器中。
2.  **使用提示/抗鋸齒：** 對於螢幕上的小字體，請確保在您的 `Paint` 中啟用抗鋸齒，以保持可讀性。
3.  **繪製前先測量：** 使用 `font.measureTextWidth(string)` 在實際將文本繪製到畫布上之前計算佈局。