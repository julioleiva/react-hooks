# TanStack Router

### Características Principales

- ✅ **100% Type-Safe** - Navegación, parámetros y datos completamente tipados
- ✅ **Enrutamiento Basado en Archivos** - Estructura intuitiva y automática división de código
- ✅ **Nested Routes & Layouts** - Rutas anidadas con layouts reutilizables
- ✅ **Search Params como Estado** - Gestión de estado en la URL con validación
- ✅ **Carga de Datos Integrada** - Loaders con caché SWR incorporado
- ✅ **Suscripciones Granulares** - Re-renders optimizados con selectores
- ✅ **Integración con React Query** - Perfecta integración con TanStack Query
- ✅ **Suspense & Error Boundaries** - Soporte nativo para patrones React modernos
- ✅ **SSR Ready** - Soporte completo para Server-Side Rendering

## Instalación

```bash
npm install @tanstack/react-router
# o
yarn add @tanstack/react-router
# o
pnpm add @tanstack/react-router
```

### Configuración Básica

```bash
# Con el CLI
npx create-tanstack-router@latest my-app
cd my-app
npm install
npm run dev
```

## Inicio Rápido

### 1. Configuración del Router

```typescript
// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
```

### 2. Ruta Root

```typescript
// src/routes/__root.tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="nav">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
```

### 3. Rutas de Páginas

```typescript
// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <div>¡Hola desde la página principal!</div>,
});
```

```typescript
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => <div>Acerca de nosotros</div>,
});
```

## Enrutamiento Type-Safe

### Navegación Type-Safe

TanStack Router vive y respira TypeScript. Todas las características fueron diseñadas con seguridad de tipos completamente inferida en mente.

```typescript
// ❌ Error de TypeScript si la ruta no existe
<Link to="/ruta-inexistente">Ir a algún lugar</Link>

// ✅ Navegación completamente tipada
<Link to="/issues/$issueId" params={{ issueId: 'TSR-25' }}>
  Ir a detalles
</Link>
```

### useParams con StrictOrFrom

```typescript
// Con from específico - garantiza que issueId existe
const { issueId } = useParams({ from: "/issues/$issueId" });
//      ^? const issueId: string

// Con strict: false - union de todos los params posibles
const params = useParams({ strict: false });
//    ^? const params: {
//           issueId: string | undefined,
//           dashboardId: number | undefined
//       }
```

### Parámetros de Búsqueda Type-Safe

```typescript
// Definir schema de validación
import { type } from "arktype";

const issuesSchema = type({
  page: "number > 0 = 1",
  filter: 'string = ""',
  sort: '"asc" | "desc" = "asc"',
});

export const Route = createFileRoute("/issues")({
  validateSearch: issuesSchema,
  component: Issues,
});

function Issues() {
  const { page, filter, sort } = useSearch({ from: "/issues" });
  //      ^? Completamente tipado según el schema

  return (
    <div>
      <p>Página: {page}</p>
      <p>Filtro: {filter}</p>
      <p>Ordenar: {sort}</p>
    </div>
  );
}
```

## Route Context - Inyección de Dependencias

El contexto del router es una herramienta poderosa para inyección de dependencias y compartir datos entre rutas.

### Configuración del Contexto Root

```typescript
// src/router.tsx
import { createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
  auth: {
    isAuthenticated: boolean;
    user?: User;
  };
}

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: App,
});

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree: rootRoute,
  context: {
    queryClient,
    auth: {
      isAuthenticated: false,
    },
  },
});
```

### Uso del Contexto en Rutas

```typescript
// src/routes/todos.tsx
export const Route = createFileRoute("/todos")({
  component: Todos,
  loader: ({ context }) => {
    // Acceso al contexto tipado
    return context.queryClient.fetchQuery({
      queryKey: ["todos", context.auth.user?.id],
      queryFn: () => fetchTodos(context.auth.user?.id),
    });
  },
});

function Todos() {
  const { queryClient, auth } = Route.useRouteContext();

  return (
    <div>
      <h1>Todos para {auth.user?.name}</h1>
      {/* Componente */}
    </div>
  );
}
```

