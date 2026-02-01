# API リファレンス: BreakIterator

`BreakIterator` クラスは、テキスト内の境界（文字、単語、行、文）を特定するために使用されます。高レベルの `Paragraph` API を使用しない場合、テキスト選択、カーソル移動、および行折り返しロジックを実装するために不可欠です。

## 作成

Skija は、異なる境界タイプのイテレータを作成するためのファクトリメソッドを提供します。オプションでロケール（例: "en-US", "ja-JP"）を指定できます。

```java
// 単語境界（ダブルクリック選択用）
BreakIterator words = BreakIterator.makeWordInstance();

// 文境界（トリプルクリック選択用）
BreakIterator sentences = BreakIterator.makeSentenceInstance(Locale.GERMANY.toLanguageTag());

// 行境界（行折り返し用）
BreakIterator lines = BreakIterator.makeLineInstance();

// 文字境界（カーソル移動、書記素クラスタの処理用）
BreakIterator chars = BreakIterator.makeCharacterInstance();
```

## 使用方法

1.  **テキストの設定**: 分析したいテキストを割り当てます。
2.  **反復処理**: `next()`, `previous()`, `first()`, `last()` を使用して境界間を移動します。

```java
String text = "Hello, world! 🌍";
BreakIterator iter = BreakIterator.makeWordInstance();
iter.setText(text);

int start = iter.first();
for (int end = iter.next(); end != BreakIterator.DONE; start = end, end = iter.next()) {
    // この範囲が実際に単語（空白や句読点ではない）かどうかを確認
    if (iter.getRuleStatus() != BreakIterator.WORD_NONE) {
        String word = text.substring(start, end);
        System.out.println("Word: " + word);
    }
}
```

## ナビゲーションメソッド

- `first()`: テキストの先頭に移動します。0 を返します。
- `last()`: テキストの末尾に移動します。文字列の長さを返します。
- `next()`: 次の境界に移動します。オフセットまたは `DONE` を返します。
- `previous()`: 前の境界に移動します。オフセットまたは `DONE` を返します。
- `following(offset)`: 指定されたオフセットの*後*にある最初の境界に移動します。
- `preceding(offset)`: 指定されたオフセットの*前*にある最後の境界に移動します。
- `isBoundary(offset)`: オフセットが境界である場合に true を返します。

## ルールステータス

単語イテレータの場合、`getRuleStatus()` は現在の境界と前の境界の間にどのような種類の「単語」があるかを示します。

- `WORD_NONE`: 空白、句読点、または記号。
- `WORD_NUMBER`: 数字。
- `WORD_LETTER`: 文字（非 CJK）。
- `WORD_KANA`: ひらがな/カタカナ。
- `WORD_IDEO`: CJK 表意文字。