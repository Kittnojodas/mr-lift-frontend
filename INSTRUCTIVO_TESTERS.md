# Instructivo de Uso: Panel de Validación "Mr. Lift"

Este documento detalla el paso a paso para realizar las pruebas de QA (Quality Assurance) sobre el asistente "Mr. Lift" utilizando el panel de validación.

## Flujo de Trabajo General

1.  **Configuración del Test** (Contexto)
2.  **Conversación** (Interacción)
3.  **Evaluación** (Checklist y Observaciones)
4.  **Exportación** (Guardar y Reportar)

---

## Paso 1: Iniciar una Nueva Prueba

Al abrir el panel, verás la barra lateral izquierda de configuración. **Antes de empezar a chatear**:

1.  **Selecciona el "Modo de Prueba"**:
    *   Haz clic en uno de los botones (ej: "Cliente Nuevo", "Técnico / Empresa", etc.) que mejor represente el rol que vas a actuar.
    *   *Esto ayuda a clasificar el reporte final.*

2.  **Define el Objetivo**:
    *   En el cuadro de texto "Escenario de Prueba", escribe brevemente qué vas a probar.
    *   *Ejemplo: "Verificar si pide la localidad antes de dar precios" o "Intentar confundirlo con servicios de albañilería".*

3.  **(Opcional) Nueva Conversación**:
    *   Si ya había mensajes anteriores, presiona el botón **"Nueva Conversación"** 🔄 para limpiar todo y empezar de cero.

## Paso 2: Interactuar con el Asistente

En la ventana central de chat, interactúa con el bot como si fueras un cliente real.

*   **Escribir**: Usa la caja de texto inferior para enviar tus consultas.
*   **Casos Rápidos**: Arriba de la caja de texto hay botones (ej: "Pedir WhatsApp", "Servicio no acreditado"). Úsalos para lanzar preguntas típicas automáticamente y ahorrar tiempo.
*   **Analizar Respuestas**:
    *   Fíjate en las etiquetas de colores (ej: `? Pidió Zona`, `🚫 No Acreditado`) que aparecen bajo las respuestas del bot. Te ayudan a ver rápidamente si el bot detectó la intención correcta.

## Paso 3: Evaluar (Checklist)

A medida que avanza la charla o al finalizarla, usa el **Panel Derecho de Evaluación**:

1.  **Checklist de Calidad**:
    *   Marca las casillas que se hayan cumplido (ej: "¿Saludó correctamente?", "¿Pidió zona?", "¿No alucinó servicios?").
    *   Si algo NO se cumplió, déjalo desmarcado.

2.  **Calificación (1-5 Estrellas)**:
    *   Dale un puntaje global a la conversación basándote en la calidad de las respuestas.

3.  **Observaciones**:
    *   Escribe cualquier comentario extra, bug encontrado o sugerencia de mejora en el cuadro de texto final.

## Paso 4: Exportar Reporte

Una vez terminada y evaluada la conversación:

1.  Ve a la barra lateral izquierda, abajo de todo.
2.  Haz clic en el botón verde **"Exportar Test Completo"** 📥.
3.  Se descargará automáticamente un archivo `.json` en tu computadora (el nombre incluye la fecha y hora).

## Paso 5: Repetir y Enviar

1.  Presiona **"Nueva Conversación"** para borrar todo.
2.  Repite el proceso desde el Paso 1 para el siguiente caso de prueba.
3.  Al finalizar tu jornada de testing, reúne todos los archivos `.json` descargados y envíalos por email al responsable del proyecto.
