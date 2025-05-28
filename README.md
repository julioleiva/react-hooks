# 🚀 React Router Advanced

## 🆕 Nuevos Componentes Implementados

### **1. LocationInfo Component**

`src/components/LocationInfo/LocationInfo.tsx`

**Funcionalidad:**

- ✅ Muestra información detallada de la ubicación actual
- ✅ Utiliza `useLocation()` para acceder a datos de la ruta
- ✅ Muestra pathname, search params, hash y estado transferido
- ✅ Diseño responsive con estilos modulares

**Hook utilizado:** `useLocation`

```tsx
import { useLocation } from "react-router-dom";

function LocationInfo() {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div>
      <p>Ruta: {location.pathname}</p>
      <p>Parámetros: {location.search}</p>
      <p>Hash: {location.hash}</p>
      {state.message && <p>Mensaje: {state.message}</p>}
    </div>
  );
}
```

### **2. ProductList Page**

`src/pages/ProductList/ProductList.tsx`

**Funcionalidades avanzadas:**

- ✅ **Filtros dinámicos**: Categoría, búsqueda y ordenación
- ✅ **useSearchParams**: Sincronización con URL
- ✅ **Navegación con estado**: Transfiere filtros a ProductDetail
- ✅ **Grid responsive**: Layout adaptativo para productos
- ✅ **Integración LocationInfo**: Muestra información de navegación

**Hooks utilizados:** `useSearchParams`, `useNavigate`

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get("category") || "all";
const sortBy = searchParams.get("sort") || "name";

const handleCategoryChange = (newCategory) => {
  setSearchParams({ category: newCategory, sort: sortBy });
};
```

**Características destacadas:**

- 🔍 **Búsqueda en tiempo real**
- 📂 **Filtros por categoría** (Electrónica, Ropa, Todos)
- 🔄 **Ordenación** (Nombre, Precio, Fecha)
- 🌐 **URL sincronizada** con filtros
- 💾 **Estado persistente** en navegación

### **3. ProductDetail Page**

`src/pages/ProductDetail/ProductDetail.tsx`

**Funcionalidades avanzadas:**

- ✅ **Recepción de estado**: Maneja datos transferidos desde ProductList
- ✅ **Navegación inteligente**: Preserva filtros al regresar
- ✅ **Breadcrumb navigation**: Navegación jerárquica
- ✅ **Productos relacionados**: Navegación entre productos similares
- ✅ **Manejo de errores**: Producto no encontrado

**Hooks utilizados:** `useParams`, `useNavigate`, `useLocation`

```tsx
const { productId } = useParams();
const location = useLocation();
const navigationState = location.state || {};

// Navegación inteligente que preserva filtros
const handleGoBack = () => {
  if (navigationState.filters) {
    const { category, sortBy, search } = navigationState.filters;
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    navigate(`/products?${params.toString()}`);
  }
};
```

---

## 🎯 Funcionalidades Avanzadas Implementadas

### **1. useLocation - Información de Ubicación**

**Implementado en:** `LocationInfo.tsx`, `ProductDetail.tsx`

```tsx
const location = useLocation();

// Acceso a diferentes propiedades
console.log(location.pathname); // "/products/1"
console.log(location.search); // "?category=electronics&sort=price"
console.log(location.hash); // "#reviews"
console.log(location.state); // { from: "product-list", filters: {...} }
```

**Casos de uso:**

- 📍 Mostrar información de navegación en tiempo real
- 💾 Acceder a datos transferidos entre rutas
- 🔍 Análisis de parámetros de URL
- 📊 Tracking de navegación de usuarios

### **2. useSearchParams - Parámetros de Búsqueda**

**Implementado en:** `ProductList.tsx`

```tsx
const [searchParams, setSearchParams] = useSearchParams();

// Lectura de parámetros
const category = searchParams.get("category") || "all";
const sortBy = searchParams.get("sort") || "name";

// Actualización de parámetros
const updateFilters = (newCategory, newSort) => {
  setSearchParams({
    category: newCategory,
    sort: newSort,
  });
};
```

**Características:**

- 🔄 **Sincronización automática** con la URL
- 📱 **URLs compartibles** con filtros aplicados
- ⏪ **Navegación del navegador** funcional (back/forward)
- 🔍 **Filtros persistentes** al recargar la página

### **3. Navegación con Estado**

**Implementado entre:** `ProductList.tsx` ↔ `ProductDetail.tsx`

```tsx
// En ProductList - Envío de estado
const handleProductClick = (productId) => {
  navigate(`/products/${productId}`, {
    state: {
      from: "product-list",
      filters: { category, sortBy, search },
      timestamp: Date.now(),
    },
  });
};

