# Ombres dans Skija

Skija propose deux façons distinctes de dessiner des ombres : **les ombres portées 2D** (via ImageFilters) et **les ombres d'élévation 3D** (via ShadowUtils).

## 1. Ombres portées 2D (ImageFilter)

C'est la méthode standard pour ajouter une ombre à une opération de dessin spécifique. L'ombre suit la forme de la géométrie ou de l'image dessinée.

```java
ImageFilter shadow = ImageFilter.makeDropShadow(
    2.0f, 2.0f,   // Décalage (dx, dy)
    3.0f, 3.0f,   // Quantité de flou (sigmaX, sigmaY)
    0x80000000    // Couleur de l'ombre (noir à 50% de transparence)
);

Paint paint = new Paint().setImageFilter(shadow);
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
```

### Ombre portée uniquement
Si vous souhaitez uniquement dessiner l'ombre sans l'objet d'origine (par exemple, pour des superpositions complexes), utilisez `makeDropShadowOnly`.

---

## 2. Ombres d'élévation 3D (ShadowUtils)

`ShadowUtils` fournit un modèle d'ombre plus basé sur la physique, similaire à l'élévation du Material Design. Il calcule comment une source lumineuse à une position 3D spécifique projette une ombre depuis un "occulteur" (un Path) sur le plan du canvas.

### Utilisation de base

```java
Path path = new Path().addRect(Rect.makeXYWH(50, 50, 100, 100));

// Plan Z : élévation de l'objet.
// Généralement constant pour les éléments d'interface plats : (0, 0, elevation)
Point3 elevation = new Point3(0, 0, 10.0f);

// Position de la lumière : coordonnées 3D relatives au canvas
Point3 lightPos = new Point3(250, 0, 600);

float lightRadius = 800.0f;
int ambientColor = 0x10000000;
int spotColor = 0x30000000;

ShadowUtils.drawShadow(
    canvas,
    path,
    elevation,
    lightPos,
    lightRadius,
    ambientColor,
    spotColor,
    ShadowUtilsFlag.TRANSPARENT_OCCLUDER
);

// Note : drawShadow dessine UNIQUEMENT l'ombre.
// Vous devez toujours dessiner l'objet lui-même :
canvas.drawPath(path, new Paint().setColor(0xFFFFFFFF));
```

### Ombre ambiante vs. Ombre directionnelle
- **Ombre ambiante** : Une ombre douce, non directionnelle, causée par une lumière indirecte.
- **Ombre directionnelle** : Une ombre directionnelle causée par la position spécifique de la source lumineuse.
La combinaison des deux crée un effet de profondeur réaliste.

### Drapeaux d'ombre
- `TRANSPARENT_OCCLUDER` : Utilisez ceci si votre objet est semi-transparent, afin que l'ombre ne soit pas tronquée sous l'objet.
- `GEOMETRIC_ONLY` : Optimisation si vous n'avez pas besoin d'un flou de haute qualité.
- `DIRECTIONAL_LIGHT` : Traite la lumière comme étant infiniment éloignée (comme la lumière du soleil).

## Comparaison

| Caractéristique | Ombre portée (ImageFilter) | Ombre d'élévation (ShadowUtils) |
| :--- | :--- | :--- |
| **Modèle** | Flou gaussien 2D | Projection en perspective 3D |
| **Performance** | Rapide (mis en cache par Skia) | Plus complexe, mais hautement optimisé |
| **Utilisation** | Défini sur `Paint` | Appel direct à `ShadowUtils` |
| **Idéal pour** | Texte, lueurs d'interface simples, icônes | Boutons Material Design, cartes, effets de profondeur |

## Exemple visuel

Pour voir ces ombres en action, exécutez l'application d'exemple **Scenes** et sélectionnez la scène **ShadowUtils**.

**Code source :** [`examples/scenes/src/ShadowUtilsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadowUtilsScene.java)

*Figure : Comparaison de divers drapeaux ShadowUtils et positions de lumière.*