# レンダリングの基礎

このガイドでは、描画サーフェスの作成から基本的な描画操作まで、Skijaを使用したレンダリングの基本的な概念について説明します。

## サーフェスとキャンバス

Skia（およびSkija）では、すべての描画は**キャンバス**上で行われます。ただし、キャンバスは描画先となる**サーフェス**を必要とします。

### オフスクリーンレンダリング（ラスター）

最も簡単な始め方は、ラスター（メモリ内）サーフェスを作成することです。これは画像生成、サーバーサイドレンダリング、またはテストに最適です。

```java
// デフォルトのN32カラーフォーマット（通常はRGBAまたはBGRA）を使用して100x100ピクセルのサーフェスを作成
Surface surface = Surface.makeRasterN32Premul(100, 100);

// サーフェスからキャンバスを取得
Canvas canvas = surface.getCanvas();
```

`Canvas`オブジェクトは描画のための主要なインターフェースです。現在の状態（変換、クリッピング）を保持し、描画メソッドを提供します。

## ペイントの使用

`Canvas`は*どこに*、*何を*描画するかを定義しますが、`Paint`オブジェクトは*どのように*描画するかを定義します。`Paint`オブジェクトは、色、ストロークスタイル、ブレンディングモード、およびさまざまなエフェクトに関する情報を保持します。

```java
Paint paint = new Paint();
paint.setColor(0xFFFF0000); // 完全に不透明な赤
```

### 色の操作

Skijaの色は、**ARGB**形式の32ビット整数として表現されます：
- `0x`の後に`FF`（アルファ）、`RR`（赤）、`GG`（緑）、`BB`（青）が続きます。
- `0xFFFF0000`は不透明な赤です。
- `0xFF00FF00`は不透明な緑です。
- `0xFF0000FF`は不透明な青です。
- `0x80000000`は半透明の黒です。

## 基本的な描画操作

`Canvas`は、プリミティブを描画するための多くのメソッドを提供します。

```java
// 中心(50, 50)、半径30の円を描画
canvas.drawCircle(50, 50, 30, paint);

// 単純な線を描画
canvas.drawLine(10, 10, 90, 90, paint);

// 四角形を描画
canvas.drawRect(Rect.makeXYWH(10, 10, 80, 80), paint);
```

## 出力のキャプチャと保存

サーフェスに描画した後、結果を画像ファイルとして保存したいことがよくあります。

```java
// 1. 現在のサーフェス内容のスナップショットをImageとして取得
Image image = surface.makeImageSnapshot();

// 2. 画像を特定の形式（例：PNG）にエンコード
Data pngData = image.encodeToData(EncodedImageFormat.PNG);

// 3. 書き込みのためにデータをByteBufferに変換
ByteBuffer pngBytes = pngData.toByteBuffer();

// 4. 標準のJava I/Oを使用してファイルに書き込み
try {
    java.nio.file.Path path = java.nio.file.Path.of("output.png");
    Files.write(path, pngBytes.array());
} catch (IOException e) {
    e.printStackTrace();
}
```

### ピクセルの読み取り（スクリーンキャプチャ）

画像形式にエンコードせずに、サーフェスから生のピクセルデータ（例：処理や検査のため）を取得する必要がある場合：

```java
// 結果を格納するためのビットマップを作成
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));

// サーフェスからビットマップにピクセルを読み取り
// サイズが一致する場合、サーフェス全体を読み取ります
surface.readPixels(bitmap, 0, 0);

// 特定の領域の場合（例：10, 10から始まる50x50の領域）
Bitmap region = new Bitmap();
region.allocPixels(ImageInfo.makeN32Premul(50, 50));
surface.readPixels(region, 10, 10);
```

## チェーンAPI

多くのSkijaセッターは`this`を返すため、流れるようなビルダースタイルのAPIが可能です：

```java
Paint strokePaint = new Paint()
    .setColor(0xFF1D7AA2)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(2f)
    .setAntiAlias(true);
```