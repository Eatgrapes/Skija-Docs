# Referencia de la API: Picture y PictureRecorder

Cuando necesitas dibujar la misma escena compleja múltiples veces, o si tienes un fondo estático que no cambia, debes usar `Picture`. Este objeto graba tus comandos de dibujo en un formato altamente optimizado que Skia puede "reproducir" mucho más rápido que ejecutar llamadas individuales a Java en cada fotograma.

## El Flujo de Trabajo

Grabar un picture implica usar un `PictureRecorder` para obtener un `Canvas` temporal.

```java
PictureRecorder recorder = new PictureRecorder();

// 1. Define el "rectángulo de recorte" (el área que pretendes dibujar)
Canvas recordingCanvas = recorder.beginRecording(Rect.makeWH(500, 500));

// 2. Realiza tus comandos de dibujo como de costumbre
Paint p = new Paint().setColor(0xFF4285F4);
recordingCanvas.drawCircle(250, 250, 100, p);
// ... más dibujos ...

// 3. Detén la grabación y obtén el objeto Picture
Picture picture = recorder.finishRecordingAsPicture();
```

## API de PictureRecorder

El `PictureRecorder` es el objeto con estado que se utiliza para capturar comandos.

- `beginRecording(bounds)`: Inicia la grabación. Devuelve un `Canvas` en el que puedes dibujar. Todos los comandos de dibujo enviados a este canvas se almacenarán.
- `getRecordingCanvas()`: Devuelve el canvas de grabación activo, o `null` si no se está grabando.
- `finishRecordingAsPicture()`: Finaliza la grabación y devuelve el objeto `Picture` inmutable. Invalida el canvas de grabación.
- `finishRecordingAsPicture(cullRect)`: Finaliza la grabación, pero sobrescribe el rectángulo de recorte almacenado en el picture.

## Creando Pictures (Serialización)

- `makePlaceholder(cullRect)`: Crea un picture de marcador de posición que no dibuja nada pero tiene límites específicos.
- `makeFromData(data)`: Deserializa un picture desde un objeto `Data` (creado mediante `serializeToData`).

## Dibujando el Picture

Una vez que tienes un objeto `Picture`, puedes dibujarlo en cualquier otro `Canvas`.

```java
canvas.drawPicture(picture);
```

## ¿Por qué usar Picture?

1.  **Rendimiento:** Si tienes 1,000 llamadas de dibujo, Java tiene que llamar al código nativo 1,000 veces por fotograma. Si las grabas en un `Picture`, es solo **una** llamada nativa por fotograma.
2.  **Seguridad en Hilos:** Mientras que un `Canvas` está vinculado a un hilo, un `Picture` es inmutable y se puede dibujar desde cualquier hilo (aunque normalmente lo dibujas en tu hilo principal de renderizado).
3.  **Almacenamiento en Caché de Teselación:** Skia puede almacenar en caché la geometría compleja (como rutas) dentro de un `Picture` mejor de lo que puede hacerlo para llamadas individuales.

## Mejores Prácticas y Errores Comunes

- **No grabes todo:** Si tu contenido cambia en cada fotograma (como un personaje en movimiento), grabar un nuevo `Picture` cada vez podría ser *más lento* debido a la sobrecarga del grabador.
- **Vida Útil del Canvas:** El `Canvas` que obtienes de `beginRecording()` solo es válido hasta que llames a `finishRecordingAsPicture()`. ¡No intentes mantener una referencia a él!
- **Memoria:** Los pictures ocupan memoria nativa. Si estás creando muchos pictures pequeños, recuerda `close()` cuando ya no sean necesarios.