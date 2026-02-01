# API-Referenz: CubicResampler

`CubicResampler` ist ein Typ von [`SamplingMode`](SamplingMode.md), der für hochwertige Bildskalierung mittels bikubischer Interpolation verwendet wird.

## Übersicht

Ein kubischer Resampler wird durch zwei Parameter definiert, **B** und **C**, welche die Form des kubischen Filters steuern. Unterschiedliche Werte führen zu unterschiedlichen Eigenschaften (Schärfe, Überschwinger etc.).

## Konstanten

`CubicResampler` bietet zwei häufig verwendete Voreinstellungen:

- `CubicResampler.MITCHELL`: (B=1/3, C=1/3). Eine gute Balance zwischen Schärfe und Artefakten.
- `CubicResampler.CATMULL_ROM`: (B=0, C=1/2). Schärfer als Mitchell, wird oft für die Verkleinerung verwendet.

## Parameter

- **B (Unschärfe)**: Steuert die "Unschärfe" des Filters.
- **C (Überschwinger)**: Steuert die "Überschwinger" oder "Lichthöfe" um Kanten.

## Verwendung

```java
// Mitchell-Resampler für hochwertige Skalierung verwenden
canvas.drawImageRect(image, dstRect, CubicResampler.MITCHELL, null);

// Benutzerdefinierter Resampler
CubicResampler custom = new CubicResampler(0.2f, 0.4f);
canvas.drawImageRect(image, dstRect, custom, paint);
```

## Referenzen

- "Reconstruction Filters in Computer Graphics" (Mitchell & Netravali, 1988).
- [Übersicht über bikubische Filterung](https://entropymine.com/imageworsener/bicubic/)