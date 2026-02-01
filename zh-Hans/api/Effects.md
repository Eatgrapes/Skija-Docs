# API 参考：特效（滤镜）

Skija 提供三种可通过 `Paint` 应用的滤镜类型：**MaskFilter**、**ColorFilter** 和 **ImageFilter**。理解它们之间的区别是实现预期视觉效果的关键。

## 1. MaskFilter
**Alpha 通道修改。** 在几何形状着色前影响其遮罩。它只处理 Alpha 值。

### 高斯模糊
最常见的用途是创建柔和的边缘或简单的发光效果。

```java
// Sigma 值大约是模糊半径的 1/3
MaskFilter blur = MaskFilter.makeBlur(FilterBlurMode.NORMAL, 5.0f);
paint.setMaskFilter(blur);
```

**模式：**
- `NORMAL`：内部和外部都模糊。
- `SOLID`：保持原始形状不透明，仅模糊外部。
- `OUTER`：仅模糊形状外部的部分。
- `INNER`：仅模糊形状内部的部分。

---

## 2. ColorFilter
**色彩空间修改。** 独立地变换每个像素的颜色。

### 颜色矩阵
适用于灰度、复古色调或颜色偏移。

```java
ColorFilter grayscale = ColorFilter.makeMatrix(ColorMatrix.grayscale());
paint.setColorFilter(grayscale);
```

### 混合模式颜色滤镜
用特定颜色为所有内容着色。

```java
ColorFilter tint = ColorFilter.makeBlend(0xFF4285F4, BlendMode.SRC_ATOP);
```

---

## 3. ImageFilter（像素特效）

`ImageFilter` 对绘图（或其背景）的像素进行操作。它们通常用于模糊、阴影和光照效果。

### 基础滤镜
- `makeBlur(sigmaX, sigmaY, tileMode)`：高斯模糊。
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`：绘制内容 + 阴影。
- `makeDropShadowOnly(...)`：仅绘制阴影（无内容）。
- `makeDilate(rx, ry)`：扩展明亮区域（形态学操作）。
- `makeErode(rx, ry)`：扩展暗部区域（形态学操作）。
- `makeOffset(dx, dy)`：偏移内容。
- `makeTile(src, dst)`：平铺内容。

### 组合
- `makeCompose(outer, inner)`：先应用 `inner` 滤镜，再应用 `outer`。
- `makeMerge(filters)`：合并多个滤镜的结果（例如，绘制多个阴影）。
- `makeBlend(mode, bg, fg)`：使用 `BlendMode` 混合两个滤镜。
- `makeArithmetic(k1, k2, k3, k4, bg, fg)`：自定义像素组合：`k1*fg*bg + k2*fg + k3*bg + k4`。

### 颜色与着色器
- `makeColorFilter(cf, input)`：将 `ColorFilter` 应用于图像滤镜的结果。
- `makeShader(shader)`：用 `Shader`（例如，渐变或噪点）填充滤镜区域。
- `makeRuntimeShader(builder, ...)`：使用自定义 SkSL 着色器作为图像滤镜。

### 光照（Material Design）
模拟光线从由 Alpha 通道定义的表面反射（alpha = 高度）。
- `makeDistantLitDiffuse(...)`
- `makePointLitDiffuse(...)`
- `makeSpotLitDiffuse(...)`
- `makeDistantLitSpecular(...)`
- `makePointLitSpecular(...)`
- `makeSpotLitSpecular(...)`

### 示例：毛玻璃（背景模糊）
要模糊图层*背后*的内容，请使用带有背景滤镜的 `Canvas.saveLayer`。

```java
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
// 'paint' 参数为 null（图层本身无 Alpha/混合）
// 'backdrop' 参数是模糊滤镜
canvas.saveLayer(new SaveLayerRec(null, null, blur));
    canvas.drawRect(rect, new Paint().setColor(0x40FFFFFF)); // 半透明白色
canvas.restore();
```

## 对比总结

| 滤镜类型 | 影响对象 | 常见用途 |
| :--- | :--- | :--- |
| **MaskFilter** | 仅 Alpha 通道 | 简单模糊、发光 |
| **ColorFilter** | 像素颜色 | 灰度、着色、对比度 |
| **ImageFilter** | 整个像素 | 投影、复杂模糊、组合 |

## 4. Blender（高级混合）

虽然 `BlendMode` 提供了标准的 Porter-Duff 混合（如 `SRC_OVER`、`MULTIPLY`），但 `Blender` 类允许可编程的自定义混合。

你可以通过 `paint.setBlender(blender)` 为画笔分配一个混合器。

### 算术混合器
这允许你定义源像素和目标像素的线性组合：
`结果 = k1 * src * dst + k2 * src + k3 * dst + k4`

```java
// 示例：可以近似实现线性减淡（相加）效果
Blender b = Blender.makeArithmetic(0, 1, 1, 0, false);
paint.setBlender(b);
```

### 运行时混合器（SkSL）
你可以用 SkSL 编写自己的混合函数！着色器接收 `src` 和 `dst` 颜色并必须返回结果。

```java
String sksl = "vec4 main(vec4 src, vec4 dst) {" +
              "  return src * dst;" + // 简单的相乘
              "}";
RuntimeEffect effect = RuntimeEffect.makeForBlender(sksl);
Blender myBlender = effect.makeBlender(null);
paint.setBlender(myBlender);
```

## 5. PathEffect（描边修饰器）

`PathEffect` 在路径被绘制（描边或填充）*之前*修改其几何形状。它通常用于虚线、圆角或有机粗糙感。

### 创建方法

**1. 离散（粗糙感）**
将路径分割成段并随机偏移它们。
- `makeDiscrete(segLength, dev, seed)`：
    - `segLength`：段的长度。
    - `dev`：最大偏移量（抖动）。
    - `seed`：随机种子。

```java
PathEffect rough = PathEffect.makeDiscrete(10f, 4f, 0);
paint.setPathEffect(rough);
```

**2. 圆角（圆滑）**
圆滑尖锐的角。
- `makeCorner(radius)`：圆角的半径。

```java
PathEffect round = PathEffect.makeCorner(20f);
```

**3. 虚线（虚线）**
创建虚线或点线。
- `makeDash(intervals, phase)`：
    - `intervals`：开/关长度数组（长度必须为偶数）。
    - `phase`：在间隔中的偏移量。

```java
// 10px 开，5px 关
PathEffect dash = PathEffect.makeDash(new float[] { 10f, 5f }, 0f);
```

**4. Path1D（路径图章）**
沿着路径图章一个形状（类似画笔）。
- `makePath1D(path, advance, phase, style)`

```java
Path shape = new Path().addCircle(0, 0, 3);
PathEffect dots = PathEffect.makePath1D(shape, 10f, 0f, PathEffect1DStyle.TRANSLATE);
```

**5. Path2D（矩阵）**
通过矩阵变换路径几何。
- `makePath2D(matrix, path)`

**6. Line2D**
- `makeLine2D(width, matrix)`

### 组合

你可以组合多个路径效果。

- `makeSum(second)`：绘制*两种*效果（例如，填充 + 描边）。
- `makeCompose(inner)`：先应用 `inner`，再应用 `this`（例如，粗糙轮廓 -> 虚线）。

```java
PathEffect dashed = PathEffect.makeDash(new float[] {10, 5}, 0);
PathEffect corner = PathEffect.makeCorner(10);

// 先圆角，再虚线
PathEffect composed = dashed.makeCompose(corner);
```