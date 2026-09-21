export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateEs(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateShort(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Obtiene el rango de fechas de la semana de trabajo (Lunes a Domingo).
 * Incluir el domingo evita ocultar una recepción registrada el mismo día.
 */
export function getWorkWeekRange(): { inicio: string; fin: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Dom, 1 = Lun, ..., 6 = Sáb
  
  // Calcular Lunes anterior/actual
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  // Calcular Domingo
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    inicio: toFechaLocal(monday),
    fin: toFechaLocal(sunday),
  };
}

/**
 * Formatea una fecha como 'YYYY-MM-DD' usando la fecha LOCAL.
 * toISOString() la convierte a UTC y en Mexico (UTC-6) adelanta un dia
 * despues de las 18:00 h, lo que corrompia el rango semanal de la raya.
 */
export function toFechaLocal(date: Date): string {
  const anio = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
