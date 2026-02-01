# Référence API : Animation (Skottie)

La classe `Animation` (dans `io.github.humbleui.skija.skottie`) fournit le support pour charger et afficher des animations Lottie.

## Aperçu

Skottie est un lecteur Lottie haute performance pour Skia. La classe `Animation` vous permet de charger des animations Lottie depuis des fichiers, des chaînes de caractères ou des données, et d'afficher des images spécifiques sur un `Canvas`.

## Création

- `makeFromString(data)` : Crée une `Animation` à partir d'une chaîne JSON.
- `makeFromFile(path)` : Crée une `Animation` à partir d'un chemin de fichier.
- `makeFromData(data)` : Crée une `Animation` à partir d'un objet `Data`.

## Rendu

- `render(canvas)` : Dessine l'image courante sur le canvas à la position `(0, 0)` avec la taille naturelle de l'animation.
- `render(canvas, offset)` : Dessine l'image courante au décalage `(x, y)` spécifié.
- `render(canvas, left, top)` : Dessine l'image courante aux coordonnées spécifiées.
- `render(canvas, dst, renderFlags)` : Dessine l'image courante mise à l'échelle pour s'adapter au `Rect` de destination.

## Contrôle de la lecture

Pour afficher une image spécifique, vous devez d'abord vous y positionner.

- `seek(t)` : Se positionne à un temps normalisé `t` dans l'intervalle `[0..1]`.
- `seek(t, ic)` : Se positionne à un temps normalisé `t` avec un `InvalidationController`.
- `seekFrame(t)` : Se positionne à un index d'image spécifique `t` (relatif à `duration * fps`).
- `seekFrameTime(t)` : Se positionne à un temps spécifique `t` en secondes.

## Propriétés

- `getDuration()` : Retourne la durée totale de l'animation en secondes.
- `getFPS()` : Retourne la fréquence d'images (images par seconde).
- `getInPoint()` : Retourne le point d'entrée (image de début) en unités d'index d'image.
- `getOutPoint()` : Retourne le point de sortie (image de fin) en unités d'index d'image.
- `getVersion()` : Retourne la chaîne de version Lottie.
- `getSize()` : Retourne la taille naturelle de l'animation sous forme de `Point`.
- `getWidth()` : Retourne la largeur de l'animation.
- `getHeight()` : Retourne la hauteur de l'animation.

## Exemple

```java
// Charger l'animation depuis les ressources ou le système de fichiers
try (var anim = Animation.makeFromFile("loading.json")) {
    
    // Obtenir les informations de l'animation
    float duration = anim.getDuration(); // en secondes
    float width = anim.getWidth();
    float height = anim.getHeight();

    // Préparer le rendu
    anim.seek(0.5f); // Aller au milieu de l'animation (50%)

    // Rendre sur le canvas
    // Suppose que vous avez une instance Canvas 'canvas'
    canvas.save();
    canvas.translate(100, 100); // Positionner l'animation
    anim.render(canvas);
    canvas.restore();
}
```