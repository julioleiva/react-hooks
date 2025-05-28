# 📘 Guía Completa de React Router DOM Básico

## 🧭 Navegación con NavLink

### **Navigation.jsx - Barra de navegación**

```jsx
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/about">Acerca</NavLink>
        </li>
        <li>
          <NavLink to="/users">Usuarios</NavLink>
        </li>
      </ul>
    </nav>
  );
}
```

### **Características de NavLink:**

- ✅ **Clase automática 'active'** cuando la ruta coincide
- ✅ **Función className dinámica** con `isActive`
- ✅ **Navegación declarativa** ideal para menús
- ✅ **Accesibilidad automática** con aria-current

## 🔗 Enlaces con Link

### **En Users.jsx - Enlaces simples**

```jsx
import { Link } from "react-router-dom";

// Enlaces simples sin estado activo
<Link to={`/users/${user.id}`} className="userLink">
  {user.name}
</Link>;
```

**Diferencia Link vs NavLink:**

- **Link**: Enlaces simples, sin estado activo
- **NavLink**: Enlaces con estado activo, ideal para navegación

## 📍 Parámetros de Ruta con useParams

### **UserProfile.jsx - Capturar parámetros**

```jsx
import { useParams } from "react-router-dom";

function UserProfile() {
  const { userId } = useParams();

  // userId contiene el valor del parámetro :userId de la ruta
  const user = users[userId];

  if (!user) {
    return <div>Usuario con ID "{userId}" no encontrado</div>;
  }

  return (
    <div>
      <h1>Perfil de {user.name}</h1>
      <p>ID: {userId}</p>
    </div>
  );
}
```

### **Configuración de ruta con parámetros:**

```jsx
<Route path="/users/:userId" element={<UserProfile />} />
```

**Características:**

- ✅ **Parámetros dinámicos** con `:paramName`
- ✅ **Acceso automático** via `useParams()`
- ✅ **Múltiples parámetros** posibles: `/users/:userId/posts/:postId`
- ✅ **Parámetros opcionales** con `?`: `/users/:userId?`

## 🚀 Navegación Programática con useNavigate

### **Casos de uso implementados:**

#### **1. Navegación básica**

```jsx
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToUser = (userId) => {
    navigate(`/users/${userId}`);
  };
}
```

#### **2. Navegación con estado**

```jsx
const handleNavigateWithState = () => {
  navigate("/users", {
    state: {
      from: "about",
      message: "¡Viniste desde About!",
    },
  });
};

// En el componente destino
import { useLocation } from "react-router-dom";

function Users() {
  const location = useLocation();
  const { from, message } = location.state || {};

  return <div>{message && <p>{message}</p>}</div>;
}
```

#### **3. Navegación en el historial**

```jsx
const navigate = useNavigate();

// Ir atrás (equivale a window.history.back())
const goBack = () => navigate(-1);

// Ir adelante
const goForward = () => navigate(1);

// Ir atrás 2 páginas
const goBackTwice = () => navigate(-2);
```

#### **4. Navegación con reemplazo**

```jsx
// Reemplaza la entrada actual del historial
navigate("/login", { replace: true });

// Útil para redirects después de login/logout
```

## 🎯 Comparación de Métodos de Navegación

| Método          | Uso ideal               | Características                                                   |
| --------------- | ----------------------- | ----------------------------------------------------------------- |
| **NavLink**     | Menús de navegación     | ✅ Estado activo automático<br>✅ Accesibilidad<br>✅ Declarativo |
| **Link**        | Enlaces simples         | ✅ Ligero<br>✅ Sin estado activo<br>✅ Declarativo               |
| **useNavigate** | Navegación programática | ✅ Control total<br>✅ Lógica condicional<br>✅ Estado y opciones |

## 📱 Casos de Uso Prácticos Implementados

### **1. Página de Usuarios (Users.jsx)**

