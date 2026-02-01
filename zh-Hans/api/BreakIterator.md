# API 参考：BreakIterator

`BreakIterator` 类用于定位文本中的边界（字符、单词、行、句子）。如果你不使用高级的 `Paragraph` API，那么实现文本选择、光标移动和换行逻辑时，这个类至关重要。

## 创建

Skija 提供了工厂方法来创建不同边界类型的迭代器。你可以选择性地指定区域设置（例如 "en-US"、"ja-JP"）。

```java
// 单词边界（用于双击选择）
BreakIterator words = BreakIterator.makeWordInstance();

// 句子边界（用于三击选择）
BreakIterator sentences = BreakIterator.makeSentenceInstance(Locale.GERMANY.toLanguageTag());

// 行边界（用于换行）
BreakIterator lines = BreakIterator.makeLineInstance();

// 字符边界（用于光标移动，处理字素簇）
BreakIterator chars = BreakIterator.makeCharacterInstance();
```

## 使用方法

1.  **设置文本**：分配你想要分析的文本。
2.  **迭代**：使用 `next()`、`previous()`、`first()`、`last()` 来遍历边界。

```java
String text = "Hello, world! 🌍";
BreakIterator iter = BreakIterator.makeWordInstance();
iter.setText(text);

int start = iter.first();
for (int end = iter.next(); end != BreakIterator.DONE; start = end, end = iter.next()) {
    // 检查这个范围是否真的是一个单词（而不是空格/标点符号）
    if (iter.getRuleStatus() != BreakIterator.WORD_NONE) {
        String word = text.substring(start, end);
        System.out.println("Word: " + word);
    }
}
```

## 导航方法

- `first()`：移动到文本开头。返回 0。
- `last()`：移动到文本末尾。返回字符串长度。
- `next()`：移动到下一个边界。返回偏移量或 `DONE`。
- `previous()`：移动到上一个边界。返回偏移量或 `DONE`。
- `following(offset)`：移动到给定偏移量*之后*的第一个边界。
- `preceding(offset)`：移动到给定偏移量*之前*的最后一个边界。
- `isBoundary(offset)`：如果偏移量是一个边界，则返回 true。

## 规则状态

对于单词迭代器，`getRuleStatus()` 会告诉你当前边界和上一个边界之间是哪种类型的“单词”。

- `WORD_NONE`：空格、标点符号或符号。
- `WORD_NUMBER`：数字。
- `WORD_LETTER`：字母（非 CJK）。
- `WORD_KANA`：平假名/片假名。
- `WORD_IDEO`：CJK 表意文字。