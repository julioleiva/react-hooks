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

## 🔍 ¿Cómo debuguear Tailwind en el bavegador?

### **1. Integración directa en el bundler**

Con Tailwind v4, el CSS se procesa directamente dentro del proceso de Vite usando el plugin `@tailwindcss/vite`, no como un archivo CSS separado.

### **2. CSS inline en el JS bundle**

En desarrollo, Tailwind v4 integra el CSS directamente en el bundle de JavaScript, similar a CSS-in-JS, por lo que no hay un archivo CSS separado que descargar.

### **3. Procesamiento on-demand**

El nuevo engine procesa las clases bajo demanda y las inyecta directamente en el DOM.

## 🔧 **Cómo verificar que funciona:**

### **Opción 1: Inspeccionar el DOM**

```bash
# Abre DevTools → Elements
# Busca <style> tags en el <head>
# Deberías ver estilos de Tailwind inyectados
```

### **Opción 2: Ver en Sources**

```bash
# DevTools → Sources → webpack://
# Busca archivos que contengan CSS generado
```

### **Opción 3: Ver en el JS bundle**

```bash
# DevTools → Network → JS tab
# El archivo principal JS contendrá el CSS integrado
```

## 🆚 **Diferencia con v3:**

**Tailwind v3:**

```bash
# Network tab mostraría:
├── app.css (archivo separado)
├── main.js
└── index.html
```

**Tailwind v4:**

```bash
# Network tab muestra:
├── main.js (CSS incluido aquí)
└── index.html
```

## ✅ **Para confirmar que funciona:**

1. **Inspecciona un elemento** con clases Tailwind
2. **Ve los computed styles** - deberías ver los estilos aplicados
3. **Busca** `<style data-vite-dev-id>` en el `<head>`
4. **El CSS está ahí**, solo que integrado, no como archivo separado

Esta es una de las mejoras de rendimiento de v4: menos archivos HTTP requests y mejor integración con el bundler.

Ahí tienes **exactamente** cómo se carga el CSS en Tailwind v4:

## 🔍 **Análisis del CSS generado:**

### **1. Estructura moderna de v4:**

```css
/*! tailwindcss v4.1.8 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
```

- ✅ Usa **CSS Layers** (nueva característica de v4)
- ✅ Variables CSS nativas con `--color-*`
- ✅ Colores en formato **OKLCH** (más moderno)

### **2. Variables CSS automáticas:**

```css
:root,
:host {
  --color-red-500: oklch(63.7% 0.237 25.331);
  --color-blue-500: oklch(62.3% 0.214 259.815);
  --spacing: 0.25rem;
  --text-xl: 1.25rem;
  /* etc... */
}
```

### **3. Solo las clases que usas:**

Solo aparecen las clases que **realmente estás usando** en tu componente:

- `.text-2xl`, `.font-bold`, `.bg-blue-500`, etc.
- No hay CSS innecesario

### **4. Características avanzadas de v4:**

```css
@property --tw-translate-x {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
```

- ✅ Usa `@property` para variables tipadas
- ✅ Soporte nativo para animaciones complejas
- ✅ Color mixing automático: `color-mix(in oklab, ...)`

## 🎯 **Por qué no aparece en Network > CSS:**

1. **Integrado en el bundle:** El CSS se inyecta directamente como `<style>` en el `<head>`
2. **Generado on-demand:** Solo se crean las clases que necesitas
3. **Sin archivo separado:** No hay un `styles.css` descargable
4. **Más eficiente:** Menos requests HTTP, mejor performance

## 🆚 **Comparación con v3:**

**v3:** `app.css` → archivo separado descargable  
**v4:** `<style data-vite-dev-id>` → CSS integrado y optimizado

---

## 🎯 El Enfoque "Utility-First" de Tailwind

### **¿Qué es Utility-First?**

En lugar de escribir CSS personalizado, usas **clases pequeñas y específicas** que hacen una sola cosa:

