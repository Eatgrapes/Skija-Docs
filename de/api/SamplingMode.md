# API-Referenz: SamplingMode

`SamplingMode` ist ein Interface, das definiert, wie Pixel abgetastet werden, wenn ein Bild skaliert, gedreht oder transformiert wird.

## Implementierungen

Es gibt drei Hauptmethoden, um das Sampling in Skija anzugeben:

1.  **[`FilterMipmap`](#filtermipmap)**: Standard-Linear/Nearest-Filterung mit optionalen Mipmaps.
2.  **[`CubicResampler`](CubicResampler.md)**: Hochwertige bikubische Interpolation (Mitchell, Catmull-Rom).
3.  **`SamplingModeAnisotropic`**: Hochwertige Filterung für Texturen, die unter scharfen Winkeln betrachtet werden.

## Gängige Voreinstellungen

- `SamplingMode.DEFAULT`: Nearest-Neighbor-Filterung (schnellste, blockig).
- `SamplingMode.LINEAR`: Bilineare Filterung (glatt, Standard für die meisten Anwendungen).
- `SamplingMode.MITCHELL`: Hochwertige bikubische Filterung (glatt und scharf).
- `SamplingMode.CATMULL_ROM`: Sehr scharfe bikubische Filterung.

## FilterMipmap

Dies ist der häufigste Sampling-Modus. Er verwendet zwei Parameter:

### FilterMode
- `NEAREST`: Nimmt den einzelnen nächsten Pixel.
- `LINEAR`: Interpoliert zwischen den 4 nächsten Pixeln.

### MipmapMode
- `NONE`: Es werden keine Mipmaps verwendet.
- `NEAREST`: Nimmt von der nächsten Mipmap-Stufe.
- `LINEAR`: Interpoliert zwischen zwei Mipmap-Stufen (Trilineare Filterung).

## Verwendung

```java
// Bilineares Sampling
canvas.drawImage(img, 0, 0, SamplingMode.LINEAR, null);

// Nearest Neighbor (Pixel-Art-Stil)
canvas.drawImage(img, 0, 0, SamplingMode.DEFAULT, null);

// Hochwertige bikubische Filterung
canvas.drawImage(img, 0, 0, CubicResampler.MITCHELL, null);
```