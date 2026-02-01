# API 參考：TextLine

`TextLine` 代表一行已進行字形排版的文字。它通常由 `Shaper` 創建，並提供度量資訊和命中測試功能，這些對於構建文字編輯器或互動式標籤至關重要。

## 創建

```java
// 對單行文字進行字形排版
TextLine line = TextLine.make("Hello World", font);
```

## 度量

- `getAscent()`: 從基線到最高字元頂部的距離（負值）。
- `getDescent()`: 從基線到最低字元底部的距離（正值）。
- `getCapHeight()`: 大寫字母的高度。
- `getXHeight()`: 小寫字母 'x' 的高度。
- `getWidth()`: 該行的總前進寬度。
- `getHeight()`: 總高度（descent - ascent）。

## 命中測試（互動）

`TextLine` 提供方法來在像素座標和字元偏移量之間進行映射。

```java
// 1. 從座標獲取偏移量（點擊）
float x = mouseEvent.getX();
int offset = line.getOffsetAtCoord(x); // 返回 UTF-16 字元索引
// 'offset' 將最接近滑鼠游標

// 2. 從偏移量獲取座標（游標放置）
float cursorX = line.getCoordAtOffset(offset);
// 在 (cursorX, baseline) 處繪製游標
```

- `getOffsetAtCoord(x)`: 最接近的字元偏移量。
- `getLeftOffsetAtCoord(x)`: 嚴格位於左側的字元偏移量。
- `getCoordAtOffset(offset)`: 給定字元索引的像素 X 座標。

## 渲染

```java
// 可以直接繪製該行
canvas.drawTextLine(line, x, y, paint);

// 或者提取 TextBlob 以進行更手動的控制
try (TextBlob blob = line.getTextBlob()) {
    canvas.drawTextBlob(blob, x, y, paint);
}
```

## 生命週期
`TextLine` 實現了 `Managed` 介面。使用完畢後請務必關閉它以釋放原生資源。

```java
try (TextLine line = TextLine.make(text, font)) {
    // ... 使用 line ...
}
```