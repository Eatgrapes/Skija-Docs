# Рендеринг на GPU

Хотя Skija отлично работает на CPU, её истинная мощь раскрывается при использовании аппаратного ускорения через OpenGL, Metal, Vulkan или Direct3D.

## Основные понятия

### DirectContext
`DirectContext` представляет соединение с драйвером GPU. Он управляет ресурсами GPU, кэшами и состоянием низкоуровневого графического API.

### BackendRenderTarget
`BackendRenderTarget` представляет собой буфер (например, Framebuffer OpenGL или текстуру Metal), в который Skia может выполнять отрисовку.

## Пример: OpenGL с LWJGL

Для рендеринга в окно OpenGL с использованием LWJGL:

1.  **Инициализация OpenGL:** Используйте LWJGL для создания окна и контекста GL.
2.  **Создание DirectContext:**
    ```java
    DirectContext context = DirectContext.makeGL();
    ```
3.  **Создание Render Target:**
    Необходимо указать Skia, в какой framebuffer выполнять отрисовку (обычно `0` для окна по умолчанию).
    ```java
    BackendRenderTarget rt = BackendRenderTarget.makeGL(
        width, height, 
        0, /* samples */ 
        8, /* stencil */ 
        fbId, /* GL framebuffer id */ 
        FramebufferFormat.GR_GL_RGBA8
    );
    ```
4.  **Создание Surface:**
    ```java
    Surface surface = Surface.makeFromBackendRenderTarget(
        context, rt, 
        SurfaceOrigin.BOTTOM_LEFT, 
        ColorType.RGBA_8888, 
        ColorSpace.getSRGB()
    );
    ```

## Цикл рендеринга

В среде с аппаратным ускорением необходимо вручную указывать Skia отправлять команды на GPU.

```java
while (!window.shouldClose()) {
    Canvas canvas = surface.getCanvas();
    
    // 1. Отрисовка содержимого
    canvas.clear(0xFFFFFFFF);
    canvas.drawCircle(50, 50, 30, paint);
    
    // 2. Отправка команд на GPU
    context.flush();
    
    // 3. Смена буферов (зависит от графического API)
    window.swapBuffers();
}
```

## Рекомендации

- **Переиспользуйте Context:** Создание `DirectContext` — дорогая операция. Создайте его один раз и используйте на протяжении всего жизненного цикла приложения.
- **Обработка изменения размера:** При изменении размера окна необходимо `close()` старые `Surface` и `BackendRenderTarget` и создать новые, соответствующие новым размерам.
- **Управление ресурсами:** Поверхности, использующие GPU, следует закрывать, когда они больше не нужны, чтобы освободить видеопамять.