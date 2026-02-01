# Référence API : Canvas

La classe `Canvas` est le point central pour toutes les opérations de dessin dans Skija. Elle gère l'état de dessin, y compris les transformations et le découpage.

## Vue d'ensemble

Un `Canvas` ne contient pas les pixels eux-mêmes ; c'est une interface qui dirige les commandes de dessin vers une destination, telle qu'une `Surface` ou un `Bitmap`.

## Gestion de l'état

Le Canvas maintient une pile d'états. Vous pouvez sauvegarder l'état actuel (matrice et découpage) et le restaurer plus tard.

- `save()` : Pousse une copie de la matrice et du découpage actuels sur la pile. Retourne le compteur de sauvegarde.
- `restore()` : Dépile la pile et réinitialise la matrice et le découpage à l'état précédent.
- `restoreToCount(count)` : Restaure à un compteur de sauvegarde spécifique.
- `getSaveCount()` : Retourne la profondeur actuelle de la pile.

### Calques

Les calques créent un tampon hors écran pour le dessin, qui est ensuite composité sur le canvas principal lors de la restauration.

- `saveLayer(rect, paint)` : Sauvegarde l'état et redirige le dessin vers un calque. Le `paint` contrôle l'alpha/le mélange du calque lors de la composition.
- `saveLayerAlpha(rect, alpha)` : Version simplifiée pour changer uniquement l'opacité.
- `saveLayer(SaveLayerRec)` : Contrôle avancé des calques (arrière-plans, modes de tuilage).

```java
// Créer un filtre de flou
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
SaveLayerRec rec = new SaveLayerRec(null, null, blur);

canvas.saveLayer(rec);
    // Tout ce qui est dessiné ici apparaîtra sur un arrière-plan flouté
    // (créant un effet de "verre dépoli")
    canvas.drawRect(Rect.makeWH(200, 200), new Paint().setColor(0x80FFFFFF));
canvas.restore();
```

## Transformations

Les transformations affectent toutes les opérations de dessin ultérieures.

- `translate(dx, dy)` : Déplace l'origine.
- `scale(sx, sy)` : Met à l'échelle les coordonnées.
- `rotate(degrees)` : Tourne autour de l'origine actuelle.
- `skew(sx, sy)` : Incline le système de coordonnées.
- `concat(matrix)` : Multiplie par une `Matrix33` ou `Matrix44` personnalisée.
- `setMatrix(matrix)` : Remplace entièrement la matrice actuelle.
- `resetMatrix()` : Réinitialise à la matrice identité.
- `getLocalToDevice()` : Retourne la matrice de transformation totale actuelle.

## Découpage

Le découpage restreint la zone où le dessin peut se produire.

- `clipRect(rect, mode, antiAlias)` : Découpe à un rectangle.
- `clipRRect(rrect, mode, antiAlias)` : Découpe à un rectangle arrondi.
- `clipPath(path, mode, antiAlias)` : Découpe à un chemin.
- `clipRegion(region, mode)` : Découpe à une région (alignée sur les pixels).

## Méthodes de dessin

**Exemple visuel :**
Voir [`examples/scenes/src/GeometryScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/GeometryScene.java) pour des démos de primitives de dessin.

![Primitives du Canvas](../images/canvas_primitives.png)

### Primitives de base

```java
// Dessiner un point (pixel ou cercle selon le cap du paint)
canvas.drawPoint(50, 50, new Paint().setColor(0xFF0000FF).setStrokeWidth(5));

// Dessiner une ligne
canvas.drawLine(10, 10, 100, 100, paint);

// Dessiner un rectangle (contour ou remplissage selon le mode du paint)
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);

// Dessiner un cercle
canvas.drawCircle(100, 100, 40, paint);

// Dessiner un ovale
canvas.drawOval(Rect.makeXYWH(50, 50, 100, 50), paint);

// Dessiner un rectangle arrondi (les rayons peuvent être complexes)
canvas.drawRRect(RRect.makeXYWH(50, 50, 100, 100, 10), paint);

// Dessiner un arc (tranche de tarte ou trait)
// startAngle : 0 est à droite, sweepAngle : degrés dans le sens horaire
canvas.drawArc(Rect.makeXYWH(50, 50, 100, 100), 0, 90, true, paint);
```

- `drawPoint(x, y, paint)` : Dessine un point unique.
- `drawPoints(points, paint)` : Dessine une collection de points (ou lignes/polygones selon le cap du paint).
- `drawLine(x0, y0, x1, y1, paint)` : Dessine un segment de ligne.
- `drawLines(points, paint)` : Dessine des segments de ligne séparés pour chaque paire de points.
- `drawRect(rect, paint)` : Dessine un rectangle.
- `drawOval(rect, paint)` : Dessine un ovale.
- `drawCircle(x, y, radius, paint)` : Dessine un cercle.
- `drawRRect(rrect, paint)` : Dessine un rectangle arrondi.
- `drawDRRect(outer, inner, paint)` : Dessine la zone entre deux rectangles arrondis (anneau).
- `drawArc(rect, startAngle, sweepAngle, useCenter, paint)` : Dessine un secteur (tranche de tarte) ou un trait d'arc.
- `drawPath(path, paint)` : Dessine un chemin.
- `drawRegion(region, paint)` : Dessine une région spécifique.

### Remplissages et effacements

```java
// Remplir tout le canvas/calque avec une couleur spécifique (se mélange au contenu existant)
canvas.drawColor(0x80FF0000); // Superposition rouge à 50%