```html
<!-- ❌ Enfoque tradicional -->
<style>
  .card {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
<div class="card">...</div>

<!-- ✅ Enfoque Utility-First -->
<div class="bg-white p-6 rounded-lg shadow-md">...</div>
```

### **Ventajas del Utility-First:**

- 🚀 **Velocidad**: No escribes CSS personalizado
- 🎯 **Predictabilidad**: Cada clase hace exactamente lo mismo siempre
- 📦 **Tamaño controlado**: Solo incluye lo que usas
- 🔧 **Mantenibilidad**: Cambios directos en el HTML
- 🎨 **Consistencia**: Sistema de diseño automático

---

## 🏗️ **Las 4 Capas de Tailwind CSS**

Tailwind organiza todo su CSS en **4 capas principales**:

### **1. @layer base** - Estilos Base

Reset y estilos fundamentales del navegador:

```css
@layer base {
  /* Reset de márgenes y padding */
  *,
  ::before,
  ::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Estilos base de elementos HTML */
  html {
    line-height: 1.5;
    font-family: ui-sans-serif, system-ui;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
}
```

**¿Para qué sirve?**

- Normalizar diferencias entre navegadores
- Establecer una base consistente
- Reset de estilos por defecto

### **2. @layer components** - Componentes

Patrones reutilizables más complejos:

```css
@layer components {
  .btn {
    @apply inline-flex items-center px-4 py-2 rounded-md font-medium;
  }

  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md 
           focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

**¿Cuándo usar Components?**

- Patrones que se repiten mucho
- Combinaciones complejas de utilities
- Elementos con muchas variantes
- APIs de terceros que requieren clases específicas

### **3. @layer utilities** - Utilidades

El corazón de Tailwind - clases atómicas:

```css
@layer utilities {
  /* Espaciado */
  .p-4 {
    padding: 1rem;
  }
  .m-2 {
    margin: 0.5rem;
  }
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  /* Colores */
  .bg-blue-500 {
    background-color: #3b82f6;
  }
  .text-white {
    color: #ffffff;
  }

  /* Layout */
  .flex {
    display: flex;
  }
  .grid {
    display: grid;
  }
  .hidden {
    display: none;
  }

  /* Responsive */
  @media (min-width: 768px) {
    .md\:block {
      display: block;
    }
    .md\:flex {
      display: flex;
    }
  }
}
```

### **4. @layer theme** - Variables del Tema (v4)

Variables CSS para personalización:

```css
@layer theme {
  :root {
    --color-primary: #3b82f6;
    --color-secondary: #6b7280;
    --spacing-unit: 0.25rem;
    --font-sans: "Inter", sans-serif;
  }
}
```

---

## 🎨 **Sistema de Utilities - Categorías Principales**

### **1. Layout & Display**

```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <div class="flex-1 flex-shrink-0">
    <!-- Grid -->
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <!-- Position -->
        <div class="relative">
          <div class="absolute top-0 right-0"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### **2. Spacing (Espaciado)**

```html
<!-- Padding -->
<div class="p-4">
  <!-- padding: 1rem -->
  <div class="px-6 py-2">
    <!-- padding: 0.5rem 1.5rem -->

    <!-- Margin -->
    <div class="m-4">
      <!-- margin: 1rem -->
      <div class="mx-auto">
        <!-- margin: 0 auto -->
        <div class="mt-8 mb-4">
          <!-- margin-top: 2rem; margin-bottom: 1rem -->

          <!-- Space Between -->
          <div class="space-y-4">
            <!-- gap vertical entre hijos -->
            <div class="space-x-2"><!-- gap horizontal entre hijos --></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### **3. Typography**

```html
<!-- Tamaño y peso -->
<h1 class="text-4xl font-bold">
  <p class="text-base font-normal">
    <span class="text-sm font-medium">
      <!-- Color y estilo -->
      <p class="text-gray-600 leading-relaxed">
        <span class="text-blue-500 underline"></span></p
    ></span>
  </p>
