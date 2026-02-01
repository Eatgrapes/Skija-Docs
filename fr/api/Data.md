# Référence API : Data

La classe `Data` est un wrapper immuable autour d'un tampon mémoire brut (tableau d'octets). Elle est utilisée dans tout Skija pour passer des données binaires (comme des images encodées, des polices ou des shaders) entre Java et la bibliothèque native C++ Skia de manière efficace.

## Création

### À partir d'un tableau d'octets Java
Copie les données d'un `byte[]` Java.

```java
byte[] bytes = new byte[] { 1, 2, 3, 4 };
Data data = Data.makeFromBytes(bytes);
```

### À partir d'un fichier
Mappe efficacement un fichier en mémoire (en utilisant `mmap` lorsque c'est possible).

```java
Data data = Data.makeFromFileName("assets/image.png");
if (data == null) {
    System.err.println("Fichier non trouvé");
}
```

### Vide
Crée un objet data vide.

```java
Data empty = Data.makeEmpty();
```

## Modification (Sous-ensemble)

Puisque `Data` est immuable, vous ne pouvez pas modifier son contenu, mais vous pouvez créer une vue sur un sous-ensemble de celui-ci (sans copie si supporté, ou avec une copie peu coûteuse).

```java
// Crée un nouvel objet Data représentant les octets 10 à 20
Data subset = data.makeSubset(10, 10);
```

## Accès au contenu

### En tant que tableau d'octets
Copie les données natives dans un `byte[]` Java.

```java
byte[] content = data.getBytes();

// Ou une plage
byte[] part = data.getBytes(0, 10);
```

### En tant que ByteBuffer
Enveloppe directement la mémoire native dans un `ByteBuffer` Java. C'est la manière la plus efficace de lire les données sans copie.

```java
ByteBuffer buffer = data.toByteBuffer();
// Lire depuis le buffer...
```

### Taille
```java
long size = data.getSize();
```

## Cycle de vie

`Data` étend `Managed` et utilise de la mémoire native. Idéalement, utilisez try-with-resources ou appelez `close()` lorsque vous avez terminé, bien que le ramasse-miettes finira par la libérer.

```java
try (Data data = Data.makeFromFileName("large_file.dat")) {
    // utiliser data...
} // data.close() appelé automatiquement
```