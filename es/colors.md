# Colores y Transparencia Alfa

Comprender cómo Skija maneja los colores y la transparencia es esencial para lograr resultados visuales correctos, especialmente al combinar múltiples capas o imágenes.

## Representación del Color

En Skija, los colores se representan más comúnmente como enteros de 32 bits en formato **ARGB**.

- **A (Alfa)**: bits 24-31
- **R (Rojo)**: bits 16-23
- **G (Verde)**: bits 8-15
- **B (Azul)**: bits 0-7

Puedes usar la clase de utilidad `Color` para manipular estos valores de forma segura:

```java
int myColor = Color.makeARGB(255, 66, 133, 244); // Azul Opaco
int transparentRed = Color.withA(0xFFFF0000, 128); // Rojo 50% Transparente
```

## Tipo Alfa: Premultiplicado vs. Directo

Uno de los conceptos más importantes en Skia es el **Tipo Alfa** (`ColorAlphaType`).

### Premultiplicado (`PREMUL`)
Este es el formato **predeterminado y recomendado** para renderizado. En este formato, los componentes RGB ya están multiplicados por el valor alfa.
- **¿Por qué?** Hace que la mezcla sea mucho más rápida y evita "bordes oscuros" al filtrar o escalar imágenes.
- **Ejemplo**: Un blanco 50% transparente (Alfa=128, R=255, G=255, B=255) se convierte en (128, 128, 128, 128) en el espacio premultiplicado.

### No Premultiplicado (`UNPREMUL`)
También conocido como "Alfa Directo". Los componentes RGB son independientes del alfa. Así es como la mayoría de los archivos de imagen (como PNG) almacenan los datos.
- **Ejemplo**: El mismo blanco 50% transparente permanece como (128, 255, 255, 255).

## Espacios de Color

Skija es consciente del espacio de color. Aunque puedes trabajar con RGB "crudo" o ingenuo, para resultados profesionales, debes especificar un `ColorSpace`.

- `ColorSpace.getSRGB()`: El espacio de color estándar para la web y la mayoría de los monitores.
- `ColorSpace.getDisplayP3()`: Para pantallas de amplia gama (como los Macs e iPhones modernos).

Al crear una `Surface` o cargar una `Image`, siempre considera el espacio de color para garantizar una apariencia consistente en diferentes dispositivos.

## Mejores Prácticas

1.  **Usa siempre Alfa Premultiplicado** para renderizado activo y composición.
2.  **Usa `Color4f`** cuando necesites colores de alta precisión (punto flotante) o estés trabajando con espacios de color de amplia gama.
3.  **Ten en cuenta el Modo Alfa** al capturar instantáneas o leer píxeles; es posible que necesites convertir de `PREMUL` a `UNPREMUL` si planeas guardar los datos en un PNG estándar.