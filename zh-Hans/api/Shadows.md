# Skija 中的阴影

Skija 提供了两种不同的绘制阴影方式：**2D 投影阴影**（通过 ImageFilters）和 **3D 高程阴影**（通过 ShadowUtils）。

## 1. 2D 投影阴影 (ImageFilter)

这是为特定绘制操作添加阴影的标准方法。阴影跟随所绘制几何形状或图像的轮廓。

```java
ImageFilter shadow = ImageFilter.makeDropShadow(
    2.0f, 2.0f,   // 偏移量 (dx, dy)
    3.0f, 3.0f,   // 模糊量 (sigmaX, sigmaY)
    0x80000000    // 阴影颜色 (50% 透明黑色)
);

Paint paint = new Paint().setImageFilter(shadow);
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
```

### 仅绘制阴影
如果只想绘制阴影而不绘制原始对象（例如，用于复杂分层），请使用 `makeDropShadowOnly`。

---

## 2. 3D 高程阴影 (ShadowUtils)

`ShadowUtils` 提供了一个更基于物理的阴影模型，类似于 Material Design 的高程概念。它计算特定 3D 位置的光源如何将“遮挡物”（一个 Path）的阴影投射到画布平面上。

### 基本用法

```java
Path path = new Path().addRect(Rect.makeXYWH(50, 50, 100, 100));

// Z 平面：对象的高程。
// 对于平面 UI 元素通常是常量：(0, 0, elevation)
Point3 elevation = new Point3(0, 0, 10.0f); 

// 光源位置：相对于画布的 3D 坐标
Point3 lightPos = new Point3(250, 0, 600); 

float lightRadius = 800.0f;
int ambientColor = 0x10000000;
int spotColor = 0x30000000;

ShadowUtils.drawShadow(
    canvas, 
    path, 
    elevation, 
    lightPos, 
    lightRadius, 
    ambientColor, 
    spotColor, 
    ShadowUtilsFlag.TRANSPARENT_OCCLUDER
);

// 注意：drawShadow 仅绘制阴影。
// 你仍然需要绘制对象本身：
canvas.drawPath(path, new Paint().setColor(0xFFFFFFFF));
```

### 环境阴影 vs. 聚光阴影
- **环境阴影**：由间接光引起的柔和、无方向性的阴影。
- **聚光阴影**：由特定光源位置引起的定向阴影。
两者结合可以创造出逼真的深度效果。

### 阴影标志
- `TRANSPARENT_OCCLUDER`：如果你的对象是半透明的，请使用此标志，这样阴影就不会被裁剪到对象下方。
- `GEOMETRIC_ONLY`：如果不需要高质量模糊，可以使用此优化标志。
- `DIRECTIONAL_LIGHT`：将光源视为无限远（如阳光）。

## 对比

| 特性 | 投影阴影 (ImageFilter) | 高程阴影 (ShadowUtils) |
| :--- | :--- | :--- |
| **模型** | 2D 高斯模糊 | 3D 透视投影 |
| **性能** | 快速（由 Skia 缓存） | 更复杂，但高度优化 |
| **用法** | 在 `Paint` 上设置 | 直接调用 `ShadowUtils` |
| **最适合** | 文本、简单的 UI 发光效果、图标 | Material Design 按钮、卡片、深度效果 |

## 视觉示例

要查看这些阴影的实际效果，请运行 **Scenes** 示例应用并选择 **ShadowUtils** 场景。

**源代码：** [`examples/scenes/src/ShadowUtilsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadowUtilsScene.java)

*图：各种 ShadowUtils 标志和光源位置的对比。*