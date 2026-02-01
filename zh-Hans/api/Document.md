# API 参考：文档（PDF 生成）

`Document` 类允许您捕获绘图命令并将其保存为基于矢量的格式，最显著的是 **PDF**。与渲染为像素的 `Surface` 不同，`Document` 保留了绘图的矢量特性。

## 创建 PDF

要创建 PDF，您需要一个 `WStream`（写入流）来接收输出。

```java
try (FileOutputStream fos = new FileOutputStream("output.pdf");
     WStream stream = new FileOutputStreamWStream(fos);
     Document doc = Document.makePDF(stream)) {
     
    // 1. 开始一个页面
    Canvas canvas = doc.beginPage(595, 842); // A4 尺寸，单位为点
    
    // 2. 在页面画布上绘图
    Paint paint = new Paint().setColor(0xFF4285F4);
    canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
    
    // 3. 结束页面
    doc.endPage();
    
    // 4. 关闭文档以完成文件
    doc.close();
}
```

## 添加元数据

您可以在创建文档时包含 PDF 元数据（标题、作者等）：

```java
Document doc = Document.makePDF(stream, 
    "我的 Skija 文档", // 标题
    "Skija 开发者",    // 作者
    "图形演示",     // 主题
    "矢量, skia, java", // 关键词
    "Skija 引擎",      // 创建者
    "Skija PDF 生成器", // 生成器
    System.currentTimeMillis(), // 创建日期
    System.currentTimeMillis()  // 修改日期
);
```

## 重要注意事项

- **坐标系**：PDF 默认使用 **点**（1/72 英寸）作为单位。
- **画布生命周期**：`beginPage()` 返回的 `Canvas` 仅在调用 `endPage()` 之前有效。页面结束后请勿尝试使用它。
- **字体**：在 PDF 中绘制文本时，Skija 会尝试嵌入必要的字体数据。请确保您使用的字体允许嵌入。
- **矢量与栅格**：大多数 Skija 操作（线条、形状、文本）在 PDF 中将保持为矢量。但是，某些复杂效果（如某些 ImageFilter 或 Shader）可能会导致 Skia 将部分页面栅格化。