# Renderizado por GPU

Si bien Skija tiene un rendimiento excepcional en la CPU, su verdadero poder se despliega al utilizar aceleración por GPU mediante OpenGL, Metal, Vulkan o Direct3D.

## Conceptos

### DirectContext
El `DirectContext` representa la conexión con el controlador de la GPU. Gestiona los recursos de la GPU, las cachés y el estado de la API gráfica subyacente.

### BackendRenderTarget
Un `BackendRenderTarget` representa un búfer (como un Framebuffer de OpenGL o una Textura de Metal) en el que Skia puede dibujar.

## Ejemplo: OpenGL con LWJGL

Para renderizar en una ventana OpenGL usando LWJGL:

1.  **Inicializar OpenGL:** Usa LWJGL para crear una ventana y un contexto GL.
2.  **Crear DirectContext:**
    ```java
    DirectContext context = DirectContext.makeGL();
    ```
3.  **Crear Render Target:**
    Debes indicarle a Skia en qué framebuffer dibujar (normalmente `0` para la ventana por defecto).
    ```java
    BackendRenderTarget rt = BackendRenderTarget.makeGL(
        width, height, 
        0, /* muestras */ 
        8, /* stencil */ 
        fbId, /* id del framebuffer GL */ 
        FramebufferFormat.GR_GL_RGBA8
    );
    ```
4.  **Crear Surface:**
    ```java
    Surface surface = Surface.makeFromBackendRenderTarget(
        context, rt, 
        SurfaceOrigin.BOTTOM_LEFT, 
        ColorType.RGBA_8888, 
        ColorSpace.getSRGB()
    );
    ```

## El Bucle de Renderizado

En un entorno acelerado por GPU, debes indicar manualmente a Skia que envíe los comandos a la GPU.

```java
while (!window.shouldClose()) {
    Canvas canvas = surface.getCanvas();
    
    // 1. Dibuja tu contenido
    canvas.clear(0xFFFFFFFF);
    canvas.drawCircle(50, 50, 30, paint);
    
    // 2. Envía los comandos a la GPU
    context.flush();
    
    // 3. Intercambia los búferes (específico de la API gráfica)
    window.swapBuffers();
}
```

## Mejores Prácticas

- **Reutiliza el Contexto:** Crear un `DirectContext` es costoso. Créalo una vez y úsalo durante toda la vida útil de tu aplicación.
- **Maneja el Cambio de Tamaño:** Cuando se redimensiona la ventana, debes `close()` el `Surface` y `BackendRenderTarget` antiguos y crear otros nuevos que coincidan con las nuevas dimensiones.
- **Gestión de Recursos:** Las superficies respaldadas por GPU deben cerrarse cuando ya no sean necesarias para liberar VRAM.