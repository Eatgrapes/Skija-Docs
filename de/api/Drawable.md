# API-Referenz: Drawable

Die `Drawable`-Klasse ermöglicht es Ihnen, benutzerdefinierte Zeichenobjekte zu erstellen, die ihre eigene Zeichenlogik und ihren Zustand kapseln. Sie ähnelt `Picture`, aber während `Picture` eine statische Aufzeichnung von Zeichenbefehlen ist, ruft `Drawable` während des Renderings in Ihren Java-Code zurück, was dynamisches Verhalten ermöglicht.

## Überblick

Um `Drawable` zu verwenden, müssen Sie es unterklassieren und zwei Methoden überschreiben:
1.  `onDraw(Canvas canvas)`: Die Zeichenlogik.
2.  `onGetBounds()`: Gibt den Begrenzungsrahmen der Zeichnung zurück.

## Erstellen eines benutzerdefinierten Drawable

```java
public class MyDrawable extends Drawable {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    @Override
    public void onDraw(Canvas canvas) {
        // Dies wird aufgerufen, wenn das Drawable gerendert werden muss
        canvas.drawCircle(50, 50, 40, paint);
    }

    @Override
    public Rect onGetBounds() {
        // Geben Sie die konservativen Grenzen dessen zurück, was Sie zeichnen
        return Rect.makeXYWH(10, 10, 80, 80);
    }
}
```

## Verwenden eines Drawable

Sie können ein `Drawable` direkt auf eine Leinwand zeichnen oder transformieren.

```java
MyDrawable drawable = new MyDrawable();

// Zeichnen bei (0, 0)
drawable.draw(canvas);

// Zeichnen bei (100, 100)
drawable.draw(canvas, 100, 100);

// Zeichnen mit einer Matrix
drawable.draw(canvas, Matrix33.makeScale(2.0f));
```

Alternativ hat `Canvas` eine spezifische Methode dafür:
```java
canvas.drawDrawable(drawable);
```

## Zustand & Ungültigmachung

`Drawable` hat eine **Generierungs-ID** (`getGenerationId()`), die es Clients ermöglicht, die Ausgabe zwischenzuspeichern. Wenn sich der interne Zustand Ihres Drawable ändert (z.B. Farbe oder Text), müssen Sie `notifyDrawingChanged()` aufrufen, um den Cache für ungültig zu erklären.

```java
public class TextDrawable extends Drawable {
    private String text = "Hello";
    
    public void setText(String newText) {
        this.text = newText;
        // Wichtig: Skija mitteilen, dass sich der Inhalt geändert hat!
        notifyDrawingChanged();
    }
    
    // ... onDraw-Implementierung ...
}
```

## Drawable vs. Picture

- **Picture**: Schnelle Wiedergabe, unveränderlich, zeichnet Befehle einmal auf. Am besten für komplexen statischen Inhalt.
- **Drawable**: Dynamisch, ruft Java-Code in jedem Frame auf. Am besten, wenn die Logik bestimmt, was zum Renderzeitpunkt gezeichnet werden soll, oder zum Erstellen wiederverwendbarer "Widgets".