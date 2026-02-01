# API 參考：特效（濾鏡）

Skija 提供三種可透過 `Paint` 套用的濾鏡：**MaskFilter**、**ColorFilter** 和 **ImageFilter**。了解它們之間的差異是實現所需視覺效果的關鍵。

## 1. MaskFilter
**修改 Alpha 通道。** 在圖形著色前影響其遮罩（幾何形狀）。它只處理 Alpha 值。

### 高斯模糊
最常見的用途是創建柔和的邊緣或簡單的發光效果。

```java
// Sigma 大約是模糊半徑的 1/3
MaskFilter blur = MaskFilter.makeBlur(FilterBlurMode.NORMAL, 5.0f);
paint.setMaskFilter(blur);
```

**模式：**
- `NORMAL`：內部和外部都模糊。
- `SOLID`：保持原始形狀不透明，僅模糊外部。
- `OUTER`：僅模糊形狀外部的部分。
- `INNER`：僅模糊形狀內部的部分。

---

## 2. ColorFilter
**修改色彩空間。** 獨立轉換每個像素的顏色。

### 色彩矩陣
適用於灰階、復古色調或色彩偏移。

```java
ColorFilter grayscale = ColorFilter.makeMatrix(ColorMatrix.grayscale());
paint.setColorFilter(grayscale);
```

### 混合模式色彩濾鏡
用特定顏色為所有內容上色。

```java
ColorFilter tint = ColorFilter.makeBlend(0xFF4285F4, BlendMode.SRC_ATOP);
```

---

## 3. ImageFilter（像素特效）

`ImageFilter` 對繪製內容（或其背景）的像素進行操作。常用於模糊、陰影和光照效果。

### 基本濾鏡
- `makeBlur(sigmaX, sigmaY, tileMode)`：高斯模糊。
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`：繪製內容 + 陰影。
- `makeDropShadowOnly(...)`：僅繪製陰影（無內容）。
- `makeDilate(rx, ry)`：擴展亮區（形態學操作）。
- `makeErode(rx, ry)`：擴展暗區（形態學操作）。
- `makeOffset(dx, dy)`：偏移內容。
- `makeTile(src, dst)`：平鋪內容。

### 組合
- `makeCompose(outer, inner)`：先套用 `inner` 濾鏡，再套用 `outer`。
- `makeMerge(filters)`：合併多個濾鏡的結果（例如繪製多個陰影）。
- `makeBlend(mode, bg, fg)`：使用 `BlendMode` 混合兩個濾鏡。
- `makeArithmetic(k1, k2, k3, k4, bg, fg)`：自定義像素組合：`k1*fg*bg + k2*fg + k3*bg + k4`。

### 色彩與著色器
- `makeColorFilter(cf, input)`：將 `ColorFilter` 套用至影像濾鏡結果。
- `makeShader(shader)`：用 `Shader`（例如漸變或噪點）填充濾鏡區域。
- `makeRuntimeShader(builder, ...)`：使用自定義 SkSL 著色器作為影像濾鏡。

### 光照（Material Design）
模擬光線從由 Alpha 通道定義的表面反射（alpha = 高度）。
- `makeDistantLitDiffuse(...)`
- `makePointLitDiffuse(...)`
- `makeSpotLitDiffuse(...)`
- `makeDistantLitSpecular(...)`
- `makePointLitSpecular(...)`
- `makeSpotLitSpecular(...)`

### 範例：毛玻璃（背景模糊）
要模糊圖層*後方*的內容，請搭配背景濾鏡使用 `Canvas.saveLayer`。

```java
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
// 'paint' 參數為 null（圖層本身無 Alpha/混合）
// 'backdrop' 參數是模糊濾鏡
canvas.saveLayer(new SaveLayerRec(null, null, blur));
    canvas.drawRect(rect, new Paint().setColor(0x40FFFFFF)); // 半透明白色
canvas.restore();
```

## 對比總結

| 濾鏡類型 | 影響範圍 | 常見用途 |
| :--- | :--- | :--- |
| **MaskFilter** | 僅 Alpha 通道 | 簡單模糊、發光 |
| **ColorFilter** | 像素顏色 | 灰階、色調、對比度 |
| **ImageFilter** | 整個像素 | 投影、複雜模糊、組合 |

## 4. Blender（進階混合）

雖然 `BlendMode` 提供標準的 Porter-Duff 混合（如 `SRC_OVER`、`MULTIPLY`），但 `Blender` 類別允許可編程的自定義混合。

你可以使用 `paint.setBlender(blender)` 將混合器分配給畫筆。

### 算術混合器
這允許你定義來源和目標像素的線性組合：
`result = k1 * src * dst + k2 * src + k3 * dst + k4`

```java
// 範例：線性減淡（相加）可以近似實現
Blender b = Blender.makeArithmetic(0, 1, 1, 0, false);
paint.setBlender(b);
```

### 執行時混合器（SkSL）
你可以用 SkSL 編寫自己的混合函數！著色器接收 `src` 和 `dst` 顏色並必須返回結果。

```java
String sksl = "vec4 main(vec4 src, vec4 dst) {" +
              "  return src * dst;" + // 簡單相乘
              "}";
RuntimeEffect effect = RuntimeEffect.makeForBlender(sksl);
Blender myBlender = effect.makeBlender(null);
paint.setBlender(myBlender);
```

## 5. PathEffect（筆劃修飾器）

`PathEffect` 在路徑被繪製（描邊或填充）*之前*修改其幾何形狀。常用於虛線、圓角或有機粗糙感。

### 創建方法

**1. 離散（粗糙感）**
將路徑分割成片段並隨機位移。
- `makeDiscrete(segLength, dev, seed)`：
    - `segLength`：片段長度。
    - `dev`：最大偏移量（抖動）。
    - `seed`：隨機種子。

```java
PathEffect rough = PathEffect.makeDiscrete(10f, 4f, 0);
paint.setPathEffect(rough);
```

**2. 圓角（圓滑化）**
圓滑化尖角。
- `makeCorner(radius)`：圓角半徑。

```java
PathEffect round = PathEffect.makeCorner(20f);
```

**3. 虛線（虛線）**
創建虛線或點線。
- `makeDash(intervals, phase)`：
    - `intervals`：開/關長度陣列（必須為偶數長度）。
    - `phase`：進入間隔的偏移量。

```java
// 10px 開，5px 關
PathEffect dash = PathEffect.makeDash(new float[] { 10f, 5f }, 0f);
```

**4. Path1D（圖章路徑）**
沿路徑蓋印形狀（類似畫筆）。
- `makePath1D(path, advance, phase, style)`

```java
Path shape = new Path().addCircle(0, 0, 3);
PathEffect dots = PathEffect.makePath1D(shape, 10f, 0f, PathEffect1DStyle.TRANSLATE);
```

**5. Path2D（矩陣）**
透過矩陣變換路徑幾何。
- `makePath2D(matrix, path)`

**6. Line2D**
- `makeLine2D(width, matrix)`

### 組合

你可以組合多個路徑效果。

- `makeSum(second)`：繪製*兩種*效果（例如，填充 + 描邊）。
- `makeCompose(inner)`：先套用 `inner`，再套用 `this`（例如，粗糙輪廓 -> 虛線）。

```java
PathEffect dashed = PathEffect.makeDash(new float[] {10, 5}, 0);
PathEffect corner = PathEffect.makeCorner(10);

// 先圓角化，再將線條虛線化
PathEffect composed = dashed.makeCompose(corner);
```