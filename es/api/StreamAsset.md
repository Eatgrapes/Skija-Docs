# Referencia de API: StreamAsset

`StreamAsset` representa un flujo de datos de solo lectura y con capacidad de búsqueda (seek). Se utiliza frecuentemente para cargar datos de fuentes tipográficas u otros recursos donde se requiere acceso aleatorio.

## Descripción General

Un `StreamAsset` proporciona métodos para leer, saltar y buscar dentro de un flujo de bytes. Es un objeto "Gestionado" (Managed), lo que significa que Skija se encargará de la limpieza de la memoria nativa.

## Métodos

### Lectura

- `read(buffer, size)`: Lee hasta `size` bytes en el array de bytes proporcionado. Devuelve el número de bytes realmente leídos.
- `peek(buffer, size)`: Observa datos sin avanzar la posición del flujo.
- `isAtEnd()`: Devuelve `true` si el flujo ha llegado al final.

### Navegación

- `skip(size)`: Salta el número especificado de bytes.
- `rewind()`: Mueve la posición del flujo de vuelta al principio.
- `seek(position)`: Busca (seeks) una posición absoluta específica.
- `move(offset)`: Mueve la posición por un desplazamiento relativo.

### Información

- `getPosition()`: Devuelve el desplazamiento de bytes actual en el flujo.
- `getLength()`: Devuelve la longitud total del flujo (si se conoce).
- `hasPosition()`: Devuelve `true` si el flujo admite búsqueda/posicionamiento.
- `hasLength()`: Devuelve `true` si se conoce la longitud.
- `getMemoryBase()`: Si el flujo está respaldado por memoria, devuelve la dirección de memoria nativa.

### Duplicación

- `duplicate()`: Crea un nuevo `StreamAsset` que comparte los mismos datos pero tiene una posición independiente.
- `fork()`: Similar a duplicate, pero el nuevo flujo comienza en la posición actual del original.

## Uso en Tipografía

`StreamAsset` se encuentra más comúnmente cuando se trabaja con datos de [`Typeface`](Typeface.md):

```java
Typeface typeface = Typeface.makeFromFile("fonts/Inter.ttf");
StreamAsset stream = typeface.openStream();

if (stream != null) {
    byte[] header = new byte[4];
    stream.read(header, 4);
    // ... procesar datos de la fuente
}
```