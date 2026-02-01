# Référence API : Document (Génération PDF)

La classe `Document` vous permet de capturer des commandes de dessin et de les enregistrer dans des formats vectoriels, notamment le **PDF**. Contrairement à une `Surface`, qui rend en pixels, un `Document` préserve la nature vectorielle de vos dessins.

## Créer un PDF

Pour créer un PDF, vous avez besoin d'un `WStream` (flux d'écriture) pour recevoir la sortie.

```java
try (FileOutputStream fos = new FileOutputStream("output.pdf");
     WStream stream = new FileOutputStreamWStream(fos);
     Document doc = Document.makePDF(stream)) {
     
    // 1. Démarrer une page
    Canvas canvas = doc.beginPage(595, 842); // Taille A4 en points
    
    // 2. Dessiner sur le canevas de la page
    Paint paint = new Paint().setColor(0xFF4285F4);
    canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
    
    // 3. Terminer la page
    doc.endPage();
    
    // 4. Fermer le document pour finaliser le fichier
    doc.close();
}
```

## Ajouter des métadonnées

Vous pouvez inclure des métadonnées PDF (Titre, Auteur, etc.) lors de la création du document :

```java
Document doc = Document.makePDF(stream, 
    "Mon document Skija", // Titre
    "Développeur Skija",  // Auteur
    "Démonstration graphique", // Sujet
    "vectoriel, skia, java", // Mots-clés
    "Moteur Skija",       // Créateur
    "Producteur PDF Skija", // Producteur
    System.currentTimeMillis(), // Date de création
    System.currentTimeMillis()  // Date de modification
);
```

## Considérations importantes

- **Système de coordonnées** : Le PDF utilise les **Points** (1/72 de pouce) comme unité par défaut.
- **Durée de vie du canevas** : Le `Canvas` retourné par `beginPage()` n'est valide que jusqu'à l'appel de `endPage()`. N'essayez pas de l'utiliser après la fin de la page.
- **Polices** : Lors du dessin de texte dans un PDF, Skija tentera d'intégrer les données de police nécessaires. Assurez-vous d'utiliser des polices qui autorisent l'intégration.
- **Vectoriel vs. Raster** : La plupart des opérations Skija (lignes, formes, texte) resteront vectorielles dans le PDF. Cependant, certains effets complexes (comme certains ImageFilters ou Shaders) peuvent amener Skia à rasteriser une partie de la page.