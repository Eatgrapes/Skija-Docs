# タイポグラフィとテキスト

テキストは、あらゆるグラフィックスライブラリにおいて最も複雑な部分の一つです。Skijaは、単純なラベルから複雑な複数行テキストレイアウトまで、あらゆるものを処理するための高レベルAPIを提供します。

## タイプフェース（「何を」描くか）

`Typeface`は、特定のフォントファイル（例: "Inter-Bold.ttf"）を表します。これはグリフの形状を定義します。

### タイプフェースの読み込み
ファイル、リソース、またはシステムフォントマネージャーから読み込むことができます。

```java
// ファイルから
Typeface inter = Typeface.makeFromFile("fonts/Inter.ttf");

// システムから（安全な方法）
Typeface sans = FontMgr.getDefault().matchFamilyStyle("sans-serif", FontStyle.NORMAL);
```

**よくある落とし穴:** ユーザーのシステムに特定のフォントが存在することを前提にしないでください。常にフォールバックを用意するか、フォントをリソースとしてバンドルしてください。

## フォント（「どのように」描くか）

`Font`は`Typeface`を受け取り、サイズやその他のレンダリング属性を与えます。

```java
Font font = new Font(inter, 14f);
```

### テキストの配置: フォントメトリクス

テキストを中央揃えしたり、正確に配置したい場合は、`FontMetrics`を理解する必要があります。

```java
FontMetrics metrics = font.getMetrics();
// metrics.getAscent()  -> ベースラインから上部までの距離（負の値）
// metrics.getDescent() -> ベースラインから下部までの距離（正の値）
// metrics.getLeading() -> 行間の推奨スペース
```

**例: 完璧な垂直方向の中央揃え**
テキストを垂直方向に`y`で中央揃えするには、通常「キャップハイト」（大文字の高さ）の半分だけオフセットする必要があります。

```java
float centerY = rect.getMidY() - metrics.getCapHeight() / 2f;
canvas.drawString("HELLO", rect.getLeft(), centerY, font, paint);
```

## 高度なテキスト: パラグラフ

単語や単一行よりも複雑なものには、**Paragraph** APIを使用してください。これは以下を処理します:
- 行の折り返し
- 1ブロック内の複数のスタイル（太字、斜体、色）
- 右から左への（RTL）テキスト
- 絵文字のサポート

詳細は[**Paragraph API リファレンス**](api/Paragraph.md)を参照してください。

## インタラクティブなテキスト: TextLine

単一行のテキストが必要だが、各文字が正確にどこにあるかを知る必要がある場合（例: テキスト入力でのカーソルや選択範囲）、`TextLine`を使用します。

```java
TextLine line = TextLine.make("Interact with me", font);

// 視覚的プロパティを取得
float width = line.getWidth();
float height = line.getHeight();

// ヒットテスト: ピクセル座標での文字インデックスを取得
int charIndex = line.getOffsetAtCoord(45.0f);

// 文字インデックスのピクセル座標を取得
float xCoord = line.getCoordAtOffset(5);

// レンダリング
canvas.drawTextLine(line, 20, 50, paint);
```

### 視覚的な例

**インタラクティブなテキスト行:**
カーソル位置、ヒットテスト、マルチスクリプトテキストレイアウトのデモについては、[`examples/scenes/src/TextLineScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextLineScene.java)を参照してください。

**テキストブロブエフェクト:**
パス上のテキスト、波状のテキスト、カスタム配置の例については、[`examples/scenes/src/TextBlobScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextBlobScene.java)を参照してください。

## ベストプラクティス

1.  **フォント/タイプフェースをキャッシュする:** `Typeface`の作成にはファイルの解析が含まれ、遅くなる可能性があります。静的キャッシュやテーママネージャーに保持してください。
2.  **ヒンティング/アンチエイリアシングを使用する:** 画面上の小さなテキストの場合、読みやすさを保つために`Paint`でアンチエイリアシングが有効になっていることを確認してください。
3.  **描画前に計測する:** キャンバスに実際に描画する前にレイアウトを計算するには、`font.measureTextWidth(string)`を使用してください。