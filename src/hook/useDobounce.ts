import { useState, useEffect } from "react";

/**
 * Hook personalizado para debounce de valores con TypeScript
 * Optimiza peticiones retrasando la actualización del valor hasta que
 * el usuario deje de interactuar por un período determinado
 *
 * @param value - Valor a debounce (puede ser de cualquier tipo)
 * @param delay - Tiempo de espera en milisegundos
 * @returns Valor debounced del mismo tipo que el input
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    console.log(
      `🕐 useDebounce: Iniciando timer para "${value}" con delay de ${delay}ms`
    );

    // Configurar el timer
    const timer = setTimeout(() => {
      console.log(
        `✅ useDebounce: Valor actualizado a "${value}" después de ${delay}ms`
      );
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timer si el valor cambia antes del delay
    return () => {
      console.log(`🚫 useDebounce: Timer cancelado para "${value}"`);
      clearTimeout(timer);
    };
  }, [value, delay]);

  // Log inicial
  useEffect(() => {
    console.log(`🎯 useDebounce: Hook inicializado con valor "${value}"`);
  }, []);

  return debouncedValue;
};
