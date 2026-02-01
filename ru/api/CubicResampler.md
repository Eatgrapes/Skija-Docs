# Справочник API: CubicResampler

`CubicResampler` — это тип [`SamplingMode`](SamplingMode.md), используемый для высококачественного масштабирования изображений с помощью бикубической интерполяции.

## Обзор

Кубический ресемплер определяется двумя параметрами, **B** и **C**, которые управляют формой кубического фильтра. Разные значения приводят к разным характеристикам (резкость, звон, и т.д.).

## Константы

`CubicResampler` предоставляет два часто используемых предустановленных значения:

- `CubicResampler.MITCHELL`: (B=1/3, C=1/3). Хороший баланс между резкостью и артефактами.
- `CubicResampler.CATMULL_ROM`: (B=0, C=1/2). Более резкий, чем Mitchell, часто используется для уменьшения масштаба.

## Параметры

- **B (Размытие)**: Управляет "размытостью" фильтра.
- **C (Звон)**: Управляет "звоном" или "ореолами" вокруг краёв.

## Использование

```java
// Использовать ресемплер Mitchell для высококачественного масштабирования
canvas.drawImageRect(image, dstRect, CubicResampler.MITCHELL, null);

// Пользовательский ресемплер
CubicResampler custom = new CubicResampler(0.2f, 0.4f);
canvas.drawImageRect(image, dstRect, custom, paint);
```

## Ссылки

- "Reconstruction Filters in Computer Graphics" (Mitchell & Netravali, 1988).
- [Обзор бикубической фильтрации](https://entropymine.com/imageworsener/bicubic/)