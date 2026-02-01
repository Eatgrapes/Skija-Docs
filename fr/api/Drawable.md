# Référence API : Drawable

La classe `Drawable` vous permet de créer des objets de dessin personnalisés qui encapsulent leur propre logique de dessin et leur état. Elle est similaire à `Picture`, mais alors que `Picture` est un enregistrement statique de commandes de dessin, `Drawable` rappelle votre code Java pendant le rendu, permettant un comportement dynamique.

## Aperçu

Pour utiliser `Drawable`, vous devez créer une sous-classe et redéfinir deux méthodes :
1.  `onDraw(Canvas canvas)` : La logique de dessin.
2.  `onGetBounds()` : Retourne la boîte englobante du dessin.

## Création d'un Drawable personnalisé

```java
public class MyDrawable extends Drawable {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    @Override
    public void onDraw(Canvas canvas) {
        // Ceci est appelé chaque fois que le drawable doit être rendu
        canvas.drawCircle(50, 50, 40, paint);
    }

    @Override
    public Rect onGetBounds() {
        // Retourne les limites conservatrices de ce que vous dessinez
        return Rect.makeXYWH(10, 10, 80, 80);
    }
}
```

## Utilisation d'un Drawable

Vous pouvez dessiner un `Drawable` directement sur un canvas ou le transformer.

```java
MyDrawable drawable = new MyDrawable();

// Dessiner à (0, 0)
drawable.draw(canvas);

// Dessiner à (100, 100)
drawable.draw(canvas, 100, 100);

// Dessiner avec une matrice
drawable.draw(canvas, Matrix33.makeScale(2.0f));
```

Alternativement, `Canvas` a une méthode spécifique pour cela :
```java
canvas.drawDrawable(drawable);
```

## État et Invalidation

`Drawable` a un **ID de Génération** (`getGenerationId()`) qui permet aux clients de mettre en cache le résultat. Si votre drawable change son état interne (par exemple, la couleur ou le texte), vous devez appeler `notifyDrawingChanged()` pour invalider le cache.

```java
public class TextDrawable extends Drawable {
    private String text = "Hello";
    
    public void setText(String newText) {
        this.text = newText;
        // Important : Indiquer à Skija que le contenu a changé !
        notifyDrawingChanged();
    }
    
    // ... implémentation de onDraw ...
}
```

## Drawable vs. Picture

- **Picture** : Lecture rapide, immuable, enregistre les commandes une fois. Idéal pour un contenu statique complexe.
- **Drawable** : Dynamique, appelle le code Java à chaque image. Idéal lorsque la logique détermine quoi dessiner au moment du rendu, ou pour créer des "widgets" réutilisables.