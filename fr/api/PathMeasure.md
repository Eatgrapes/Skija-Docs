# Référence API : PathMeasure

`PathMeasure` est utilisé pour calculer la longueur d'un chemin, et pour trouver la position et la tangente à n'importe quelle distance donnée le long du chemin.

## Aperçu

Un objet `PathMeasure` est initialisé avec un [`Path`](Path.md). Il parcourt les contours du chemin. Si le chemin a plusieurs contours, vous pouvez passer au suivant en utilisant `nextContour()`.

## Constructeurs

- `new PathMeasure()` : Crée un `PathMeasure` vide.
- `new PathMeasure(path)` : Initialise avec le chemin spécifié.
- `new PathMeasure(path, forceClosed)` : Si `forceClosed` est vrai, le chemin est traité comme s'il était fermé, même s'il ne l'est pas.
- `new PathMeasure(path, forceClosed, resScale)` : `resScale` contrôle la précision de la mesure (par défaut 1.0).

## Méthodes

### Gestion de l'état

- `setPath(path, forceClosed)` : Réinitialise la mesure avec un nouveau chemin.
- `nextContour()` : Passe au contour suivant dans le chemin. Renvoie `true` s'il en existe un.
- `isClosed()` : Renvoie `true` si le contour actuel est fermé.

### Mesures

- `getLength()` : Renvoie la longueur totale du contour actuel.
- `getPosition(distance)` : Renvoie le `Point` à la distance spécifiée le long du chemin.
- `getTangent(distance)` : Renvoie la tangente (sous forme de vecteur `Point`) à la distance spécifiée.
- `getRSXform(distance)` : Renvoie le `RSXform` à la distance spécifiée.
- `getMatrix(distance, getPosition, getTangent)` : Renvoie une `Matrix33` représentant la position et/ou la tangente à la distance.

### Extraction

- `getSegment(startD, endD, dst, startWithMoveTo)` : Extrait le segment du chemin entre `startD` et `endD` dans le `PathBuilder` fourni.

## Exemple

```java
Path path = Path.makeCircle(100, 100, 50);
PathMeasure measure = new PathMeasure(path);

float length = measure.getLength();
Point pos = measure.getPosition(length / 2); // Obtient le point à mi-chemin
Point tan = measure.getTangent(length / 2);   // Obtient la direction à ce point
```