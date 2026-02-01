# API 参考：着色器

着色器根据像素在画布上的位置定义其颜色。它们主要用于渐变、图案和噪点效果。着色器通过 `paint.setShader(shader)` 分配给 `Paint` 对象。

## 渐变

渐变是最常见的着色器类型。Skija 支持以下几种：

### 线性渐变
在两点之间创建平滑过渡。

**视觉示例：**
查看 [`examples/scenes/src/ShadersScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadersScene.java) 以获取线性、径向、扫描和锥形渐变以及噪点着色器的示例。

```java
Shader linear = Shader.makeLinearGradient(
    0, 0, 100, 100,      // x0, y0, x1, y1
    new int[] { 0xFFFF0000, 0xFF0000FF } // 颜色（红到蓝）
);
```

### 径向渐变
从中心点创建圆形过渡。

```java
Shader radial = Shader.makeRadialGradient(
    50, 50, 30,          // 中心点 x, y, 半径
    new int[] { 0xFFFFFFFF, 0xFF000000 } // 颜色（白到黑）
);
```

### 扫描渐变
围绕中心点创建扫描式过渡（类似色轮）。

```java
Shader sweep = Shader.makeSweepGradient(
    50, 50,              // 中心点 x, y
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFFFF0000 }
);
```

### 两点锥形渐变
在两个圆之间创建过渡（适用于类似 3D 光照或光晕效果）。

```java
Shader conical = Shader.makeTwoPointConicalGradient(
    30, 30, 10,          // 起始点 x, y, 半径
    70, 70, 40,          // 结束点 x, y, 半径
    new int[] { 0xFFFF0000, 0xFF0000FF }
);
```

## 噪点与图案

### 柏林噪点
生成类似云彩、大理石或火焰的纹理。

```java
// 分形噪点
Shader noise = Shader.makeFractalNoise(
    0.05f, 0.05f,        // baseFrequencyX, baseFrequencyY
    4,                   // numOctaves
    0.0f                 // seed
);

// 湍流噪点
Shader turb = Shader.makeTurbulence(0.05f, 0.05f, 4, 0.0f);
```

### 图像着色器
将 `Image` 转换为可平铺或用于填充形状的着色器。

```java
// 通过 Image 类访问
Shader imageShader = image.makeShader(
    FilterTileMode.REPEAT, 
    FilterTileMode.REPEAT, 
    SamplingMode.DEFAULT
);
```

## 组合与修改

- `Shader.makeBlend(mode, dst, src)`：使用混合模式组合两个着色器。
- `shader.makeWithLocalMatrix(matrix)`：对着色器的坐标系应用变换。
- `shader.makeWithColorFilter(filter)`：对着色器的输出应用颜色滤镜。

## 平铺模式 (`FilterTileMode`)

当着色器（如渐变或图像）需要填充超出其定义边界的区域时：
- `CLAMP`：使用边缘颜色填充剩余区域。
- `REPEAT`：重复图案。
- `MIRROR`：重复图案，并在边缘处镜像。
- `DECAL`：在边界外渲染透明区域。