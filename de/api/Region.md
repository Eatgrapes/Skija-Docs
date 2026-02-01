# API-Referenz: Region

Die `Region`-Klasse repräsentiert einen komplexen Bereich auf der Leinwand, ähnlich wie ein `Path`, jedoch definiert durch **ganzzahlige** Koordinaten. Regionen sind für boolesche Operationen (wie Schnittmenge, Vereinigung, Differenz) und für Tests, ob ein Punkt oder Rechteck innerhalb des Bereichs liegt, hochoptimiert.

## Überblick

Im Gegensatz zu `Path`, das Fließkommakoordinaten verwendet und Kurven enthalten kann, ist eine `Region` grundsätzlich eine Sammlung horizontaler Scanlines. Sie ist effizient für Hit-Tests und Clipping.

## Regionen erstellen und ändern

```java
// Leere Region erstellen
Region region = new Region();

// Auf ein Rechteck setzen
region.setRect(new IRect(0, 0, 100, 100));

// Aus einem Path setzen
// (Erfordert eine 'clip'-Region, die die maximalen Grenzen definiert)
Path path = new Path().addCircle(50, 50, 40);
Region clip = new Region();
clip.setRect(new IRect(0, 0, 200, 200));
region.setPath(path, clip);
```

## Boolesche Operationen

Die Stärke von `Region` liegt in ihrer Fähigkeit, mehrere Bereiche mit logischen Operatoren zu kombinieren.

```java
Region regionA = new Region();
regionA.setRect(new IRect(0, 0, 100, 100));

Region regionB = new Region();
regionB.setRect(new IRect(50, 50, 150, 150));

// Schnittmenge: Ergebnis ist der überlappende Bereich (50, 50, 100, 100)
regionA.op(regionB, RegionOp.INTERSECT);

// Vereinigung: Ergebnis ist der kombinierte Bereich beider
regionA.op(regionB, RegionOp.UNION);

// Differenz: Entferne B aus A
regionA.op(regionB, RegionOp.DIFFERENCE);
```

Verfügbare Operationen (`RegionOp`):
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A
- `REPLACE`: B

## Hit-Testing

Sie können prüfen, ob ein Punkt oder Rechteck innerhalb einer Region liegt.

```java
if (region.contains(10, 10)) {
    // Punkt ist innerhalb
}

if (region.quickReject(new IRect(200, 200, 300, 300))) {
    // Rechteck ist definitiv AUSSERHALB der Region
}
```

## Verwendung mit Canvas

Sie können eine `Region` verwenden, um den `Canvas` zu beschneiden.

```java
canvas.clipRegion(region);
```

**Hinweis:** `Region`-Operationen (wie `setPath`) sind strikt ganzzahlig. Kurven werden durch kleine Schritte angenähert. Für hochpräzises Rendering bevorzugen Sie `Path`. `Region` eignet sich am besten für komplexe UI-Hit-Tests oder pixelgenaue Clipping-Masken.