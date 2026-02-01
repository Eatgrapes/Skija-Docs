# GPU レンダリング

Skija は CPU 上でも非常に優れたパフォーマンスを発揮しますが、その真の力を発揮するのは、OpenGL、Metal、Vulkan、または Direct3D を介した GPU アクセラレーションを使用するときです。

## 概念

### DirectContext
`DirectContext` は GPU ドライバーへの接続を表します。GPU リソース、キャッシュ、および基盤となるグラフィックス API の状態を管理します。

### BackendRenderTarget
`BackendRenderTarget` は、Skia が描画できるバッファ（OpenGL のフレームバッファや Metal のテクスチャなど）を表します。

## 例: LWJGL を使用した OpenGL

LWJGL を使用して OpenGL ウィンドウにレンダリングするには:

1.  **OpenGL の初期化:** LWJGL を使用してウィンドウと GL コンテキストを作成します。
2.  **DirectContext の作成:**
    ```java
    DirectContext context = DirectContext.makeGL();
    ```
3.  **レンダーターゲットの作成:**
    Skia にどのフレームバッファに描画するかを伝える必要があります（通常、デフォルトのウィンドウには `0` を使用します）。
    ```java
    BackendRenderTarget rt = BackendRenderTarget.makeGL(
        width, height, 
        0, /* サンプル数 */ 
        8, /* ステンシル */ 
        fbId, /* GL フレームバッファ ID */ 
        FramebufferFormat.GR_GL_RGBA8
    );
    ```
4.  **Surface の作成:**
    ```java
    Surface surface = Surface.makeFromBackendRenderTarget(
        context, rt, 
        SurfaceOrigin.BOTTOM_LEFT, 
        ColorType.RGBA_8888, 
        ColorSpace.getSRGB()
    );
    ```

## レンダーループ

GPU アクセラレーション環境では、Skia に GPU へのコマンド送信を手動で指示する必要があります。

```java
while (!window.shouldClose()) {
    Canvas canvas = surface.getCanvas();
    
    // 1. コンテンツを描画する
    canvas.clear(0xFFFFFFFF);
    canvas.drawCircle(50, 50, 30, paint);
    
    // 2. コマンドを GPU にフラッシュする
    context.flush();
    
    // 3. バッファをスワップする（グラフィックス API 固有）
    window.swapBuffers();
}
```

## ベストプラクティス

- **コンテキストの再利用:** `DirectContext` の作成は負荷が高いです。一度作成したら、アプリケーションのライフタイムを通じて使用してください。
- **リサイズの処理:** ウィンドウのサイズが変更された場合、古い `Surface` と `BackendRenderTarget` を `close()` し、新しいサイズに一致する新しいものを作成する必要があります。
- **リソース管理:** GPU バックドのサーフェスは、不要になったら VRAM を解放するために閉じる必要があります。