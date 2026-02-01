# Referencia de API: CubicResampler

`CubicResampler` es un tipo de [`SamplingMode`](SamplingMode.md) utilizado para el escalado de imágenes de alta calidad mediante interpolación bicúbica.

## Descripción General

Un remuestreador cúbico se define por dos parámetros, **B** y **C**, que controlan la forma del filtro cúbico. Diferentes valores resultan en características distintas (nitidez, *ringing*, etc.).

## Constantes

`CubicResampler` proporciona dos preajustes de uso común:

- `CubicResampler.MITCHELL`: (B=1/3, C=1/3). Un buen equilibrio entre nitidez y artefactos.
- `CubicResampler.CATMULL_ROM`: (B=0, C=1/2). Más nítido que Mitchell, se utiliza a menudo para reducir la escala.

## Parámetros

- **B (Desenfoque)**: Controla el "desenfoque" del filtro.
- **C (Ringing)**: Controla el "*ringing*" o "halos" alrededor de los bordes.

## Uso

```java
// Usar el remuestreador Mitchell para escalado de alta calidad
canvas.drawImageRect(image, dstRect, CubicResampler.MITCHELL, null);

// Remuestreador personalizado
CubicResampler custom = new CubicResampler(0.2f, 0.4f);
canvas.drawImageRect(image, dstRect, custom, paint);
```

## Referencias

- "Reconstruction Filters in Computer Graphics" (Mitchell & Netravali, 1988).
- [Descripción General del Filtrado Bicúbico](https://entropymine.com/imageworsener/bicubic/)