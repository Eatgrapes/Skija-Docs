# Référence API : Surface

La classe `Surface` est la destination de toutes les commandes de dessin. Elle gère la mémoire des pixels (sur CPU ou GPU) et fournit le `Canvas` que vous utilisez pour dessiner.

## Vue d'ensemble

Une `Surface` est responsable de :
1.  Contenir les données des pixels (ou gérer la texture GPU).
2.  Fournir une interface `Canvas` pour dessiner dans ces données.
3.  Capturer le contenu actuel dans une `Image`.

## Création d'une Surface

### 1. Surface Raster (CPU)
La surface la plus simple. Les pixels résident dans la mémoire système standard (RAM). Idéal pour générer des images, le rendu côté serveur ou les tests.

```java
// Surface standard 32 bits RGBA
Surface raster = Surface.makeRasterN32Premul(800, 600);

// Avec une ImageInfo personnalisée (par ex., couleur F16 pour HDR)
ImageInfo info = new ImageInfo(800, 600, ColorType.RGBA_F16, AlphaType.PREMUL);
Surface hdrSurface = Surface.makeRaster(info);
```

### 2. Surface GPU (Cible de rendu)
Utilisée pour le rendu accéléré par le matériel. Vous avez besoin d'un `DirectContext` (contexte OpenGL/Metal/Vulkan).

```java
DirectContext context = ...; // Votre contexte GPU

// Créer une nouvelle texture sur le GPU gérée par Skia
Surface gpuSurface = Surface.makeRenderTarget(
    context,
    false,             // Budgetée ? (Skia doit-il compter cela dans sa limite de cache ?)
    ImageInfo.makeN32Premul(800, 600)
);
```

### 3. Encapsulation de textures OpenGL/Metal existantes
Si vous intégrez Skija dans un moteur de jeu ou un système de fenêtrage existant (comme LWJGL ou JWM), la fenêtre fournit généralement un ID de "framebuffer" ou de "texture". Vous l'encapsulez pour que Skija puisse dessiner directement sur l'écran.

```java
// Exemple OpenGL
int framebufferId = 0; // Buffer d'écran par défaut
BackendRenderTarget renderTarget = BackendRenderTarget.makeGL(
    800, 600,          // Largeur, Hauteur
    0,                 // Nombre d'échantillons (0 pour pas de MSAA)
    8,                 // Bits de stencil
    framebufferId,
    BackendRenderTarget.FRAMEBUFFER_FORMAT_GR_GL_RGBA8
);

Surface screenSurface = Surface.wrapBackendRenderTarget(
    context,
    renderTarget,
    SurfaceOrigin.BOTTOM_LEFT, // Les coordonnées OpenGL commencent en bas à gauche
    ColorType.RGBA_8888,
    ColorSpace.getSRGB(),
    null // SurfaceProps
);
```

### 4. Encapsulation de pixels Raster (Interop)
Si vous avez un `ByteBuffer` ou un pointeur provenant d'une autre bibliothèque (comme un décodeur de trame vidéo), vous pouvez l'encapsuler directement sans copie.

```java
long pixelPtr = ...; // Pointeur natif vers la mémoire
int rowBytes = width * 4; // Octets par ligne

Surface wrap = Surface.wrapPixels(
    ImageInfo.makeN32Premul(width, height),
    pixelPtr,
    rowBytes
);
```

### 5. Surface Null
Crée une surface qui ne fait rien. Utile pour mesurer ou tester sans allouer de mémoire.

```java
Surface nullSurface = Surface.makeNull(100, 100);
```

## Création de captures instantanées (`Image`)

Créer une `Image` immuable à partir d'une `Surface` est une opération peu coûteuse (Copie à l'écriture).

```java
// Cela ne copie pas les pixels immédiatement !
// Cela "fork" effectivement la surface. Les dessins futurs sur 'surface' n'affecteront pas 'snapshot'.
Image snapshot = surface.makeImageSnapshot();

// Vous pouvez maintenant utiliser 'snapshot' pour dessiner sur une autre surface ou l'enregistrer sur disque.
```

## Interaction avec le contenu

```java
// Obtenir le canvas pour dessiner
Canvas canvas = surface.getCanvas();
canvas.drawCircle(50, 50, 20, paint);

// Lire les pixels dans un bitmap
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));
if (surface.readPixels(bitmap, 0, 0)) {
    // Pixels lus avec succès
}

// Écrire des pixels d'un bitmap sur la surface
surface.writePixels(bitmap, 10, 10);

// Envoyer les commandes au GPU (important pour les surfaces GPU)
surface.flush();
```

- `getCanvas()` : Retourne le canvas pour dessiner.
- `readPixels(bitmap, x, y)` : Lit les pixels depuis le GPU/CPU dans un bitmap.
- `writePixels(bitmap, x, y)` : Écrit les pixels d'un bitmap sur la surface.
- `flush()` : Assure que toutes les commandes GPU en attente sont envoyées au pilote.
- `notifyContentWillChange()` : Appelez cette méthode si vous modifiez directement la mémoire sous-jacente des pixels (en contournant le Canvas).
- `getRecordingContext()` : Retourne le `DirectContext` supportant cette surface (s'il y en a un).