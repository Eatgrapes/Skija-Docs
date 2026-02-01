# API-Referenz: DirectContext (GL-Zustand & Kontext)

Die `DirectContext`-Klasse ist Ihre Brücke zur GPU. Sie verwaltet die Verbindung zur zugrundeliegenden Grafik-API (OpenGL, Metal, Vulkan oder Direct3D) und kümmert sich um den Lebenszyklus von GPU-Ressourcen.

## Einen Kontext erstellen

Typischerweise erstellen Sie einen `DirectContext` pro Anwendung und verwenden ihn während ihrer gesamten Laufzeit wieder.

```java
// Für OpenGL
DirectContext context = DirectContext.makeGL();

// Für Metal (macOS/iOS)
DirectContext context = DirectContext.makeMetal(devicePtr, queuePtr);
```

## Befehlssubmission

Skia zeichnet Zeichenbefehle in einen internen Puffer auf. Sie müssen Skia explizit anweisen, diese Befehle an die GPU zu senden.

- `flush()`: Übermittelt aufgezeichnete Befehle an den Puffer des GPU-Treibers.
- `submit()`: Stellt sicher, dass die GPU tatsächlich mit der Verarbeitung der Befehle beginnt.
- `flushAndSubmit(syncCpu)`: Die gängigste Methode, um einen Frame abzuschließen. Wenn `syncCpu` true ist, blockiert der Aufruf, bis die GPU vollständig fertig ist.

```java
context.flushAndSubmit(true);
```

## GL-Zustand verwalten

Wenn Skija neben anderem OpenGL-Code verwendet wird (z.B. in einer Spiel-Engine oder einer benutzerdefinierten UI), könnte der externe Code den OpenGL-Zustand ändern (z.B. ein anderes Programm binden oder den Viewport ändern). Skia muss über diese Änderungen informiert werden, um Renderfehler zu vermeiden.

### Zustand zurücksetzen

Wenn Sie oder eine von Ihnen verwendete Bibliothek den OpenGL-Zustand modifiziert, **müssen** Sie Skia benachrichtigen:

```java
// Skia mitteilen, dass sich ALLE OpenGL-Zustände geändert haben könnten
context.resetGLAll();

// Oder für bessere Performance spezifischer sein
context.reset(BackendState.GL_PROGRAM, BackendState.GL_TEXTURE_BINDING);
```

### Kontext aufgeben

Wenn der zugrundeliegende GPU-Kontext verloren geht (z.B. weil das Fenster zerstört wurde oder der Treiber abgestürzt ist), verwenden Sie `abandon()`, um zu verhindern, dass Skia weitere native Aufrufe tätigt, die einen Absturz verursachen könnten.

```java
context.abandon();
```

## Best Practices

1.  **Thread-Sicherheit:** Ein `DirectContext` ist **nicht** thread-sicher. Alle Aufrufe darauf und alle Zeichenoperationen auf zugehörigen Surfaces müssen im selben Thread erfolgen.
2.  **Zustandshygiene:** Wenn Sie Skija mit reinen OpenGL-Aufrufen mischen, rufen Sie immer `context.resetGLAll()` auf, bevor Sie die Kontrolle an Skija zurückgeben.
3.  **Surface flushen:** Wenn Sie mehrere Surfaces haben, können Sie sie einzeln flushen: `context.flush(surface)`.