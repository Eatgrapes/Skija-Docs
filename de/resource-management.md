# Ressourcenverwaltung

Skija ist ein Java-Wrapper um die C++ Skia-Bibliothek. Das bedeutet, dass viele Java-Objekte von nativen C++-Ressourcen unterstützt werden. Das Verständnis, wie diese Ressourcen verwaltet werden, ist entscheidend für den Aufbau stabiler und effizienter Anwendungen.

## Automatische Speicherverwaltung

Standardmäßig verwaltet Skija den Speicher automatisch. Die meisten Skija-Objekte erweitern die Klasse `Managed`. Wenn ein Java-Objekt vom Garbage Collector eingesammelt wird, stellt Skija sicher, dass die entsprechende native C++-Ressource ebenfalls freigegeben wird.

```java
void drawSomething(Canvas canvas) {
    Paint paint = new Paint(); // Native Ressource allokiert
    canvas.drawCircle(50, 50, 20, paint);
} // paint verlässt den Gültigkeitsbereich, wird später vom GC bereinigt
```

Für die meisten Anwendungsfälle ist dieses "standardmäßig sichere" Verhalten genau das, was Sie wollen.

## Manuelle Ressourcenfreigabe

In leistungskritischen Anwendungen oder beim Umgang mit vielen kurzlebigen Objekten möchten Sie native Ressourcen möglicherweise sofort freigeben, anstatt auf den Garbage Collector zu warten.

Alle `Managed`-Objekte implementieren `AutoCloseable`, sodass Sie das `try-with-resources`-Muster verwenden können:

```java
void drawCircle(Canvas canvas) {
    try (Paint p = new Paint()) {
        canvas.drawCircle(50, 50, 20, p);
    } // Native Ressource wird HIER SOFORT freigegeben
}
```

**Warnung:** Sobald ein Objekt geschlossen ist, kann es nicht mehr verwendet werden. Der Versuch, ein geschlossenes Objekt zu verwenden, führt zu einer Ausnahme oder einem Absturz.

## Wiederverwendung von Objekten

Da die Erstellung nativer Objekte Overhead verursachen kann, ist es oft besser, sie wiederzuverwenden, insbesondere in einer Render-Schleife.

```java
class MyApp {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    void onRender(Canvas canvas) {
        canvas.drawCircle(100, 100, 50, paint); // Dasselbe Paint-Objekt wiederverwenden
    }
}
```

## Kapselung und Getter

Skija verwendet eine spezielle Konvention für seine Datenklassen (wie `Rect`, `Color4f`). Sie werden oft öffentliche Felder sehen, die mit einem Unterstrich beginnen (z. B. `_r`, `_g`, `_b` in `Color4f`).

**Konvention:**
- Felder, die mit `_` beginnen, sollten als **privat/intern** behandelt werden.
- Verwenden Sie immer die bereitgestellten **Getter** (z. B. `getR()`, `getG()`) für den Zugriff über die öffentliche API.

```java
Color4f color = new Color4f(1f, 0f, 0f);

float r = color._r;    // VERMEIDEN: Zugriff auf internes Feld
float r2 = color.getR(); // EMPFOHLEN: Verwenden des öffentlichen Getters
```

Dieser Ansatz ermöglicht es Skija, eine stabile API beizubehalten, selbst wenn sich die interne Implementierung dieser Datenklassen in zukünftigen Versionen ändert.