### Contexto Anidado y Breadcrumbs

```typescript
// src/routes/app.tsx
export const Route = createFileRoute("/app")({
  beforeLoad: () => ({
    getTitle: () => "Dashboard",
    breadcrumb: "Dashboard",
  }),
  component: () => <Outlet />,
});

// src/routes/app/users/$userId.tsx
export const Route = createFileRoute("/app/users/$userId")({
  beforeLoad: ({ params }) => ({
    getTitle: () => `Usuario ${params.userId}`,
    breadcrumb: `Usuario ${params.userId}`,
  }),
  component: UserProfile,
});

// src/routes/__root.tsx
export const Route = createRootRoute({
  component: () => {
    const matches = useRouterState({ select: (s) => s.matches });
    const breadcrumbs = matches
      .map((match) => match.context.breadcrumb)
      .filter(Boolean);

    return (
      <div>
        <nav>
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {crumb} {i < breadcrumbs.length - 1 && ">"}
            </span>
          ))}
        </nav>
        <Outlet />
      </div>
    );
  },
});
```

## Rutas Anidadas y Layouts

### Estructura de Archivos

```
src/routes/
├── __root.tsx
├── index.tsx
├── about.tsx
├── app/
│   ├── route.tsx          # Layout route
│   ├── dashboard.tsx      # /app/dashboard
│   ├── settings.tsx       # /app/settings
│   └── users/
│       ├── route.tsx      # Layout para usuarios
│       ├── index.tsx      # /app/users
│       └── $userId/
│           ├── route.tsx  # Layout para usuario específico
│           ├── index.tsx  # /app/users/$userId
│           └── edit.tsx   # /app/users/$userId/edit
```

### Layout Routes

```typescript
// src/routes/app/route.tsx
export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="app-layout">
      <header>
        <nav>
          <Link to="/app/dashboard">Dashboard</Link>
          <Link to="/app/settings">Configuración</Link>
        </nav>
      </header>
      <main>
        <Outlet /> {/* Renderiza rutas hijas */}
      </main>
    </div>
  );
}
```

### Pathless Layout Routes

```typescript
// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});

// Todas las rutas bajo _authenticated/ requieren autenticación
// src/routes/_authenticated/dashboard.tsx
// src/routes/_authenticated/profile.tsx
```

### Rutas No-Anidadas

```typescript
// Ruta anidada normal: /posts/$postId
// src/routes/posts/$postId.tsx

// Ruta no-anidada: /posts/$postId/edit (no hereda layout de posts)
// src/routes/posts_.$postId.edit.tsx
export const Route = createFileRoute("/posts_/$postId/edit")({
  component: PostEditor,
});
```

## Integración con TanStack Query

### Configuración del Router con Query Client

```typescript
// src/router.tsx
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

const queryClient = new QueryClient();

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

export const router = createRouter({
  routeTree: rootRoute,
  context: { queryClient },
});
```

### Carga de Datos con Loaders

```typescript
// src/routes/posts/$postId.tsx
import { useSuspenseQuery } from "@tanstack/react-query";

const postQueryOptions = (postId: string) => ({
  queryKey: ["posts", postId],
  queryFn: () => fetchPost(postId),
});

export const Route = createFileRoute("/posts/$postId")({
  loader: ({ context: { queryClient }, params: { postId } }) => {
    // Prefetch de datos en el servidor
    return queryClient.ensureQueryData(postQueryOptions(postId));
  },
  component: PostDetail,
});

function PostDetail() {
  const { postId } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQueryOptions(postId));
  //      ^? const post: Post (garantizado por Suspense)

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### Gestión de Estado con Search Params

```typescript
// src/routes/posts/index.tsx
import { useQuery } from "@tanstack/react-query";

