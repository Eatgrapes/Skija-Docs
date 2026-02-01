# API 参考：Typeface

`Typeface` 类代表特定的字体设计（例如 "Helvetica Bold"）。它是字体文件数据的句柄，用于创建 `Font` 实例。

## 创建

### 从文件加载
从文件路径加载字体。

```java
// 加载文件中的第一个字体（索引 0）
Typeface face = Typeface.makeFromFile("fonts/Inter-Regular.ttf");

// 从集合文件（TTC）加载特定字体索引
Typeface faceIndex = Typeface.makeFromFile("fonts/Collection.ttc", 1);
```

### 从数据加载
从 `Data` 对象（内存）加载字体。

```java
Data data = Data.makeFromFileName("fonts/font.ttf");
Typeface face = Typeface.makeFromData(data);
```

### 从名称加载（系统字体）
尝试通过名称查找系统字体。

```java
// "Arial"、"Times New Roman" 等
Typeface system = Typeface.makeFromName("Arial", FontStyle.NORMAL);
```

## 属性

- `getFamilyName()`：返回字体家族名称（例如 "Inter"）。
- `getFontStyle()`：返回 `FontStyle`（字重、字宽、倾斜度）。
- `isBold()`：如果字重 >= 600 则返回 true。
- `isItalic()`：如果倾斜度非直立则返回 true。
- `isFixedPitch()`：如果字符等宽（等宽字体）则返回 true。
- `getUnitsPerEm()`：返回每个 em 单位的字体单位数。
- `getBounds()`：返回字体中所有字形边界框。

## 字形访问

- `getStringGlyphs(string)`：将 Java 字符串转换为字形 ID 数组（`short[]`）。
- `getUTF32Glyph(codePoint)`：返回单个 Unicode 码点的字形 ID。
- `getGlyphsCount()`：返回字体中字形总数。

## 表数据

访问原始 TrueType/OpenType 表数据的高级功能。

- `getTableTags()`：返回字体中所有表标签列表（例如 "head"、"cmap"、"glyf"）。
- `getTableData(tag)`：以 `Data` 对象形式返回特定表的原始数据。
- `getTableSize(tag)`：返回特定表的大小。

## 克隆（可变字体）

对于可变字体，可以创建具有特定轴值的字体克隆。

```java
// 创建变体实例（例如字重 = 500）
FontVariation weight = new FontVariation("wght", 500);

// 使用此变体克隆字体
Typeface medium = variableFace.makeClone(weight);
```