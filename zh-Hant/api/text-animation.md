# 進階排版：裁切與動畫

Skija 不僅提供繪製靜態文字的強大工具，還能將文字作為幾何物件用於裁切、遮罩和動畫。

## 文字作為裁切遮罩

要將文字用作遮罩（例如，在字母*內部*顯示圖像），不能簡單地「裁切到文字」。必須先將文字轉換為 `Path`。

### 1. 從文字取得路徑
使用 `Font.getPath()` 取得特定字形（glyph）的幾何輪廓。

```java
Font font = new Font(typeface, 100);
short[] glyphs = font.getStringGlyphs("MASK");

// 取得這些字形的路徑
// 注意：getPaths 返回一個路徑陣列（每個字形一個）
// 通常需要將它們組合或依序繪製
Point[] positions = font.getPositions(glyphs, new Point(50, 150)); // 定位文字

Path textPath = new Path();
for (int i = 0; i < glyphs.length; i++) {
    Path glyphPath = font.getPath(glyphs[i]);
    if (glyphPath != null) {
        // 將字形路徑偏移到其位置並加入主路徑
        glyphPath.transform(Matrix33.makeTranslate(positions[i].getX(), positions[i].getY()));
        textPath.addPath(glyphPath);
    }
}
```

### 2. 裁切畫布
一旦有了 `Path`，就可以裁切畫布。

```java
canvas.save();
canvas.clipPath(textPath);

// 現在繪製圖像（或漸變、圖案）
// 它只會出現在字母 "MASK" 內部
canvas.drawImage(myImage, 0, 0);

canvas.restore();
```

## 文字動畫

Skija 透過 `TextBlob` 提供對字形定位的低階存取，實現高效能文字動畫。

### 1. 逐字形動畫（波浪文字）
不直接繪製字串，而是手動計算每個字元的位置。

```java
String text = "Wavy Text";
short[] glyphs = font.getStringGlyphs(text);
float[] widths = font.getWidths(glyphs);

// 計算每個字形的位置
Point[] positions = new Point[glyphs.length];
float x = 50;
float time = (System.currentTimeMillis() % 1000) / 1000f; // 0.0 到 1.0

for (int i = 0; i < glyphs.length; i++) {
    // 正弦波動畫
    float yOffset = (float) Math.sin((x / 50.0) + (time * Math.PI * 2)) * 10;
    
    positions[i] = new Point(x, 100 + yOffset);
    x += widths[i];
}

// 從這些明確位置建立 TextBlob
TextBlob blob = TextBlob.makeFromPos(glyphs, positions, font);

// 繪製
canvas.drawTextBlob(blob, 0, 0, paint);
```

### 2. 路徑上的文字（RSXform）
對於沿曲線排列（並旋轉以匹配曲線）的文字，使用 `RSXform`（旋轉縮放平移變換）。

```java
// 參閱 API 中的 'TextBlob.makeFromRSXform'
// 這允許你為每個字形獨立指定旋轉和位置。
```

## 可變字型

如果你有可變字型（例如 `Inter-Variable.ttf`），可以平滑地動畫其字重或傾斜度。

```java
// 1. 建立 FontVariation 實例
FontVariation weight = new FontVariation("wght", 400 + (float)Math.sin(time) * 300); // 字重 100 到 700

// 2. 從可變基礎建立特定 Typeface
Typeface currentFace = variableTypeface.makeClone(weight);

// 3. 建立 Font 並繪製
Font font = new Font(currentFace, 40);
canvas.drawString("Breathing Text", 50, 50, font, paint);
```

## 總結

- **裁切：** 文字 -> 字形 -> 路徑 -> `canvas.clipPath()`。
- **波浪/移動文字：** 手動計算 `Point[]` 位置並使用 `TextBlob.makeFromPos()`。
- **路徑上的文字：** 使用 `TextBlob.makeFromRSXform()`。
- **字重/樣式動畫：** 使用可變字型和 `makeClone(FontVariation)`。