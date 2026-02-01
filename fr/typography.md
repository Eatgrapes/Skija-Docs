# Typographie et Texte

Le texte est l'un des aspects les plus complexes de toute bibliothèque graphique. Skija fournit une API de haut niveau pour gérer tout, des étiquettes simples à la mise en page de texte multi-lignes complexe.

## La Police de Caractères (Le "Quoi")

Une `Typeface` représente un fichier de police spécifique (comme "Inter-Bold.ttf"). Elle définit la forme des glyphes.

### Chargement des Polices de Caractères
Vous pouvez les charger depuis des fichiers, des ressources ou le gestionnaire de polices système.

```java
// Depuis un fichier
Typeface inter = Typeface.makeFromFile("fonts/Inter.ttf");

// Depuis le système (méthode sûre)
Typeface sans = FontMgr.getDefault().matchFamilyStyle("sans-serif", FontStyle.NORMAL);
```

**Piège courant :** Ne supposez pas qu'une police existe sur le système de l'utilisateur. Fournissez toujours une police de secours ou incluez vos polices en tant que ressources.

## La Police (Le "Comment")

Une `Font` prend une `Typeface` et lui donne une taille et d'autres attributs de rendu.

```java
Font font = new Font(inter, 14f);
```

### Positionnement du Texte : Métriques de Police

Si vous voulez centrer du texte ou l'aligner avec précision, vous devez comprendre les `FontMetrics`.

```java
FontMetrics metrics = font.getMetrics();
// metrics.getAscent()  -> Distance de la ligne de base vers le haut (négative)
// metrics.getDescent() -> Distance de la ligne de base vers le bas (positive)
// metrics.getLeading() -> Espace suggéré entre les lignes
```

**Exemple : Centrage Vertical Parfait**
Pour centrer verticalement du texte à la position `y`, vous voulez généralement le décaler de la moitié de la hauteur de la "hauteur de capitale" (hauteur des lettres majuscules).

```java
float centerY = rect.getMidY() - metrics.getCapHeight() / 2f;
canvas.drawString("HELLO", rect.getLeft(), centerY, font, paint);
```

## Texte Avancé : Paragraphe

Pour tout ce qui est plus complexe qu'un mot ou une ligne unique, utilisez l'API **Paragraph**. Elle gère :
- Le retour à la ligne
- Multiples styles (gras, italique, couleurs) dans un même bloc
- Texte de droite à gauche (RTL)
- Support des émojis

Voir [**Référence de l'API Paragraph**](api/Paragraph.md) pour plus de détails.

## Texte Interactif : TextLine

Si vous avez besoin d'une seule ligne de texte mais devez savoir exactement où se trouve chaque caractère (par exemple, pour un curseur ou une sélection dans un champ de saisie), utilisez `TextLine`.

```java
TextLine line = TextLine.make("Interact with me", font);

// Obtenir les propriétés visuelles
float width = line.getWidth();
float height = line.getHeight();

// Test de position : Obtenir l'index du caractère à une coordonnée en pixels
int charIndex = line.getOffsetAtCoord(45.0f);

// Obtenir la coordonnée en pixels pour un index de caractère
float xCoord = line.getCoordAtOffset(5);

// Rendu
canvas.drawTextLine(line, 20, 50, paint);
```

### Exemples Visuels

**Ligne de Texte Interactive :**
Voir [`examples/scenes/src/TextLineScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextLineScene.java) pour une démonstration du positionnement du curseur, du test de position et de la mise en page de texte multi-script.

**Effets de Blob de Texte :**
Voir [`examples/scenes/src/TextBlobScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextBlobScene.java) pour des exemples de texte sur chemin, texte ondulé et positionnement personnalisé.

## Bonnes Pratiques

1.  **Mettez en cache vos Fonts/Typefaces :** Créer une `Typeface` implique l'analyse d'un fichier et peut être lent. Gardez-les dans un cache statique ou un gestionnaire de thème.
2.  **Utilisez l'anticrénelage :** Pour du petit texte à l'écran, assurez-vous que l'anticrénelage est activé dans votre `Paint` pour garder le texte lisible.
3.  **Mesurez avant de Dessiner :** Utilisez `font.measureTextWidth(string)` pour calculer les mises en page avant de les dessiner réellement sur le canevas.