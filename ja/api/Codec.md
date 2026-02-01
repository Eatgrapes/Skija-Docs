# APIリファレンス: Codec (デコード & アニメーション)

`Image.makeDeferredFromEncodedBytes()` は単純な静止画像には適していますが、デコード処理をより細かく制御したい場合や、**アニメーション画像** (GIF、アニメーションWebP) を扱う場合には `Codec` クラスが必要です。

## Codecの読み込み

`Codec` は、画像がピクセルに変換される前の「ソース」を表します。

```java
Data data = Data.makeFromFileName("animations/loading.gif");
Codec codec = Codec.makeFromData(data);
```

## 基本的なデコード

Codecから単一の静止フレームを取得するには:

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(codec.getImageInfo()); // メモリを準備
codec.readPixels(bmp); // データをビットマップにデコード
```

## アニメーションの処理

ここが `Codec` の真価を発揮する場面です。GIFやWebPのフレームを反復処理できます。

```java
int frameCount = codec.getFrameCount();
int loopCount = codec.getRepetitionCount(); // -1は無限ループ

for (int i = 0; i < frameCount; i++) {
    // 1. この特定のフレームに関する情報を取得 (継続時間など)
    AnimationFrameInfo info = codec.getFrameInfo(i);
    int duration = info.getDuration(); // ミリ秒単位
    
    // 2. フレームをデコード
    Bitmap frameBmp = new Bitmap();
    frameBmp.allocPixels(codec.getImageInfo());
    codec.readPixels(frameBmp, i);
    
    // 3. フレームを使って何か処理...
}
```

## 高度なデコードオプション

### デコード中のスケーリング
4K画像があるが、200x200のサイズしか必要ない場合、デコード処理**中**にスケーリングするようCodecに指示できます。これは、フル画像をデコードしてからスケーリングするよりもはるかに高速で、メモリ使用量も大幅に少なくなります。

```java
ImageInfo smallInfo = ImageInfo.makeN32Premul(200, 200);
Bitmap smallBmp = new Bitmap();
smallBmp.allocPixels(smallInfo);

codec.readPixels(smallBmp); // デコードとスケーリングを1ステップで実行！
```

## 重要な注意点

- **ストリームの巻き戻し:** 一部のCodec (ソースデータに依存) は巻き戻しできません。フレームを複数回デコードする必要がある場合は、`Data` をメモリ内に保持する方が安全です。
- **カラースペース:** Codecは画像に埋め込まれたカラースペースを尊重しようとします。`readPixels` に異なる `ImageInfo` を提供することでこれを上書きできます。
- **メモリ:** `Codec` 自体は小さいですが、デコード先の `Bitmap` オブジェクトは非常に大きくなる可能性があります。可能な限りビットマップを再利用してください。