```jsx
function Users() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Comparación de métodos */}
      <NavLink to={`/users/${user.id}`}>Ver Perfil (Link)</NavLink>

      <button onClick={() => navigate(`/users/${user.id}`)}>
        Ver Perfil (Navigate)
      </button>

      <button onClick={() => navigate("/")}>🏠 Volver al Inicio</button>
    </div>
  );
}
```

### **2. Perfil de Usuario (UserProfile.jsx)**

```jsx
function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleNavigateToUser = (newUserId) => {
    navigate(`/users/${newUserId}`);
  };

  return (
    <div>
      <h1>Perfil de {user.name}</h1>

      {/* Navegación entre usuarios */}
      {otherUsers.map((user) => (
        <button key={user.id} onClick={() => handleNavigateToUser(user.id)}>
          {user.name}
        </button>
      ))}

      {/* Botones de navegación */}
      <button onClick={() => navigate("/users")}>← Volver a Usuarios</button>

      <button onClick={() => navigate("/")}>🏠 Inicio</button>
    </div>
  );
}
```

### **3. Página About con navegación avanzada**

```jsx
function About() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navegación básica */}
      <button onClick={() => navigate("/users")}>👥 Ver Usuarios</button>

      {/* Navegación con estado */}
      <button
        onClick={() =>
          navigate("/users", {
            state: { from: "about", message: "¡Desde About!" },
          })
        }
      >
        👥 Usuarios (con estado)
      </button>

      {/* Navegación en historial */}
      <button onClick={() => navigate(-1)}>← Volver atrás</button>
    </div>
  );
}
```

## 🛠️ Hooks de React Router

### **1. useParams**

```jsx
const { userId, postId } = useParams();
// Captura parámetros de la URL
```

### **2. useNavigate**

```jsx
const navigate = useNavigate();
// Navegación programática
```

### **3. useLocation**

```jsx
const location = useLocation();
// Información sobre la ubicación actual
console.log(location.pathname); // "/users/1"
console.log(location.state); // Estado pasado via navigate
```

### **4. useSearchParams**

```jsx
const [searchParams, setSearchParams] = useSearchParams();
// Manejo de query parameters (?page=1&filter=active)
```

## 🎯 Resumen de Funcionalidades Implementadas

- ✅ **Routing básico** con múltiples páginas
- ✅ **Parámetros dinámicos** en URLs
- ✅ **Navegación activa** con NavLink
- ✅ **Navegación programática** con useNavigate
- ✅ **Navegación con estado** entre componentes
- ✅ **Navegación en historial** (atrás/adelante)
- ✅ **Manejo de errores** (rutas no encontradas)
- ✅ **UX optimizada** con estilos y transiciones

## 📦 Layouts y Rutas Anidadas con Outlet en React Router DOM

Outlet es un componente especial que actúa como un marcador de posición donde se renderizan las rutas hijas (child routes) en layouts anidados.

### ¿Cómo funciona?

Cuando defines rutas anidadas, el componente padre necesita indicar dónde debe aparecer el contenido de las rutas hijas. Ahí es donde entra Outlet:

```jsx
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>
        <nav>Mi Navegación</nav>
      </header>

      <main>
        <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
      </main>

      <footer>Mi Footer</footer>
    </div>
  );
}
```

### Configuración de rutas anidadas

```jsx
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);
```

En este ejemplo:

Cuando el usuario visita /home, se renderiza <Layout> y dentro del <Outlet> aparece <Home>
Cuando visita /about, se mantiene el layout pero el <Outlet> muestra <About>
El header y footer permanecen constantes mientras cambia solo el contenido principal

**Ventajas principales**
Reutilización de layouts: Puedes mantener elementos comunes (navegación, sidebar, footer) mientras cambias solo el contenido específico de cada página.
Anidación profunda: Puedes tener múltiples niveles de <Outlet> para estructuras más complejas.

Rendimiento: Evita re-renderizar elementos que no cambian entre rutas.
El <Outlet> es fundamental para crear aplicaciones con navegación fluida y layouts consistentes en React Router DOM.
