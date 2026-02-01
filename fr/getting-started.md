# Démarrer avec Skija

Skija apporte la puissance du moteur graphique Skia à la machine virtuelle Java. Ce guide fournit une vue d'ensemble de haut niveau pour commencer à dessiner avec Skija.

## Concepts Fondamentaux

Avant de plonger dans le code, il est utile de comprendre les principaux acteurs de l'écosystème Skija :

- **Surface** : La destination de votre dessin (comme une feuille de papier).
- **Canvas** : L'interface utilisée pour effectuer les opérations de dessin (comme votre main).
- **Paint** : Définit la couleur, le style et les effets de ce que vous dessinez (comme votre stylo ou pinceau).

## Parcours de Démarrage Rapide

Pour afficher votre premier "Hello World" à l'écran ou dans un fichier image, nous vous recommandons de suivre ces étapes :

1.  **[Installation](installation.md)** : Configurez les dépendances de votre projet pour votre plateforme spécifique (Windows, macOS ou Linux).
2.  **[Bases du Rendu](rendering-basics.md)** : Apprenez à créer une simple Surface en mémoire et à dessiner vos premières formes primitives.
3.  **[Typographie](typography.md)** : Ajoutez du texte à vos créations en utilisant les polices système ou des fichiers de polices personnalisés.
4.  **[Rendu GPU](gpu-rendering.md)** : Pour les applications interactives, apprenez à exploiter la puissance de votre carte graphique.

## Gestion des Ressources

Skija est un wrapper haute performance autour d'une bibliothèque C++. Bien qu'il gère la mémoire automatiquement pour vous, comprendre les principes de [Gestion des Ressources](resource-management.md) est recommandé pour construire des applications robustes.

## Approfondissements

Une fois à l'aise avec les bases, explorez nos références d'API détaillées :

- [**API Canvas**](api/Canvas.md) : Vue détaillée des transformations, du découpage et des méthodes de dessin.
- [**Paint & Effets**](api/Effects.md) : Maîtrisez les flous, les ombres et les matrices de couleur.
- [**Shaders**](api/Shader.md) : Créez de beaux dégradés et des textures procédurales.
- [**SkSL**](api/runtime-effect.md) : Écrivez des shaders GPU personnalisés pour une flexibilité ultime.

---

### Prêt à construire quelque chose d'incroyable ?
Consultez l'[**Index Complet de la Documentation**](/) pour une liste complète des guides et références.