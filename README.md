# 🚀 Hooks Personalizados: useDebounce + useFetch

## 🔧 Hooks Incluidos

### useDebounce

Retrasa la actualización de un valor hasta que el usuario deje de interactuar durante un período específico.

#### Firma

```typescript
function useDebounce<T>(value: T, delay: number): T;
```

#### Parámetros

- `value: T` - Valor a debounce (cualquier tipo)
- `delay: number` - Tiempo de espera en milisegundos

#### Retorna

- `T` - Valor debounced del mismo tipo que el input

#### Ejemplo

```typescript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// El valor se actualiza solo después de 500ms sin cambios
useEffect(() => {
  if (debouncedSearchTerm) {
    // Hacer búsqueda
  }
}, [debouncedSearchTerm]);
```

### useFetch

Hook para peticiones HTTP con manejo automático de estados.

#### Firma

```typescript
function useFetch<T = unknown>(
  url: string | null
): {
  data: T | null;
  loading: boolean;
  error: string | null;
};
```

#### Parámetros

- `url: string | null` - URL para la petición (null previene la ejecución)

#### Retorna

- `data: T | null` - Datos recibidos de la API
- `loading: boolean` - Estado de carga
- `error: string | null` - Mensaje de error si ocurre

#### Ejemplo

```typescript
const { data, loading, error } = useFetch<User[]>(
  "https://api.example.com/users"
);

if (loading) return <div>Cargando...</div>;
if (error) return <div>Error: {error}</div>;
if (data) return <div>Usuarios: {data.length}</div>;
```

## 🚀 Uso Básico

### 1. Importar los hooks

```typescript
import { useDebounce } from "./hooks/useDebounce";
import { useFetch } from "./hooks/useFetch";
```

### 2. Implementación simple

```typescript
const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const apiUrl = debouncedQuery
    ? `https://api.example.com/search?q=${debouncedQuery}`
    : null;

  const { data, loading, error } = useFetch(apiUrl);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
      />
      {loading && <p>Buscando...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Resultados: {data.length}</p>}
    </div>
  );
};
```

## 💡 Ejemplo Completo

```typescript
import React, { useState, useMemo } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { useFetch } from "./hooks/useFetch";

interface User {
  id: number;
  name: string;
  email: string;
}

export const UserSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Debounce del término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Construir URL solo cuando hay término válido
  const searchUrl = useMemo(() => {
    return debouncedSearchTerm.trim()
      ? `https://jsonplaceholder.typicode.com/users`
      : null;
  }, [debouncedSearchTerm]);

  // Fetch de datos
  const { data, loading, error } = useFetch<User[]>(searchUrl);

  // Filtrar resultados localmente
  const filteredUsers = useMemo(() => {
    if (!data || !debouncedSearchTerm) return [];

    return data.filter((user) =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [data, debouncedSearchTerm]);

  return (
    <div>
      <h2>🔍 Búsqueda de Usuarios</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar usuarios..."
        style={{ padding: "10px", width: "300px" }}
      />

      <div style={{ marginTop: "20px" }}>
        <p>Término actual: "{searchTerm}"</p>
        <p>Término debounced: "{debouncedSearchTerm}"</p>
        <p>Estado: {loading ? "Cargando..." : "Listo"}</p>
      </div>

      {loading && <div>🔄 Buscando usuarios...</div>}
      {error && <div>❌ Error: {error}</div>}

      {filteredUsers.length > 0 && (
        <div>
          <h3>📊 Resultados ({filteredUsers.length})</h3>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                margin: "5px",
              }}
            >
              <strong>{user.name}</strong>
              <br />
              <small>{user.email}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 📚 API Reference

### useDebounce

| Parámetro | Tipo     | Descripción           | Default |
| --------- | -------- | --------------------- | ------- |
| `value`   | `T`      | Valor a debounce      | -       |
| `delay`   | `number` | Tiempo de espera (ms) | -       |

**Retorna**: `T`

### useFetch

| Parámetro | Tipo             | Descripción        | Default |
| --------- | ---------------- | ------------------ | ------- |
| `url`     | `string \| null` | URL de la petición | -       |

**Retorna**: `{ data: T \| null, loading: boolean, error: string \| null }`

## 🎯 Casos de Uso

### 1. Búsqueda de Productos

```typescript
const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const { data } = useFetch(`/api/products?search=${debouncedQuery}`);
  // ...
};
```

### 2. Autocompletado

```typescript
const Autocomplete = () => {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 250);
  const { data: suggestions } = useFetch(
    `/api/autocomplete?q=${debouncedInput}`
  );
  // ...
};
```

### 3. Validación de Formularios

```typescript
const EmailValidator = () => {
  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounce(email, 600);
  const { data: isValid } = useFetch(
    `/api/validate-email?email=${debouncedEmail}`
  );
  // ...
};
```

### 4. Filtros Dinámicos

```typescript
const DataFilter = () => {
  const [filters, setFilters] = useState({});
  const debouncedFilters = useDebounce(filters, 300);
  const { data } = useFetch(
    `/api/data?${new URLSearchParams(debouncedFilters)}`
  );
  // ...
};
```

## Retos

### Reto 1: Mejora del Hook useFetch - Type Safety 🛡️

📝 Problema
El siguiente código genera un error de TypeScript porque data es de tipo unknown:

```typescript
import { useFetch } from "../hook/useFetch";

export function TodoList() {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/todos"
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {/* ❌ Error: 'data' is of type 'unknown' */}
      {data.slice(0, 5).map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

### Reto 2: Protección contra Cambios de Endpoint 🔄

📝 Problema
En el componente de demostración, cuando cambias entre endpoints (users y posts) con un término de búsqueda activo, la aplicación se rompe con el siguiente error:

```bash
TypeError: Cannot read properties of undefined (reading 'substring')
TypeError: Cannot read properties of undefined (reading 'title')
```

Esto ocurre porque:

Los datos del endpoint anterior permanecen en el estado
El código intenta acceder a propiedades que no existen en el nuevo tipo de datos
No hay validación de tipos en tiempo de ejecución
