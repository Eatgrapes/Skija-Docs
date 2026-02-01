# Images et Bitmaps

La manipulation d'images dans Skija implique deux classes principales : `Image` et `Bitmap`. Bien qu'elles semblent similaires, elles servent des objectifs différents.

## Image vs. Bitmap

- **`Image`** : Considérez-la comme une texture en lecture seule, potentiellement gérée par le GPU. Elle est optimisée pour être dessinée sur un canvas.
- **`Bitmap`** : Il s'agit d'un tableau mutable de pixels, côté CPU. Vous l'utilisez lorsque vous avez besoin de modifier les pixels individuellement de manière programmatique.

## Charger une Image

La manière la plus courante d'obtenir une image est de la charger à partir d'octets encodés (PNG, JPEG, etc.).

```java
byte[] bytes = Files.readAllBytes(Path.of("photo.jpg"));
Image img = Image.makeDeferredFromEncodedBytes(bytes);
```

**Astuce :** `makeDeferredFromEncodedBytes` est "paresseux" (lazy) — il ne décode pas les pixels avant la première fois que vous le dessinez réellement, ce qui économise de la mémoire et du temps lors du chargement initial.

### Créer à partir de Pixels (Raster)

Si vous avez des données de pixels brutes (par exemple, provenant d'une autre bibliothèque ou générées de manière procédurale) :

```java
// À partir d'un objet Data (encapsule la mémoire native ou un tableau d'octets)
Image img = Image.makeRasterFromData(
    ImageInfo.makeN32Premul(100, 100),
    data,
    rowBytes
);

// À partir d'un Bitmap (copie ou partage les pixels)
Image img = Image.makeRasterFromBitmap(bitmap);

// À partir d'un Pixmap (copie les pixels)
Image img = Image.makeRasterFromPixmap(pixmap);
```

## Encodage (Sauvegarde d'Images)

Pour sauvegarder une `Image` dans un fichier ou un flux, vous devez l'encoder. Skija fournit `EncoderJPEG`, `EncoderPNG` et `EncoderWEBP` pour un contrôle précis.

```java
// Encodage simple (paramètres par défaut)
Data pngData = EncoderPNG.encode(image);
Data jpgData = EncoderJPEG.encode(image); // Qualité par défaut 100

// Encodage avancé (avec options)
EncodeJPEGOptions jpgOpts = new EncodeJPEGOptions()
    .setQuality(80)
    .setAlphaMode(EncodeJPEGAlphaMode.IGNORE);

Data compressed = EncoderJPEG.encode(image, jpgOpts);

// Encodage WebP
EncodeWEBPOptions webpOpts = new EncodeWEBPOptions()
    .setQuality(90)
    .setCompression(EncodeWEBPCompressionMode.LOSSY); // ou LOSSLESS

Data webp = EncoderWEBP.encode(image, webpOpts);
```

## Dessiner sur un Canvas

Dessiner une image est simple, mais faites attention au **Sampling** (échantillonnage).

```java
canvas.drawImage(img, 10, 10);
```

### Modes d'Échantillonnage

Lorsque vous redimensionnez une image, vous devez décider comment elle doit être échantillonnée :
- `SamplingMode.DEFAULT` : Plus proche voisin (Nearest neighbor). Rapide, mais donne un aspect pixellisé lors de la mise à l'échelle.
- `SamplingMode.LINEAR` : Filtrage bilinéaire. Lisse, mais peut être un peu flou.
- `SamplingMode.MITCHELL` : Rééchantillonnage cubique de haute qualité. Excellent pour la réduction d'échelle.

```java
canvas.drawImageRect(img, Rect.makeWH(200, 200), SamplingMode.LINEAR, null, true);
```

## Créer des Shaders à partir d'Images

Vous pouvez utiliser une image comme motif (par exemple, pour un arrière-plan en mosaïque) en la transformant en shader.

```java
Shader pattern = img.makeShader(FilterTileMode.REPEAT, FilterTileMode.REPEAT);
paint.setShader(pattern);
canvas.drawPaint(paint); // Remplit tout le canvas avec l'image en mosaïque
```

## Travailler avec les Pixels (Bitmap)

Si vous avez besoin de générer une image pixel par pixel à partir de zéro :

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Maintenant, vous pouvez dessiner dans ce bitmap en utilisant un Canvas
Canvas c = new Canvas(bmp);
c.clear(0xFFFFFFFF);
// ... dessiner des choses ...

// Ou accéder aux pixels bruts (avancé)
ByteBuffer pixels = bmp.peekPixels();
```

## Accéder aux Données de Pixels (Échantillonnage)

Pour lire les pixels d'une `Image` ou d'une `Surface`, utilisez la méthode `readPixels`.

### Échantillonnage de l'Image Complète
```java
// Créer un bitmap pour contenir les pixels
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(width, height));

// Lire tous les pixels de l'image dans le bitmap
image.readPixels(bmp);
```

### Échantillonnage d'une Région
Vous pouvez lire une sous-rectangle spécifique de l'image en fournissant un décalage (x, y).

```java
// Nous ne voulons qu'une région de 50x50
Bitmap regionBmp = new Bitmap();
regionBmp.allocPixels(ImageInfo.makeN32Premul(50, 50));

// Lire à partir de (100, 100) dans l'image source
// capturant effectivement le rectangle {100, 100, 150, 150}
image.readPixels(regionBmp, 100, 100); 
```

## Interopérabilité OpenGL / Metal

Skija vous permet de créer des objets `Image` directement à partir de textures GPU existantes. C'est utile pour l'intégration avec d'autres bibliothèques graphiques (comme LWJGL).

### Créer une Image à partir d'une Texture OpenGL

```java
// Vous avez besoin d'un DirectContext pour les opérations GPU
DirectContext context = ...; 

// Supposons que vous ayez un ID de texture OpenGL provenant d'ailleurs
int textureId = 12345;

Image glImage = Image.adoptGLTextureFrom(
    context, 
    textureId, 
    GL30.GL_TEXTURE_2D, 
    512, 512, 
    GL30.GL_RGBA8, 
    SurfaceOrigin.BOTTOM_LEFT, 
    ColorType.RGBA_8888
);

// Maintenant, vous pouvez dessiner cette texture avec Skija
canvas.drawImage(glImage, 0, 0);
```

**Note :** Lors de l'adoption d'une texture, Skija en assume la propriété. Si vous souhaitez l'encapsuler sans en prendre possession, recherchez les variantes `makeFromTexture` (si disponibles) ou gérez soigneusement la durée de vie.

## Pièges de Performance

1.  **Décodage sur le thread UI :** Le décodage de grandes images peut être lent. Faites-le en arrière-plan.
2.  **Téléchargements de textures :** Si vous utilisez un backend GPU (comme OpenGL), la première fois que vous dessinez une `Image` côté CPU, Skia doit la télécharger sur le GPU. Pour les grandes textures, cela peut provoquer un ralentissement d'une frame.
3.  **Bitmaps de grande taille :** Les Bitmaps résident dans le tas Java et la mémoire native. Soyez prudent avec les grandes dimensions (par exemple, des textures 8k) car elles peuvent rapidement entraîner des erreurs OutOfMemory.