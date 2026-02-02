# Referencia de la API: Color y Codificación

Esta página cubre la representación de color de alta precisión, formatos de píxeles, interpretación alfa y espacios de color.

---

## Color4f

`Color4f` representa un color utilizando cuatro valores de punto flotante (RGBA), cada uno típicamente en el rango de 0.0 a 1.0. Esto permite una precisión mucho mayor que los enteros tradicionales de 8 bits.

### Constructores

- `new Color4f(r, g, b, a)`
- `new Color4f(r, g, b)`: Color opaco (alfa = 1.0).
- `new Color4f(int color)`: Convierte un entero ARGB 8888 estándar a componentes de punto flotante.

### Métodos

- `toColor()`: Convierte de nuevo a un entero ARGB 8888.
- `makeLerp(other, weight)`: Interpola linealmente entre dos colores.

### Ejemplo

```java
Color4f red = new Color4f(1f, 0f, 0f, 1f);
Color4f halfTransparentBlue = new Color4f(0f, 0f, 1f, 0.5f);

// Uso en Paint
Paint paint = new Paint().setColor4f(red, ColorSpace.getSRGB());
```

---

## ColorType

`ColorType` describe cómo se organizan los bits en un píxel (por ejemplo, orden de canales y profundidad de bits).

### Tipos Comunes

- `RGBA_8888`: 8 bits por canal, rojo primero.
- `BGRA_8888`: 8 bits por canal, azul primero (común en Windows).
- `N32`: Formato nativo de 32 bits para la plataforma actual (generalmente se asigna a RGBA o BGRA).
- `F16`: Medio flotante de 16 bits por canal (Alto Rango Dinámico).
- `GRAY_8`: un solo canal de 8 bits para escala de grises.
- `ALPHA_8`: un solo canal de 8 bits para máscaras de transparencia.

---

## ColorAlphaType

`ColorAlphaType` describe cómo se debe interpretar el canal alfa.

- `OPAQUE`: Todos los píxeles son completamente opacos; se ignora el canal alfa.
- `PREMUL`: Los componentes de color están multiplicados por alfa (estándar para el rendimiento de Skia).
- `UNPREMUL`: Los componentes de color son independientes del alfa.

---

## ColorSpace

`ColorSpace` define el rango (gama) y la linealidad de los colores.

### Espacios de Color Comunes

- `ColorSpace.getSRGB()`: El espacio de color estándar para la web y la mayoría de los monitores.
- `ColorSpace.getSRGBLinear()`: sRGB con una función de transferencia lineal (útil para matemáticas/mezcla).
- `ColorSpace.getDisplayP3()`: Espacio de color de gama amplia utilizado por dispositivos Apple modernos.

### Métodos

- `isSRGB()`: Devuelve verdadero si el espacio es sRGB.
- `isGammaLinear()`: Devuelve verdadero si la función de transferencia es lineal.
- `convert(to, color)`: Convierte un `Color4f` de este espacio a otro.

### Ejemplo de Uso

```java
// Creando un ImageInfo con codificación específica
ImageInfo info = new ImageInfo(
    800, 600, 
    ColorType.N32, 
    ColorAlphaType.PREMUL, 
    ColorSpace.getSRGB()
);
```