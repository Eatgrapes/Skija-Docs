# Référence API : Path

La classe `Path` représente des tracés géométriques complexes et composés, constitués de segments de ligne droite, de courbes quadratiques et de courbes cubiques.

> **Note :** Pour construire de nouveaux tracés, il est fortement recommandé d'utiliser [**PathBuilder**](path-builder.md) plutôt que d'appeler directement les méthodes sur `Path`. `PathBuilder` offre une meilleure API fluide et garantit que le `Path` résultant est immuable.

## Construction d'un tracé (Fabriques statiques)

Bien que `PathBuilder` soit préféré pour les tracés complexes, `Path` propose des fabriques statiques efficaces pour les formes courantes.

- `makeRect(rect)` : Crée un tracé à partir d'un rectangle.
- `makeOval(rect)` : Crée un tracé à partir d'un ovale.
- `makeCircle(x, y, radius)` : Crée un tracé à partir d'un cercle.
- `makeRRect(rrect)` : Crée un tracé à partir d'un rectangle arrondi.
- `makeLine(p1, p2)` : Crée un tracé à partir d'un segment de ligne unique.
- `makePolygon(points, closed)` : Crée un tracé à partir d'une séquence de points.
- `makeFromSVGString(svgString)` : Analyse une chaîne de tracé SVG (par exemple, `"M10 10 L50 50 Z"`).

## Informations et métriques du tracé

- `getBounds()` : Renvoie la boîte englobante conservative (rapide, mise en cache).
- `computeTightBounds()` : Renvoie la boîte englobante précise (plus lent).
- `isEmpty()` : Renvoie vrai si le tracé ne contient aucun verbe.
- `isConvex()` : Renvoie vrai si le tracé définit une forme convexe.
- `isRect()` : Renvoie le `Rect` si le tracé représente un simple rectangle, ou null.
- `isOval()` : Renvoie le `Rect` englobant si le tracé est un ovale, ou null.
- `isFinite()` : Renvoie vrai si tous les points du tracé sont finis.

## Test de collision

- `contains(x, y)` : Renvoie vrai si le point spécifié est à l'intérieur du tracé (basé sur le type de remplissage actuel).
- `conservativelyContainsRect(rect)` : Renvoie vrai si le rectangle est définitivement à l'intérieur du tracé (test de rejet rapide).

## Opérations booléennes

Les tracés peuvent être combinés à l'aide d'opérations logiques. Celles-ci créent un **nouvel** objet `Path`.

```java
Path result = Path.makeCombining(pathA, pathB, PathOp.INTERSECT);
```

`PathOp` disponibles :
- `DIFFERENCE` : A - B
- `INTERSECT` : A & B
- `UNION` : A | B
- `XOR` : (A | B) - (A & B)
- `REVERSE_DIFFERENCE` : B - A

## Transformations et modifications

Ces méthodes renvoient une **nouvelle** instance de `Path` avec la transformation appliquée.

- `makeTransform(matrix)` : Applique une `Matrix33` à tous les points du tracé.
- `makeOffset(dx, dy)` : Translate le tracé.
- `makeScale(s)` : Met le tracé à l'échelle.

## Interpolation (Morphing)

Vous pouvez interpoler entre deux tracés compatibles (utile pour les animations).

```java
// Interpole à 50% entre pathA et pathB
if (pathA.isInterpolatable(pathB)) {
    Path midPath = pathA.makeInterpolate(pathB, 0.5f);
}
```

## Sérialisation

- `serializeToBytes()` : Sérialise le tracé en un tableau d'octets.
- `makeFromBytes(bytes)` : Reconstruit un tracé à partir d'octets.
- `dump()` : Affiche la structure du tracé sur la sortie standard (pour le débogage).

## Mesure et itération

- `PathMeasure` : Utilisé pour calculer la longueur d'un tracé et trouver des positions/tangentes le long de sa longueur.
- `PathSegmentIterator` : Permet d'itérer sur les verbes et points individuels qui composent le tracé.

## Exemple

```java
Path path = new Path()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath();

canvas.drawPath(path, paint);
```

## Type de remplissage

Le type de remplissage détermine quelles zones sont considérées comme "intérieures" au tracé pour les opérations de remplissage.
- `WINDING` (Par défaut) : Utilise la règle du nombre d'enroulement.
- `EVEN_ODD` : Utilise la règle pair-impair.
- `INVERSE_WINDING` : Inverse la règle d'enroulement (remplit l'extérieur).
- `INVERSE_EVEN_ODD` : Inverse la règle pair-impair.

## Exemple visuel

Consultez [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) pour des exemples de création, modification et combinaison de tracés.
