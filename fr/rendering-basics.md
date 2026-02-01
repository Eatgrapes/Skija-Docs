# Principes de base du rendu

Ce guide couvre les concepts fondamentaux du rendu avec Skija, de la création d'une surface de dessin aux opérations de dessin de base.

## La Surface et le Canvas

Dans Skia (et Skija), tout dessin se produit sur un **Canvas**. Cependant, un Canvas a besoin d'une destination dans laquelle dessiner, fournie par une **Surface**.

### Rendu hors écran (Raster)

La manière la plus simple de commencer est de créer une surface raster (en mémoire). C'est idéal pour générer des images, le rendu côté serveur ou les tests.

```java
// Créer une surface de 100x100 pixels en utilisant le format de couleur N32 par défaut (généralement RGBA ou BGRA)
Surface surface = Surface.makeRasterN32Premul(100, 100);

// Obtenir le Canvas à partir de la surface
Canvas canvas = surface.getCanvas();
```

L'objet `Canvas` est votre interface principale pour le dessin. Il maintient l'état courant (transformations, découpage) et fournit les méthodes de dessin.

## Utilisation de Paint

Alors que le `Canvas` définit *où* et *quoi* dessiner, l'objet `Paint` définit *comment* le dessiner. Un objet `Paint` contient des informations sur les couleurs, les styles de trait, les modes de fusion et divers effets.

```java
Paint paint = new Paint();
paint.setColor(0xFFFF0000); // Rouge complètement opaque
```

### Travailler avec les couleurs

Les couleurs dans Skija sont représentées par des entiers 32 bits au format **ARGB** :
- `0x` suivi de `FF` (Alpha), `RR` (Rouge), `GG` (Vert), `BB` (Bleu).
- `0xFFFF0000` est Rouge Opaque.
- `0xFF00FF00` est Vert Opaque.
- `0xFF0000FF` est Bleu Opaque.
- `0x80000000` est Noir Semi-transparent.

## Opérations de dessin de base

Le `Canvas` fournit de nombreuses méthodes pour dessiner des primitives.

```java
// Dessiner un cercle à (50, 50) avec un rayon de 30
canvas.drawCircle(50, 50, 30, paint);

// Dessiner une ligne simple
canvas.drawLine(10, 10, 90, 90, paint);

// Dessiner un rectangle
canvas.drawRect(Rect.makeXYWH(10, 10, 80, 80), paint);
```

## Capture et sauvegarde du résultat

Après avoir dessiné sur une surface, on souhaite souvent sauvegarder le résultat sous forme de fichier image.

```java
// 1. Prendre un instantané du contenu actuel de la surface sous forme d'Image
Image image = surface.makeImageSnapshot();

// 2. Encoder l'image dans un format spécifique (par exemple, PNG)
Data pngData = image.encodeToData(EncodedImageFormat.PNG);

// 3. Convertir les données en ByteBuffer pour l'écriture
ByteBuffer pngBytes = pngData.toByteBuffer();

// 4. Écrire dans un fichier en utilisant les E/S Java standard
try {
    java.nio.file.Path path = java.nio.file.Path.of("output.png");
    Files.write(path, pngBytes.array());
} catch (IOException e) {
    e.printStackTrace();
}
```

### Lecture des pixels (Capture d'écran)

Si vous avez besoin des données brutes des pixels de la surface (par exemple, pour traitement ou inspection) sans les encoder dans un format d'image :

```java
// Créer un bitmap pour stocker le résultat
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Lire les pixels de la surface dans le bitmap
// Cela lit toute la surface si les tailles correspondent
surface.readPixels(bitmap, 0, 0);

// Pour une région spécifique (par exemple, une zone de 50x50 commençant à 10, 10)
Bitmap region = new Bitmap();
region.allocPixels(ImageInfo.makeN32Premul(50, 50));
surface.readPixels(region, 10, 10);
```

## API chaînée

De nombreux setters de Skija retournent `this`, permettant une API fluide de type builder :

```java
Paint strokePaint = new Paint()
    .setColor(0xFF1D7AA2)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(2f)
    .setAntiAlias(true);
```