# Référence API : Shaper (Façonnage de texte)

La classe `Shaper` est responsable du **Façonnage de texte** : le processus de conversion d'une chaîne de caractères Unicode en un ensemble de glyphes positionnés provenant d'une police.

## Vue d'ensemble

Le façonnage de texte est nécessaire pour :
- **Les ligatures** : Convertir "f" + "i" en un seul glyphe "fi".
- **Le crénage** : Ajuster l'espace entre des paires de caractères spécifiques (comme "AV").
- **Les scripts complexes** : Gérer l'arabe, le devanagari ou le thaï, où la forme des glyphes change en fonction de leurs voisins.
- **Le BiDi** : Gérer le texte mixte Gauche-à-Droite (latin) et Droite-à-Gauche (arabe/hébreu).

## Façonnage de base

Pour obtenir simplement un `TextBlob` (un ensemble de glyphes positionnés) que vous pouvez dessiner, utilisez la méthode `shape()`.

```java
try (Shaper shaper = Shaper.make()) {
    Font font = new Font(typeface, 24);
    
    // Façonnage simple (pas de limite de largeur)
    TextBlob blob = shaper.shape("Hello, Skija!", font);
    
    canvas.drawTextBlob(blob, 20, 50, paint);
}
```

## Retour à la ligne et façonnage multi-lignes

`Shaper` peut également calculer les sauts de ligne en fonction d'une largeur maximale.

```java
float maxWidth = 300f;
TextBlob multiLineBlob = shaper.shape(
    "This is a long sentence that will be wrapped by the shaper.",
    font,
    maxWidth
);

// Note : Le TextBlob résultant contient toutes les lignes positionnées correctement les unes par rapport aux autres.
canvas.drawTextBlob(multiLineBlob, 20, 100, paint);
```

## Options de façonnage

Vous pouvez contrôler le comportement du façonnage (par exemple, la direction du texte) en utilisant `ShapingOptions`.

```java
ShapingOptions options = ShapingOptions.DEFAULT.withLeftToRight(false); // RTL
TextBlob blob = shaper.shape("مرحبا", font, options, Float.POSITIVE_INFINITY, Point.ZERO);
```

## Façonnage avancé (RunHandler)

Si vous avez besoin d'un contrôle total sur le processus de façonnage (par exemple, pour implémenter votre propre sélection de texte ou une mise en page multi-style personnalisée), vous pouvez utiliser un `RunHandler`.

```java
shaper.shape(text, font, ShapingOptions.DEFAULT, maxWidth, new RunHandler() {
    @Override
    public void beginLine() { ... }

    @Override
    public void runInfo(RunInfo info) {
        // Obtenir des informations sur la séquence actuelle de glyphes
        System.out.println("Glyph count: " + info.getGlyphCount());
    }

    @Override
    public void commitRunInfo() { ... }

    @Override
    public Point commitLine() { return Point.ZERO; }

    // ... plus de méthodes ...
});
```

## Performance

- **Mise en cache** : Le façonnage de texte est une opération coûteuse en calcul (impliquant HarfBuzz). Si votre texte est statique, façonnez-le une fois et stockez le `TextBlob` résultant.
- **Instance Shaper** : Créer un `Shaper` implique l'initialisation de HarfBuzz. Il est recommandé de créer une instance de `Shaper` et de la réutiliser dans toute votre application (il est généralement sûr de la réutiliser, mais vérifiez la sécurité des threads si vous utilisez plusieurs threads).

## Shaper vs. Paragraph

- **Utilisez `Shaper`** pour des blocs de texte à haute performance, à style unique, ou lorsque vous avez besoin d'un accès de bas niveau aux glyphes.
- **Utilisez [Paragraph](Paragraph.md)** pour du texte enrichi (couleurs/polices différentes dans un même bloc), des mises en page d'interface utilisateur complexes et un comportement standard d'éditeur de texte.