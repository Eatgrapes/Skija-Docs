# API 參考：段落（富文本佈局）

對於任何需要多行或多種樣式的文字（例如，一個**粗體**單詞後接一個*斜體*單詞），Skija 提供了**段落** API。它處理複雜的佈局任務，如換行、RTL 支援和多腳本文字。

## 段落的三大支柱

創建段落涉及三個主要步驟：
1.  **`FontCollection`**：定義段落從何處獲取字體。
2.  **`ParagraphStyle`**：定義全域設定（對齊方式、最大行數、省略號）。
3.  **`ParagraphBuilder`**：組裝文字和樣式的工具。

## 1. 設定 FontCollection

`FontCollection` 是段落的字體管理器。您必須告訴它使用哪個 `FontMgr`。

```java
FontCollection fc = new FontCollection();
fc.setDefaultFontManager(FontMgr.getDefault());
```

## 2. 全域樣式 (ParagraphStyle)

這定義了整個文字塊的行為。

```java
ParagraphStyle style = new ParagraphStyle();
style.setAlignment(Alignment.CENTER);
style.setMaxLinesCount(3);
style.setEllipsis("..."); // 如果文字過長則顯示
```

## 3. 組裝富文本 (ParagraphBuilder)

`ParagraphBuilder` 使用基於堆疊的樣式方法。您「推入」一個樣式，添加文字，然後「彈出」它以返回先前的樣式。

```java
ParagraphBuilder builder = new ParagraphBuilder(style, fc);

// 添加一些預設文字
builder.pushStyle(new TextStyle().setColor(0xFF000000).setFontSize(16f));
builder.addText("Skija 是 ");

// 添加一些粗體文字
builder.pushStyle(new TextStyle().setColor(0xFF4285F4).setFontWeight(FontWeight.BOLD));
builder.addText("強大的");
builder.popStyle(); // 返回預設的 16pt 黑色文字

builder.addText(" 且易於使用。");
```

## 4. 佈局與渲染

`Paragraph` 在繪製前需要進行「佈局」（測量和換行）。這需要一個特定的寬度。

```java
Paragraph p = builder.build();

// 將文字佈局為適合 300 像素寬度
p.layout(300);

// 在 (x, y) 位置繪製
p.paint(canvas, 20, 20);
```

## 基本方法

- `p.getHeight()`：獲取已佈局文字的總高度。
- `p.getLongestLine()`：獲取最長行的寬度。
- `p.getLineNumber()`：文字換行後的行數。
- `p.getRectsForRange(...)`：獲取選取範圍的邊界框（對於文字高亮顯示很有用）。

## 效能與最佳實踐

1.  **重複使用 FontCollection**：通常整個應用程式只需要一個 `FontCollection`。
2.  **佈局是主要工作**：`p.layout()` 是最耗費資源的部分，因為它涉及測量每個字形並計算換行點。如果您的文字沒有改變且寬度相同，請勿再次呼叫它。
3.  **文字度量**：如果您需要每行位置和高度的詳細資訊以進行進階 UI 佈局，請使用 `p.getLineMetrics()`。
4.  **佔位符**：您可以使用 `builder.addPlaceholder()` 在文字流中為內嵌圖片或 UI 小部件預留空間。