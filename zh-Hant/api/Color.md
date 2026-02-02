# API 參考：色彩與編碼

本頁涵蓋高精度色彩表示、像素格式、透明度解讀與色彩空間。

---

## Color4f

`Color4f` 使用四個浮點數值（RGBA）表示顏色，每個值通常介於 0.0 到 1.0 之間。這比傳統的 8 位元整數提供更高的精度。

### 建構函式

- `new Color4f(r, g, b, a)`
- `new Color4f(r, g, b)`：不透明顏色（alpha = 1.0）。
- `new Color4f(int color)`：將標準 ARGB 8888 整數轉換為浮點數分量。

### 方法

- `toColor()`：轉換回 ARGB 8888 整數。
- `makeLerp(other, weight)`：在兩個顏色之間進行線性插值。

### 範例

```java
Color4f red = new Color4f(1f, 0f, 0f, 1f);
Color4f halfTransparentBlue = new Color4f(0f, 0f, 1f, 0.5f);

// 在 Paint 中使用
Paint paint = new Paint().setColor4f(red, ColorSpace.getSRGB());
```

---

## ColorType

`ColorType` 描述像素中位元的排列方式（例如通道順序和位元深度）。

### 常見類型

- `RGBA_8888`：每個通道 8 位元，紅色優先。
- `BGRA_8888`：每個通道 8 位元，藍色優先（在 Windows 上常見）。
- `N32`：當前平台的本地 32 位元格式（通常對應 RGBA 或 BGRA）。
- `F16`：每個通道 16 位元半浮點數（高動態範圍）。
- `GRAY_8`：單一 8 位元通道，用於灰階。
- `ALPHA_8`：單一 8 位元通道，用於透明度遮罩。

---

## ColorAlphaType

`ColorAlphaType` 描述應如何解讀透明度通道。

- `OPAQUE`：所有像素完全不透明；忽略透明度通道。
- `PREMUL`：色彩分量已乘以透明度值（Skia 性能的標準做法）。
- `UNPREMUL`：色彩分量獨立於透明度值。

---

## ColorSpace

`ColorSpace` 定義色彩的範圍（色域）和線性特性。

### 常見色彩空間

- `ColorSpace.getSRGB()`：網頁和大多數顯示器的標準色彩空間。
- `ColorSpace.getSRGBLinear()`：具有線性傳遞函數的 sRGB（適用於數學計算/混合）。
- `ColorSpace.getDisplayP3()`：現代 Apple 裝置使用的廣色域色彩空間。

### 方法

- `isSRGB()`：如果空間是 sRGB 則返回 true。
- `isGammaLinear()`：如果傳遞函數是線性的則返回 true。
- `convert(to, color)`：將 `Color4f` 從此空間轉換到另一個空間。

### 使用範例

```java
// 建立具有特定編碼的 ImageInfo
ImageInfo info = new ImageInfo(
    800, 600, 
    ColorType.N32, 
    ColorAlphaType.PREMUL, 
    ColorSpace.getSRGB()
);
```