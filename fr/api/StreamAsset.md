# Référence API : StreamAsset

`StreamAsset` représente un flux de données accessible en lecture seule et permettant la recherche. Il est souvent utilisé pour charger des données de police ou d'autres ressources nécessitant un accès aléatoire.

## Vue d'ensemble

Un `StreamAsset` fournit des méthodes pour lire, sauter et se déplacer dans un flux d'octets. C'est un objet "Géré", ce qui signifie que Skija s'occupera du nettoyage de la mémoire native.

## Méthodes

### Lecture

- `read(buffer, size)` : Lit jusqu'à `size` octets dans le tableau d'octets fourni. Retourne le nombre d'octets effectivement lus.
- `peek(buffer, size)` : Jette un coup d'œil aux données sans avancer la position du flux.
- `isAtEnd()` : Retourne `true` si le flux a atteint la fin.

### Navigation

- `skip(size)` : Saute le nombre spécifié d'octets.
- `rewind()` : Ramène la position du flux au début.
- `seek(position)` : Se positionne à une position absolue spécifique.
- `move(offset)` : Déplace la position d'un décalage relatif.

### Informations

- `getPosition()` : Retourne le décalage d'octet actuel dans le flux.
- `getLength()` : Retourne la longueur totale du flux (si connue).
- `hasPosition()` : Retourne `true` si le flux prend en charge la recherche/le positionnement.
- `hasLength()` : Retourne `true` si la longueur est connue.
- `getMemoryBase()` : Si le flux est basé sur la mémoire, retourne l'adresse mémoire native.

### Duplication

- `duplicate()` : Crée un nouveau `StreamAsset` qui partage les mêmes données mais possède une position indépendante.
- `fork()` : Similaire à duplicate, mais le nouveau flux commence à la position actuelle de l'original.

## Utilisation en Typographie

`StreamAsset` est le plus souvent rencontré lors du travail avec des données de [`Typeface`](Typeface.md) :

```java
Typeface typeface = Typeface.makeFromFile("fonts/Inter.ttf");
StreamAsset stream = typeface.openStream();

if (stream != null) {
    byte[] header = new byte[4];
    stream.read(header, 4);
    // ... traiter les données de la police
}
```