const postsSearchSchema = type({
  page: "number = 1",
  limit: "number = 10",
  search: 'string = ""',
  category: "string?",
});

export const Route = createFileRoute("/posts")({
  validateSearch: postsSearchSchema,
  component: PostsList,
});

function PostsList() {
  const { page, limit, search, category } = useSearch({ from: "/posts" });
  const navigate = useNavigate({ from: "/posts" });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", { page, limit, search, category }],
    queryFn: () => fetchPosts({ page, limit, search, category }),
  });

  const handleSearchChange = (newSearch: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: newSearch, page: 1 }),
    });
  };

  return (
    <div>
      <input
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Buscar posts..."
      />
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <div>
          {posts?.map((post) => (
            <div key={post.id}>
              <Link to="/posts/$postId" params={{ postId: post.id }}>
                {post.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Search Middleware

TanStack Router permite definir middleware para procesar parámetros de búsqueda antes y después de la validación.

### Middleware de Validación Personalizada

```typescript
// src/middleware/searchMiddleware.ts
import { createSearchMiddleware } from "@tanstack/react-router";

export const paginationMiddleware = createSearchMiddleware({
  beforeValidate: (search) => {
    // Normalizar parámetros antes de validación
    return {
      ...search,
      page: search.page ? Number(search.page) : 1,
      limit: search.limit ? Number(search.limit) : 10,
    };
  },
  afterValidate: (search) => {
    // Procesar después de validación
    return {
      ...search,
      offset: (search.page - 1) * search.limit,
    };
  },
});
```

### Uso del Middleware

```typescript
// src/routes/products.tsx
export const Route = createFileRoute("/products")({
  validateSearch: productsSchema,
  searchMiddleware: [paginationMiddleware],
  component: Products,
});
```

## Suscripciones Granulares

Evita re-renders innecesarios con selectores granulares:

```typescript
function ProductTable() {
  // Solo se re-renderiza cuando cambia 'page'
  const page = useSearch({
    from: "/products",
    select: (search) => search.page,
  });

  // Solo se re-renderiza cuando cambia 'sortBy'
  const sortBy = useSearch({
    from: "/products",
    select: (search) => search.sortBy,
  });

  // Componente pesado que solo depende de 'page'
  return (
    <ExpensiveTable
      page={page}
      sortBy={sortBy}
      onSortChange={(sort) => {
        navigate({
          search: (prev) => ({ ...prev, sortBy: sort }),
        });
      }}
    />
  );
}
```

## Configuración en Monorepo

### Estructura del Proyecto

```
packages/
├── shared-router/
│   ├── package.json
│   ├── src/
│   │   ├── index.ts
│   │   └── routes/
│   └── tsconfig.json
├── app-admin/
│   ├── package.json
│   ├── src/
│   │   ├── main.tsx
│   │   └── routes/
│   └── vite.config.ts
└── app-client/
    ├── package.json
    ├── src/
    │   ├── main.tsx
    │   └── routes/
    └── vite.config.ts
```

### Configuración Compartida

```typescript
// packages/shared-router/src/index.ts
export * from "@tanstack/react-router";
export type { RouterContext } from "./types";

// Tipos compartidos
export interface BaseRouterContext {
  queryClient: QueryClient;
  auth: AuthContext;
}
```

```typescript
// packages/app-admin/src/router.ts
import { createRouter } from "@tanstack/react-router";
import { BaseRouterContext } from "shared-router";
import { routeTree } from "./routeTree.gen";

interface AdminRouterContext extends BaseRouterContext {
  adminPermissions: string[];
}

export const router = createRouter({
  routeTree,
  context: {
    queryClient: new QueryClient(),
    auth: useAuth(),
    adminPermissions: ["admin", "moderator"],
  } as AdminRouterContext,
});
```

### Configuración de Vite para Monorepo

```typescript
// packages/app-admin/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
  ],
  resolve: {
    alias: {
      "shared-router": "../shared-router/src",
    },
  },
});
```

## TanStack Start - SSR Full-Stack

TanStack Start es un framework full-stack construido sobre TanStack Router que añade capacidades de servidor.

### Instalación

```bash
npx create-tanstack-start@latest my-app
cd my-app
npm install
npm run dev
```

### Estructura del Proyecto

```
app/
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   └── api/
│       └── hello.ts
├── client.tsx
├── router.tsx
├── ssr.tsx           # Configuración SSR
└── routeTree.gen.ts
```

### Configuración SSR

```typescript
// app/ssr.tsx
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
```

### Server Functions

```typescript
// app/routes/api/hello.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const Route = createAPIFileRoute("/api/hello")({
  GET: ({ request }) => {
    return new Response("Hello from the server!", {
      status: 200,
    });
  },
});
```

### Funciones del Servidor

```typescript
// app/routes/posts.tsx
import { createServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

const getPosts = createServerFn("GET", async () => {
  // Código que solo se ejecuta en el servidor
  const posts = await db.posts.findMany();
  return posts;
});

export const Route = createFileRoute("/posts")({
  loader: () => getPosts(),
  component: Posts,
});

function Posts() {
  const posts = Route.useLoaderData();

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Middleware en Start

```typescript
// app/middleware.ts
import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const token = request.headers.get("Authorization");

    if (!token) {
      throw new Error("No autorizado");
    }

    const user = await validateToken(token);

    return next({
      context: { user },
    });
  }
);

// Uso en server function
const getProtectedData = createServerFn("GET", async () => {
  // ...
}).middleware([authMiddleware]);
```

### Configuración de Deployment

```typescript
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    preset: "vercel", // o 'netlify', 'cloudflare-pages', etc.
  },
  vite: {
    plugins: [
      // plugins de Vite
    ],
  },
});
```

## Rutas Autenticadas

### Protección con beforeLoad

```typescript
// src/routes/_authenticated.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
```

### Configuración de Autenticación

```typescript
// src/auth.tsx
import { createContext, useContext } from "react";

