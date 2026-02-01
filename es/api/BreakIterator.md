# Referencia de la API: BreakIterator

La clase `BreakIterator` se utiliza para localizar límites en texto (caracteres, palabras, líneas, oraciones). Es esencial para implementar la lógica de selección de texto, movimiento del cursor y ajuste de línea si no estás utilizando la API de alto nivel `Paragraph`.

## Creación

Skija proporciona métodos de fábrica para crear iteradores para diferentes tipos de límites. Opcionalmente, puedes especificar una configuración regional (locale) (por ejemplo, "en-US", "ja-JP").

```java
// Límites de palabra (para selección con doble clic)
BreakIterator words = BreakIterator.makeWordInstance();

// Límites de oración (para selección con triple clic)
BreakIterator sentences = BreakIterator.makeSentenceInstance(Locale.GERMANY.toLanguageTag());

// Límites de línea (para ajuste de línea)
BreakIterator lines = BreakIterator.makeLineInstance();

// Límites de carácter (para movimiento del cursor, manejo de clústeres de grafemas)
BreakIterator chars = BreakIterator.makeCharacterInstance();
```

## Uso

1.  **Establecer Texto**: Asigna el texto que quieres analizar.
2.  **Iterar**: Usa `next()`, `previous()`, `first()`, `last()` para navegar por los límites.

```java
String text = "Hello, world! 🌍";
BreakIterator iter = BreakIterator.makeWordInstance();
iter.setText(text);

int start = iter.first();
for (int end = iter.next(); end != BreakIterator.DONE; start = end, end = iter.next()) {
    // Verifica si este rango es realmente una palabra (y no espacios/puntuación)
    if (iter.getRuleStatus() != BreakIterator.WORD_NONE) {
        String word = text.substring(start, end);
        System.out.println("Word: " + word);
    }
}
```

## Métodos de Navegación

- `first()`: Se mueve al inicio del texto. Devuelve 0.
- `last()`: Se mueve al final del texto. Devuelve la longitud de la cadena.
- `next()`: Se mueve al siguiente límite. Devuelve el desplazamiento o `DONE`.
- `previous()`: Se mueve al límite anterior. Devuelve el desplazamiento o `DONE`.
- `following(offset)`: Se mueve al primer límite *después* del desplazamiento dado.
- `preceding(offset)`: Se mueve al último límite *antes* del desplazamiento dado.
- `isBoundary(offset)`: Devuelve verdadero si el desplazamiento es un límite.

## Estado de la Regla (Rule Status)

Para los iteradores de palabras, `getRuleStatus()` te indica qué tipo de "palabra" se encuentra entre el límite actual y el anterior.

- `WORD_NONE`: Espacios en blanco, puntuación o símbolos.
- `WORD_NUMBER`: Dígitos.
- `WORD_LETTER`: Letras (no CJK).
- `WORD_KANA`: Hiragana/Katakana.
- `WORD_IDEO`: Ideogramas CJK.