</h1>
```

### **4. Colors**

```html
<!-- Background -->
<div class="bg-blue-500">
  <div class="bg-gradient-to-r from-blue-400 to-purple-500">
    <!-- Text -->
    <span class="text-red-500">
      <span class="text-gray-700">
        <!-- Border -->
        <div class="border border-gray-300">
          <div class="border-2 border-blue-500"></div></div></span
    ></span>
  </div>
</div>
```

### **5. Effects & Transitions**

```html
<!-- Shadows -->
<div class="shadow-md">
  <div class="shadow-lg hover:shadow-xl">
    <!-- Transitions -->
    <button class="transition-colors duration-200 hover:bg-blue-600">
      <div class="transform hover:scale-105 transition-transform"></div>
    </button>
  </div>
</div>
```

---

## 🔧 **Personalización del Sistema**

### **1. Extender el tema (v4)**

```css
@import "tailwindcss";

@theme {
  --color-brand-500: #ff6b35;
  --font-display: "Playfair Display", serif;
  --spacing-huge: 4rem;
}
```

### **2. Componentes personalizados**

```css
@layer components {
  .btn-cta {
    @apply bg-brand-500 hover:bg-brand-600 text-white 
           font-bold py-4 px-8 rounded-xl shadow-lg 
           transform hover:scale-105 transition-all duration-200;
  }

  .card-product {
    @apply bg-white rounded-2xl shadow-md overflow-hidden 
           hover:shadow-xl transition-shadow duration-300;
  }
}
```

### **3. Utilities personalizadas**

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .bg-grid {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
}
```

---

## 🎯 **Estrategias de Uso**

### **1. Composición gradual**

```html
<!-- Empezar simple -->
<button class="px-4 py-2">Click me</button>

<!-- Añadir estilos -->
<button class="px-4 py-2 bg-blue-500 text-white">Click me</button>

<!-- Añadir interactividad -->
<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
  Click me
</button>

<!-- Versión completa -->
<button
  class="
  px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
  text-white font-semibold rounded-lg shadow-md
  transition-colors duration-200 transform hover:scale-105
  focus:outline-none focus:ring-2 focus:ring-blue-300
"
>
  Click me
</button>
```

### **2. Responsive Design**

```html
<div
  class="
  w-full 
  sm:w-1/2 
  lg:w-1/3 
  xl:w-1/4
  
  p-4 
  sm:p-6 
  lg:p-8
  
  text-center 
  sm:text-left
"
>
  Responsive content
</div>
```

### **3. Estados condicionales**

```html
<div
  class="
  bg-white 
  hover:bg-gray-50 
  focus:bg-blue-50
  
  border 
  hover:border-gray-300 
  focus:border-blue-500
  
  transition-all duration-200
"
>
  Interactive element
</div>
```

---

## 🏗️ **Orden de Precedencia de las Capas**

```css
/* 1. Base (más bajo) */
@layer base {
  /* Reset, estilos de elementos HTML */
}

/* 2. Components */
@layer components {
  /* Patrones reutilizables */
}

/* 3. Utilities (más alto) */
@layer utilities {
  /* Clases atómicas - siempre ganan */
}
```

**Ejemplo práctico:**

```html
<!-- El utility .text-red-500 sobrescribe el component .btn -->
<button class="btn text-red-500">
  El texto será rojo, no el color del .btn
</button>
```

---

## 🎨 **Filosofía: "Constraints liberate creativity"**

Tailwind te da **limitaciones intencionales** que:

1. **Aceleran decisiones**: No pierdes tiempo eligiendo entre infinitos valores
2. **Mantienen consistencia**: Tu diseño se ve cohesivo automáticamente
3. **Facilitan mantenimiento**: Cambios globales desde la configuración
4. **Mejoran colaboración**: Todo el equipo usa el mismo sistema
