# Guía Rápida: Tailwind v3 & v4

## 🚀 Configuración Inicial

### v4

```bash
npm install -D @tailwindcss/vite tailwindcss
```

**vite.config.js:**

```javascript
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**src/index.css:**

```css
@import "tailwindcss";
```

### v3

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**postcss.config.js:**

```javascript
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

**src/index.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🎨 Utilidades Básicas (Idénticas en v3 y v4)

### Espaciado

```jsx
<div className="p-8 m-4 px-6 py-2 mx-auto space-y-4">
  <div className="p-4 bg-red-100">p-4</div>
  <div className="mx-auto w-32">mx-auto</div>
</div>
```

### Colores

```jsx
<div className="bg-red-500 text-white p-4 rounded">
<div className="bg-gradient-to-r from-purple-400 to-pink-400">
<div className="bg-blue-500/75 text-white">
```

### Tipografía

```jsx
<h1 className="text-4xl font-bold text-gray-900">
<p className="text-base text-gray-600 leading-relaxed">
<p className="text-sm font-medium uppercase tracking-wide">
```

### Layout

```jsx
{/* Flexbox */}
<div className="flex justify-between items-center gap-4">
<div className="flex-1 flex-none">

{/* Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="col-span-2">
```

---

## 📱 Responsive

### Breakpoints

```jsx
<div className="
  bg-red-400
  sm:bg-green-400
  md:bg-blue-400
  lg:bg-yellow-400
  xl:bg-purple-400
">

<div className="
  text-sm
  sm:text-base
  md:text-lg
  lg:text-xl
  xl:text-2xl
">

<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
">
```

### Navbar Responsive

```jsx
{/* Desktop Menu */}
<div className="hidden md:flex space-x-8">

{/* Mobile Menu Button */}
<button className="md:hidden">

{/* Mobile Menu */}
<div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
```

---

## 🎭 Estados e Interacciones

### Hover, Focus, Active

```jsx
<button className="
  bg-blue-500 hover:bg-blue-600 active:bg-blue-700
  text-white px-6 py-2 rounded
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-300
  transform hover:scale-105 active:scale-95
">

<div className="
  border border-gray-200 rounded
  hover:shadow-lg hover:border-gray-300
  transition-all duration-300 cursor-pointer
">
```

### Animaciones

```jsx
{/* Predefinidas */}
<div className="animate-pulse">
<div className="animate-bounce">
<div className="animate-spin">

{/* Transiciones personalizadas */}
<div className="
  transition-all duration-500 ease-in-out
  hover:scale-110 hover:rotate-12
">
```

---

## 🔧 Formularios

```jsx
<input className="
  w-full px-4 py-3 border border-gray-300 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-blue-500
  focus:border-transparent
  hover:border-gray-400 transition-all duration-200
  placeholder-gray-400
">

<button className="
  w-full bg-blue-600 hover:bg-blue-700
  text-white font-bold py-3 px-4 rounded-md
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-300
">
```

---

## 🃏 Cards

```jsx
<div className="
  bg-white rounded-lg shadow-md overflow-hidden
  hover:shadow-xl hover:-translate-y-1
  transition-all duration-300
  border border-gray-100
">
  <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-2">
    <p className="text-gray-600 mb-4">
  </div>
</div>
```

---

## 🎯 Modal

```jsx
{/* Overlay */}
<div className="
  fixed inset-0 bg-black bg-opacity-50
  flex items-center justify-center z-50
">

{/* Modal */}
<div className="
  bg-white rounded-lg p-8 max-w-md mx-4
  transform transition-all duration-300
">
```

---

## ⚙️ Configuración Personalizada (Idéntica en v3 y v4)

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif"],
      },
      spacing: {
        72: "18rem",
        96: "24rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
```

---

## 🎨 Componentes con @apply

```css
/* Idéntico en v3 y v4 */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white 
           font-semibold py-2 px-4 rounded-lg 
           transition-colors duration-200;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6 
           hover:shadow-lg transition-shadow duration-300;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md
           focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

---

## 🧩 Componente Button Completo

```jsx
const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2";

  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    disabled ? "opacity-50" : ""
  }`;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
```

---

## 🚀 Optimización

### v4 - Automática

```javascript
// vite.config.js - v4 optimiza automáticamente
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### v3 - Manual

```javascript
// tailwind.config.js - v3 requiere configuración
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  purge: {
    enabled: process.env.NODE_ENV === "production",
    safelist: ["bg-red-500", "bg-green-500"],
  },
};
```

---

## 📏 Utilidades de Clases

```javascript
// utils/classNames.js
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Uso
const classes = classNames(
  "base-class",
  condition && "conditional-class",
  variant === "primary" && "primary-class"
);
```

Esta función es una utilidad para concatenar clases CSS de forma condicional.

**Firma:**

```typescript
const classNames = (...classes: (string | boolean | undefined)[]): string
```

**Explicación:**

La función `classNames` recibe cualquier cantidad de argumentos que pueden ser strings, booleanos o undefined, y devuelve un string con las clases CSS válidas separadas por espacios.

**Cómo funciona:**

1. Acepta múltiples argumentos usando el operador rest (`...classes`)
2. Filtra los valores "falsy" (false, undefined, null, "") usando `filter(Boolean)`
3. Une los valores restantes con espacios usando `join(' ')`

**Ejemplos de uso:**

```typescript
classNames("btn", "primary");
// → "btn primary"

classNames("btn", isActive && "active", "large");
// → "btn active large" (si isActive es true)
// → "btn large" (si isActive es false)

classNames("card", undefined, "", "shadow");
// → "card shadow"

classNames("text-lg", loading && "opacity-50", error && "text-red-500");
// → "text-lg opacity-50" (si loading=true, error=false)
```

Es especialmente útil en React o frameworks similares donde necesitas aplicar clases condicionalmente basándote en el estado de los componentes. Es una versión simplificada de librerías como `clsx` o `classnames`.

---

## 🎯 Dashboard Base

```jsx
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            ☰
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          bg-white shadow-sm w-64 min-h-screen
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
        >
          {/* Sidebar content */}
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          {/* Grid de stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Ventas</h3>
              <p className="text-2xl font-semibold text-gray-900">$125,430</p>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
```

---

## 🔄 Diferencias Clave

| Aspecto          | v3                                    | v4                      |
| ---------------- | ------------------------------------- | ----------------------- |
| **Setup**        | PostCSS config requerido              | Plugin Vite nativo      |
| **CSS**          | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| **Optimización** | Manual (purge config)                 | Automática              |
| **Performance**  | Bueno                                 | Mejorado                |
| **Clases**       | **Idénticas**                         | **Idénticas**           |

> **Importante**: Las clases de Tailwind son **100% compatibles** entre v3 y v4. Solo cambia la configuración inicial.
