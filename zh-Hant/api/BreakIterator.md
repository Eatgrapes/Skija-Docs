# API 參考：BreakIterator

`BreakIterator` 類別用於定位文字中的邊界（字元、單詞、行、句子）。如果你不使用高階的 `Paragraph` API，它對於實作文字選取、游標移動和換行邏輯至關重要。

## 建立

Skija 提供了工廠方法來建立不同邊界類型的迭代器。你可以選擇性地指定語言環境（例如 "en-US"、"ja-JP"）。

```java
// 單詞邊界（用於雙擊選取）
BreakIterator words = BreakIterator.makeWordInstance();

// 句子邊界（用於三擊選取）
BreakIterator sentences = BreakIterator.makeSentenceInstance(Locale.GERMANY.toLanguageTag());

// 行邊界（用於換行）
BreakIterator lines = BreakIterator.makeLineInstance();

// 字元邊界（用於游標移動，處理字素叢集）
BreakIterator chars = BreakIterator.makeCharacterInstance();
```

## 使用方式

1.  **設定文字**：指派你想要分析的文字。
2.  **迭代**：使用 `next()`、`previous()`、`first()`、`last()` 來導航邊界。

```java
String text = "Hello, world! 🌍";
BreakIterator iter = BreakIterator.makeWordInstance();
iter.setText(text);

int start = iter.first();
for (int end = iter.next(); end != BreakIterator.DONE; start = end, end = iter.next()) {
    // 檢查此範圍是否實際為單詞（而非空白/標點符號）
    if (iter.getRuleStatus() != BreakIterator.WORD_NONE) {
        String word = text.substring(start, end);
        System.out.println("Word: " + word);
    }
}
```

## 導航方法

- `first()`：移動到文字開頭。返回 0。
- `last()`：移動到文字結尾。返回字串長度。
- `next()`：移動到下一個邊界。返回偏移量或 `DONE`。
- `previous()`：移動到上一個邊界。返回偏移量或 `DONE`。
- `following(offset)`：移動到給定偏移量*之後*的第一個邊界。
- `preceding(offset)`：移動到給定偏移量*之前*的最後一個邊界。
- `isBoundary(offset)`：如果偏移量是邊界則返回 true。

## 規則狀態

對於單詞迭代器，`getRuleStatus()` 會告訴你當前邊界與上一個邊界之間是什麼類型的「單詞」。

- `WORD_NONE`：空白、標點符號或符號。
- `WORD_NUMBER`：數字。
- `WORD_LETTER`：字母（非 CJK）。
- `WORD_KANA`：平假名/片假名。
- `WORD_IDEO`：CJK 表意文字。