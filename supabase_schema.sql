-- =================================================================
-- ESQUEMA SQL PARA BASE DE DATOS POSTGRESQL / SUPABASE
-- Sistema de Almacén y Control de Producción de Fábrica de Calzado
-- =================================================================

-- 1. TABLA DE MAQUILEROS / TALLERES EXTERNOS
CREATE TABLE IF NOT EXISTS public.maquileros (
    id VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tarifa_por_par NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABLA DE MODELOS DE CALZADO
CREATE TABLE IF NOT EXISTS public.modelos (
    id VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    estilo VARCHAR(255),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLA DE FICHAS TÉCNICAS (BOM)
CREATE TABLE IF NOT EXISTS public.fichas_tecnicas_bom (
    id VARCHAR(100) PRIMARY KEY,
    modelo_nombre VARCHAR(255) NOT NULL UNIQUE,
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA DE ITEMS DE RECETAS BOM
CREATE TABLE IF NOT EXISTS public.items_receta_bom (
    id VARCHAR(100) PRIMARY KEY,
    ficha_id VARCHAR(100) REFERENCES public.fichas_tecnicas_bom(id) ON DELETE CASCADE,
    material_nombre VARCHAR(255) NOT NULL,
    cantidad_por_par NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    unidad_medida VARCHAR(50) NOT NULL
);

-- 5. TABLA DE INVENTARIO CRUDO / INSUMOS
CREATE TABLE IF NOT EXISTS public.inventario_crudo (
    id VARCHAR(100) PRIMARY KEY,
    tipo_material VARCHAR(255) NOT NULL,
    talla NUMERIC(5, 1) DEFAULT 0.0,
    cantidad_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA DE LOTES DE PRODUCCIÓN (WIP)
CREATE TABLE IF NOT EXISTS public.lotes_produccion (
    id VARCHAR(100) PRIMARY KEY,
    folio VARCHAR(100) UNIQUE NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    total_pares INT NOT NULL DEFAULT 0,
    etapa_actual VARCHAR(100) NOT NULL DEFAULT 'Corte',
    maquilero_id VARCHAR(100) REFERENCES public.maquileros(id) ON DELETE SET NULL,
    maquilero_nombre VARCHAR(255),
    fecha_inicio VARCHAR(50) NOT NULL,
    desglose_tallas JSONB DEFAULT '[]'::jsonb,
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABLA DE HISTORIAL DE MOVIMIENTOS DE LOTES
CREATE TABLE IF NOT EXISTS public.historial_movimientos_lote (
    id VARCHAR(100) PRIMARY KEY,
    lote_id VARCHAR(100) REFERENCES public.lotes_produccion(id) ON DELETE CASCADE,
    etapa_origen VARCHAR(100) NOT NULL,
    etapa_destino VARCHAR(100) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    maquilero_nombre VARCHAR(255),
    notas TEXT
);

-- 8. TABLA DE ÓRDENES DE SALIDA A MAQUILA
CREATE TABLE IF NOT EXISTS public.ordenes_salida (
    id VARCHAR(100) PRIMARY KEY,
    maquilero_id VARCHAR(100) REFERENCES public.maquileros(id) ON DELETE CASCADE,
    modelo VARCHAR(255) NOT NULL,
    fecha_envio VARCHAR(50) NOT NULL,
    estatus VARCHAR(50) DEFAULT 'Pendiente',
    insumos JSONB DEFAULT '[]'::jsonb,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. DETALLE DE ÓRDENES DE SALIDA POR TALLA
CREATE TABLE IF NOT EXISTS public.ordenes_salida_detalle (
    id VARCHAR(100) PRIMARY KEY,
    orden_id VARCHAR(100) REFERENCES public.ordenes_salida(id) ON DELETE CASCADE,
    talla NUMERIC(5, 1) NOT NULL,
    pares_enviados INT NOT NULL DEFAULT 0
);

-- 10. TABLA DE RECEPCIONES DE MAQUILA Y QC
CREATE TABLE IF NOT EXISTS public.recepciones (
    id VARCHAR(100) PRIMARY KEY,
    orden_detalle_id VARCHAR(100) REFERENCES public.ordenes_salida_detalle(id) ON DELETE CASCADE,
    fecha_recepcion TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    pares_completos_entregados INT NOT NULL DEFAULT 0,
    faltantes_izquierdos INT DEFAULT 0,
    faltantes_derechos INT DEFAULT 0,
    pares_segunda INT DEFAULT 0,
    mermas_totales INT DEFAULT 0,
    tipo_defecto VARCHAR(100),
    cargo_maquilero_mxn NUMERIC(10, 2) DEFAULT 0.00,
    nota TEXT,
    alerta_activa BOOLEAN DEFAULT FALSE
);

-- 11. TABLA DE TICKETS DE PAGOS SEMANALES GUARDADOS
CREATE TABLE IF NOT EXISTS public.tickets_pagos_semanales (
    id VARCHAR(100) PRIMARY KEY,
    folio VARCHAR(100) UNIQUE NOT NULL,
    fecha_guardado TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    maquilero_id VARCHAR(100) REFERENCES public.maquileros(id) ON DELETE CASCADE,
    maquilero_nombre VARCHAR(255) NOT NULL,
    tarifa_por_par NUMERIC(10, 2) NOT NULL,
    fecha_inicio VARCHAR(50) NOT NULL,
    fecha_fin VARCHAR(50) NOT NULL,
    total_pares_completos INT NOT NULL DEFAULT 0,
    total_faltantes_piezas INT DEFAULT 0,
    total_pares_segunda INT DEFAULT 0,
    total_mermas INT DEFAULT 0,
    total_cargos_qc_mxn NUMERIC(10, 2) DEFAULT 0.00,
    total_pagar_mxn NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    items JSONB DEFAULT '[]'::jsonb,
    incidencias JSONB DEFAULT '[]'::jsonb
);

-- 12. TABLA DE SALIDAS GENERALES DE ALMACÉN
CREATE TABLE IF NOT EXISTS public.salidas_generales (
    id VARCHAR(100) PRIMARY KEY,
    folio VARCHAR(100) UNIQUE NOT NULL,
    fecha VARCHAR(50) NOT NULL,
    tipo_material VARCHAR(255) NOT NULL,
    talla NUMERIC(5, 1) DEFAULT 0.0,
    cantidad NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    unidad VARCHAR(50) NOT NULL,
    motivo_concepto VARCHAR(255) NOT NULL,
    entregado_a VARCHAR(255),
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- HABILITAR SEGURIDAD RLS (Row Level Security) CON ACCESO LECTURA/ESCRITURA PÚBLICA / AUTENTICADA
ALTER TABLE public.maquileros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fichas_tecnicas_bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_receta_bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_crudo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lotes_produccion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_movimientos_lote ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_salida ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_salida_detalle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recepciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets_pagos_semanales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salidas_generales ENABLE ROW LEVEL SECURITY;

-- POLITICAS DE ACCESO ANÓNIMO / AUTENTICADO
CREATE POLICY "Permitir todo acceso a maquileros" ON public.maquileros FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a modelos" ON public.modelos FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a fichas_tecnicas_bom" ON public.fichas_tecnicas_bom FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a items_receta_bom" ON public.items_receta_bom FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a inventario_crudo" ON public.inventario_crudo FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a lotes_produccion" ON public.lotes_produccion FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a historial_movimientos_lote" ON public.historial_movimientos_lote FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a ordenes_salida" ON public.ordenes_salida FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a ordenes_salida_detalle" ON public.ordenes_salida_detalle FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a recepciones" ON public.recepciones FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a tickets_pagos_semanales" ON public.tickets_pagos_semanales FOR ALL USING (true);
CREATE POLICY "Permitir todo acceso a salidas_generales" ON public.salidas_generales FOR ALL USING (true);
