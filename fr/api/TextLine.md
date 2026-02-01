# Référence API : TextLine

`TextLine` représente une seule ligne de texte mis en forme. Elle est généralement créée par le `Shaper` et fournit des informations métriques ainsi que des capacités de test de clic, essentielles pour créer des éditeurs de texte ou des étiquettes interactives.

## Création

```java
// Mettre en forme une seule ligne de texte
TextLine line = TextLine.make("Hello World", font);
```

## Métriques

- `getAscent()` : Distance entre la ligne de base et le sommet du glyphe le plus haut (négative).
- `getDescent()` : Distance entre la ligne de base et le bas du glyphe le plus bas (positive).
- `getCapHeight()` : Hauteur des lettres majuscules.
- `getXHeight()` : Hauteur du 'x' minuscule.
- `getWidth()` : Largeur totale d'avance de la ligne.
- `getHeight()` : Hauteur totale (descent - ascent).

## Test de clic (Interaction)

`TextLine` fournit des méthodes pour faire correspondre les coordonnées en pixels et les décalages de caractères.

```java
// 1. Obtenir le décalage à partir d'une coordonnée (Clic)
float x = mouseEvent.getX();
int offset = line.getOffsetAtCoord(x); // Retourne l'index du caractère UTF-16
// 'offset' sera le plus proche du curseur de la souris

// 2. Obtenir la coordonnée à partir d'un décalage (Placement du curseur)
float cursorX = line.getCoordAtOffset(offset);
// Dessiner un curseur à (cursorX, baseline)
```

- `getOffsetAtCoord(x)` : Décalage du caractère le plus proche.
- `getLeftOffsetAtCoord(x)` : Décalage du caractère strictement à gauche.
- `getCoordAtOffset(offset)` : Coordonnée X en pixels pour un index de caractère donné.

## Rendu

```java
// Vous pouvez dessiner la ligne directement
canvas.drawTextLine(line, x, y, paint);

// Ou extraire le TextBlob pour un contrôle plus manuel
try (TextBlob blob = line.getTextBlob()) {
    canvas.drawTextBlob(blob, x, y, paint);
}
```

## Cycle de vie
`TextLine` implémente `Managed`. Toujours la fermer lorsque vous avez terminé pour libérer les ressources natives.

```java
try (TextLine line = TextLine.make(text, font)) {
    // ... utiliser line ...
}
```