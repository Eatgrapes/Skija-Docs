# Référence API : PathBuilder

`PathBuilder` est la méthode moderne et recommandée pour construire des objets `Path` dans Skija. Il fournit une API fluide et est conçu spécifiquement pour la construction de chemins, séparant le processus de construction du résultat `Path` immuable.

## Commandes de base

Mouvement et lignes :
- `moveTo(x, y)` : Démarre un nouveau contour.
- `lineTo(x, y)` : Ajoute un segment de ligne.
- `polylineTo(points)` : Ajoute plusieurs segments de ligne.
- `closePath()` : Ferme le contour actuel.

Commandes relatives (décalages par rapport au point courant) :
- `rMoveTo(dx, dy)`
- `rLineTo(dx, dy)`

## Courbes

Bézier quadratique (1 point de contrôle) :
- `quadTo(x1, y1, x2, y2)` : Coordonnées absolues.
- `rQuadTo(dx1, dy1, dx2, dy2)` : Coordonnées relatives.

Bézier cubique (2 points de contrôle) :
- `cubicTo(x1, y1, x2, y2, x3, y3)` : Absolues.
- `rCubicTo(dx1, dy1, dx2, dy2, dx3, dy3)` : Relatives.

Conique (Quadratique avec poids) :
- `conicTo(x1, y1, x2, y2, w)` : Utile pour des cercles/ellipses exacts.
- `rConicTo(...)` : Version relative.

## Arcs

- `arcTo(oval, startAngle, sweepAngle, forceMoveTo)` : Ajoute un arc confiné à l'ovale donné.
- `tangentArcTo(p1, p2, radius)` : Ajoute un arc tangent aux lignes (courant -> p1) et (p1 -> p2).
- `ellipticalArcTo(...)` : Ajoute un arc au format SVG.

## Ajout de formes

`PathBuilder` permet d'ajouter des formes entières comme nouveaux contours.

- `addRect(rect, direction, startIndex)`
- `addOval(rect, direction, startIndex)`
- `addCircle(x, y, radius, direction)`
- `addRRect(rrect, direction, startIndex)` : Rectangle arrondi.
- `addPolygon(points, close)` : Ajoute une séquence de points comme contour.
- `addPath(path, mode)` : Ajoute les contours d'un autre chemin à celui-ci.

## Transformations (État du Builder)

Ces méthodes affectent les points *actuellement* dans le builder.

- `offset(dx, dy)` : Translate tous les points existants dans le builder.
- `transform(matrix)` : Applique une matrice à tous les points existants.

## Gestion du Builder

- `reset()` : Vide le builder à un état vide (conserve la mémoire).
- `incReserve(points, verbs)` : Pré-alloue de la mémoire pour éviter les redimensionnements pendant la construction.
- `setFillMode(mode)` : Définit la règle de remplissage (`WINDING`, `EVEN_ODD`, etc.).
- `setVolatile(boolean)` : Indique que le chemin résultant ne doit pas être mis en cache (utile pour les chemins d'animation ponctuels).

## Méthodes de sortie

- **`snapshot()`** : Retourne un `Path` et conserve l'état du builder.
- **`detach()`** : Retourne un `Path` et réinitialise le builder (le plus efficace).
- **`build()`** : Retourne un `Path` et ferme le builder (ne peut plus être utilisé ensuite).

## Exemple : Construction de base

```java
Path path = new PathBuilder()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath()
    .snapshot(); // Retourne le Path
```

## Exemple : Transformations

```java
PathBuilder builder = new PathBuilder();

builder.addRect(Rect.makeXYWH(0, 0, 100, 100))
       .offset(10, 10)
       .transform(Matrix33.makeRotate(45));

Path p = builder.detach(); // Retourne le chemin et réinitialise le builder
```

## Exemple visuel

Voir [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) pour diverses combinaisons de chemins et règles de remplissage.