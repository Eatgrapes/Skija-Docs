# API 參考：DirectContext（GL 狀態與上下文）

`DirectContext` 類別是你與 GPU 的橋樑。它管理與底層圖形 API（OpenGL、Metal、Vulkan 或 Direct3D）的連接，並處理 GPU 資源的生命週期。

## 建立上下文

通常每個應用程式會建立一個 `DirectContext`，並在其整個生命週期中重複使用。

```java
// 用於 OpenGL
DirectContext context = DirectContext.makeGL();

// 用於 Metal (macOS/iOS)
DirectContext context = DirectContext.makeMetal(devicePtr, queuePtr);
```

## 指令提交

Skia 會將繪圖指令記錄到內部緩衝區。你必須明確告訴 Skia 將這些指令發送到 GPU。

- `flush()`：將已記錄的指令提交到 GPU 驅動程式的緩衝區。
- `submit()`：確保 GPU 實際開始處理指令。
- `flushAndSubmit(syncCpu)`：完成一幀最常用的方式。如果 `syncCpu` 為 true，它會阻塞直到 GPU 完全完成。

```java
context.flushAndSubmit(true);
```

## 管理 GL 狀態

當 Skija 與其他 OpenGL 程式碼（例如在遊戲引擎或自訂 UI 中）一起使用時，外部程式碼可能會改變 OpenGL 狀態（例如綁定不同的程式或更改視口）。Skia 需要知道這些變更，以避免渲染錯誤。

### 重設狀態

如果你或你使用的函式庫修改了 OpenGL 狀態，你**必須**通知 Skia：

```java
// 通知 Skia 所有 OpenGL 狀態可能已改變
context.resetGLAll();

// 或者為了更好的效能，更精確地指定
context.reset(BackendState.GL_PROGRAM, BackendState.GL_TEXTURE_BINDING);
```

### 放棄上下文

如果底層 GPU 上下文遺失（例如視窗被銷毀或驅動程式崩潰），請使用 `abandon()` 以防止 Skia 進行任何可能導致崩潰的後續原生呼叫。

```java
context.abandon();
```

## 最佳實踐

1.  **執行緒安全：** `DirectContext` **不**是執行緒安全的。對它的所有呼叫，以及對與其關聯的所有表面的繪圖，都必須在同一個執行緒上進行。
2.  **狀態衛生：** 如果你將 Skija 與原始 OpenGL 呼叫混合使用，在將控制權返回給 Skija 之前，請務必呼叫 `context.resetGLAll()`。
3.  **刷新表面：** 如果你有多個表面，可以單獨刷新它們：`context.flush(surface)`。