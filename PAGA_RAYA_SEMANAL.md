# Funcionamiento del Pago maquila

Este documento explica cómo funciona el módulo de **Pago maquila** en el sistema.

## 1. Objetivo General
El módulo permite calcular la liquidación (pago) semanal de un maquilero (taller) basándose en las **recepciones de calzado** registradas en un rango de fechas. También permite guardar el registro de este cálculo (como un ticket/nota) y consultar el historial de pagos.

## 2. Lógica de Cálculo (`calcularCorteSabatino`)
Cuando el usuario selecciona un maquilero y un rango de fechas, el sistema realiza lo siguiente:

1. **Filtrar Recepciones:**
   Busca todas las recepciones (`Recepciones`) de calzado asociadas a las órdenes de salida del maquilero seleccionado, que caigan dentro de la **fecha de inicio** y **fecha de fin** indicadas (ambas inclusive, desde las 00:00:00 del inicio hasta las 23:59:59 del final).

2. **Cálculo de Totales:**
   Para cada recepción válida encontrada en el periodo, se extrae:
   - **Pares Completos:** `pares_completos_entregados`.
   - **Cargos de Control de Calidad (QC):** `cargo_maquilero_mxn` (deducciones por defectos).
   - **Subtotal a pagar por entrega:** `(pares_completos_entregados * tarifa_por_par) - cargo_maquilero_mxn`.

3. **Total a Pagar (Raya):**
   El sistema suma todos los subtotales para obtener el `total_pagar_mxn`. Si hay cargos de calidad, estos se restan del total. La fórmula global es:
   `Total Pagar = (Total Pares Completos * Tarifa del Maquilero) - Total Cargos QC`

4. **Registro de Incidencias:**
   Si durante una recepción se reportaron piezas faltantes (izquierdos o derechos), pares de segunda, mermas o cargos por control de calidad, el sistema genera automáticamente un **registro de incidencia**. Estas incidencias se imprimen en la nota final para justificar cualquier descuento o anomalía.

## 3. Flujo en la Interfaz de Usuario (`page.tsx`)
La pantalla está dividida en dos pestañas principales: **Calcular pago** e **Historial de Notas**.

### Pestaña: Calcular Pago maquila
- **Controles:** El usuario selecciona el Maquilero y el rango de fechas (por defecto, el rango de la semana actual laborable).
- **Resultado:** Si no hay entregas, se muestra un aviso. Si hay entregas, se muestra la **Nota de Liquidación Semanal** detallando:
  - Total a pagar en grande.
  - Cantidad de pares completos.
  - Detalle por cada entrega (Fecha, Modelo, Talla, Pares y Subtotal).
  - Lista de notas e incidencias (si existen).
- **Acciones:**
  - **Imprimir Nota:** Abre el diálogo de impresión del navegador.
  - **Guardar Nota:** Registra el cálculo permanentemente en el historial, generando un número de folio (ej. `TCK-2026-001`).

### Pestaña: Historial de pagos de maquila
- Lista todas las notas de pago guardadas previamente.
- Incluye una barra de búsqueda para filtrar por maquilero o folio.
- Cada elemento muestra el folio, el maquilero, el rango de fechas, los pares totales y el total pagado.
- **Acciones:**
  - **Ver:** Permite revisar los detalles de una nota guardada y reimprimirla.
  - **Eliminar:** Borra la nota del historial (con confirmación previa).

## 4. Estructura de Datos
El cálculo produce un objeto `ResumenPagoSemanal` (o `ResumenCorteSabatino`) que contiene:
- `maquilero`: Datos del taller (incluyendo tarifa).
- `fecha_inicio` y `fecha_fin`.
- `total_pares_completos`, `total_faltantes_piezas`, `total_pares_segunda`, `total_mermas`, `total_cargos_qc_mxn`, `total_pagar_mxn`.
- `items`: Arreglo con el desglose de cada entrega.
- `incidencias`: Arreglo con el detalle de faltantes, defectos o notas del supervisor.

Al guardarse, esto se transforma en un objeto `TicketPagoSemanalGuardado` (añadiendo id, folio y fecha de guardado), que se persiste en el `localStorage` mediante la clave `calzado_pwa_tickets_pagos`.
