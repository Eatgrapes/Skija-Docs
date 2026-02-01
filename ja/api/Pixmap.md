# API リファレンス: Pixmap

`Pixmap` クラスはメモリ内のラスター画像を表します。ピクセルデータへの直接アクセスと、ピクセルの読み取り、書き込み、操作のためのメソッドを提供します。

## 概要

`Pixmap` は、`ImageInfo`（幅、高さ、カラータイプ、アルファタイプ、カラースペース）と、メモリ内の実際のピクセルデータを組み合わせたものです。`Image` とは異なり、`Pixmap` はピクセルバッファへの直接アクセスを可能にします。

## 作成

- `make(info, buffer, rowBytes)`: 提供された `ByteBuffer` をラップする `Pixmap` を作成します。
- `make(info, addr, rowBytes)`: 提供されたネイティブメモリアドレスをラップする `Pixmap` を作成します。

## データ管理

- `reset()`: `Pixmap` を null 状態にクリアします。
- `reset(info, buffer, rowBytes)`: `Pixmap` をリセットして、新しく提供されたバッファをラップします。
- `setColorSpace(colorSpace)`: `Pixmap` のカラースペースを更新します。
- `extractSubset(subsetPtr, area)`: `Pixmap` のサブセットを `subsetPtr` が指すメモリに抽出します。
- `extractSubset(buffer, area)`: `Pixmap` のサブセットを提供された `ByteBuffer` に抽出します。

## プロパティ

- `getInfo()`: `Pixmap` を記述する `ImageInfo`（幅、高さ、カラータイプなど）を返します。
- `getRowBytes()`: 1行あたりのバイト数を返します。
- `getAddr()`: ピクセルデータのネイティブアドレスを返します。
- `getRowBytesAsPixels()`: 1行あたりのピクセル数を返します（特定のカラータイプのみ）。
- `computeByteSize()`: ピクセルデータの合計バイトサイズを計算します。
- `computeIsOpaque()`: `Pixmap` が不透明な場合に true を返します。
- `getBuffer()`: ピクセルデータをラップする `ByteBuffer` を返します。

## ピクセルへのアクセス

### 単一ピクセルアクセス

- `getColor(x, y)`: `(x, y)` のピクセルの色を整数（ARGB）で返します。
- `getColor4f(x, y)`: `(x, y)` のピクセルの色を `Color4f` で返します。
- `getAlphaF(x, y)`: `(x, y)` のピクセルのアルファ成分を float で返します。
- `getAddr(x, y)`: `(x, y)` のピクセルのネイティブアドレスを返します。

### 一括ピクセル操作

- `readPixels(info, addr, rowBytes)`: `Pixmap` からピクセルを宛先メモリにコピーします。
- `readPixels(pixmap)`: ピクセルを別の `Pixmap` にコピーします。
- `scalePixels(dstPixmap, samplingMode)`: 指定されたサンプリングモードを使用して、ピクセルを宛先 `Pixmap` に合わせてスケーリングします。
- `erase(color)`: 指定された色で `Pixmap` 全体を塗りつぶします。
- `erase(color, subset)`: `Pixmap` の特定の領域を指定された色で塗りつぶします。

## 例

### ピクセルの変更

```java
// 新しい N32（標準 RGBA/BGRA）Pixmap を作成
try (var pixmap = new Pixmap()) {
    // 100x100 ピクセルのメモリを割り当て
    pixmap.reset(ImageInfo.makeN32Premul(100, 100), Unpooled.malloc(100 * 100 * 4), 100 * 4);
    
    // 白で塗りつぶし
    pixmap.erase(0xFFFFFFFF);

    // (10, 10) のピクセルを赤に設定
    // 注: 一括操作では直接バイト操作の方が高速かもしれませんが、
    // erase/readPixels はより簡単な API です。
    // Skija Pixmap は、マネージド API でのパフォーマンス上の理由から、
    // 単純な setPixel(x,y,color) を公開していませんが、
    // ByteBuffer に直接書き込むことができます。
    ByteBuffer buffer = pixmap.getBuffer();
    int offset = (10 * 100 + 10) * 4; // y * width + x * bpp
    buffer.putInt(offset, 0xFFFF0000); // ARGB (赤)
    
    // 描画するためにこのピクセルマップから画像を作成
    try (var image = Image.makeFromRaster(pixmap)) {
        canvas.drawImage(image, 0, 0);
    }
}
```

### ピクセルの読み取り

```java
// Pixmap 'pixmap' があると仮定
int width = pixmap.getInfo().getWidth();
int height = pixmap.getInfo().getHeight();

// 特定の座標の色を取得
int color = pixmap.getColor(50, 50);
System.out.println("Color at 50,50: " + Integer.toHexString(color));

// すべてのピクセルを反復処理（Java でのパフォーマンスに注意！）
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        if (pixmap.getAlphaF(x, y) > 0.5f) {
            // 非透明ピクセルを発見
        }
    }
}
```