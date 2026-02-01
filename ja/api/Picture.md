# API リファレンス: Picture & PictureRecorder

同じ複雑なシーンを複数回描画する必要がある場合、または変化しない静的な背景がある場合は、`Picture` を使用すべきです。これは描画コマンドを高度に最適化された形式で記録し、Skia が毎フレーム個々の Java 呼び出しを実行するよりもはるかに高速に「再生」できるようにします。

## ワークフロー

ピクチャーの記録には、一時的な `Canvas` を取得するために `PictureRecorder` を使用します。

```java
PictureRecorder recorder = new PictureRecorder();

// 1. 「カリング矩形」（描画を意図する領域）を定義する
Canvas recordingCanvas = recorder.beginRecording(Rect.makeWH(500, 500));

// 2. 通常通り描画コマンドを実行する
Paint p = new Paint().setColor(0xFF4285F4);
recordingCanvas.drawCircle(250, 250, 100, p);
// ... さらに描画 ...

// 3. 記録を停止し、Picture オブジェクトを取得する
Picture picture = recorder.finishRecordingAsPicture();
```

## PictureRecorder API

`PictureRecorder` は、コマンドをキャプチャするために使用されるステートフルなオブジェクトです。

- `beginRecording(bounds)`: 記録を開始します。描画できる `Canvas` を返します。このキャンバスに送信されたすべての描画コマンドは保存されます。
- `getRecordingCanvas()`: アクティブな記録用キャンバスを返します。記録中でない場合は `null` を返します。
- `finishRecordingAsPicture()`: 記録を終了し、不変の `Picture` オブジェクトを返します。記録用キャンバスは無効化されます。
- `finishRecordingAsPicture(cullRect)`: 記録を終了しますが、ピクチャーに保存されるカリング矩形を上書きします。

## ピクチャーの作成（シリアライゼーション）

- `makePlaceholder(cullRect)`: 特定の境界を持つが何も描画しないプレースホルダーピクチャーを作成します。
- `makeFromData(data)`: `Data` オブジェクト（`serializeToData` で作成）からピクチャーをデシリアライズします。

## ピクチャーの描画

`Picture` オブジェクトを取得したら、それを他の任意の `Canvas` に描画できます。

```java
canvas.drawPicture(picture);
```

## Picture を使用する理由

1.  **パフォーマンス:** 1,000 個の描画呼び出しがある場合、Java はフレームごとにネイティブコードを 1,000 回呼び出す必要があります。それらを `Picture` に記録すると、フレームごとに**たった1回**のネイティブ呼び出しになります。
2.  **スレッドセーフ:** `Canvas` はスレッドに紐づいていますが、`Picture` は不変であり、任意のスレッドから描画できます（ただし通常はメインのレンダリングスレッドで描画します）。
3.  **テッセレーションキャッシング:** Skia は、個々の呼び出しよりも、`Picture` 内の複雑なジオメトリ（パスなど）をより効果的にキャッシュできます。

## ベストプラクティスと落とし穴

- **すべてを記録しないでください:** コンテンツが毎フレーム変化する場合（移動するキャラクターなど）、新しい `Picture` を毎回記録すると、レコーダーのオーバーヘッドにより、実際には*遅くなる*可能性があります。
- **Canvas の寿命:** `beginRecording()` から取得した `Canvas` は、`finishRecordingAsPicture()` を呼び出すまでしか有効ではありません。その参照を保持しようとしないでください！
- **メモリ:** ピクチャーはネイティブメモリを消費します。多くの小さなピクチャーを作成する場合は、不要になったときに `close()` することを忘れないでください。