# Typographie avancée : Découpage et animation

Skija offre des outils puissants non seulement pour dessiner du texte statique, mais aussi pour utiliser le texte comme un objet géométrique pour le découpage, le masquage et l'animation.

## Texte comme masque (Découpage)

Pour utiliser du texte comme masque (par exemple, pour afficher une image *à l'intérieur* des lettres), vous ne pouvez pas simplement "découper selon le texte". Vous devez d'abord convertir le texte en un `Path`.

### 1. Obtenir le chemin à partir du texte
Utilisez `Font.getPath()` pour récupérer le contour géométrique de glyphes spécifiques.

```java
Font font = new Font(typeface, 100);
short[] glyphs = font.getStringGlyphs("MASK");

// Obtenir le chemin pour ces glyphes
// Note : getPaths retourne un tableau de chemins (un par glyphe)
// Vous voulez souvent les combiner ou simplement les dessiner séquentiellement
Point[] positions = font.getPositions(glyphs, new Point(50, 150)); // Positionner le texte

Path textPath = new Path();
for (int i = 0; i < glyphs.length; i++) {
    Path glyphPath = font.getPath(glyphs[i]);
    if (glyphPath != null) {
        // Décaler le chemin du glyphe à sa position et l'ajouter au chemin principal
        glyphPath.transform(Matrix33.makeTranslate(positions[i].getX(), positions[i].getY()));
        textPath.addPath(glyphPath);
    }
}
```

### 2. Découper le canevas
Une fois que vous avez le `Path`, vous pouvez découper le canevas.

```java
canvas.save();
canvas.clipPath(textPath);

// Maintenant, dessinez l'image (ou le dégradé, ou le motif)
// Elle n'apparaîtra qu'à l'intérieur des lettres "MASK"
canvas.drawImage(myImage, 0, 0);

canvas.restore();
```

## Animer du texte

Skija permet une animation de texte haute performance en vous donnant un accès de bas niveau au positionnement des glyphes via `TextBlob`.

### 1. Animation par glyphe (Texte ondulé)
Au lieu de dessiner une chaîne, vous calculez manuellement la position de chaque caractère.

```java
String text = "Texte ondulé";
short[] glyphs = font.getStringGlyphs(text);
float[] widths = font.getWidths(glyphs);

// Calculer les positions pour chaque glyphe
Point[] positions = new Point[glyphs.length];
float x = 50;
float time = (System.currentTimeMillis() % 1000) / 1000f; // 0.0 à 1.0

for (int i = 0; i < glyphs.length; i++) {
    // Animation en onde sinusoïdale
    float yOffset = (float) Math.sin((x / 50.0) + (time * Math.PI * 2)) * 10;
    
    positions[i] = new Point(x, 100 + yOffset);
    x += widths[i];
}

// Créer un TextBlob à partir de ces positions explicites
TextBlob blob = TextBlob.makeFromPos(glyphs, positions, font);

// Le dessiner
canvas.drawTextBlob(blob, 0, 0, paint);
```

### 2. Texte sur un chemin (RSXform)
Pour du texte qui suit une courbe (et tourne pour épouser la courbe), utilisez `RSXform` (Rotation Scale Translate Transform).

```java
// Voir 'TextBlob.makeFromRSXform' dans l'API
// Cela vous permet de spécifier une rotation et une position pour chaque glyphe indépendamment.
```

## Polices variables
Si vous avez une police variable (comme `Inter-Variable.ttf`), vous pouvez animer son poids ou son inclinaison de manière fluide.

```java
// 1. Créer une instance FontVariation
FontVariation weight = new FontVariation("wght", 400 + (float)Math.sin(time) * 300); // Poids de 100 à 700

// 2. Créer un Typeface spécifique à partir de la base variable
Typeface currentFace = variableTypeface.makeClone(weight);

// 3. Créer une police et dessiner
Font font = new Font(currentFace, 40);
canvas.drawString("Texte respirant", 50, 50, font, paint);
```

## Résumé

- **Découpage :** Convertir Texte -> Glyphes -> Path -> `canvas.clipPath()`.
- **Texte ondulé/en mouvement :** Calculer manuellement les positions `Point[]` et utiliser `TextBlob.makeFromPos()`.
- **Texte sur un chemin :** Utiliser `TextBlob.makeFromRSXform()`.
- **Animation du poids/style :** Utiliser des Polices Variables et `makeClone(FontVariation)`.