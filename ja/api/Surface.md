# APIリファレンス: Surface

`Surface`クラスは、すべての描画コマンドの宛先です。ピクセルメモリ（CPUまたはGPU上）を管理し、描画に使用する`Canvas`を提供します。

## 概要

`Surface`は以下の役割を担います：
1. ピクセルデータ（またはGPUテクスチャ）を保持する。
2. そのデータに描画するための`Canvas`インターフェースを提供する。
3. 現在の内容を`Image`としてスナップショットする。

## Surfaceの作成

### 1. ラスターSurface (CPU)
最もシンプルなサーフェスです。ピクセルは標準的なシステムメモリ（RAM）上に存在します。画像生成、サーバーサイドレンダリング、テストに最適です。

```java
// 標準的な32ビットRGBAサーフェス
Surface raster = Surface.makeRasterN32Premul(800, 600);

// カスタムImageInfoを使用（例：HDR用F16カラー）
ImageInfo info = new ImageInfo(800, 600, ColorType.RGBA_F16, AlphaType.PREMUL);
Surface hdrSurface = Surface.makeRaster(info);
```

### 2. GPU Surface (レンダーターゲット)
ハードウェアアクセラレーションされたレンダリングに使用されます。`DirectContext`（OpenGL/Metal/Vulkanコンテキスト）が必要です。

```java
DirectContext context = ...; // あなたのGPUコンテキスト

// Skiaによって管理されるGPU上に新しいテクスチャを作成
Surface gpuSurface = Surface.makeRenderTarget(
    context,
    false,             // Budgeted? (Skiaがキャッシュ制限に対してこれをカウントすべきか？)
    ImageInfo.makeN32Premul(800, 600)
);
```

### 3. 既存のOpenGL/Metalテクスチャのラップ
Skijaを既存のゲームエンジンやウィンドウシステム（LWJGLやJWMなど）に統合する場合、ウィンドウは通常「フレームバッファ」または「テクスチャ」IDを提供します。これをラップすることで、Skijaは直接画面に描画できます。

```java
// OpenGLの例
int framebufferId = 0; // デフォルトのスクリーンバッファ
BackendRenderTarget renderTarget = BackendRenderTarget.makeGL(
    800, 600,          // 幅、高さ
    0,                 // サンプル数（MSAAなしの場合は0）
    8,                 // ステンシルビット数
    framebufferId,
    BackendRenderTarget.FRAMEBUFFER_FORMAT_GR_GL_RGBA8
);

Surface screenSurface = Surface.wrapBackendRenderTarget(
    context,
    renderTarget,
    SurfaceOrigin.BOTTOM_LEFT, // OpenGL座標は左下から始まる
    ColorType.RGBA_8888,
    ColorSpace.getSRGB(),
    null // SurfaceProps
);
```

### 4. ラスターピクセルのラップ（相互運用）
他のライブラリ（ビデオフレームデコーダーなど）から`ByteBuffer`やポインタを持っている場合、コピーせずに直接ラップできます。

```java
long pixelPtr = ...; // メモリへのネイティブポインタ
int rowBytes = width * 4; // 1行あたりのバイト数

Surface wrap = Surface.wrapPixels(
    ImageInfo.makeN32Premul(width, height),
    pixelPtr,
    rowBytes
);
```

### 5. Null Surface
何もしないサーフェスを作成します。メモリを割り当てずに測定やテストを行うのに便利です。

```java
Surface nullSurface = Surface.makeNull(100, 100);
```

## スナップショットの作成 (`Image`)

`Surface`から不変の`Image`を作成するのは低コストな操作です（Copy-on-Write）。

```java
// これはすぐにピクセルをコピーしません！
// 実質的にサーフェスを「フォーク」します。'surface'への将来の描画は'snapshot'に影響しません。
Image snapshot = surface.makeImageSnapshot();

// これで'snapshot'を使用して別のサーフェスに描画したり、ディスクに保存したりできます。
```

## コンテンツとの相互作用

```java
// 描画用のキャンバスを取得
Canvas canvas = surface.getCanvas();
canvas.drawCircle(50, 50, 20, paint);

// ピクセルをビットマップに読み戻す
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));
if (surface.readPixels(bitmap, 0, 0)) {
    // ピクセルの読み取りに成功
}

// ビットマップからサーフェスにピクセルを書き込む
surface.writePixels(bitmap, 10, 10);

// GPUコマンドをフラッシュ（GPUサーフェスで重要）
surface.flush();
```

- `getCanvas()`: 描画用のキャンバスを返します。
- `readPixels(bitmap, x, y)`: GPU/CPUからピクセルをビットマップに読み戻します。
- `writePixels(bitmap, x, y)`: ビットマップからサーフェスにピクセルを書き込みます。
- `flush()`: 保留中のすべてのGPUコマンドがドライバーに送信されるようにします。
- `notifyContentWillChange()`: 基礎となるピクセルメモリを直接（Canvasをバイパスして）変更する場合に呼び出します。
- `getRecordingContext()`: このサーフェスをバックアップする`DirectContext`を返します（存在する場合）。