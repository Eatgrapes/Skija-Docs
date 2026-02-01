# 扩展功能：Lottie 与 SVG

Skija 内置了对流行矢量格式（如通过 Skottie 实现的 Lottie 和 SVG）的高级支持，让你能够轻松地将复杂的动画和图标集成到 Java 应用程序中。

## Lottie 动画（Skottie）

Skottie 是 Skia 的 Lottie 播放器。它可以加载和播放从 After Effects 导出的基于 JSON 的动画。

### 加载动画

```java
import io.github.humbleui.skija.skottie.Animation;

Animation anim = Animation.makeFromFile("assets/loader.json");
```

### 播放与渲染

要播放动画，你需要“跳转”到特定的时间点或帧，然后将其渲染到画布上。

```java
// 归一化时间：0.0（开始）到 1.0（结束）
anim.seek(currentTime); 

// 或者跳转到特定的帧索引
anim.seekFrame(24);

// 渲染到画布上的指定矩形区域
anim.render(canvas, Rect.makeXYWH(0, 0, 200, 200));
```

## SVG 支持

Skija 提供了一个 SVG DOM，可以解析和渲染 SVG 文件。

### 加载与渲染 SVG

```java
import io.github.humbleui.skija.svg.SVGDOM;

Data data = Data.makeFromFileName("assets/icon.svg");
SVGDOM svg = new SVGDOM(data);

// 设置 SVG 渲染容器的尺寸
svg.setContainerSize(100, 100);

// 将其绘制到画布上
svg.render(canvas);
```

### 与 SVG 交互

你可以访问 SVG 的根元素来查询其属性，例如其固有尺寸。

```java
SVGSVG root = svg.getRoot();
Point size = root.getIntrinsicSize();
```

## 何时使用哪种格式？

- **Lottie：** 最适合复杂的 UI 动画、角色动画和富有表现力的过渡效果。
- **SVG：** 最适合静态图标、简单徽标和插图。
- **自定义着色器（SkSL）：** 最适合程序生成的背景、实时效果和高度动态的视觉效果。