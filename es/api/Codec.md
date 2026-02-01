# Referencia de la API: Codec (Decodificación y Animación)

Si bien `Image.makeDeferredFromEncodedBytes()` es adecuado para imágenes estáticas simples, necesitas la clase `Codec` cuando quieres más control sobre el proceso de decodificación o cuando trabajas con **imágenes animadas** (GIF, WebP animado).

## Cargar un Codec

Un `Codec` representa la "fuente" de una imagen antes de que se convierta en píxeles.

```java
Data data = Data.makeFromFileName("animations/loading.gif");
Codec codec = Codec.makeFromData(data);
```

## Decodificación Básica

Para obtener un solo fotograma estático de un codec:

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(codec.getImageInfo()); // Prepara la memoria
codec.readPixels(bmp); // Decodifica los datos en el bitmap
```

## Manejo de Animaciones

Aquí es donde `Codec` brilla. Te permite iterar a través de los fotogramas de un GIF o WebP.

```java
int frameCount = codec.getFrameCount();
int loopCount = codec.getRepetitionCount(); // -1 para infinito

for (int i = 0; i < frameCount; i++) {
    // 1. Obtener información sobre este fotograma específico (duración, etc.)
    AnimationFrameInfo info = codec.getFrameInfo(i);
    int duration = info.getDuration(); // en milisegundos
    
    // 2. Decodificar el fotograma
    Bitmap frameBmp = new Bitmap();
    frameBmp.allocPixels(codec.getImageInfo());
    codec.readPixels(frameBmp, i);
    
    // 3. Hacer algo con el fotograma...
}
```

## Opciones Avanzadas de Decodificación

### Escalado durante la Decodificación
Si tienes una imagen 4K pero solo la necesitas a 200x200, puedes indicarle al codec que la escale **durante** el proceso de decodificación. Esto es mucho más rápido y usa mucha menos memoria que decodificar la imagen completa y luego escalarla.

```java
ImageInfo smallInfo = ImageInfo.makeN32Premul(200, 200);
Bitmap smallBmp = new Bitmap();
smallBmp.allocPixels(smallInfo);

codec.readPixels(smallBmp); // ¡Decodifica y escala en un solo paso!
```

## Notas Importantes

- **Rebobinado del Flujo:** Algunos codecs (dependiendo de los datos de origen) no se pueden rebobinar. Si necesitas decodificar fotogramas múltiples veces, es más seguro mantener el `Data` en memoria.
- **Espacios de Color:** El codec intentará respetar el espacio de color incrustado en la imagen. Puedes anular esto proporcionando un `ImageInfo` diferente a `readPixels`.
- **Memoria:** El `Codec` en sí es pequeño, pero los objetos `Bitmap` en los que decodificas pueden ser muy grandes. Reutiliza bitmaps cuando sea posible.