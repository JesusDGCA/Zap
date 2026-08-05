# 👞 Sistema de Almacén y Control de Producción (Fábrica de Calzado)

Un sistema integral para la gestión, trazabilidad y control operativo de fábricas de calzado. Permite administrar inventarios de materia prima, dar seguimiento a lotes de producción en planta y maquilas externas, controlar inspecciones de calidad (QC) y automatizar los pagos semanales a maquileros.

---

## 🎯 Objetivo del Proyecto

El objetivo principal de este sistema es **digitalizar y optimizar la cadena operativa y logística de una fábrica de calzado**, logrando:

1. **Trazabilidad Total de Lotes (WIP):** Monitorear en tiempo real el avance de cada lote de producción a través de las etapas clave (*Corte, Pespunte, Ensuelado, Montado, Adorno/Empaque, Producto Terminado*).
2. **Control Estricto de Maquila y Calidad:** Registrar entradas y salidas de material enviadas a talleres externos, auditando entregas completas, pares de 2da selección, piezas faltantes (piezas izquierdas/derechas) y cargos por mermas o defectos.
3. **Optimización de Materiales (Explosión de Insumos - BOM):** Calcular de forma precisa las necesidades de materia prima necesarias para cumplir con los órdenes de producción basándose en las fichas técnicas de cada modelo.
4. **Automatización Financiera Semanal:** Generar tickets de pago a maquileros de manera transparente, aplicando tarifas acordadas y restando automáticamente penalizaciones por mermas o defectos de calidad detectados.

---

## 🧩 Estructura y Módulos del Sistema

El proyecto está estructurado de manera modular dentro de Next.js (App Router):

```text
almacen/
├── app/
│   ├── page.tsx                    # Dashboard principal con métricas y alertas
│   ├── catalogos/                  # Gestión de Maquileros, Modelos, Insumos y Fichas Técnicas (BOM)
│   ├── procesos/                   # Seguimiento de Lotes de Producción (WIP) e Historial
│   ├── salida/                     # Registro de Órdenes de Salida a Maquila por Talla
│   ├── recepcion/                  # Control de Recepción e Inspección de Calidad (QC)
│   ├── explosion-materiales/       # Cálculo de insumos requeridos vs. Inventario disponible
│   ├── corte-sabatino/             # Consolidado y resumen sabatino de producción
│   ├── pago-semanal/               # Generación y tickets de pago de nómina a maquileros
│   └── salidas-generales/          # Registro de salidas y consumos varios de almacén
├── components/                     # Componentes reutilizables de UI (Sidebar, Layout, etc.)
├── lib/
│   ├── store.ts                    # Estado global y sincronización LocalStorage/Supabase
│   ├── db-service.ts               # Capa de servicios para la integración con base de datos
│   └── supabase.ts                 # Cliente de Supabase (@supabase/ssr / client)
├── types/                          # Definiciones de TypeScript e interfaces de base de datos
└── supabase_schema.sql             # Esquema completo DDL de la base de datos PostgreSQL
```

### 🛠️ Tecnologías Utilizadas

- **Framework Web:** [Next.js 16 (App Router)](https://nextjs.org/) + React 19
- **Lenguaje:** TypeScript
- **Estilos & UI:** Tailwind CSS v4 + Lucide React Icons
- **Base de Datos & Backend:** Supabase / PostgreSQL (con soporte de RLS y cliente `@supabase/ssr`)
- **Persistencia Local:** LocalStorage (modo interactivo/fallback en desarrollo)

---

## ⚡ Guía de Instalación y Configuración

### 1. Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **npm**, **yarn**, **pnpm** o **bun**

### 2. Clonar e Instalar Dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd almacen
npm install
```

### 3. Configuración de Variables de Entorno

Crea o edita el archivo `.env.local` en la raíz del proyecto con las credenciales de tu proyecto de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> **Nota:** Si no se configuran credenciales válidas de Supabase, la aplicación utilizará la persistencia local (*LocalStorage*) para permitir probar todas las vistas y flujos sin necesidad de desplegar backend de inmediato.

### 4. Inicializar la Base de Datos (Opcional si usas Supabase)

Si estás usando Supabase, ejecuta el contenido de [`supabase_schema.sql`](file:///c:/Users/Jezuz/OneDrive/Escritorio/Universidad/almacen/supabase_schema.sql) dentro del **SQL Editor** de tu panel de control en Supabase. Esto creará todas las tablas (`maquileros`, `modelos`, `lotes_produccion`, `recepciones`, etc.) y sus políticas RLS.

### 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre tu navegador e ingresa a: **`http://localhost:3000`**

---

## 🧪 Guía para Ejecutar una Primera Prueba (Flujo Completo)

Para verificar el funcionamiento completo del sistema paso a paso, te sugerimos realizar el siguiente flujo de prueba:

### Paso 1: Configurar Catálogos Base
1. Navega a **Catálogos** (`/catalogos`).
2. En la pestaña **Maquileros**, haz clic en *"Nuevo Maquilero"* y registra uno (ej. `Taller San Francisco`, Tarifa por par: `$25.00`).
3. En la pestaña **Modelos**, agrega un nuevo modelo (ej. `Tenis Urbano X`, Estilo: `Deportivo`).
4. En la pestaña **Inventario Crudo**, agrega insumos de prueba (ej. `Suela Goma Talla 27`, Cantidad: `200`).
5. En la pestaña **Fichas Técnicas (BOM)**, crea una receta para el modelo indicando la cantidad de material que consume por par.

### Paso 2: Crear una Orden de Salida a Maquila
1. Dirígete a **Salida a Maquila** (`/salida`).
2. Selecciona el maquilero creado (*Taller San Francisco*) y el modelo (*Tenis Urbano X*).
3. Especifica las cantidades de pares a enviar desglosadas por talla (ej. `50` pares de la Talla `27`).
4. Haz clic en **"Registrar Orden de Salida"**.

### Paso 3: Simular Recepción y Control de Calidad (QC)
1. Ve al módulo de **Recepción** (`/recepcion`).
2. Ubica la orden de salida pendiente y haz clic en **"Recibir Pares / QC"**.
3. Simula la entrega:
   - **Pares completos entregados:** `45`
   - **Faltantes:** `2` izquierdos y `1` derecho
   - **Pares de 2da selección:** `2`
   - **Cargo/Defecto:** Registra un cobro por defecto si aplica.
4. Guarda la recepción. Verás cómo se generan automáticamente las alertas de faltantes o de calidad en el Dashboard.

### Paso 4: Probar la Explosión de Materiales
1. Entra a **Explosión de Materiales** (`/explosion-materiales`).
2. Selecciona un modelo y escribe la cantidad de pares a fabricar (ej. `100` pares).
3. Revisa la tabla de requerimientos calculada automáticamente en base a la Ficha Técnica (BOM) comparada contra el inventario actual.

### Paso 5: Generar el Ticket de Pago Semanal
1. Navega a **Pago Semanal** (`/pago-semanal`).
2. Selecciona el taller (*Taller San Francisco*) y el rango de fechas.
3. Observa la liquidación automática: calculará los pares trabajados por la tarifa (`45 pares * $25.00`), descontará las penalizaciones/cargos de calidad y te generará el resumen listo para guardar o imprimir.

---

## 📜 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Inicia el servidor de producción optimizado |
| `npm run lint` | Ejecuta el linter ESLint para auditar el código |