interface AuthContext {
  isAuthenticated: boolean;
  user?: User;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();

  const login = async (credentials: Credentials) => {
    const user = await apiLogin(credentials);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(undefined);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
```

### Integración con el Router

```typescript
// src/main.tsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./auth";
import { router } from "./router";

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## Configuración de Bundlers

### Vite

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
  ],
});
```

### Webpack

```typescript
// webpack.config.js
const { TanStackRouterWebpack } = require("@tanstack/router-webpack-plugin");

module.exports = {
  plugins: [
    new TanStackRouterWebpack({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
  ],
};
```

### Next.js

```typescript
// next.config.js
const { TanStackRouterNext } = require("@tanstack/router-next-plugin");

module.exports = TanStackRouterNext({
  routesDirectory: "./src/routes",
  generatedRouteTree: "./src/routeTree.gen.ts",
});
```

## Ejemplos Avanzados

### Rutas Dinámicas con Validación

```typescript
// src/routes/users/$userId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const userParamsSchema = z.object({
  userId: z.string().uuid(),
});

export const Route = createFileRoute("/users/$userId")({
  parseParams: (params) => userParamsSchema.parse(params),
  beforeLoad: ({ params }) => {
    // params.userId es ahora un UUID validado
    console.log("Loading user:", params.userId);
  },
  component: UserProfile,
});
```

### Manejo de Errores

```typescript
// src/routes/posts/$postId.tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: ({ params }) => fetchPost(params.postId),
  errorComponent: ({ error }) => (
    <div className="error">
      <h2>Error al cargar el post</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  ),
  component: PostDetail,
});
```

### Rutas con Data Loaders Condicionales

```typescript
// src/routes/dashboard.tsx
export const Route = createFileRoute("/dashboard")({
  loader: ({ context }) => {
    if (context.auth.user?.role === "admin") {
      return Promise.all([
        fetchUserStats(),
        fetchAdminMetrics(),
        fetchSystemHealth(),
      ]).then(([stats, metrics, health]) => ({
        stats,
        metrics,
        health,
      }));
    }

    return fetchUserStats().then((stats) => ({ stats }));
  },
  component: Dashboard,
});
```

## Migración desde React Router

### Comparación de APIs

```typescript
// React Router v6
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

