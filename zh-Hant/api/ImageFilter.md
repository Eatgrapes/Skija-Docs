# API 參考：ImageFilter

`ImageFilter` 物件用於在繪製過程中套用影像層級的效果，例如模糊、陰影或色彩轉換。它們透過 `setImageFilter()` 套用至 [`Paint`](Paint.md)。

## 靜態工廠方法

### 常用效果

- `makeBlur(sigmaX, sigmaY, tileMode)`：建立高斯模糊。
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`：建立投影。
- `makeDropShadowOnly(dx, dy, sigmaX, sigmaY, color)`：僅渲染陰影。
- `makeColorFilter(colorFilter, input)`：將 [`ColorFilter`](Effects.md#color-filters) 套用至影像。

### 組合與合成

- `makeCompose(outer, inner)`：將兩個濾鏡串聯在一起。
- `makeMerge(filters[])`：使用 SrcOver 混合模式合併多個濾鏡。
- `makeArithmetic(k1, k2, k3, k4, enforcePM, bg, fg)`：使用算術公式組合兩個輸入。
- `makeBlend(blendMode, bg, fg)`：使用 [`BlendMode`](#) 混合兩個輸入。

### 幾何與取樣

- `makeOffset(dx, dy, input)`：將輸入平移一個偏移量。
- `makeMatrixTransform(matrix, sampling, input)`：套用矩陣變換。
- `makeCrop(rect, tileMode, input)`：裁剪輸入濾鏡。
- `makeTile(src, dst, input)`：將來源區域平鋪至目標區域。

### 進階功能

- `makeRuntimeShader(builder, childName, input)`：將自訂的 [SkSL](runtime-effect.md) 著色器作為濾鏡套用。
- `makeDisplacementMap(xChan, yChan, scale, displacement, color)`：根據另一張影像置換像素。
- `makeMatrixConvolution(...)`：套用 NxM 卷積核。
- `makeLighting(...)`：各種光照濾鏡（遠距光、點光源、聚光燈）。

## 使用方式

```java
Paint paint = new Paint()
    .setImageFilter(ImageFilter.makeBlur(5f, 5f, FilterTileMode.CLAMP));

canvas.drawRect(Rect.makeWH(100, 100), paint);
```