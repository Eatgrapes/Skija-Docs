# Référence API : SVG

Bien que Skia soit principalement un moteur de dessin bas niveau, Skija inclut un module SVG qui vous permet de travailler directement avec des fichiers SVG. C'est parfait pour les icônes, les illustrations simples et les logos.

## Chargement et rendu

Le SVG dans Skija est géré par la classe `SVGDOM`.

```java
import io.github.humbleui.skija.svg.SVGDOM;

// 1. Charger les données SVG
Data svgData = Data.makeFromFileName("assets/logo.svg");
SVGDOM svg = new SVGDOM(svgData);

// 2. Définir la taille de la fenêtre d'affichage
// C'est important ! Les SVG n'ont souvent pas de taille fixe.
svg.setContainerSize(200, 200);

// 3. Le rendre sur un Canvas
svg.render(canvas);
```

## Mise à l'échelle des SVG

Comme les SVG sont basés sur des vecteurs, vous pouvez les redimensionner à n'importe quelle taille sans perte de qualité. Changez simplement `setContainerSize` ou utilisez `canvas.scale()` avant le rendu.

```java
canvas.save();
canvas.translate(100, 100);
canvas.scale(2.0f, 2.0f); // Le rendre deux fois plus grand
svg.render(canvas);
canvas.restore();
```

## Accès à l'élément racine

Vous pouvez obtenir l'élément racine `<svg>` pour interroger les dimensions d'origine ou d'autres métadonnées.

```java
SVGSVG root = svg.getRoot();
if (root != null) {
    Point size = root.getIntrinsicSize(); // Obtenir la taille définie dans le fichier SVG
}
```

## Astuce de performance : le "Cache Raster"

Le rendu d'un SVG peut être étonnamment coûteux car Skia doit analyser la structure de type XML et exécuter de nombreuses commandes de dessin à chaque fois.

**Meilleure pratique :** Si vous avez une icône qui apparaît de nombreuses fois (comme une icône de dossier dans un gestionnaire de fichiers), n'appelez pas `svg.render()` pour chaque instance. Rendez-la plutôt une fois dans une `Image` hors écran et dessinez cette image.

```java
// Faire cela une fois
Surface cache = Surface.makeRasterN32Premul(width, height);
svg.render(cache.getCanvas());
Image cachedIcon = cache.makeImageSnapshot();

// Utiliser cela dans votre boucle de rendu
canvas.drawImage(cachedIcon, x, y);
```

## Limitations

L'implémentation SVG de Skija est un "sous-ensemble" de la spécification SVG complète. Elle prend en charge la plupart des fonctionnalités courantes (formes, chemins, remplissages, dégradés), mais peut avoir des difficultés avec :
- Le style CSS complexe
- Le scriptage (JavaScript à l'intérieur du SVG)
- Certains effets de filtre obscurs

Pour la plupart des icônes d'interface utilisateur et des logos, cela fonctionne parfaitement.