// TanStack Router (equivalente)
const rootRoute = createRootRoute({
  component: Root,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([dashboardRoute]),
});
```

### Guía de Migración

1. **Instalar TanStack Router**: `npm install @tanstack/react-router`
2. **Configurar el plugin**: Agregar el plugin de Vite/Webpack
3. **Convertir rutas**: Migrar de `createBrowserRouter` a file-based routing
4. **Actualizar navegación**: Cambiar `useNavigate` por la versión tipada
5. **Migrar loaders**: Convertir `loaders` de React Router a TanStack Router
6. **Actualizar tests**: Adaptar tests para las nuevas APIs

## Mejores Prácticas

### 1. Estructura de Carpetas

```
src/
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── _authenticated/
│   │   ├── dashboard.tsx
│   │   └── profile.tsx
│   └── _public/
│       ├── login.tsx
│       └── register.tsx
├── components/
├── hooks/
├── services/
└── types/
```

### 2. Validación de Schemas

```typescript
// Usar librerías como Zod o ArkType para validación
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
});
```

### 3. Gestión de Errores

```typescript
// Componente de error reutilizable
const ErrorFallback = ({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) => (
  <div className="error-boundary">
    <h2>Algo salió mal</h2>
    <details>
      <summary>Detalles del error</summary>
      <pre>{error.message}</pre>
    </details>
    <button onClick={retry}>Reintentar</button>
  </div>
);

// Usar en rutas
export const Route = createFileRoute("/data")({
  errorComponent: ErrorFallback,
});
```

### 4. Optimización de Performance

```typescript
// Preload de rutas críticas
const router = createRouter({
  routeTree,
  defaultPreload: "intent", // Preload al hacer hover
  defaultPreloadStaleTime: 1000 * 60 * 2, // 2 minutos
});

// Lazy loading de componentes pesados
const HeavyComponent = lazy(() => import("./HeavyComponent"));

export const Route = createFileRoute("/heavy")({
  component: () => (
    <Suspense fallback={<div>Cargando...</div>}>
      <HeavyComponent />
    </Suspense>
  ),
});
```

### 5. Testing

```typescript
// Test helpers
import { createMemoryHistory } from "@tanstack/react-router";
import { render } from "@testing-library/react";

const createTestRouter = (initialEntries = ["/"]) => {
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries }),
  });
};

// Test de rutas
test("renders dashboard correctly", () => {
  const router = createTestRouter(["/dashboard"]);

  render(<RouterProvider router={router} />);

  expect(screen.getByText("Dashboard")).toBeInTheDocument();
});
```

## Comparación con Otros Routers

| Característica     | TanStack Router  | React Router | Next.js Router |
| ------------------ | ---------------- | ------------ | -------------- |
| Type Safety        | ✅ 100%          | ❌ Básico    | ✅ Parcial     |
| File-based Routing | ✅               | ❌           | ✅             |
| Search Params      | ✅ Primera clase | ❌ Manual    | ❌ Manual      |
| Nested Layouts     | ✅               | ✅           | ✅             |
| Data Loading       | ✅ Con caché     | ✅ Básico    | ✅ Avanzado    |
| Bundle Size        | 📦 ~12kb         | 📦 ~13kb     | 📦 Framework   |
| Learning Curve     | 📈 Media         | 📈 Baja      | 📈 Media-Alta  |
