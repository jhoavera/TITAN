/*
 * servicio-validacion-nombres.ts
 * Servicio para validar nombres de elementos (archivos, variables, scripts).
 * Reglas: estrictamente en español técnico empresarial. No usar `any`.
 */

import { z } from "zod";

export type ResultadoValidacion = {
  valido: boolean;
  razones: string[];
  sugerencia?: string;
};

const esquemaNombre = z.string().min(3).max(200).regex(/^[a-z0-9\-_.]+$/i, "El nombre debe usar caracteres válidos (a-z, 0-9, -, _, .)");

export class ServicioValidacionNombres {
  validarNombreElemento(nombre: string): ResultadoValidacion {
    const razones: string[] = [];
    try {
      esquemaNombre.parse(nombre);
    } catch (err) {
      if (err instanceof Error) razones.push(err.message);
      else razones.push("Nombre inválido");
    }

    // Regla específica de idioma: detectar palabras en inglés comunes y sugerir traducción
    const inglesComunes = ["migration", "migrations", "migrate", "create", "template"];
    const minus = nombre.toLowerCase();
    const inglesEncontrado = inglesComunes.find((t) => minus.includes(t));

    if (inglesEncontrado) {
      razones.push(`Contiene término en inglés: '${inglesEncontrado}'`);
    }

    const valido = razones.length === 0;
    const sugerencia = inglesEncontrado ? this.sugerirTraduccion(inglesEncontrado) : undefined;

    return { valido, razones, sugerencia };
  }

  sugerirTraduccion(ingles: string): string {
    switch (ingles) {
      case "migration":
      case "migrations":
      case "migracion":
      case "migraciones":
        return "migración / migraciones";
      case "migrate":
        return "migrar";
      case "create":
        return "crear";
      case "template":
        return "plantilla";
      default:
        return "ver sugerencia en glosario";
    }
  }
}
