import { GlosarioRow } from '@infraestructura/base-de-datos/esquemas/esquema-glosario';

export interface RepositorioGlosario {
  listar(): Promise<GlosarioRow[]>;
  buscarPorTermino(termino: string): Promise<GlosarioRow | null>;
  crear(entrada: { termino: string; definicion: string; autor?: string }): Promise<GlosarioRow>;
  actualizar(id: string, cambios: Partial<Omit<GlosarioRow, 'id' | 'creado_en'>>): Promise<GlosarioRow | null>;
  eliminar(id: string): Promise<boolean>;
}

export default RepositorioGlosario;
