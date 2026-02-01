# Référence API : DirectContext (État GL & Contexte)

La classe `DirectContext` est votre pont vers le GPU. Elle gère la connexion à l'API graphique sous-jacente (OpenGL, Metal, Vulkan ou Direct3D) et prend en charge le cycle de vie des ressources GPU.

## Création d'un Contexte

Vous créez généralement un `DirectContext` par application et le réutilisez tout au long de sa durée de vie.

```java
// Pour OpenGL
DirectContext context = DirectContext.makeGL();

// Pour Metal (macOS/iOS)
DirectContext context = DirectContext.makeMetal(devicePtr, queuePtr);
```

## Soumission de Commandes

Skia enregistre les commandes de dessin dans un tampon interne. Vous devez explicitement dire à Skia d'envoyer ces commandes au GPU.

- `flush()` : Soumet les commandes enregistrées dans le tampon du pilote GPU.
- `submit()` : Garantit que le GPU commence réellement à traiter les commandes.
- `flushAndSubmit(syncCpu)` : La méthode la plus courante pour terminer une frame. Si `syncCpu` est vrai, elle bloque jusqu'à ce que le GPU ait complètement terminé.

```java
context.flushAndSubmit(true);
```

## Gestion de l'État GL

Lorsque Skija est utilisé conjointement avec d'autres codes OpenGL (par exemple, dans un moteur de jeu ou une interface utilisateur personnalisée), le code externe peut modifier l'état OpenGL (comme lier un programme différent ou changer le viewport). Skia a besoin de connaître ces changements pour éviter des erreurs de rendu.

### Réinitialisation de l'État

Si vous ou une bibliothèque que vous utilisez modifiez l'état OpenGL, vous **devez** en informer Skia :

```java
// Informer Skia que TOUS les états OpenGL ont pu changer
context.resetGLAll();

// Ou être plus spécifique pour de meilleures performances
context.reset(BackendState.GL_PROGRAM, BackendState.GL_TEXTURE_BINDING);
```

### Abandon du Contexte

Si le contexte GPU sous-jacent est perdu (par exemple, la fenêtre a été détruite ou le pilote a planté), utilisez `abandon()` pour empêcher Skia d'effectuer d'autres appels natifs qui pourraient provoquer un crash.

```java
context.abandon();
```

## Bonnes Pratiques

1.  **Sécurité des Threads :** Un `DirectContext` n'est **pas** thread-safe. Tous les appels à celui-ci, et tout dessin sur les surfaces qui lui sont associées, doivent se produire sur le même thread.
2.  **Hygiène de l'État :** Si vous mélangez Skija avec des appels OpenGL bruts, appelez toujours `context.resetGLAll()` avant de rendre le contrôle à Skija.
3.  **Flush de Surface :** Si vous avez plusieurs surfaces, vous pouvez les vider individuellement : `context.flush(surface)`.