# Rendu GPU

Bien que Skija offre d'excellentes performances sur le CPU, sa véritable puissance est décuplée lors de l'utilisation de l'accélération GPU via OpenGL, Metal, Vulkan ou Direct3D.

## Concepts

### DirectContext
Le `DirectContext` représente la connexion au pilote GPU. Il gère les ressources GPU, les caches et l'état de l'API graphique sous-jacente.

### BackendRenderTarget
Un `BackendRenderTarget` représente un tampon (comme un Framebuffer OpenGL ou une Texture Metal) dans lequel Skia peut dessiner.

## Exemple : OpenGL avec LWJGL

Pour effectuer un rendu dans une fenêtre OpenGL en utilisant LWJGL :

1.  **Initialiser OpenGL :** Utilisez LWJGL pour créer une fenêtre et un contexte GL.
2.  **Créer le DirectContext :**
    ```java
    DirectContext context = DirectContext.makeGL();
    ```
3.  **Créer la Cible de Rendu :**
    Vous devez indiquer à Skia dans quel framebuffer dessiner (généralement `0` pour la fenêtre par défaut).
    ```java
    BackendRenderTarget rt = BackendRenderTarget.makeGL(
        width, height, 
        0, /* échantillons */ 
        8, /* stencil */ 
        fbId, /* identifiant du framebuffer GL */ 
        FramebufferFormat.GR_GL_RGBA8
    );
    ```
4.  **Créer la Surface :**
    ```java
    Surface surface = Surface.makeFromBackendRenderTarget(
        context, rt, 
        SurfaceOrigin.BOTTOM_LEFT, 
        ColorType.RGBA_8888, 
        ColorSpace.getSRGB()
    );
    ```

## La Boucle de Rendu

Dans un environnement accéléré par GPU, vous devez manuellement signaler à Skia de soumettre les commandes au GPU.

```java
while (!window.shouldClose()) {
    Canvas canvas = surface.getCanvas();
    
    // 1. Dessinez votre contenu
    canvas.clear(0xFFFFFFFF);
    canvas.drawCircle(50, 50, 30, paint);
    
    // 2. Envoyez les commandes au GPU
    context.flush();
    
    // 3. Échangez les tampons (spécifique à l'API graphique)
    window.swapBuffers();
}
```

## Bonnes Pratiques

- **Réutilisez le Contexte :** Créer un `DirectContext` est coûteux. Créez-le une fois et utilisez-le pendant toute la durée de vie de votre application.
- **Gérez le Redimensionnement :** Lorsque la fenêtre est redimensionnée, vous devez `close()` l'ancienne `Surface` et le `BackendRenderTarget`, puis en créer de nouveaux correspondant aux nouvelles dimensions.
- **Gestion des Ressources :** Les surfaces liées au GPU doivent être fermées lorsqu'elles ne sont plus nécessaires pour libérer la VRAM.