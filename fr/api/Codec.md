# Référence API : Codec (Décodage & Animation)

Bien que `Image.makeDeferredFromEncodedBytes()` convienne pour les images statiques simples, la classe `Codec` est nécessaire lorsque vous souhaitez plus de contrôle sur le processus de décodage ou lorsque vous traitez des **images animées** (GIF, WebP animé).

## Chargement d'un Codec

Un `Codec` représente la "source" d'une image avant qu'elle ne soit transformée en pixels.

```java
Data data = Data.makeFromFileName("animations/loading.gif");
Codec codec = Codec.makeFromData(data);
```

## Décodage de base

Pour obtenir une seule image statique à partir d'un codec :

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(codec.getImageInfo()); // Préparer la mémoire
codec.readPixels(bmp); // Décoder les données dans le bitmap
```

## Gestion des Animations

C'est là que `Codec` excelle. Il permet de parcourir les images d'un GIF ou d'un WebP.

```java
int frameCount = codec.getFrameCount();
int loopCount = codec.getRepetitionCount(); // -1 pour infini

for (int i = 0; i < frameCount; i++) {
    // 1. Obtenir les informations sur cette image spécifique (durée, etc.)
    AnimationFrameInfo info = codec.getFrameInfo(i);
    int duration = info.getDuration(); // en millisecondes
    
    // 2. Décoder l'image
    Bitmap frameBmp = new Bitmap();
    frameBmp.allocPixels(codec.getImageInfo());
    codec.readPixels(frameBmp, i);
    
    // 3. Faire quelque chose avec l'image...
}
```

## Options de Décodage Avancées

### Mise à l'échelle pendant le décodage
Si vous avez une image 4K mais que vous n'en avez besoin qu'à 200x200, vous pouvez demander au codec de la redimensionner **pendant** le processus de décodage. C'est beaucoup plus rapide et utilise bien moins de mémoire que de décoder l'image complète puis de la redimensionner.

```java
ImageInfo smallInfo = ImageInfo.makeN32Premul(200, 200);
Bitmap smallBmp = new Bitmap();
smallBmp.allocPixels(smallInfo);

codec.readPixels(smallBmp); // Décode et redimensionne en une seule étape !
```

## Notes Importantes

- **Retour au début du flux :** Certains codecs (selon la source des données) ne peuvent pas être relus. Si vous devez décoder des images plusieurs fois, il est plus sûr de garder les `Data` en mémoire.
- **Espaces colorimétriques :** Le codec tentera de respecter l'espace colorimétrique intégré à l'image. Vous pouvez le remplacer en fournissant un `ImageInfo` différent à `readPixels`.
- **Mémoire :** Le `Codec` lui-même est petit, mais les objets `Bitmap` dans lesquels vous décodez peuvent être très volumineux. Réutilisez les bitmaps lorsque c'est possible.