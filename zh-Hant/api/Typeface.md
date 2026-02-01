# API 參考：字型

`Typeface` 類別代表特定的字型設計（例如「Helvetica Bold」）。它是字型檔案資料的處理程序，用於建立 `Font` 實例。

## 建立方式

### 從檔案載入
從檔案路徑載入字型。

```java
// 載入檔案中的第一個字型（索引 0）
Typeface face = Typeface.makeFromFile("fonts/Inter-Regular.ttf");

// 從集合檔案（TTC）載入特定字型索引
Typeface faceIndex = Typeface.makeFromFile("fonts/Collection.ttc", 1);
```

### 從資料載入
從 `Data` 物件（記憶體）載入字型。

```java
Data data = Data.makeFromFileName("fonts/font.ttf");
Typeface face = Typeface.makeFromData(data);
```

### 從名稱載入（系統字型）
嘗試依名稱尋找系統字型。

```java
// "Arial"、"Times New Roman" 等
Typeface system = Typeface.makeFromName("Arial", FontStyle.NORMAL);
```

## 屬性

- `getFamilyName()`：傳回字型家族名稱（例如「Inter」）。
- `getFontStyle()`：傳回 `FontStyle`（字重、寬度、傾斜度）。
- `isBold()`：若字重 >= 600 則為 true。
- `isItalic()`：若傾斜度非直立則為 true。
- `isFixedPitch()`：若字元具有相同寬度（等寬字型）則為 true。
- `getUnitsPerEm()`：傳回每個 em 單位的字型單位數。
- `getBounds()`：傳回字型中所有字形邊界框。

## 字形存取

- `getStringGlyphs(string)`：將 Java 字串轉換為字形 ID 陣列（`short[]`）。
- `getUTF32Glyph(codePoint)`：傳回單一 Unicode 碼點的字形 ID。
- `getGlyphsCount()`：傳回字型中的字形總數。

## 表格

進階存取原始 TrueType/OpenType 表格。

- `getTableTags()`：傳回字型中所有表格標籤的清單（例如「head」、「cmap」、「glyf」）。
- `getTableData(tag)`：以 `Data` 物件形式傳回特定表格的原始資料。
- `getTableSize(tag)`：傳回特定表格的大小。

## 複製（可變字型）

對於可變字型，您可以建立具有特定軸值的字型複本。

```java
// 建立變體實例（例如字重 = 500）
FontVariation weight = new FontVariation("wght", 500);

// 使用此變體複製字型
Typeface medium = variableFace.makeClone(weight);
```