# API リファレンス: 段落（リッチテキストレイアウト）

単一行以上のテキストや複数のスタイル（例：**太字**の単語の後に*斜体*の単語）が必要な場合、Skija は **Paragraph** API を提供します。これは、行の折り返し、RTL サポート、マルチスクリプトテキストなどの複雑なレイアウトタスクを処理します。

## 段落の三本柱

段落を作成するには、主に3つのステップがあります：
1.  **`FontCollection`**: 段落がフォントを取得する場所を定義します。
2.  **`ParagraphStyle`**: グローバル設定（配置、最大行数、省略記号）を定義します。
3.  **`ParagraphBuilder`**: テキストとスタイルを「組み立てる」ものです。

## 1. FontCollection の設定

`FontCollection` は、段落のフォントマネージャーです。使用する `FontMgr` を指定する必要があります。

```java
FontCollection fc = new FontCollection();
fc.setDefaultFontManager(FontMgr.getDefault());
```

## 2. グローバルスタイル設定 (ParagraphStyle)

これは、テキストブロック全体の動作を定義します。

```java
ParagraphStyle style = new ParagraphStyle();
style.setAlignment(Alignment.CENTER);
style.setMaxLinesCount(3);
style.setEllipsis("..."); // テキストが長すぎる場合に表示
```

## 3. リッチテキストの組み立て (ParagraphBuilder)

`ParagraphBuilder` はスタックベースのスタイリングアプローチを使用します。スタイルを「プッシュ」し、テキストを追加し、「ポップ」して前のスタイルに戻ります。

```java
ParagraphBuilder builder = new ParagraphBuilder(style, fc);

// デフォルトのテキストを追加
builder.pushStyle(new TextStyle().setColor(0xFF000000).setFontSize(16f));
builder.addText("Skija is ");

// 太字のテキストを追加
builder.pushStyle(new TextStyle().setColor(0xFF4285F4).setFontWeight(FontWeight.BOLD));
builder.addText("Powerful");
builder.popStyle(); // デフォルトの 16pt 黒色に戻る

builder.addText(" and easy to use.");
```

## 4. レイアウトとレンダリング

`Paragraph` は、描画する前に「レイアウト」（測定と折り返し）を行う必要があります。これには特定の幅が必要です。

```java
Paragraph p = builder.build();

// テキストを 300 ピクセル以内に収まるようにレイアウト
p.layout(300);

// (x, y) に描画
p.paint(canvas, 20, 20);
```

## 主要なメソッド

- `p.getHeight()`: レイアウトされたテキストの合計高さを取得します。
- `p.getLongestLine()`: 最長の行の幅を取得します。
- `p.getLineNumber()`: テキストが折り返された行数を取得します。
- `p.getRectsForRange(...)`: 選択範囲のバウンディングボックスを取得します（テキストのハイライト表示に便利）。

## パフォーマンスとベストプラクティス

1.  **FontCollection の再利用:** 通常、アプリ全体で1つの `FontCollection` だけが必要です。
2.  **レイアウトが重い処理:** `p.layout()` は、すべてのグリフを測定し、行の折り返しを計算するため、最も負荷の高い部分です。テキストが変更されず、幅が同じ場合は、再度呼び出さないでください。
3.  **テキストメトリクス:** 高度な UI レイアウトのために各行の位置と高さの詳細情報が必要な場合は、`p.getLineMetrics()` を使用します。
4.  **プレースホルダー:** `builder.addPlaceholder()` を使用して、テキストフロー内にインライン画像や UI ウィジェットのためのスペースを確保できます。