# Référence API : Picture & PictureRecorder

Lorsque vous devez dessiner la même scène complexe plusieurs fois — ou si vous avez un arrière-plan statique qui ne change pas — vous devriez utiliser `Picture`. Il enregistre vos commandes de dessin dans un format hautement optimisé que Skia peut "rejouer" beaucoup plus rapidement que d'exécuter des appels Java individuels à chaque frame.

## Le flux de travail

L'enregistrement d'une image implique d'utiliser un `PictureRecorder` pour obtenir un `Canvas` temporaire.

```java
PictureRecorder recorder = new PictureRecorder();

// 1. Définir le "cull rect" (la zone que vous prévoyez de dessiner)
Canvas recordingCanvas = recorder.beginRecording(Rect.makeWH(500, 500));

// 2. Exécuter vos commandes de dessin comme d'habitude
Paint p = new Paint().setColor(0xFF4285F4);
recordingCanvas.drawCircle(250, 250, 100, p);
// ... plus de dessins ...

// 3. Arrêter l'enregistrement et obtenir l'objet Picture
Picture picture = recorder.finishRecordingAsPicture();
```

## API PictureRecorder

Le `PictureRecorder` est l'objet avec état utilisé pour capturer les commandes.

- `beginRecording(bounds)` : Commence l'enregistrement. Retourne un `Canvas` dans lequel vous pouvez dessiner. Toutes les commandes de dessin envoyées à ce canvas seront stockées.
- `getRecordingCanvas()` : Retourne le canvas d'enregistrement actif, ou `null` si aucun enregistrement n'est en cours.
- `finishRecordingAsPicture()` : Termine l'enregistrement et retourne l'objet `Picture` immuable. Invalide le canvas d'enregistrement.
- `finishRecordingAsPicture(cullRect)` : Termine l'enregistrement, mais remplace le cull rect stocké dans l'image.

## Création d'Images (Sérialisation)

- `makePlaceholder(cullRect)` : Crée une image de substitution qui ne dessine rien mais a des limites spécifiques.
- `makeFromData(data)` : Désérialise une image à partir d'un objet `Data` (créé via `serializeToData`).

## Dessiner l'Image

Une fois que vous avez un objet `Picture`, vous pouvez le dessiner sur n'importe quel autre `Canvas`.

```java
canvas.drawPicture(picture);
```

## Pourquoi utiliser Picture ?

1.  **Performance :** Si vous avez 1 000 appels de dessin, Java doit appeler le code natif 1 000 fois par frame. Si vous les enregistrez dans un `Picture`, ce n'est plus qu'**un** appel natif par frame.
2.  **Sécurité des threads :** Alors qu'un `Canvas` est lié à un thread, un `Picture` est immuable et peut être dessiné depuis n'importe quel thread (bien que vous le dessiniez généralement sur votre thread de rendu principal).
3.  **Mise en cache de la tessellation :** Skia peut mieux mettre en cache la géométrie complexe (comme les chemins) à l'intérieur d'un `Picture` que pour des appels individuels.

## Bonnes pratiques et pièges

- **Ne pas tout enregistrer :** Si votre contenu change à chaque frame (comme un personnage en mouvement), enregistrer un nouveau `Picture` à chaque fois pourrait en réalité être *plus lent* en raison de la surcharge du recorder.
- **Durée de vie du Canvas :** Le `Canvas` que vous obtenez de `beginRecording()` n'est valide que jusqu'à ce que vous appeliez `finishRecordingAsPicture()`. Ne tentez pas de conserver une référence à celui-ci !
- **Mémoire :** Les images occupent de la mémoire native. Si vous créez de nombreuses petites images, n'oubliez pas de les `close()` lorsqu'elles ne sont plus nécessaires.