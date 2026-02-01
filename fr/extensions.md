# Extensions : Lottie & SVG

Skija inclut une prise en charge de haut niveau pour les formats vectoriels populaires comme Lottie (via Skottie) et SVG, vous permettant d'intégrer facilement des animations complexes et des icônes dans vos applications Java.

## Animations Lottie (Skottie)

Skottie est le lecteur Lottie de Skia. Il peut charger et lire des animations basées sur JSON exportées depuis After Effects.

### Charger une animation

```java
import io.github.humbleui.skija.skottie.Animation;

Animation anim = Animation.makeFromFile("assets/loader.json");
```

### Lire et rendre

Pour lire une animation, vous devez vous "déplacer" à un temps ou une image spécifique, puis la rendre sur un canvas.

```java
// temps normalisé : 0.0 (début) à 1.0 (fin)
anim.seek(currentTime); 

// Ou se déplacer à un index d'image spécifique
anim.seekFrame(24);

// Rendre dans un rectangle spécifique sur le canvas
anim.render(canvas, Rect.makeXYWH(0, 0, 200, 200));
```

## Prise en charge SVG

Skija fournit un DOM SVG qui peut analyser et rendre des fichiers SVG.

### Charger et rendre un SVG

```java
import io.github.humbleui.skija.svg.SVGDOM;

Data data = Data.makeFromFileName("assets/icon.svg");
SVGDOM svg = new SVGDOM(data);

// Définir la taille du conteneur où le SVG sera rendu
svg.setContainerSize(100, 100);

// Le dessiner sur le canvas
svg.render(canvas);
```

### Interagir avec un SVG

Vous pouvez accéder à l'élément racine du SVG pour interroger ses propriétés, comme sa taille intrinsèque.

```java
SVGSVG root = svg.getRoot();
Point size = root.getIntrinsicSize();
```

## Quand utiliser quoi ?

- **Lottie :** Idéal pour les animations d'interface complexes, les animations de personnages et les transitions expressives.
- **SVG :** Idéal pour les icônes statiques, les logos simples et les illustrations.
- **Shaders personnalisés (SkSL) :** Idéal pour les arrière-plans générés procéduralement, les effets en temps réel et les visuels hautement dynamiques.