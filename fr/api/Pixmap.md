# Référence API : Pixmap

La classe `Pixmap` représente une image raster en mémoire. Elle fournit un accès direct aux données de pixels et des méthodes pour lire, écrire et manipuler les pixels.

## Aperçu

Un `Pixmap` associe `ImageInfo` (largeur, hauteur, type de couleur, type alpha, espace colorimétrique) avec les données de pixels réelles en mémoire. Contrairement à `Image`, `Pixmap` permet un accès direct au tampon de pixels.

## Création

- `make(info, buffer, rowBytes)` : Crée un `Pixmap` encapsulant le `ByteBuffer` fourni.
- `make(info, addr, rowBytes)` : Crée un `Pixmap` encapsulant l'adresse mémoire native fournie.

## Gestion des données

- `reset()` : Efface le `Pixmap` pour le mettre dans un état nul.
- `reset(info, buffer, rowBytes)` : Réinitialise le `Pixmap` pour encapsuler le nouveau tampon fourni.
- `setColorSpace(colorSpace)` : Met à jour l'espace colorimétrique du `Pixmap`.
- `extractSubset(subsetPtr, area)` : Extrait un sous-ensemble du `Pixmap` dans la mémoire pointée par `subsetPtr`.
- `extractSubset(buffer, area)` : Extrait un sous-ensemble du `Pixmap` dans le `ByteBuffer` fourni.

## Propriétés

- `getInfo()` : Retourne l'`ImageInfo` décrivant le `Pixmap` (largeur, hauteur, type de couleur, etc.).
- `getRowBytes()` : Retourne le nombre d'octets par ligne.
- `getAddr()` : Retourne l'adresse native des données de pixels.
- `getRowBytesAsPixels()` : Retourne le nombre de pixels par ligne (uniquement pour certains types de couleur).
- `computeByteSize()` : Calcule la taille totale en octets des données de pixels.
- `computeIsOpaque()` : Retourne vrai si le `Pixmap` est opaque.
- `getBuffer()` : Retourne un `ByteBuffer` encapsulant les données de pixels.

## Accès aux pixels

### Accès à un pixel unique

- `getColor(x, y)` : Retourne la couleur du pixel à `(x, y)` sous forme d'entier (ARGB).
- `getColor4f(x, y)` : Retourne la couleur du pixel à `(x, y)` sous forme de `Color4f`.
- `getAlphaF(x, y)` : Retourne la composante alpha du pixel à `(x, y)` sous forme de flottant.
- `getAddr(x, y)` : Retourne l'adresse native du pixel à `(x, y)`.

### Opérations sur des pixels en masse

- `readPixels(info, addr, rowBytes)` : Copie les pixels du `Pixmap` vers la mémoire de destination.
- `readPixels(pixmap)` : Copie les pixels vers un autre `Pixmap`.
- `scalePixels(dstPixmap, samplingMode)` : Redimensionne les pixels pour s'adapter au `Pixmap` de destination en utilisant le mode d'échantillonnage spécifié.
- `erase(color)` : Remplit l'intégralité du `Pixmap` avec la couleur spécifiée.
- `erase(color, subset)` : Remplit une zone spécifique du `Pixmap` avec la couleur spécifiée.

## Exemple

### Modification de pixels

```java
// Créer un nouveau Pixmap N32 (RGBA/BGRA standard)
try (var pixmap = new Pixmap()) {
    // Allouer de la mémoire pour 100x100 pixels
    pixmap.reset(ImageInfo.makeN32Premul(100, 100), Unpooled.malloc(100 * 100 * 4), 100 * 4);
    
    // Remplir avec du blanc
    pixmap.erase(0xFFFFFFFF);

    // Définir un pixel en rouge à (10, 10)
    // Note : La manipulation directe des octets peut être plus rapide pour les opérations en masse,
    // mais les API erase/readPixels sont plus simples.
    // L'API Pixmap de Skija n'expose pas de setPixel(x,y,color) simple pour des raisons de performance
    // dans l'API managée, mais vous pouvez écrire directement dans le ByteBuffer.
    ByteBuffer buffer = pixmap.getBuffer();
    int offset = (10 * 100 + 10) * 4; // y * width + x * bpp
    buffer.putInt(offset, 0xFFFF0000); // ARGB (Rouge)
    
    // Créer une image à partir de ce pixmap pour la dessiner
    try (var image = Image.makeFromRaster(pixmap)) {
        canvas.drawImage(image, 0, 0);
    }
}
```

### Lecture de pixels

```java
// En supposant que vous avez un Pixmap 'pixmap'
int width = pixmap.getInfo().getWidth();
int height = pixmap.getInfo().getHeight();

// Obtenir la couleur à des coordonnées spécifiques
int color = pixmap.getColor(50, 50);
System.out.println("Couleur à 50,50: " + Integer.toHexString(color));

// Parcourir tous les pixels (attention aux performances en Java !)
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        if (pixmap.getAlphaF(x, y) > 0.5f) {
            // Trouvé un pixel non transparent
        }
    }
}
```