# API 参考：字体与管理

`Font` 类控制文本的渲染方式，而 `FontMgr` 负责字体发现，`FontFeature` 则启用高级 OpenType 功能。

## Font

`Font` 接收一个 [`Typeface`](Typeface.md) 并添加大小、缩放、倾斜和渲染属性。

### 创建

```java
// 默认字体（通常为 12pt 无衬线字体）
Font font = new Font();

// 自定义字体和大小
Font font = new Font(typeface, 24f);

// 紧缩/扩展或倾斜文本
Font font = new Font(typeface, 24f, 0.8f, -0.25f);
```

- `new Font()`: 使用默认值初始化。
- `new Font(typeface)`: 使用特定字体和默认大小初始化。
- `new Font(typeface, size)`: 使用特定字体和大小初始化。
- `new Font(typeface, size, scaleX, skewX)`: 完整构造函数。

### 度量与间距

- `getSize()` / `setSize(value)`: 排版大小（以点为单位）。
- `getScaleX()` / `setScaleX(value)`: 水平缩放（1.0 为正常）。
- `getSkewX()` / `setSkewX(value)`: 水平倾斜（0 为正常）。
- `getMetrics()`: 返回详细的 [`FontMetrics`](#fontmetrics)。
- `getSpacing()`: 推荐的行间距（上升、下降和行间距的总和）。

### 渲染标志

这些标志影响字形如何被栅格化。

- `setSubpixel(boolean)`: 请求子像素定位以获得更平滑的文本。
- `setEdging(FontEdging)`: 控制抗锯齿（`ALIAS`、`ANTI_ALIAS`、`SUBPIXEL_ANTI_ALIAS`）。
- `setHinting(FontHinting)`: 控制字形轮廓调整（`NONE`、`SLIGHT`、`NORMAL`、`FULL`）。
- `setEmboldened(boolean)`: 通过增加笔画宽度来模拟粗体。
- `setBaselineSnapped(boolean)`: 将基线对齐到像素位置。
- `setMetricsLinear(boolean)`: 请求线性可缩放的度量（忽略提示和舍入）。
- `setBitmapsEmbedded(boolean)`: 请求使用字体中的位图而非轮廓。

### 测量文本

```java
// 简单宽度测量
float width = font.measureTextWidth("Hello");

// 获取精确边界框
Rect bounds = font.measureText("Hello");

// 使用特定绘制效果测量宽度
float width = font.measureTextWidth("Hello", paint);
```

- `measureText(string)` / `measureText(string, paint)`: 返回边界框。
- `measureTextWidth(string)` / `measureTextWidth(string, paint)`: 返回前进宽度。
- `getWidths(glyphs)`: 检索每个字形 ID 的前进宽度。
- `getBounds(glyphs)` / `getBounds(glyphs, paint)`: 检索每个字形 ID 的边界框。

### 字形访问

- `getStringGlyphs(string)`: 将文本转换为字形 ID 数组。
- `getUTF32Glyph(unichar)`: 返回单个字符的字形 ID。
- `getUTF32Glyphs(uni)`: 返回字符数组的字形 ID。
- `getStringGlyphsCount(string)`: 返回文本表示的字形数量。
- `getPath(glyph)`: 返回单个字形的轮廓 [`Path`](Path.md)。
- `getPaths(glyphs)`: 返回字形数组的轮廓。

---

## FontMgr

`FontMgr`（字体管理器）管理字体文件的发现和加载。

### 访问管理器

- `FontMgr.getDefault()`: 返回全局默认字体管理器。

### 查找字体

```java
FontMgr mgr = FontMgr.getDefault();

// 按名称和样式匹配
Typeface inter = mgr.matchFamilyStyle("Inter", FontStyle.BOLD);

// 为特定字符（如表情符号）匹配系统回退字体
Typeface emoji = mgr.matchFamilyStyleCharacter(null, FontStyle.NORMAL, null, "🧛".codePointAt(0));
```

- `matchFamilyStyle(familyName, style)`: 查找最接近匹配的字体。
- `matchFamiliesStyle(families[], style)`: 按顺序尝试多个字体族名称。
- `matchFamilyStyleCharacter(familyName, style, bcp47[], character)`: 查找支持特定 Unicode 字符的字体。
- `getFamiliesCount()`: 返回系统上可用的字体族数量。
- `getFamilyName(index)`: 返回字体族的名称。

### 加载字体

- `makeFromFile(path)` / `makeFromFile(path, ttcIndex)`: 从文件加载字体。
- `makeFromData(data)` / `makeFromData(data, ttcIndex)`: 从内存加载字体。

---

## FontFeature

`FontFeature` 启用 OpenType 功能，如连字、字距调整或替代字形。

```java
// 启用特定功能
FontFeature[] features = FontFeature.parse("cv06 cv07 +liga");

// 手动创建
FontFeature kernOff = new FontFeature("kern", 0);
```

- `FontFeature.parse(string)`: 从字符串解析功能（例如 `"+liga -kern"`）。
- `new FontFeature(tag)`: 启用功能（值 = 1）。
- `new FontFeature(tag, value)`: 将功能设置为特定值。
- `new FontFeature(tag, value, start, end)`: 将功能应用于特定文本范围。

---

## FontMetrics

按字体大小缩放的详细度量。

- `getTop()` / `getBottom()`: 基线之上/之下的范围（最大值）。
- `getAscent()` / `getDescent()`: 平均范围（上升为负值）。
- `getLeading()`: 推荐的行间距。
- `getCapHeight()`: 大写字母的高度。
- `getXHeight()`: 小写字母的高度。
- `getThickness()` / `getUnderlinePosition()`: 用于绘制下划线。