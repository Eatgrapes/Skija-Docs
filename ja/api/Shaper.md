# APIリファレンス: Shaper (テキストシェーピング)

`Shaper`クラスは、**テキストシェーピング**（文字列をフォントの位置指定されたグリフの集合に変換する処理）を担当します。

## 概要

テキストシェーピングは以下のために必要です:
- **合字**: "f" + "i" を単一の "fi" グリフに変換。
- **カーニング**: 特定の文字ペア（"AV"など）間のスペース調整。
- **複雑なスクリプト**: 隣接する文字に基づいてグリフ形状が変化するアラビア語、デーヴァナーガリー、タイ語などの処理。
- **双方向テキスト**: 左から右（ラテン文字）と右から左（アラビア語/ヘブライ語）が混在するテキストの処理。

## 基本的なシェーピング

描画可能な`TextBlob`（位置指定されたグリフの集合）を単純に取得するには、`shape()`メソッドを使用します。

```java
try (Shaper shaper = Shaper.make()) {
    Font font = new Font(typeface, 24);
    
    // 単純なシェーピング（幅制限なし）
    TextBlob blob = shaper.shape("Hello, Skija!", font);
    
    canvas.drawTextBlob(blob, 20, 50, paint);
}
```

## 折り返しと複数行シェーピング

`Shaper`は最大幅に基づいて改行を計算することもできます。

```java
float maxWidth = 300f;
TextBlob multiLineBlob = shaper.shape(
    "This is a long sentence that will be wrapped by the shaper.",
    font,
    maxWidth
);

// 注: 結果のTextBlobには、互いに正しく配置されたすべての行が含まれます。
canvas.drawTextBlob(multiLineBlob, 20, 100, paint);
```

## シェーピングオプション

`ShapingOptions`を使用して、シェーピングの動作（テキスト方向など）を制御できます。

```java
ShapingOptions options = ShapingOptions.DEFAULT.withLeftToRight(false); // RTL
TextBlob blob = shaper.shape("مرحبا", font, options, Float.POSITIVE_INFINITY, Point.ZERO);
```

## 高度なシェーピング (RunHandler)

シェーピング処理を完全に制御する必要がある場合（独自のテキスト選択やカスタムマルチスタイルレイアウトを実装するためなど）、`RunHandler`を使用できます。

```java
shaper.shape(text, font, ShapingOptions.DEFAULT, maxWidth, new RunHandler() {
    @Override
    public void beginLine() { ... }

    @Override
    public void runInfo(RunInfo info) {
        // 現在のグリフ連続に関する情報を取得
        System.out.println("Glyph count: " + info.getGlyphCount());
    }

    @Override
    public void commitRunInfo() { ... }

    @Override
    public Point commitLine() { return Point.ZERO; }

    // ... その他のメソッド ...
});
```

## パフォーマンス

- **キャッシング**: テキストシェーピングは計算コストの高い操作です（HarfBuzzを伴います）。テキストが静的な場合は、一度シェーピングして結果の`TextBlob`を保存してください。
- **Shaperインスタンス**: `Shaper`の作成にはHarfBuzzの初期化が伴います。アプリケーション全体で1つの`Shaper`インスタンスを作成して再利用することを推奨します（一般的に再利用は安全ですが、複数スレッドを使用する場合はスレッド安全性を確認してください）。

## Shaper vs. Paragraph

- **`Shaper`を使用する場合**: 高性能な単一スタイルのテキストブロック、またはグリフへの低レベルアクセスが必要な場合。
- **[Paragraph](Paragraph.md)を使用する場合**: リッチテキスト（1ブロック内で異なる色/フォント）、複雑なUIレイアウト、標準的なテキストエディタの動作が必要な場合。