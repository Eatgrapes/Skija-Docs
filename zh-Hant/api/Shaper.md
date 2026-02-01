# API 參考：Shaper（文字成形）

`Shaper` 類別負責**文字成形**：將一串 Unicode 字元轉換為字型中一組定位字形（glyph）的過程。

## 概述

文字成形對於以下情況是必要的：
- **合字**：將 "f" + "i" 轉換為單一的 "fi" 字形。
- **字距調整**：調整特定字元對（如 "AV"）之間的間距。
- **複雜文字**：處理阿拉伯文、天城文或泰文等字形會根據相鄰字元而變化的文字。
- **雙向文字**：處理混合的左至右（拉丁文）和右至左（阿拉伯文/希伯來文）文字。

## 基本成形

若要簡單取得可繪製的 `TextBlob`（一組定位字形），請使用 `shape()` 方法。

```java
try (Shaper shaper = Shaper.make()) {
    Font font = new Font(typeface, 24);
    
    // 簡單成形（無寬度限制）
    TextBlob blob = shaper.shape("Hello, Skija!", font);
    
    canvas.drawTextBlob(blob, 20, 50, paint);
}
```

## 換行與多行成形

`Shaper` 也可以根據最大寬度計算換行。

```java
float maxWidth = 300f;
TextBlob multiLineBlob = shaper.shape(
    "This is a long sentence that will be wrapped by the shaper.",
    font,
    maxWidth
);

// 注意：產生的 TextBlob 包含所有行，且各行相對於彼此正確定位。
canvas.drawTextBlob(multiLineBlob, 20, 100, paint);
```

## 成形選項

您可以使用 `ShapingOptions` 控制成形行為（例如文字方向）。

```java
ShapingOptions options = ShapingOptions.DEFAULT.withLeftToRight(false); // 右至左
TextBlob blob = shaper.shape("مرحبا", font, options, Float.POSITIVE_INFINITY, Point.ZERO);
```

## 進階成形（RunHandler）

如果您需要完全控制成形過程（例如實作自訂文字選取或自訂多樣式排版），可以使用 `RunHandler`。

```java
shaper.shape(text, font, ShapingOptions.DEFAULT, maxWidth, new RunHandler() {
    @Override
    public void beginLine() { ... }

    @Override
    public void runInfo(RunInfo info) {
        // 取得目前字形串列的資訊
        System.out.println("Glyph count: " + info.getGlyphCount());
    }

    @Override
    public void commitRunInfo() { ... }

    @Override
    public Point commitLine() { return Point.ZERO; }

    // ... 更多方法 ...
});
```

## 效能

- **快取**：文字成形是計算密集的操作（涉及 HarfBuzz）。如果您的文字是靜態的，請成形一次並儲存產生的 `TextBlob`。
- **Shaper 實例**：建立 `Shaper` 會初始化 HarfBuzz。建議建立一個 `Shaper` 實例並在整個應用程式中重複使用（通常可以安全重複使用，但若使用多執行緒請檢查執行緒安全性）。

## Shaper 與 Paragraph 的比較

- **使用 `Shaper`**：適用於高效能、單一樣式的文字區塊，或需要低階存取字形的情況。
- **使用 [Paragraph](Paragraph.md)**：適用於富文字（同一區塊中有不同顏色/字型）、複雜的 UI 排版，以及標準文字編輯器行為。