// En ProductDetail - Recepción de estado
const location = useLocation();
const navigationState = location.state || {};

if (navigationState.filters) {
  // Usar filtros para navegación inteligente
}
```

**Beneficios:**

- 🧠 **Navegación inteligente** que recuerda el contexto
- 💾 **Preservación de filtros** al regresar
- 📈 **Mejor UX** con contexto mantenido
- 🔄 **Flujo de usuario optimizado**

---

## 📁 Estructura de Archivos Actualizada

```
src/
├── App.tsx                          # ← Sin cambios
├── App.module.css                   # ← Sin cambios
├── components/
│   ├── Navigation/                  # ← Sin cambios
│   │   ├── Navigation.tsx
│   │   └── Navigation.module.css
│   └── LocationInfo/                # ← NUEVO
│       ├── LocationInfo.tsx         # Hook useLocation
│       └── LocationInfo.module.css  # Estilos del componente
├── pages/
│   ├── Home/                        # ← Sin cambios
│   ├── About/                       # ← Sin cambios (con useNavigate previo)
│   ├── Users/                       # ← Sin cambios
│   ├── UserProfile/                 # ← Sin cambios
│   ├── ProductList/                 # ← NUEVO
│   │   ├── ProductList.tsx          # useSearchParams + navegación
│   │   └── ProductList.module.css   # Grid responsive + filtros
│   └── ProductDetail/               # ← NUEVO
│       ├── ProductDetail.tsx        # useParams + useLocation
│       └── ProductDetail.module.css # Layout de producto
└── routes/
    └── AppRoutes.tsx               # ← ACTUALIZADO con nuevas rutas
```

---

## 🛠️ Rutas Actualizadas

### **AppRoutes.tsx - Nuevas rutas añadidas**

```tsx
import ProductList from "../pages/ProductList/ProductList";
import ProductDetail from "../pages/ProductDetail/ProductDetail";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:userId" element={<UserProfile />} />

      {/* NUEVAS RUTAS */}
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
    </Routes>
  );
}
```

### **Navigation.tsx - Enlaces actualizados**

```tsx
// Agregar al componente Navigation
<li className={styles.navItem}>
  <NavLink
    to="/products"
    className={({ isActive }) =>
      `${styles.navLink} ${isActive ? styles.active : ""}`
    }
  >
    🛍️ Productos
  </NavLink>
</li>
```

---

## 🚀 Casos de Uso Prácticos

### **Flujo 1: Búsqueda y Filtrado**

1. Usuario va a `/products`
2. Aplica filtros: categoría "electronics", ordenar por "price"
3. URL se actualiza: `/products?category=electronics&sort=price`
4. Puede compartir esta URL o recargar manteniendo filtros
5. Al hacer clic en producto, los filtros se transfieren como estado

### **Flujo 2: Navegación Contextual**

1. Usuario en ProductList con filtros aplicados
2. Hace clic en un producto específico
3. ProductDetail recibe estado con los filtros activos
4. Al regresar, mantiene automáticamente los filtros aplicados
5. LocationInfo muestra el contexto de navegación

### **Flujo 3: Productos Relacionados**

1. Usuario en ProductDetail de un iPhone
2. Ve productos relacionados (otros electrónicos)
3. Hace clic en Samsung Galaxy
4. Nueva página ProductDetail con contexto del producto anterior
5. Navegación fluida entre productos similares

---

## 📊 Hooks y APIs Utilizados

| Hook              | Componente                  | Uso                                |
| ----------------- | --------------------------- | ---------------------------------- |
| `useLocation`     | LocationInfo, ProductDetail | Información de ruta y estado       |
| `useSearchParams` | ProductList                 | Filtros en URL sincronizados       |
| `useParams`       | ProductDetail               | ID del producto desde URL          |
| `useNavigate`     | Todos                       | Navegación programática con estado |

---

## 🔧 Instalación y Uso

### **1. Crear la nueva rama**

```bash
git checkout -b router-advanced
```

### **2. Implementar componentes**

- Crear `LocationInfo` component
- Crear `ProductList` page
- Crear `ProductDetail` page
- Actualizar `AppRoutes.tsx`
- Actualizar `Navigation.tsx`

### **3. Ejecutar el proyecto**

```bash
npm run dev
```

### **4. Probar funcionalidades**

- Navegar a `/products`
- Aplicar filtros y ver URL
- Hacer clic en productos
- Verificar navegación contextual
- Probar productos relacionados

---
