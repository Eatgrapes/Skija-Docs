# API-Referenz: BreakIterator

Die Klasse `BreakIterator` wird verwendet, um Grenzen in Text (Zeichen, Wörter, Zeilen, Sätze) zu lokalisieren. Sie ist wesentlich für die Implementierung von Textauswahl, Cursor-Bewegung und Zeilenumbruch-Logik, wenn Sie nicht die High-Level-`Paragraph`-API verwenden.

## Erstellung

Skija bietet Factory-Methoden, um Iteratoren für verschiedene Grenztypen zu erstellen. Optional können Sie ein Gebietsschema angeben (z.B. "en-US", "ja-JP").

```java
// Wortgrenzen (für Doppelklick-Auswahl)
BreakIterator words = BreakIterator.makeWordInstance();

// Satzgrenzen (für Dreifachklick-Auswahl)
BreakIterator sentences = BreakIterator.makeSentenceInstance(Locale.GERMANY.toLanguageTag());

// Zeilengrenzen (für Zeilenumbruch)
BreakIterator lines = BreakIterator.makeLineInstance();

// Zeichengrenzen (für Cursor-Bewegung, Behandlung von Graphem-Clustern)
BreakIterator chars = BreakIterator.makeCharacterInstance();
```

## Verwendung

1.  **Text setzen**: Weisen Sie den zu analysierenden Text zu.
2.  **Iterieren**: Verwenden Sie `next()`, `previous()`, `first()`, `last()`, um Grenzen zu navigieren.

```java
String text = "Hello, world! 🌍";
BreakIterator iter = BreakIterator.makeWordInstance();
iter.setText(text);

int start = iter.first();
for (int end = iter.next(); end != BreakIterator.DONE; start = end, end = iter.next()) {
    // Prüfen, ob dieser Bereich tatsächlich ein Wort ist (und kein Leerzeichen/Satzzeichen)
    if (iter.getRuleStatus() != BreakIterator.WORD_NONE) {
        String word = text.substring(start, end);
        System.out.println("Word: " + word);
    }
}
```

## Navigationsmethoden

- `first()`: Bewegt sich zum Anfang des Textes. Gibt 0 zurück.
- `last()`: Bewegt sich zum Ende des Textes. Gibt die String-Länge zurück.
- `next()`: Bewegt sich zur nächsten Grenze. Gibt Offset oder `DONE` zurück.
- `previous()`: Bewegt sich zur vorherigen Grenze. Gibt Offset oder `DONE` zurück.
- `following(offset)`: Bewegt sich zur ersten Grenze *nach* dem gegebenen Offset.
- `preceding(offset)`: Bewegt sich zur letzten Grenze *vor* dem gegebenen Offset.
- `isBoundary(offset)`: Gibt true zurück, wenn der Offset eine Grenze ist.

## Regelstatus

Für Wort-Iteratoren gibt `getRuleStatus()` an, welche Art von "Wort" zwischen der aktuellen und der vorherigen Grenze liegt.

- `WORD_NONE`: Leerzeichen, Satzzeichen oder Symbole.
- `WORD_NUMBER`: Ziffern.
- `WORD_LETTER`: Buchstaben (nicht-CJK).
- `WORD_KANA`: Hiragana/Katakana.
- `WORD_IDEO`: CJK-Ideogramme.