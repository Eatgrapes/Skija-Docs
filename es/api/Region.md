# Referencia de API: Region

La clase `Region` representa un área compleja en el lienzo, similar a un `Path`, pero definida por coordenadas **enteras**. Las regiones están altamente optimizadas para operaciones booleanas (como intersección, unión, diferencia) y para probar si un punto o rectángulo está dentro del área.

## Descripción General

A diferencia de `Path`, que usa coordenadas de punto flotante y puede contener curvas, una `Region` es fundamentalmente una colección de líneas de escaneo horizontales. Es eficiente para pruebas de colisión (hit-testing) y recorte (clipping).

## Crear y Modificar Regiones

```java
// Crear una región vacía
Region region = new Region();

// Establecerla como un rectángulo
region.setRect(new IRect(0, 0, 100, 100));

// Establecerla desde un Path
// (Requiere una región 'clip' para definir los límites máximos)
Path path = new Path().addCircle(50, 50, 40);
Region clip = new Region();
clip.setRect(new IRect(0, 0, 200, 200));
region.setPath(path, clip);
```

## Operaciones Booleanas

El poder de `Region` radica en su capacidad para combinar múltiples áreas usando operadores lógicos.

```java
Region regionA = new Region();
regionA.setRect(new IRect(0, 0, 100, 100));

Region regionB = new Region();
regionB.setRect(new IRect(50, 50, 150, 150));

// Intersección: El resultado es el área superpuesta (50, 50, 100, 100)
regionA.op(regionB, RegionOp.INTERSECT);

// Unión: El resultado es el área combinada de ambas
regionA.op(regionB, RegionOp.UNION);

// Diferencia: Remover B de A
regionA.op(regionB, RegionOp.DIFFERENCE);
```

Operaciones Disponibles (`RegionOp`):
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A
- `REPLACE`: B

## Pruebas de Colisión (Hit Testing)

Puedes verificar si un punto o rectángulo está dentro de una región.

```java
if (region.contains(10, 10)) {
    // El punto está dentro
}

if (region.quickReject(new IRect(200, 200, 300, 300))) {
    // El rectángulo está definitivamente FUERA de la región
}
```

## Uso con Canvas

Puedes usar una `Region` para recortar (clip) el `Canvas`.

```java
canvas.clipRegion(region);
```

**Nota:** Las operaciones de `Region` (como `setPath`) son estrictamente basadas en enteros. Las curvas serán aproximadas por pequeños pasos. Para renderizado de alta precisión, prefiere `Path`. `Region` es mejor para pruebas de colisión de UI complejas o máscaras de recorte alineadas a píxeles.