# Referencia de la API: DirectContext (Estado y Contexto GL)

La clase `DirectContext` es tu puente hacia la GPU. Gestiona la conexión con la API gráfica subyacente (OpenGL, Metal, Vulkan o Direct3D) y maneja el ciclo de vida de los recursos de la GPU.

## Crear un Contexto

Normalmente se crea un `DirectContext` por aplicación y se reutiliza durante toda su vida útil.

```java
// Para OpenGL
DirectContext context = DirectContext.makeGL();

// Para Metal (macOS/iOS)
DirectContext context = DirectContext.makeMetal(devicePtr, queuePtr);
```

## Envío de Comandos

Skia registra comandos de dibujo en un búfer interno. Debes indicar explícitamente a Skia que envíe estos comandos a la GPU.

- `flush()`: Envía los comandos registrados al búfer del controlador de la GPU.
- `submit()`: Asegura que la GPU comience realmente a procesar los comandos.
- `flushAndSubmit(syncCpu)`: La forma más común de finalizar un fotograma. Si `syncCpu` es verdadero, se bloquea hasta que la GPU haya terminado completamente.

```java
context.flushAndSubmit(true);
```

## Gestionar el Estado GL

Cuando Skija se usa junto con otro código OpenGL (por ejemplo, en un motor de juegos o una interfaz de usuario personalizada), el código externo podría cambiar el estado de OpenGL (como vincular un programa diferente o cambiar el viewport). Skia necesita conocer estos cambios para evitar errores de renderizado.

### Restablecer el Estado

Si tú o una biblioteca que uses modifica el estado de OpenGL, **debes** notificar a Skia:

```java
// Notificar a Skia que TODOS los estados de OpenGL podrían haber cambiado
context.resetGLAll();

// O ser más específico para un mejor rendimiento
context.reset(BackendState.GL_PROGRAM, BackendState.GL_TEXTURE_BINDING);
```

### Abandonar el Contexto

Si se pierde el contexto de GPU subyacente (por ejemplo, se destruyó la ventana o se bloqueó el controlador), usa `abandon()` para evitar que Skia realice más llamadas nativas que podrían causar un bloqueo.

```java
context.abandon();
```

## Mejores Prácticas

1.  **Seguridad de Hilos:** Un `DirectContext` **no** es seguro para hilos. Todas las llamadas a él, y todo el dibujo en superficies asociadas a él, deben ocurrir en el mismo hilo.
2.  **Higiene del Estado:** Si mezclas Skija con llamadas OpenGL directas, llama siempre a `context.resetGLAll()` antes de devolver el control a Skija.
3.  **Flush de Superficie:** Si tienes múltiples superficies, puedes hacerles flush individualmente: `context.flush(surface)`.