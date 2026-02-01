# Referencia de la API: Drawable

La clase `Drawable` te permite crear objetos de dibujo personalizados que encapsulan su propia lógica de dibujo y estado. Es similar a `Picture`, pero mientras que `Picture` es una grabación estática de comandos de dibujo, `Drawable` llama a tu código Java durante el renderizado, permitiendo comportamiento dinámico.

## Descripción general

Para usar `Drawable`, debes crear una subclase y sobrescribir dos métodos:
1.  `onDraw(Canvas canvas)`: La lógica de dibujo.
2.  `onGetBounds()`: Devuelve el cuadro delimitador del dibujo.

## Creando un Drawable personalizado

```java
public class MyDrawable extends Drawable {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    @Override
    public void onDraw(Canvas canvas) {
        // Esto se llama cada vez que el drawable necesita ser renderizado
        canvas.drawCircle(50, 50, 40, paint);
    }

    @Override
    public Rect onGetBounds() {
        // Devuelve los límites conservadores de lo que dibujas
        return Rect.makeXYWH(10, 10, 80, 80);
    }
}
```

## Usando un Drawable

Puedes dibujar un `Drawable` directamente en un lienzo o transformarlo.

```java
MyDrawable drawable = new MyDrawable();

// Dibujar en (0, 0)
drawable.draw(canvas);

// Dibujar en (100, 100)
drawable.draw(canvas, 100, 100);

// Dibujar con una matriz
drawable.draw(canvas, Matrix33.makeScale(2.0f));
```

Alternativamente, `Canvas` tiene un método específico para ello:
```java
canvas.drawDrawable(drawable);
```

## Estado e Invalidación

`Drawable` tiene un **ID de Generación** (`getGenerationId()`) que permite a los clientes almacenar en caché la salida. Si tu drawable cambia su estado interno (por ejemplo, color o texto), debes llamar a `notifyDrawingChanged()` para invalidar la caché.

```java
public class TextDrawable extends Drawable {
    private String text = "Hello";
    
    public void setText(String newText) {
        this.text = newText;
        // ¡Importante: ¡Indica a Skija que el contenido ha cambiado!
        notifyDrawingChanged();
    }
    
    // ... implementación de onDraw ...
}
```

## Drawable vs. Picture

- **Picture**: Reproducción rápida, inmutable, graba comandos una vez. Mejor para contenido estático complejo.
- **Drawable**: Dinámico, llama al código Java en cada fotograma. Mejor cuando la lógica determina qué dibujar en el momento del renderizado, o para crear "widgets" reutilizables.