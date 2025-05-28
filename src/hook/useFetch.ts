import { useEffect, useState } from "react";

export const useFetch = <T = unknown>(url: string | null) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      console.log(`❌ useFetch: No hay URL, saltando petición`);
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        console.log(`🚀 useFetch: Iniciando petición a ${url}`);
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log(`✅ useFetch: Datos recibidos:`, result);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        console.error(`❌ useFetch: Error:`, errorMessage);
        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
        console.log(`🏁 useFetch: Petición completada`);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
