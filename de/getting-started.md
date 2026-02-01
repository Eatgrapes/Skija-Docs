# Erste Schritte mit Skija

Skija bringt die Leistungsfähigkeit der Skia Graphics Engine auf die Java Virtual Machine. Diese Anleitung bietet einen Überblick auf hoher Ebene, wie Sie mit dem Zeichnen in Skija beginnen können.

## Kernkonzepte

Bevor Sie in den Code eintauchen, ist es hilfreich, die Hauptakteure im Skija-Ökosystem zu verstehen:

- **Surface**: Das Ziel für Ihre Zeichnung (wie ein Blatt Papier).
- **Canvas**: Die Schnittstelle, die zum Ausführen von Zeichenoperationen verwendet wird (wie Ihre Hand).
- **Paint**: Definiert die Farbe, den Stil und die Effekte dessen, was Sie zeichnen (wie Ihr Stift oder Pinsel).

## Schnellstart-Pfad

Um Ihren ersten "Hello World"-Text auf dem Bildschirm oder in einer Bilddatei zu erhalten, empfehlen wir, diese Schritte zu befolgen:

1.  **[Installation](installation.md)**: Richten Sie Ihre Projektabhängigkeiten für Ihre spezifische Plattform (Windows, macOS oder Linux) ein.
2.  **[Rendering-Grundlagen](rendering-basics.md)**: Lernen Sie, wie Sie eine einfache Surface im Speicher erstellen und Ihre ersten primitiven Formen zeichnen.
3.  **[Typografie](typography.md)**: Fügen Sie Ihren Kreationen Text hinzu, indem Sie Systemschriften oder benutzerdefinierte Schriftdateien verwenden.
4.  **[GPU-Rendering](gpu-rendering.md)**: Für interaktive Anwendungen lernen Sie, wie Sie die Leistung Ihrer Grafikkarte nutzen können.

## Ressourcenverwaltung

Skija ist ein Hochleistungs-Wrapper um eine C++-Bibliothek. Während es den Speicher automatisch für Sie verwaltet, wird das Verständnis der [Ressourcenverwaltungs](resource-management.md)-Prinzipien für den Aufbau robuster Anwendungen empfohlen.

## Vertiefende Einblicke

Sobald Sie mit den Grundlagen vertraut sind, erkunden Sie unsere detaillierten API-Referenzen:

- [**Canvas-API**](api/Canvas.md): Detaillierter Blick auf Transformationen, Clipping und Zeichenmethoden.
- [**Paint & Effekte**](api/Effects.md): Meistern Sie Unschärfen, Schatten und Farbmatrizen.
- [**Shader**](api/Shader.md): Erstellen Sie schöne Farbverläufe und prozedurale Texturen.
- [**SkSL**](api/runtime-effect.md): Schreiben Sie benutzerdefinierte GPU-Shader für maximale Flexibilität.

---

### Bereit, etwas Großartiges zu bauen?
Schauen Sie sich den [**Vollständigen Dokumentationsindex**](/) für eine vollständige Liste von Anleitungen und Referenzen an.