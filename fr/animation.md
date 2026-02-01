# Animation dans Skija

"Animation" dans Skija peut signifier trois choses différentes selon ce que vous souhaitez réaliser :

1.  **Animation programmatique :** Déplacer des formes ou changer des couleurs en utilisant du code (par exemple, une boucle de jeu).
2.  **Lottie (Skottie) :** Lire des animations vectorielles de haute qualité exportées depuis After Effects.
3.  **Images animées :** Lire des images GIF ou WebP.

## 1. Animation programmatique (La "boucle de jeu")

Skija est un moteur de rendu en "mode immédiat". Cela signifie qu'il ne se souvient pas où vous avez dessiné un cercle hier. Pour déplacer un cercle, vous le dessinez simplement à une position différente aujourd'hui.

Pour créer une animation, vous comptez sur votre bibliothèque de fenêtrage (comme JWM ou LWJGL) pour appeler votre fonction `draw` de manière répétée.

### Le Modèle

1.  **Obtenir le temps :** Utilisez `System.nanoTime()` pour obtenir l'heure actuelle.
2.  **Calculer l'état :** Déterminez où vos objets doivent être en fonction du temps.
3.  **Dessiner :** Rendez l'image.
4.  **Demander l'image suivante :** Dites à la fenêtre de se rafraîchir à nouveau immédiatement.

### Exemple : Déplacer un cercle

```java
// Variable pour stocker l'état
long startTime = System.nanoTime();

public void onPaint(Canvas canvas) {
    // 1. Calculer la progression (0.0 à 1.0) en fonction du temps
    long now = System.nanoTime();
    float time = (now - startTime) / 1e9f; // Temps en secondes
    
    // Déplacer de 100 pixels par seconde
    float x = 50 + (time * 100) % 500; 
    float y = 100 + (float) Math.sin(time * 5) * 50; // Osciller de haut en bas

    // 2. Dessiner
    Paint paint = new Paint().setColor(0xFFFF0000); // Rouge
    canvas.drawCircle(x, y, 20, paint);

    // 3. Demander l'image suivante (la méthode dépend de votre bibliothèque de fenêtrage)
    window.requestFrame(); 
}
```

## 2. Animations Lottie (Skottie)

Pour les animations vectorielles complexes (comme les chargeurs d'interface utilisateur, les icônes), Skija utilise le module **Skottie**. C'est beaucoup plus efficace que de tout dessiner manuellement.

Voir la [**Référence de l'API Animation**](api/Animation.md) pour les détails sur le chargement et le contrôle des fichiers Lottie.

## 3. Images animées (GIF / WebP)

Pour lire les formats d'image animée standard comme GIF ou WebP, vous utilisez la classe `Codec` pour extraire les images.

Voir la [**Référence de l'API Codec**](api/Codec.md) pour les détails sur le décodage et la lecture des images multi-images.

---

## Conseils de performance

- **Ne créez pas d'objets dans la boucle :** Réutilisez les objets `Paint`, `Rect` et `Path`. Créer de nouveaux objets Java 60 fois par seconde déclenche le Garbage Collector et provoque des saccades.
- **Utilisez `saveLayer` avec précaution :** C'est coûteux.
- **V-Sync :** Assurez-vous que votre bibliothèque de fenêtrage a le V-Sync activé pour éviter le déchirement d'écran.