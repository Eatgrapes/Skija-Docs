# Referencia de API: Documento (Generación de PDF)

La clase `Document` te permite capturar comandos de dibujo y guardarlos en formatos basados en vectores, principalmente **PDF**. A diferencia de una `Surface`, que renderiza a píxeles, un `Document` preserva la naturaleza vectorial de tus dibujos.

## Crear un PDF

Para crear un PDF, necesitas un `WStream` (flujo de escritura) para recibir la salida.

```java
try (FileOutputStream fos = new FileOutputStream("output.pdf");
     WStream stream = new FileOutputStreamWStream(fos);
     Document doc = Document.makePDF(stream)) {
     
    // 1. Iniciar una página
    Canvas canvas = doc.beginPage(595, 842); // Tamaño A4 en puntos
    
    // 2. Dibujar en el lienzo de la página
    Paint paint = new Paint().setColor(0xFF4285F4);
    canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
    
    // 3. Finalizar la página
    doc.endPage();
    
    // 4. Cerrar el documento para finalizar el archivo
    doc.close();
}
```

## Añadir Metadatos

Puedes incluir metadatos del PDF (Título, Autor, etc.) al crear el documento:

```java
Document doc = Document.makePDF(stream, 
    "Mi Documento Skija", // Título
    "Desarrollador Skija", // Autor
    "Demostración Gráfica", // Asunto
    "vector, skia, java",  // Palabras clave
    "Motor Skija",         // Creador
    "Productor PDF Skija", // Productor
    System.currentTimeMillis(), // Fecha de creación
    System.currentTimeMillis()  // Fecha de modificación
);
```

## Consideraciones Importantes

- **Sistema de Coordenadas**: PDF usa **Puntos** (1/72 de pulgada) como unidad predeterminada.
- **Vida Útil del Canvas**: El `Canvas` devuelto por `beginPage()` solo es válido hasta que llames a `endPage()`. No intentes usarlo después de que la página haya finalizado.
- **Fuentes**: Al dibujar texto en un PDF, Skija intentará incrustar los datos de fuente necesarios. Asegúrate de usar tipografías que permitan la incrustación.
- **Vector vs. Ráster**: La mayoría de las operaciones de Skija (líneas, formas, texto) permanecerán vectoriales en el PDF. Sin embargo, algunos efectos complejos (como ciertos ImageFilters o Shaders) podrían hacer que Skia rasterice una parte de la página.