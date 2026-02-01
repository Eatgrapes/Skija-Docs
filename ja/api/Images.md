# 画像とビットマップ

Skijaで画像を扱うには、主に2つのクラスを使用します：`Image`と`Bitmap`。これらは似ているように見えますが、異なる目的で使用されます。

## Image 対 Bitmap

- **`Image`**: 読み取り専用で、GPUバックドのテクスチャであると考えてください。キャンバスへの描画に最適化されています。
- **`Bitmap`**: これは変更可能な、CPU側のピクセル配列です。プログラムで個々のピクセルを編集する必要がある場合に使用します。

## 画像の読み込み

画像を取得する最も一般的な方法は、エンコードされたバイト（PNG、JPEGなど）から読み込むことです。

```java
byte[] bytes = Files.readAllBytes(Path.of("photo.jpg"));
Image img = Image.makeDeferredFromEncodedBytes(bytes);
```

**ヒント:** `makeDeferredFromEncodedBytes` は「遅延」です。実際に初めて描画するまでピクセルをデコードしないため、初期読み込み時のメモリと時間を節約できます。

### ピクセル（ラスター）からの作成

生のピクセルデータ（例：他のライブラリからのもの、または手続き的に生成されたもの）がある場合：

```java
// Dataオブジェクトから（ネイティブメモリまたはバイト配列をラップ）
Image img = Image.makeRasterFromData(
    ImageInfo.makeN32Premul(100, 100),
    data,
    rowBytes
);

// Bitmapから（ピクセルをコピーまたは共有）
Image img = Image.makeRasterFromBitmap(bitmap);

// Pixmapから（ピクセルをコピー）
Image img = Image.makeRasterFromPixmap(pixmap);
```

## エンコード（画像の保存）

`Image`をファイルやストリームに保存するには、エンコードする必要があります。Skijaは、きめ細かい制御のために `EncoderJPEG`、`EncoderPNG`、`EncoderWEBP` を提供します。

```java
// シンプルなエンコード（デフォルト設定）
Data pngData = EncoderPNG.encode(image);
Data jpgData = EncoderJPEG.encode(image); // デフォルト品質 100

// 高度なエンコード（オプション付き）
EncodeJPEGOptions jpgOpts = new EncodeJPEGOptions()
    .setQuality(80)
    .setAlphaMode(EncodeJPEGAlphaMode.IGNORE);

Data compressed = EncoderJPEG.encode(image, jpgOpts);

// WebPエンコード
EncodeWEBPOptions webpOpts = new EncodeWEBPOptions()
    .setQuality(90)
    .setCompression(EncodeWEBPCompressionMode.LOSSY); // または LOSSLESS

Data webp = EncoderWEBP.encode(image, webpOpts);
```

## キャンバスへの描画

画像の描画はシンプルですが、**サンプリング**に注意してください。

```java
canvas.drawImage(img, 10, 10);
```

### サンプリングモード

画像を拡大縮小するときは、どのようにサンプリングするかを決定する必要があります：
- `SamplingMode.DEFAULT`: 最近傍法。高速ですが、拡大するとブロック状に見えます。
- `SamplingMode.LINEAR`: バイリニアフィルタリング。滑らかですが、少しぼやけることがあります。
- `SamplingMode.MITCHELL`: 高品質な3次再サンプリング。ダウンスケーリングに最適です。

```java
canvas.drawImageRect(img, Rect.makeWH(200, 200), SamplingMode.LINEAR, null, true);
```

## 画像からのシェーダーの作成

画像をシェーダーに変換することで、パターン（例：タイル状の背景）として使用できます。

```java
Shader pattern = img.makeShader(FilterTileMode.REPEAT, FilterTileMode.REPEAT);
paint.setShader(pattern);
canvas.drawPaint(paint); // タイル状の画像でキャンバス全体を塗りつぶす
```

## ピクセルの操作（Bitmap）

ピクセル単位で画像を一から生成する必要がある場合：

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));

// これで、Canvasを使用してこのビットマップに描画できます
Canvas c = new Canvas(bmp);
c.clear(0xFFFFFFFF);
// ... 何かを描画 ...

// または生のピクセルにアクセス（上級者向け）
ByteBuffer pixels = bmp.peekPixels();
```

## ピクセルデータへのアクセス（サンプリング）

`Image` または `Surface` からピクセルを読み取るには、`readPixels` メソッドを使用します。

### 画像全体のサンプリング
```java
// ピクセルを保持するビットマップを作成
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(width, height));

// 画像からすべてのピクセルをビットマップに読み込む
image.readPixels(bmp);
```

### 領域サンプリング
(x, y)オフセットを指定することで、画像の特定のサブ矩形を読み取ることができます。

```java
// 50x50の領域のみが必要
Bitmap regionBmp = new Bitmap();
regionBmp.allocPixels(ImageInfo.makeN32Premul(50, 50));

// ソース画像の (100, 100) から読み取りを開始
// 実質的に矩形 {100, 100, 150, 150} をキャプチャ
image.readPixels(regionBmp, 100, 100); 
```

## OpenGL / Metal 相互運用性

Skijaでは、既存のGPUテクスチャから直接 `Image` オブジェクトを作成できます。これは他のグラフィックスライブラリ（LWJGLなど）との統合に便利です。

### OpenGLテクスチャからの画像作成

```java
// GPU操作にはDirectContextが必要
DirectContext context = ...; 

// 他の場所から取得したOpenGLテクスチャIDがあると仮定
int textureId = 12345;

Image glImage = Image.adoptGLTextureFrom(
    context, 
    textureId, 
    GL30.GL_TEXTURE_2D, 
    512, 512, 
    GL30.GL_RGBA8, 
    SurfaceOrigin.BOTTOM_LEFT, 
    ColorType.RGBA_8888
);

// これで、このテクスチャをSkijaを使用して描画できます
canvas.drawImage(glImage, 0, 0);
```

**注意:** テクスチャを採用（adopt）すると、Skijaは所有権を引き受けます。所有権を取らずにラップしたい場合は、`makeFromTexture` のバリアント（利用可能な場合）を探すか、ライフタイムを慎重に管理してください。

## パフォーマンス上の落とし穴

1.  **UIスレッドでのデコード:** 大きな画像のデコードは遅くなる可能性があります。バックグラウンドで行ってください。
2.  **テクスチャのアップロード:** GPUバックエンド（OpenGLなど）を使用している場合、CPU側の `Image` を初めて描画するとき、SkiaはそれをGPUにアップロードする必要があります。大きなテクスチャの場合、フレームドロップの原因になることがあります。
3.  **大きなビットマップ:** ビットマップはJavaのヒープとネイティブメモリに存在します。大きなサイズ（例：8kテクスチャ）は、すぐにOutOfMemoryエラーを引き起こす可能性があるため注意してください。