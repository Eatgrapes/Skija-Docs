# API 参考：颜色与编码

本页涵盖高精度颜色表示、像素格式、Alpha通道解释及色彩空间。

---

## Color4f

`Color4f` 使用四个浮点数值（RGBA）表示颜色，每个值通常在 0.0 到 1.0 之间。相比传统的 8 位整数，这种方式能提供更高的精度。

### 构造函数

- `new Color4f(r, g, b, a)`
- `new Color4f(r, g, b)`：不透明颜色（alpha = 1.0）。
- `new Color4f(int color)`：将标准的 ARGB 8888 整数转换为浮点分量。

### 方法

- `toColor()`：转换回 ARGB 8888 整数。
- `makeLerp(other, weight)`：在两个颜色之间进行线性插值。

### 示例

```java
Color4f red = new Color4f(1f, 0f, 0f, 1f);
Color4f halfTransparentBlue = new Color4f(0f, 0f, 1f, 0.5f);

// 在 Paint 中使用
Paint paint = new Paint().setColor4f(red, ColorSpace.getSRGB());
```

---

## ColorType

`ColorType` 描述像素中位的排列方式（例如通道顺序和位深度）。

### 常见类型

- `RGBA_8888`：每个通道 8 位，红色在前。
- `BGRA_8888`：每个通道 8 位，蓝色在前（在 Windows 上常见）。
- `N32`：当前平台的原生 32 位格式（通常映射到 RGBA 或 BGRA）。
- `F16`：每个通道 16 位半浮点（高动态范围）。
- `GRAY_8`：单 8 位通道，用于灰度。
- `ALPHA_8`：单 8 位通道，用于透明度蒙版。

---

## ColorAlphaType

`ColorAlphaType` 描述应如何解释 Alpha 通道。

- `OPAQUE`：所有像素完全不透明；忽略 Alpha 通道。
- `PREMUL`：颜色分量已乘以 Alpha 值（Skia 性能优化的标准做法）。
- `UNPREMUL`：颜色分量独立于 Alpha。

---

## ColorSpace

`ColorSpace` 定义颜色的范围（色域）和线性特性。

### 常见色彩空间

- `ColorSpace.getSRGB()`：用于网页和大多数显示器的标准色彩空间。
- `ColorSpace.getSRGBLinear()`：具有线性传递函数的 sRGB（适用于数学计算/混合）。
- `ColorSpace.getDisplayP3()`：现代 Apple 设备使用的广色域色彩空间。

### 方法

- `isSRGB()`：如果色彩空间是 sRGB，则返回 true。
- `isGammaLinear()`：如果传递函数是线性的，则返回 true。
- `convert(to, color)`：将 `Color4f` 从此色彩空间转换到另一个。

### 使用示例

```java
// 创建具有特定编码的 ImageInfo
ImageInfo info = new ImageInfo(
    800, 600, 
    ColorType.N32, 
    ColorAlphaType.PREMUL, 
    ColorSpace.getSRGB()
);
```