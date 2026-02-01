# Gestión de Recursos

Skija es un envoltorio de Java alrededor de la biblioteca Skia en C++. Esto significa que muchos objetos de Java están respaldados por recursos nativos en C++. Comprender cómo se gestionan estos recursos es crucial para construir aplicaciones estables y eficientes.

## Gestión Automática de Memoria

Por defecto, Skija gestiona la memoria automáticamente. La mayoría de los objetos de Skija extienden la clase `Managed`. Cuando un objeto de Java es recolectado por el Garbage Collector, Skija se asegura de que el recurso nativo en C++ correspondiente también sea liberado.

```java
void drawSomething(Canvas canvas) {
    Paint paint = new Paint(); // Recurso nativo asignado
    canvas.drawCircle(50, 50, 20, paint);
} // paint sale del ámbito, será limpiado por el GC eventualmente
```

Para la mayoría de los casos de uso, este comportamiento "seguro por defecto" es exactamente lo que se desea.

## Liberación Manual de Recursos

En aplicaciones críticas para el rendimiento o cuando se manejan muchos objetos de corta duración, es posible que se desee liberar los recursos nativos inmediatamente en lugar de esperar al Garbage Collector.

Todos los objetos `Managed` implementan `AutoCloseable`, por lo que se puede usar el patrón `try-with-resources`:

```java
void drawCircle(Canvas canvas) {
    try (Paint p = new Paint()) {
        canvas.drawCircle(50, 50, 20, p);
    } // El recurso nativo se libera INMEDIATAMENTE aquí
}
```

**Advertencia:** Una vez que un objeto se cierra, no se puede volver a usar. Intentar usar un objeto cerrado resultará en una excepción o un fallo.

## Reutilización de Objetos

Dado que crear objetos nativos puede tener cierta sobrecarga, a menudo es mejor reutilizarlos, especialmente en un bucle de renderizado.

```java
class MyApp {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    void onRender(Canvas canvas) {
        canvas.drawCircle(100, 100, 50, paint); // Reutiliza el mismo objeto paint
    }
}
```

## Encapsulación y Getters

Skija utiliza una convención específica para sus clases de datos (como `Rect`, `Color4f`). A menudo se verán campos públicos que comienzan con un guión bajo (por ejemplo, `_r`, `_g`, `_b` en `Color4f`).

**Convención:**
- Los campos que comienzan con `_` deben tratarse como **privados/internos**.
- Siempre se deben usar los **getters** proporcionados (por ejemplo, `getR()`, `getG()`) para el acceso público a la API.

```java
Color4f color = new Color4f(1f, 0f, 0f);

float r = color._r;    // EVITAR: Accediendo al campo interno
float r2 = color.getR(); // RECOMENDADO: Usando el getter público
```

Este enfoque permite a Skija mantener una API estable incluso si la implementación interna de estas clases de datos cambia en versiones futuras.