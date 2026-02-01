# API 參考：字型與管理

`Font` 類別控制文字渲染方式，而 `FontMgr` 處理字型探索，`FontFeature` 則啟用進階 OpenType 功能。

## Font

`Font` 接收一個 [`Typeface`](Typeface.md) 並加入大小、縮放、傾斜和渲染屬性。

### 建立

```java
// 預設字型（通常為 12pt 無襯線字型）
Font font = new Font();

// 自訂字型和大小
Font font = new Font(typeface, 24f);

// 壓縮/擴展或傾斜文字
Font font = new Font(typeface, 24f, 0.8f, -0.25f);
```

- `new Font()`: 使用預設值初始化。
- `new Font(typeface)`: 使用特定字型和預設大小初始化。
- `new Font(typeface, size)`: 使用特定字型和大小初始化。
- `new Font(typeface, size, scaleX, skewX)`: 完整建構函式。

### 度量與間距

- `getSize()` / `setSize(value)`: 排版大小（單位：點）。
- `getScaleX()` / `setScaleX(value)`: 水平縮放（1.0 為正常）。
- `getSkewX()` / `setSkewX(value)`: 水平傾斜（0 為正常）。
- `getMetrics()`: 傳回詳細的 [`FontMetrics`](#fontmetrics)。
- `getSpacing()`: 建議的行間距（上升、下降和行距的總和）。

### 渲染標誌

這些影響字形如何點陣化。

- `setSubpixel(boolean)`: 要求子像素定位以獲得平滑文字。
- `setEdging(FontEdging)`: 控制反鋸齒（`ALIAS`、`ANTI_ALIAS`、`SUBPIXEL_ANTI_ALIAS`）。
- `setHinting(FontHinting)`: 控制字形輪廓調整（`NONE`、`SLIGHT`、`NORMAL`、`FULL`）。
- `setEmboldened(boolean)`: 透過增加筆畫寬度模擬粗體。
- `setBaselineSnapped(boolean)`: 將基線對齊到像素位置。
- `setMetricsLinear(boolean)`: 要求線性可縮放的度量（忽略提示和捨入）。
- `setBitmapsEmbedded(boolean)`: 要求使用字型中的點陣圖而非輪廓。

### 測量文字

```java
// 簡單寬度測量
float width = font.measureTextWidth("Hello");

// 取得精確邊界框
Rect bounds = font.measureText("Hello");

// 使用特定繪製效果測量寬度
float width = font.measureTextWidth("Hello", paint);
```

- `measureText(string)` / `measureText(string, paint)`: 傳回邊界框。
- `measureTextWidth(string)` / `measureTextWidth(string, paint)`: 傳回前進寬度。
- `getWidths(glyphs)`: 取得每個字形 ID 的前進寬度。
- `getBounds(glyphs)` / `getBounds(glyphs, paint)`: 取得每個字形 ID 的邊界框。

### 字形存取

- `getStringGlyphs(string)`: 將文字轉換為字形 ID 陣列。
- `getUTF32Glyph(unichar)`: 傳回單一字元的字形 ID。
- `getUTF32Glyphs(uni)`: 傳回字元陣列的字形 ID。
- `getStringGlyphsCount(string)`: 傳回文字代表的字形數量。
- `getPath(glyph)`: 傳回單一字形的輪廓 [`Path`](Path.md)。
- `getPaths(glyphs)`: 傳回字形陣列的輪廓。

---

## FontMgr

`FontMgr`（字型管理器）管理字型檔案的探索和載入。

### 存取管理器

- `FontMgr.getDefault()`: 傳回全域預設字型管理器。

### 尋找字型

```java
FontMgr mgr = FontMgr.getDefault();

// 依名稱和樣式匹配
Typeface inter = mgr.matchFamilyStyle("Inter", FontStyle.BOLD);

// 為特定字元匹配系統後備字型（例如表情符號）
Typeface emoji = mgr.matchFamilyStyleCharacter(null, FontStyle.NORMAL, null, "🧛".codePointAt(0));
```

- `matchFamilyStyle(familyName, style)`: 尋找最接近匹配的字型。
- `matchFamiliesStyle(families[], style)`: 依序嘗試多個字型家族名稱。
- `matchFamilyStyleCharacter(familyName, style, bcp47[], character)`: 尋找支援特定 Unicode 字元的字型。
- `getFamiliesCount()`: 傳回系統上可用的字型家族數量。
- `getFamilyName(index)`: 傳回字型家族的名稱。

### 載入字型

- `makeFromFile(path)` / `makeFromFile(path, ttcIndex)`: 從檔案載入字型。
- `makeFromData(data)` / `makeFromData(data, ttcIndex)`: 從記憶體載入字型。

---

## FontFeature

`FontFeature` 啟用 OpenType 功能，如連字、字距調整或替代字形。

```java
// 啟用特定功能
FontFeature[] features = FontFeature.parse("cv06 cv07 +liga");

// 手動建立
FontFeature kernOff = new FontFeature("kern", 0);
```

- `FontFeature.parse(string)`: 從字串解析功能（例如 `"+liga -kern"`）。
- `new FontFeature(tag)`: 啟用功能（值 = 1）。
- `new FontFeature(tag, value)`: 將功能設定為特定值。
- `new FontFeature(tag, value, start, end)`: 將功能套用至特定文字範圍。

---

## FontMetrics

詳細的度量，已按字型大小縮放。

- `getTop()` / `getBottom()`: 基線上方/下方的範圍（最大值）。
- `getAscent()` / `getDescent()`: 平均範圍（上升為負值）。
- `getLeading()`: 建議的行間距。
- `getCapHeight()`: 大寫字母的高度。
- `getXHeight()`: 小寫字母的高度。
- `getThickness()` / `getUnderlinePosition()`: 用於繪製底線。