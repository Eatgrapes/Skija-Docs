# API 參考：文件（PDF 生成）

`Document` 類別允許您擷取繪圖指令並將其儲存為向量格式，最顯著的是 **PDF**。與渲染為像素的 `Surface` 不同，`Document` 保留了繪圖的向量特性。

## 建立 PDF

要建立 PDF，您需要一個 `WStream`（寫入串流）來接收輸出。

```java
try (FileOutputStream fos = new FileOutputStream("output.pdf");
     WStream stream = new FileOutputStreamWStream(fos);
     Document doc = Document.makePDF(stream)) {
     
    // 1. 開始一個頁面
    Canvas canvas = doc.beginPage(595, 842); // A4 尺寸，單位為點
    
    // 2. 在頁面畫布上繪圖
    Paint paint = new Paint().setColor(0xFF4285F4);
    canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
    
    // 3. 結束頁面
    doc.endPage();
    
    // 4. 關閉文件以完成檔案
    doc.close();
}
```

## 添加元數據

您可以在建立文件時包含 PDF 元數據（標題、作者等）：

```java
Document doc = Document.makePDF(stream, 
    "我的 Skija 文件", // 標題
    "Skija 開發者",    // 作者
    "圖形演示",     // 主題
    "向量, skia, java", // 關鍵字
    "Skija 引擎",      // 創建者
    "Skija PDF 產生器", // 產生者
    System.currentTimeMillis(), // 建立日期
    System.currentTimeMillis()  // 修改日期
);
```

## 重要注意事項

- **座標系統**：PDF 使用 **點**（1/72 英吋）作為預設單位。
- **畫布生命週期**：`beginPage()` 返回的 `Canvas` 僅在您呼叫 `endPage()` 之前有效。請勿在頁面結束後嘗試使用它。
- **字型**：在 PDF 中繪製文字時，Skija 會嘗試嵌入必要的字型數據。請確保您使用的字型允許嵌入。
- **向量與點陣圖**：大多數 Skija 操作（線條、形狀、文字）在 PDF 中將保持向量形式。然而，某些複雜效果（如某些 ImageFilters 或 Shaders）可能會導致 Skia 將部分頁面點陣化。