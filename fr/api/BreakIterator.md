# Référence API : BreakIterator

La classe `BreakIterator` est utilisée pour localiser les limites dans un texte (caractères, mots, lignes, phrases). Elle est essentielle pour implémenter la logique de sélection de texte, de déplacement du curseur et de retour à la ligne si vous n'utilisez pas l'API de haut niveau `Paragraph`.

## Création

Skija fournit des méthodes de fabrique pour créer des itérateurs pour différents types de limites. Vous pouvez éventuellement spécifier une locale (par exemple, "en-US", "ja-JP").

```java
// Limites de mots (pour la sélection par double-clic)
BreakIterator words = BreakIterator.makeWordInstance();

// Limites de phrases (pour la sélection par triple-clic)
BreakIterator sentences = BreakIterator.makeSentenceInstance(Locale.GERMANY.toLanguageTag());

// Limites de lignes (pour le retour à la ligne)
BreakIterator lines = BreakIterator.makeLineInstance();

// Limites de caractères (pour le déplacement du curseur, gestion des grappes de graphèmes)
BreakIterator chars = BreakIterator.makeCharacterInstance();
```

## Utilisation

1.  **Définir le texte** : Assignez le texte que vous souhaitez analyser.
2.  **Itérer** : Utilisez `next()`, `previous()`, `first()`, `last()` pour naviguer entre les limites.

```java
String text = "Hello, world! 🌍";
BreakIterator iter = BreakIterator.makeWordInstance();
iter.setText(text);

int start = iter.first();
for (int end = iter.next(); end != BreakIterator.DONE; start = end, end = iter.next()) {
    // Vérifier si cette plage est réellement un mot (et non un espace/ponctuation)
    if (iter.getRuleStatus() != BreakIterator.WORD_NONE) {
        String word = text.substring(start, end);
        System.out.println("Word: " + word);
    }
}
```

## Méthodes de navigation

- `first()` : Se déplace au début du texte. Retourne 0.
- `last()` : Se déplace à la fin du texte. Retourne la longueur de la chaîne.
- `next()` : Se déplace à la limite suivante. Retourne l'offset ou `DONE`.
- `previous()` : Se déplace à la limite précédente. Retourne l'offset ou `DONE`.
- `following(offset)` : Se déplace à la première limite *après* l'offset donné.
- `preceding(offset)` : Se déplace à la dernière limite *avant* l'offset donné.
- `isBoundary(offset)` : Retourne vrai si l'offset est une limite.

## Statut de règle

Pour les itérateurs de mots, `getRuleStatus()` indique le type de "mot" situé entre la limite actuelle et la précédente.

- `WORD_NONE` : Espace, ponctuation ou symbole.
- `WORD_NUMBER` : Chiffres.
- `WORD_LETTER` : Lettres (non-CJK).
- `WORD_KANA` : Hiragana/Katakana.
- `WORD_IDEO` : Idéogrammes CJK.