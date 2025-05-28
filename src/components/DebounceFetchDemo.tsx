import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../hook/useDobounce";
import { useFetch } from "../hook/useFetch";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Componente Demo Simple
export const DebounceFetchDemo = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [endpoint, setEndpoint] = useState<"users" | "posts">("users");

  // 1. Debounce del término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 2. Construir URL basada en el término debounced
  const apiUrl = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      console.log(`🔍 URL: No hay término de búsqueda, URL = null`);
      return null;
    }

    const url = `https://jsonplaceholder.typicode.com/${endpoint}`;
    console.log(`🔍 URL construida: ${url}`);
    return url;
  }, [debouncedSearchTerm, endpoint]);

  // 3. Fetch de datos
  const { data, loading, error } = useFetch<User[] | Post[]>(apiUrl);

  // 4. Logging de resultados
  useEffect(() => {
    if (data && debouncedSearchTerm) {
      console.log(`📊 RESULTADOS para "${debouncedSearchTerm}":`, data);
      console.log(`📈 Total de ${endpoint}:`, data.length);

      if (endpoint === "users") {
        const users = data as User[];
        console.log(
          `👥 Usuarios encontrados:`,
          users.map((u) => u.name)
        );
      } else {
        const posts = data as Post[];
        console.log(
          `📝 Posts encontrados:`,
          posts.map((p) => p.title.substring(0, 50) + "...")
        );
      }
    }
  }, [data, debouncedSearchTerm, endpoint]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`⌨️ Usuario escribió: "${value}"`);
    setSearchTerm(value);
  };

  const handleEndpointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndpoint = e.target.value as "users" | "posts";
    console.log(`🔄 Cambiando endpoint a: ${newEndpoint}`);
    setEndpoint(newEndpoint);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>🔍 Demo Simple: useDebounce + useFetch</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Abre la consola del navegador para ver el flujo completo
      </p>

      {/* Controles */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="search"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Término de búsqueda:
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Escribe algo..."
            style={{
              padding: "10px",
              fontSize: "16px",
              width: "100%",
              boxSizing: "border-box",
              border: "2px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="endpoint"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Endpoint:
          </label>
          <select
            id="endpoint"
            value={endpoint}
            onChange={handleEndpointChange}
            style={{
              padding: "10px",
              fontSize: "16px",
              width: "100%",
              border: "2px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <option value="users">👥 Usuarios (/users)</option>
            <option value="posts">📝 Posts (/posts)</option>
          </select>
        </div>
      </div>

      {/* Estado actual */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>📊 Estado Actual</h3>
        <p>
          <strong>Término actual:</strong> "{searchTerm}"
        </p>
        <p>
          <strong>Término debounced:</strong> "{debouncedSearchTerm}"
        </p>
        <p>
          <strong>URL:</strong> {apiUrl || "null"}
        </p>
        <p>
          <strong>Loading:</strong> {loading ? "⏳ Sí" : "✅ No"}
        </p>
        <p>
          <strong>Error:</strong> {error || "Ninguno"}
        </p>
        <p>
          <strong>Datos:</strong>{" "}
          {data ? `${Array.isArray(data) ? data.length : 1} elementos` : "null"}
        </p>
      </div>

      {/* Resultados simplificados */}
      {loading && (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#e3f2fd",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          🔄 Cargando datos...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          ❌ <strong>Error:</strong> {error}
        </div>
      )}

      {data && !loading && !error && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#e8f5e8",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          ✅ <strong>Datos recibidos:</strong>{" "}
          {Array.isArray(data) ? data.length : 1} elementos
          <br />
          <small>Revisa la consola para ver los detalles completos</small>
        </div>
      )}

      {/* Instrucciones */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff3e0",
          borderRadius: "8px",
          marginTop: "30px",
        }}
      >
        <h3>📋 Instrucciones</h3>
        <ol>
          <li>
            Abre la <strong>consola del navegador</strong> (F12 → Console)
          </li>
          <li>Escribe algo en el campo de búsqueda</li>
          <li>Observa los logs del debounce (500ms de retraso)</li>
          <li>Ve cómo se construye la URL y se hace el fetch</li>
          <li>Examina los datos recibidos en la consola</li>
          <li>Cambia el endpoint para probar diferentes APIs</li>
        </ol>
      </div>

      {/* Ejemplo de flujo */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h3>🔄 Flujo de Ejecución</h3>
        <pre style={{ fontSize: "12px", lineHeight: "1.4" }}>
          {`1. Usuario escribe "john"
     ⌨️  Usuario escribió: "john"
     🕐 useDebounce: Iniciando timer...
  
  2. Usuario sigue escribiendo "johnny"
     ⌨️  Usuario escribió: "johnny"  
     🚫 useDebounce: Timer cancelado para "john"
     🕐 useDebounce: Iniciando timer para "johnny"...
  
  3. Después de 500ms sin cambios:
     ✅ useDebounce: Valor actualizado a "johnny"
     🔍 URL construida: https://jsonplaceholder.typicode.com/users
     🚀 useFetch: Iniciando petición...
     ✅ useFetch: Datos recibidos: [array con usuarios]
     📊 RESULTADOS para "johnny": [datos...]`}
        </pre>
      </div>
    </div>
  );
};
