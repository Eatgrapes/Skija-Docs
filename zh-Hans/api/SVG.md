# API 参考：SVG

虽然 Skia 主要是一个底层绘图引擎，但 Skija 包含一个 SVG 模块，允许你直接处理 SVG 文件。这非常适合图标、简单插图和徽标。

## 加载与渲染

Skija 中的 SVG 由 `SVGDOM` 类管理。

```java
import io.github.humbleui.skija.svg.SVGDOM;

// 1. 加载 SVG 数据
Data svgData = Data.makeFromFileName("assets/logo.svg");
SVGDOM svg = new SVGDOM(svgData);

// 2. 定义视口大小
// 这很重要！SVG 通常没有固定尺寸。
svg.setContainerSize(200, 200);

// 3. 将其渲染到画布上
svg.render(canvas);
```

## 缩放 SVG

由于 SVG 是基于矢量的，你可以将其缩放到任意大小而不会损失质量。只需在渲染前更改 `setContainerSize` 或使用 `canvas.scale()`。

```java
canvas.save();
canvas.translate(100, 100);
canvas.scale(2.0f, 2.0f); // 使其放大两倍
svg.render(canvas);
canvas.restore();
```

## 访问根元素

你可以获取根 `<svg>` 元素以查询原始尺寸或其他元数据。

```java
SVGSVG root = svg.getRoot();
if (root != null) {
    Point size = root.getIntrinsicSize(); // 获取 SVG 文件中定义的尺寸
}
```

## 性能提示：“光栅缓存”

渲染 SVG 可能出人意料地昂贵，因为 Skia 每次都需要解析类似 XML 的结构并执行许多绘图命令。

**最佳实践：** 如果一个图标多次出现（例如文件管理器中的文件夹图标），不要为每个实例调用 `svg.render()`。相反，将其渲染到离屏的 `Image` 一次，然后绘制该图像。

```java
// 执行一次
Surface cache = Surface.makeRasterN32Premul(width, height);
svg.render(cache.getCanvas());
Image cachedIcon = cache.makeImageSnapshot();

// 在渲染循环中使用
canvas.drawImage(cachedIcon, x, y);
```

## 限制

Skija 的 SVG 实现是完整 SVG 规范的“子集”。它支持大多数常见功能（形状、路径、填充、渐变），但可能难以处理：
- 复杂的 CSS 样式
- 脚本（SVG 内的 JavaScript）
- 某些晦涩的滤镜效果

对于大多数 UI 图标和徽标，它都能完美工作。