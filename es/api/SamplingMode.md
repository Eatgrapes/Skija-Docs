# Referencia de la API: SamplingMode

`SamplingMode` es una interfaz que define cómo se muestrean los píxeles cuando una imagen se escala, rota o transforma.

## Implementaciones

Hay tres formas principales de especificar el muestreo en Skija:

1.  **[`FilterMipmap`](#filtermipmap)**: Filtrado lineal/vecino más cercano estándar con mipmaps opcionales.
2.  **[`CubicResampler`](CubicResampler.md)**: Interpolación bicúbica de alta calidad (Mitchell, Catmull-Rom).
3.  **`SamplingModeAnisotropic`**: Filtrado de alta calidad para texturas vistas en ángulos pronunciados.

## Preajustes Comunes

- `SamplingMode.DEFAULT`: Filtrado del vecino más cercano (más rápido, con bloques).
- `SamplingMode.LINEAR`: Filtrado bilineal (suave, predeterminado para la mayoría de usos).
- `SamplingMode.MITCHELL`: Bicúbico de alta calidad (suave y nítido).
- `SamplingMode.CATMULL_ROM`: Bicúbico muy nítido.

## FilterMipmap

Este es el modo de muestreo más común. Utiliza dos parámetros:

### FilterMode
- `NEAREST`: Muestrea el único píxel más cercano.
- `LINEAR`: Interpola entre los 4 píxeles más cercanos.

### MipmapMode
- `NONE`: No se utilizan mipmaps.
- `NEAREST`: Muestrea del nivel de mipmap más cercano.
- `LINEAR`: Interpola entre dos niveles de mipmap (filtrado trilineal).

## Uso

```java
// Muestreo bilineal
canvas.drawImage(img, 0, 0, SamplingMode.LINEAR, null);

// Vecino más cercano (estilo pixel art)
canvas.drawImage(img, 0, 0, SamplingMode.DEFAULT, null);

// Bicúbico de alta calidad
canvas.drawImage(img, 0, 0, CubicResampler.MITCHELL, null);
```