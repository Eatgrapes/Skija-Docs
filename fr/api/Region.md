# Référence API : Region

La classe `Region` représente une zone complexe sur le canevas, similaire à un `Path`, mais définie par des coordonnées **entières**. Les régions sont hautement optimisées pour les opérations booléennes (comme l'intersection, l'union, la différence) et pour tester si un point ou un rectangle est à l'intérieur de la zone.

## Vue d'ensemble

Contrairement à `Path`, qui utilise des coordonnées à virgule flottante et peut contenir des courbes, une `Region` est fondamentalement une collection de lignes de balayage horizontales. Elle est efficace pour les tests de collision et le découpage.

## Création et modification de régions

```java
// Créer une région vide
Region region = new Region();

// La définir comme un rectangle
region.setRect(new IRect(0, 0, 100, 100));

// La définir à partir d'un Path
// (Nécessite une région de 'clip' pour définir les limites maximales)
Path path = new Path().addCircle(50, 50, 40);
Region clip = new Region();
clip.setRect(new IRect(0, 0, 200, 200));
region.setPath(path, clip);
```

## Opérations booléennes

La puissance de `Region` réside dans sa capacité à combiner plusieurs zones à l'aide d'opérateurs logiques.

```java
Region regionA = new Region();
regionA.setRect(new IRect(0, 0, 100, 100));

Region regionB = new Region();
regionB.setRect(new IRect(50, 50, 150, 150));

// Intersection : Le résultat est la zone de chevauchement (50, 50, 100, 100)
regionA.op(regionB, RegionOp.INTERSECT);

// Union : Le résultat est la zone combinée des deux
regionA.op(regionB, RegionOp.UNION);

// Différence : Retirer B de A
regionA.op(regionB, RegionOp.DIFFERENCE);
```

Opérations disponibles (`RegionOp`) :
- `DIFFERENCE` : A - B
- `INTERSECT` : A & B
- `UNION` : A | B
- `XOR` : (A | B) - (A & B)
- `REVERSE_DIFFERENCE` : B - A
- `REPLACE` : B

## Test de collision

Vous pouvez vérifier si un point ou un rectangle est à l'intérieur d'une région.

```java
if (region.contains(10, 10)) {
    // Le point est à l'intérieur
}

if (region.quickReject(new IRect(200, 200, 300, 300))) {
    // Le rectangle est définitivement À L'EXTÉRIEUR de la région
}
```

## Utilisation avec Canvas

Vous pouvez utiliser une `Region` pour découper le `Canvas`.

```java
canvas.clipRegion(region);
```

**Note :** Les opérations sur `Region` (comme `setPath`) sont strictement basées sur des entiers. Les courbes seront approximées par de petits pas. Pour un rendu de haute précision, préférez `Path`. `Region` est idéale pour les tests de collision d'interface utilisateur complexes ou les masques de découpage alignés sur les pixels.