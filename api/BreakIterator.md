# API Reference: BreakIterator

The `BreakIterator` class is used to locate boundaries in text (characters, words, lines, sentences). It is essential for implementing text selection, cursor movement, and line wrapping logic if you are not using the high-level `Paragraph` API.

## Creation

Skija provides factory methods to create iterators for different boundary types. You can optionally specify a locale (e.g., "en-US", "ja-JP").

```java
// Word boundaries (for double-click selection)
BreakIterator words = BreakIterator.makeWordInstance();

// Sentence boundaries (for triple-click selection)
BreakIterator sentences = BreakIterator.makeSentenceInstance(Locale.GERMANY.toLanguageTag());

// Line boundaries (for line wrapping)
BreakIterator lines = BreakIterator.makeLineInstance();

// Character boundaries (for cursor movement, handling grapheme clusters)
BreakIterator chars = BreakIterator.makeCharacterInstance();
```

## Usage

1.  **Set Text**: Assign the text you want to analyze.
2.  **Iterate**: Use `next()`, `previous()`, `first()`, `last()` to navigate boundaries.

```java
String text = "Hello, world! 🌍";
BreakIterator iter = BreakIterator.makeWordInstance();
iter.setText(text);

int start = iter.first();
for (int end = iter.next(); end != BreakIterator.DONE; start = end, end = iter.next()) {
    // Check if this range is actually a word (and not whitespace/punctuation)
    if (iter.getRuleStatus() != BreakIterator.WORD_NONE) {
        String word = text.substring(start, end);
        System.out.println("Word: " + word);
    }
}
```

## Navigation Methods

- `first()`: Moves to the start of the text. Returns 0.
- `last()`: Moves to the end of the text. Returns string length.
- `next()`: Moves to the next boundary. Returns offset or `DONE`.
- `previous()`: Moves to the previous boundary. Returns offset or `DONE`.
- `following(offset)`: Moves to the first boundary *after* the given offset.
- `preceding(offset)`: Moves to the last boundary *before* the given offset.
- `isBoundary(offset)`: Returns true if the offset is a boundary.

## Rule Status

For word iterators, `getRuleStatus()` tells you what kind of "word" lies between the current and previous boundary.

- `WORD_NONE`: Whitespace, punctuation, or symbols.
- `WORD_NUMBER`: Digits.
- `WORD_LETTER`: Letters (non-CJK).
- `WORD_KANA`: Hiragana/Katakana.
- `WORD_IDEO`: CJK Ideographs.
