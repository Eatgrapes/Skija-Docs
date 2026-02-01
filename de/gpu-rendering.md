# GPU-Rendering

Während Skija auf der CPU außergewöhnlich gut performt, entfaltet es seine wahre Stärke bei der Nutzung von GPU-Beschleunigung über OpenGL, Metal, Vulkan oder Direct3D.

## Konzepte

### DirectContext
Der `DirectContext` repräsentiert die Verbindung zum GPU-Treiber. Er verwaltet GPU-Ressourcen, Caches und den Zustand der zugrundeliegenden Grafik-API.

### BackendRenderTarget
Ein `BackendRenderTarget` repräsentiert einen Puffer (wie einen OpenGL-Framebuffer oder eine Metal-Textur), in den Skia zeichnen kann.

## Beispiel: OpenGL mit LWJGL

So rendern Sie in ein OpenGL-Fenster mit LWJGL:

1.  **OpenGL initialisieren:** Verwenden Sie LWJGL, um ein Fenster und einen GL-Kontext zu erstellen.
2.  **DirectContext erstellen:**
    ```java
    DirectContext context = DirectContext.makeGL();
    ```
3.  **Render Target erstellen:**
    Sie müssen Skia mitteilen, in welchen Framebuffer gezeichnet werden soll (normalerweise `0` für das Standardfenster).
    ```java
    BackendRenderTarget rt = BackendRenderTarget.makeGL(
        width, height, 
        0, /* samples */ 
        8, /* stencil */ 
        fbId, /* GL framebuffer id */ 
        FramebufferFormat.GR_GL_RGBA8
    );
    ```
4.  **Surface erstellen:**
    ```java
    Surface surface = Surface.makeFromBackendRenderTarget(
        context, rt, 
        SurfaceOrigin.BOTTOM_LEFT, 
        ColorType.RGBA_8888, 
        ColorSpace.getSRGB()
    );
    ```

## Die Render-Schleife

In einer GPU-beschleunigten Umgebung müssen Sie Skia manuell anweisen, Befehle an die GPU zu senden.

```java
while (!window.shouldClose()) {
    Canvas canvas = surface.getCanvas();
    
    // 1. Zeichnen Sie Ihre Inhalte
    canvas.clear(0xFFFFFFFF);
    canvas.drawCircle(50, 50, 30, paint);
    
    // 2. Befehle zur GPU senden
    context.flush();
    
    // 3. Puffer tauschen (grafik-API-spezifisch)
    window.swapBuffers();
}
```

## Best Practices

-   **Kontext wiederverwenden:** Das Erstellen eines `DirectContext` ist aufwändig. Erstellen Sie ihn einmal und verwenden Sie ihn für die gesamte Laufzeit Ihrer Anwendung.
-   **Größenänderung behandeln:** Wenn die Fenstergröße geändert wird, müssen Sie die alte `Surface` und das alte `BackendRenderTarget` `close()`n und neue erstellen, die den neuen Abmessungen entsprechen.
-   **Ressourcenverwaltung:** GPU-gestützte Surfaces sollten geschlossen werden, wenn sie nicht mehr benötigt werden, um VRAM freizugeben.