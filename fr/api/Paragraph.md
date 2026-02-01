# Référence API : Paragraphe (Mise en Page de Texte Enrichi)

Pour tout texte nécessitant plus d'une seule ligne ou plusieurs styles (par exemple, un mot en **gras** suivi d'un mot en *italique*), Skija fournit l'API **Paragraph**. Elle gère des tâches de mise en page complexes comme le retour à la ligne, la prise en charge RTL et le texte multi-script.

## Les Trois Piliers des Paragraphes

La création d'un paragraphe implique trois étapes principales :
1.  **`FontCollection`** : Définit d'où le paragraphe obtient ses polices.
2.  **`ParagraphStyle`** : Définit les paramètres globaux (alignement, nombre maximum de lignes, points de suspension).
3.  **`ParagraphBuilder`** : "Assemble" le texte et les styles.

## 1. Configuration de la FontCollection

La `FontCollection` est le gestionnaire de polices pour vos paragraphes. Vous devez lui indiquer quel `FontMgr` utiliser.

```java
FontCollection fc = new FontCollection();
fc.setDefaultFontManager(FontMgr.getDefault());
```

## 2. Style Global (ParagraphStyle)

Cela définit le comportement de l'ensemble du bloc de texte.

```java
ParagraphStyle style = new ParagraphStyle();
style.setAlignment(Alignment.CENTER);
style.setMaxLinesCount(3);
style.setEllipsis("..."); // S'affiche si le texte est trop long
```

## 3. Assemblage du Texte Enrichi (ParagraphBuilder)

Le `ParagraphBuilder` utilise une approche de style basée sur une pile. Vous "poussez" un style, ajoutez du texte, et le "dépilez" pour revenir au style précédent.

```java
ParagraphBuilder builder = new ParagraphBuilder(style, fc);

// Ajouter du texte par défaut
builder.pushStyle(new TextStyle().setColor(0xFF000000).setFontSize(16f));
builder.addText("Skija est ");

// Ajouter du texte en gras
builder.pushStyle(new TextStyle().setColor(0xFF4285F4).setFontWeight(FontWeight.BOLD));
builder.addText("Puissant");
builder.popStyle(); // Retour au style par défaut (noir, 16pt)

builder.addText(" et facile à utiliser.");
```

## 4. Mise en Page et Rendu

Un `Paragraph` doit être "mis en page" (mesuré et organisé avec retours à la ligne) avant de pouvoir être dessiné. Cela nécessite une largeur spécifique.

```java
Paragraph p = builder.build();

// Mettre en page le texte pour qu'il tienne dans 300 pixels
p.layout(300);

// Le dessiner à la position (x, y)
p.paint(canvas, 20, 20);
```

## Méthodes Essentielles

- `p.getHeight()` : Obtenir la hauteur totale du texte mis en page.
- `p.getLongestLine()` : Obtenir la largeur de la ligne la plus longue.
- `p.getLineNumber()` : Le nombre de lignes dans lesquelles le texte a été réparti.
- `p.getRectsForRange(...)` : Obtenir les boîtes englobantes pour une sélection (utile pour la surbrillance de texte).

## Performance et Bonnes Pratiques

1.  **Réutilisez la FontCollection :** Vous n'avez généralement besoin que d'une seule `FontCollection` pour toute votre application.
2.  **La mise en page est l'étape coûteuse :** `p.layout()` est la partie la plus coûteuse car elle implique de mesurer chaque glyphe et de calculer les sauts de ligne. Si votre texte ne change pas et que la largeur est la même, ne le rappelez pas.
3.  **Métriques de texte :** Utilisez `p.getLineMetrics()` si vous avez besoin d'informations détaillées sur la position et la hauteur de chaque ligne pour des mises en page d'interface utilisateur avancées.
4.  **Espaces réservés :** Vous pouvez utiliser `builder.addPlaceholder()` pour laisser de l'espace pour des images en ligne ou des widgets d'interface utilisateur dans le flux du texte.