# Référence API : TextBlob & Builder

Un `TextBlob` est une représentation immuable et optimisée d'un ensemble de glyphes. C'est la manière la plus rapide de dessiner du texte dans Skija si la mise en page du texte (position des glyphes) ne change pas.

## TextBlob

`TextBlob` combine des glyphes, leurs positions et des polices en un seul objet qui peut être réutilisé.

### Propriétés
- `getBounds()` : Retourne le rectangle englobant conservateur du blob.
- `getUniqueId()` : Retourne un identifiant unique pour la mise en cache.
- `serializeToData()` : Sérialise le blob en un objet `Data`.

### Création à partir de positions
Si vous avez déjà calculé les positions des glyphes (par exemple en utilisant `Shaper` ou manuellement), vous pouvez créer un blob directement.

```java
// Positions horizontales uniquement (y est constant)
TextBlob blob = TextBlob.makeFromPosH(glyphs, xPositions, y, font);

// Positions complètes (x, y) pour chaque glyphe
TextBlob blob2 = TextBlob.makeFromPos(glyphs, points, font);

// RSXform (Rotation + Échelle + Translation) pour chaque glyphe
TextBlob blob3 = TextBlob.makeFromRSXform(glyphs, xforms, font);
```

### Dessin
```java
canvas.drawTextBlob(blob, x, y, paint);
```

---

## TextBlobBuilder

`TextBlobBuilder` permet de construire un `TextBlob` en ajoutant plusieurs "séquences" de texte. Une "séquence" est une suite de glyphes qui partagent la même Police (`Font`) et Peinture (`Paint`).

### Utilisation de base

```java
TextBlobBuilder builder = new TextBlobBuilder();

// Ajouter une séquence de texte
builder.appendRun(font, "Hello ", 0, 0);

// Ajouter une autre séquence (par exemple, style ou position différent)
builder.appendRun(boldFont, "World!", 100, 0);

// Construire le TextBlob immuable
TextBlob blob = builder.build();
```

### Ajout avancé
- `appendRun(font, glyphs, x, y, bounds)` : Ajoute des glyphes avec une origine partagée.
- `appendRunPosH(...)` : Ajoute des glyphes avec des positions X explicites.
- `appendRunPos(...)` : Ajoute des glyphes avec des positions (X, Y) explicites.
- `appendRunRSXform(...)` : Ajoute des glyphes avec des transformations affines complètes (rotation/échelle).

### Conseil de performance
Si vous dessinez le même paragraphe de texte plusieurs fois (même si le canevas se déplace), créez un `TextBlob` une fois et réutilisez-le. Cela évite de recalculer les positions et les formes des glyphes.