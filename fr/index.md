---
layout: home

hero:
  name: Skija
  text: Liaisons Java pour Skia
  tagline: Graphismes 2D hautes performances accélérés par le matériel pour la JVM.
  actions:
    - theme: brand
      text: Commencer
      link: /getting-started
    - theme: alt
      text: Voir sur GitHub
      link: https://github.com/HumbleUI/Skija

features:
  - title: Accélération Matérielle
    details: Tire parti d'OpenGL, Metal, Vulkan et Direct3D via Skia pour des performances fluides.
  - title: Typographie Riche
    details: Mise en forme de texte avancée avec HarfBuzz et mise en page complexe avec SkParagraph.
  - title: Shaders Modernes
    details: Écrivez des shaders GPU personnalisés à l'aide de SkSL (Skia Shading Language).
---

::: warning Documentation Non Officielle
Cette documentation est maintenue par la communauté et n'est **pas** une publication officielle des projets Skia ou Skija.
Si vous trouvez des erreurs ou avez des suggestions, veuillez les signaler sur [**Eatgrapes/Skija-Docs**](https://github.com/Eatgrapes/Skija-Docs).
:::

## Index Complet de la Documentation

### Les Essentiels

- [**Getting Started**](../getting-started.md): Une vue d'ensemble du fonctionnement de Skija et par où commencer.
- [**Installation**](../installation.md): Configuration des dépendances du projet pour Windows, macOS et Linux.
- [**Rendering Basics**](../rendering-basics.md): Surfaces, Canvases et votre premier "Hello World".
- [**Colors and Alpha**](../colors.md): Gestion de la transparence, de la prémultiplication et des espaces colorimétriques.
- [**Animation**](../animation.md): Création de mouvements, boucles de jeu et lecture d'animations Lottie/GIF.
- [**Resource Management**](../resource-management.md): Comment Skija gère la mémoire native et le cycle de vie `Managed`.

### Plongée dans l'API

- [**Surface**](../api/Surface.md): Création de destinations de dessin (Raster, GPU, Wrapped).
- [**Canvas**](../api/Canvas.md): Transformations, découpage et primitives de dessin.
- [**Images & Bitmaps**](../api/Images.md): Chargement, dessin et manipulation de données de pixels.
- [**Data**](../api/Data.md): Gestion efficace de la mémoire native.
- [**Matrix**](../api/Matrix.md): Transformations matricielles 3x3 et 4x4.
- [**Codec (Animations)**](../api/Codec.md): Décodage d'images de bas niveau et animations GIF/WebP.
- [**Paint & Effects**](../api/Effects.md): Styles, flous, ombres et filtres de couleur.
- [**Shadows**](../api/Shadows.md): Ombres portées 2D et ombres basées sur l'élévation 3D.
- [**Paths**](../api/Path.md): Création et combinaison de formes géométriques complexes.
- [**PathBuilder**](../api/path-builder.md): API fluide pour la construction de chemins.
- [**Region**](../api/Region.md): Opérations de zone basées sur des entiers et tests de collision.
- [**Picture**](../api/Picture.md): Enregistrement et lecture de commandes de dessin pour les performances.

### Typographie et Texte

- [**Typeface**](../api/Typeface.md): Chargement de fichiers de polices et propriétés.
- [**Font**](../api/Font.md) : Taille de police, métriques et attributs de rendu.
- [**Typography & Fonts**](../typography.md): Principes de base des polices et des métriques.
- [**Text Animation & Clipping**](../api/text-animation.md): Utilisation du texte comme masques, texte ondulé et polices variables.
- [**TextBlob & Builder**](../api/TextBlob.md): Exécutions de glyphes optimisées et réutilisables.
- [**TextLine**](../api/TextLine.md): Mise en page de texte sur une seule ligne et tests de collision.
- [**Paragraph (Rich Text)**](../api/Paragraph.md): Mise en page de texte complexe multi-styles et retour à la ligne.
- [**BreakIterator**](../api/BreakIterator.md): Localisation des limites de mots, de lignes et de phrases.

### Graphismes Avancés

- [**GPU Rendering**](../gpu-rendering.md): Accélération matérielle avec OpenGL, Metal, Vulkan et Direct3D.
- [**DirectContext**](../api/direct-context.md): Gestion de l'état du GPU et soumission des commandes.
- [**Shaper**](../api/Shaper.md): Mise en forme du texte et positionnement des glyphes (HarfBuzz).
- [**SkSL (RuntimeEffect)**](../api/runtime-effect.md): Écriture de shaders GPU personnalisés pour une flexibilité ultime.
- [**PDF Generation**](../api/Document.md): Création de documents PDF vectoriels.

### Extensions

- [**SVG**](../api/SVG.md): Chargement et rendu d'icônes et d'illustrations SVG.
- [**Lottie**](../extensions.md): Lecture d'animations vectorielles hautes performances avec Skottie.
