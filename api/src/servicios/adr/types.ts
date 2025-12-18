export type EstadoADR = 'pendiente' | 'en revisión' | 'aprobado' | 'rechazado';

export interface ADR {
  id: string; // UUID
  titulo: string;
  autor: string;
  fechaCreacion: string; // ISO
  estado: EstadoADR;
  objetivo: string;
  decisión: string;
  contexto?: string;
}
