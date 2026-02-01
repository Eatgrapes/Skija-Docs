# Gestion des Ressources

Skija est un wrapper Java autour de la bibliothèque C++ Skia. Cela signifie que de nombreux objets Java sont soutenus par des ressources natives C++. Comprendre comment ces ressources sont gérées est crucial pour construire des applications stables et efficaces.

## Gestion Automatique de la Mémoire

Par défaut, Skija gère la mémoire automatiquement. La plupart des objets Skija étendent la classe `Managed`. Lorsqu'un objet Java est récupéré par le ramasse-miettes (garbage collector), Skija s'assure que la ressource native C++ correspondante est également libérée.

```java
void drawSomething(Canvas canvas) {
    Paint paint = new Paint(); // Ressource native allouée
    canvas.drawCircle(50, 50, 20, paint);
} // paint sort du scope, sera nettoyé par le GC éventuellement
```

Pour la plupart des cas d'utilisation, ce comportement "sûr par défaut" est exactement ce que vous voulez.

## Libération Manuelle des Ressources

Dans les applications critiques en termes de performances ou lors de la manipulation de nombreux objets à courte durée de vie, vous pourriez vouloir libérer les ressources natives immédiatement plutôt que d'attendre le Garbage Collector.

Tous les objets `Managed` implémentent `AutoCloseable`, vous pouvez donc utiliser le motif `try-with-resources` :

```java
void drawCircle(Canvas canvas) {
    try (Paint p = new Paint()) {
        canvas.drawCircle(50, 50, 20, p);
    } // La ressource native est libérée IMMÉDIATEMENT ici
}
```

**Avertissement :** Une fois qu'un objet est fermé (`close`), il ne peut plus être utilisé. Tenter d'utiliser un objet fermé entraînera une exception ou un plantage.

## Réutilisation des Objets

Étant donné que la création d'objets natifs peut avoir un certain coût, il est souvent préférable de les réutiliser, en particulier dans une boucle de rendu.

```java
class MyApp {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    void onRender(Canvas canvas) {
        canvas.drawCircle(100, 100, 50, paint); // Réutilise le même objet paint
    }
}
```

## Encapsulation et Getters

Skija utilise une convention spécifique pour ses classes de données (comme `Rect`, `Color4f`). Vous verrez souvent des champs publics commençant par un underscore (par exemple, `_r`, `_g`, `_b` dans `Color4f`).

**Convention :**
- Les champs commençant par `_` doivent être traités comme **privés/internes**.
- Utilisez toujours les **getters** fournis (par exemple, `getR()`, `getG()`) pour un accès public via l'API.

```java
Color4f color = new Color4f(1f, 0f, 0f);

float r = color._r;    // À ÉVITER : Accès au champ interne
float r2 = color.getR(); // RECOMMANDÉ : Utilisation du getter public
```

Cette approche permet à Skija de maintenir une API stable même si l'implémentation interne de ces classes de données change dans les versions futures.