# Référence API : CubicResampler

`CubicResampler` est un type de [`SamplingMode`](SamplingMode.md) utilisé pour un redimensionnement d'image de haute qualité via une interpolation bicubique.

## Vue d'ensemble

Un rééchantillonneur cubique est défini par deux paramètres, **B** et **C**, qui contrôlent la forme du filtre cubique. Différentes valeurs produisent des caractéristiques différentes (netteté, effet de rebond, etc.).

## Constantes

`CubicResampler` fournit deux préréglages couramment utilisés :

- `CubicResampler.MITCHELL` : (B=1/3, C=1/3). Un bon équilibre entre netteté et artefacts.
- `CubicResampler.CATMULL_ROM` : (B=0, C=1/2). Plus net que Mitchell, souvent utilisé pour la réduction d'échelle.

## Paramètres

- **B (Flou)** : Contrôle le "flou" du filtre.
- **C (Effet de rebond)** : Contrôle l'"effet de rebond" ou les "halos" autour des bords.

## Utilisation

```java
// Utiliser le rééchantillonneur Mitchell pour un redimensionnement de haute qualité
canvas.drawImageRect(image, dstRect, CubicResampler.MITCHELL, null);

// Rééchantillonneur personnalisé
CubicResampler custom = new CubicResampler(0.2f, 0.4f);
canvas.drawImageRect(image, dstRect, custom, paint);
```

## Références

- "Reconstruction Filters in Computer Graphics" (Mitchell & Netravali, 1988).
- [Aperçu du filtrage bicubique](https://entropymine.com/imageworsener/bicubic/)