# API 参考：ImageFilter

`ImageFilter` 对象用于在绘制过程中应用图像级效果，例如模糊、阴影或颜色变换。它们通过 `setImageFilter()` 应用于 [`Paint`](Paint.md)。

## 静态工厂方法

### 常用效果

- `makeBlur(sigmaX, sigmaY, tileMode)`：创建高斯模糊。
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`：创建投影。
- `makeDropShadowOnly(dx, dy, sigmaX, sigmaY, color)`：仅渲染阴影。
- `makeColorFilter(colorFilter, input)`：将 [`ColorFilter`](Effects.md#color-filters) 应用于图像。

### 组合与复合

- `makeCompose(outer, inner)`：将两个滤镜链接在一起。
- `makeMerge(filters[])`：使用 SrcOver 混合模式合并多个滤镜。
- `makeArithmetic(k1, k2, k3, k4, enforcePM, bg, fg)`：使用算术公式组合两个输入。
- `makeBlend(blendMode, bg, fg)`：使用 [`BlendMode`](#) 混合两个输入。

### 几何与采样

- `makeOffset(dx, dy, input)`：按偏移量平移输入。
- `makeMatrixTransform(matrix, sampling, input)`：应用矩阵变换。
- `makeCrop(rect, tileMode, input)`：裁剪输入滤镜。
- `makeTile(src, dst, input)`：将源区域平铺到目标区域。

### 高级功能

- `makeRuntimeShader(builder, childName, input)`：应用自定义 [SkSL](runtime-effect.md) 着色器作为滤镜。
- `makeDisplacementMap(xChan, yChan, scale, displacement, color)`：基于另一幅图像置换像素。
- `makeMatrixConvolution(...)`：应用 NxM 卷积核。
- `makeLighting(...)`：各种光照滤镜（平行光、点光源、聚光灯）。

## 用法示例

```java
Paint paint = new Paint()
    .setImageFilter(ImageFilter.makeBlur(5f, 5f, FilterTileMode.CLAMP));

canvas.drawRect(Rect.makeWH(100, 100), paint);
```