// Effacer tout le canvas en transparent (remplace le contenu, pas de mélange)
canvas.clear(0x00000000);

// Remplir le découpage actuel avec un paint spécifique
// Utile pour remplir l'écran avec un Shader ou un effet Paint complexe
canvas.drawPaint(new Paint().setShader(myGradient));
```

- `clear(color)` : Remplit toute la région de découpage avec une couleur (remplace les pixels, ignore le mélange).
- `drawColor(color, mode)` : Remplit le découpage avec une couleur (respecte le mélange).
- `drawPaint(paint)` : Remplit le découpage avec le paint donné (utile pour remplir avec un Shader).

### Images et Bitmaps

```java
// Dessiner une image à (0, 0)
canvas.drawImage(image, 0, 0);

// Dessiner une image mise à l'échelle vers un rectangle spécifique
canvas.drawImageRect(image, Rect.makeXYWH(0, 0, 200, 200));

// Dessiner une image 9-slice (élément d'interface utilisateur extensible)
// center : la région centrale extensible de l'image source
// dst : le rectangle cible dans lequel dessiner
canvas.drawImageNine(image, IRect.makeLTRB(10, 10, 20, 20), Rect.makeXYWH(0, 0, 100, 50), FilterMode.LINEAR, null);
```

- `drawImage(image, x, y, paint)` : Dessine une image aux coordonnées.
- `drawImageRect(image, src, dst, sampling, paint, strict)` : Dessine un sous-ensemble d'une image mis à l'échelle vers un rectangle de destination.
- `drawImageNine(image, center, dst, filter, paint)` : Dessine une image 9-slice extensible.
- `drawBitmap(bitmap, x, y, paint)` : Dessine un bitmap (données raster).

### Texte

```java
// Dessin de texte simple
canvas.drawString("Hello World", 50, 50, font, paint);

// Dessin de texte avancé utilisant TextBlob (mise en page pré-calculée)
canvas.drawTextBlob(blob, 50, 50, paint);

// Dessin d'une TextLine (depuis Shaper)
canvas.drawTextLine(line, 50, 50, paint);
```

- `drawString(string, x, y, font, paint)` : Dessine une chaîne simple.
- `drawTextBlob(blob, x, y, paint)` : Dessine un blob de texte pré-calculé.
- `drawTextLine(line, x, y, paint)` : Dessine une `TextLine` mise en forme.

### Dessin avancé

```java
// Dessiner un maillage de triangles (par exemple, pour des effets 3D personnalisés ou des déformations)
canvas.drawVertices(
    new Point[] { new Point(0, 0), new Point(100, 0), new Point(50, 100) },
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF }, // Couleurs par sommet
    null, // Pas de coordonnées de texture
    null, // Pas d'indices (utiliser les sommets dans l'ordre)
    BlendMode.MODULATE,
    new Paint()
);

// Dessiner une ombre portée pour un rectangle
// (Plus simple que de créer un filtre d'ombre manuellement)
canvas.drawRectShadow(
    Rect.makeXYWH(50, 50, 100, 100),
    5, 5,  // dx, dy
    10,    // flou
    0,     // étalement
    0x80000000 // Couleur de l'ombre
);
```

- `drawPicture(picture)` : Rejoue une `Picture` enregistrée.
- `drawDrawable(drawable)` : Dessine un objet `Drawable` dynamique.
- `drawVertices(positions, colors, texCoords, indices, mode, paint)` : Dessine un maillage de triangles.
- `drawPatch(cubics, colors, texCoords, mode, paint)` : Dessine une patch de Coons.
- `drawRectShadow(rect, dx, dy, blur, spread, color)` : Aide pour dessiner une ombre portée simple.

## Accès aux pixels

```java
// Lire les pixels du canvas dans un bitmap
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));
canvas.readPixels(bmp, 0, 0); // Lire à partir de (0,0) sur le canvas

// Écrire les pixels sur le canvas
canvas.writePixels(bmp, 50, 50);
```

- `readPixels(bitmap, srcX, srcY)` : Lit les pixels du canvas dans un bitmap.
- `writePixels(bitmap, x, y)` : Écrit les pixels d'un bitmap sur le canvas.