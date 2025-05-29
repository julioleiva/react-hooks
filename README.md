# Taller Completo: Tailwind CSS con Vite y React

## 🎯 Objetivos del Taller

Al finalizar, los participantes podrán:

- Configurar Tailwind CSS en un proyecto Vite + React
- Dominar el sistema de utilidades de Tailwind
- Crear interfaces responsive y modernas
- Optimizar el bundle de producción
- Implementar componentes reutilizables con Tailwind

---

## 📚 Módulo 1: Introducción y Configuración

### 1.1 ¿Qué es Tailwind CSS?

- Diferencias entre CSS tradicional, frameworks como Bootstrap y Tailwind
- Ventajas del utility-first approach
- Casos de uso ideales

### 1.2 Configuración del Entorno

```bash
# Crear proyecto con Vite
npm create vite@latest mi-proyecto-tailwind -- --template react
cd mi-proyecto-tailwind
npm install

# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 1.3 Configuración de Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 1.4 Primer Ejemplo

```jsx
// src/App.jsx
function App() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">¡Hola Tailwind!</h1>
    </div>
  );
}
```

---

## 🎨 Módulo 2: Sistema de Utilidades Básicas (90 min)

### 2.1 Espaciado (Padding y Margin)

```jsx
const EspaciadoEjemplos = () => (
  <div className="p-8 space-y-4">
    {/* Padding */}
    <div className="p-4 bg-red-100">p-4</div>
    <div className="px-6 py-2 bg-green-100">px-6 py-2</div>

    {/* Margin */}
    <div className="m-4 p-2 bg-blue-100">m-4</div>
    <div className="mx-auto w-32 p-2 bg-yellow-100">mx-auto</div>
  </div>
);
```

### 2.2 Colores y Backgrounds

```jsx
const ColoresEjemplos = () => (
  <div className="grid grid-cols-3 gap-4 p-8">
    <div className="bg-red-500 text-white p-4 rounded">Red 500</div>
    <div className="bg-green-400 text-gray-800 p-4 rounded">Green 400</div>
    <div className="bg-blue-600 text-white p-4 rounded">Blue 600</div>

    {/* Gradientes */}
    <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded text-white col-span-3">
      Gradiente Purple to Pink
    </div>
  </div>
);
```

### 2.3 Tipografía

```jsx
const TipografiaEjemplos = () => (
  <div className="p-8 space-y-4">
    <h1 className="text-4xl font-bold text-gray-900">Título Principal</h1>
    <h2 className="text-2xl font-semibold text-gray-700">Subtítulo</h2>
    <p className="text-base text-gray-600 leading-relaxed">
      Este es un párrafo con interlineado relajado y color gris.
    </p>
    <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
      Texto pequeño y espaciado
    </p>
  </div>
);
```

### 2.4 Flexbox y Grid

```jsx
const LayoutEjemplos = () => (
  <div className="p-8 space-y-8">
    {/* Flexbox */}
    <div className="flex justify-between items-center bg-gray-100 p-4 rounded">
      <div className="bg-red-300 p-2 rounded">Item 1</div>
      <div className="bg-green-300 p-2 rounded">Item 2</div>
      <div className="bg-blue-300 p-2 rounded">Item 3</div>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="bg-purple-200 p-4 rounded text-center">
          Grid {n}
        </div>
      ))}
    </div>
  </div>
);
```

---

## 📱 Módulo 3: Responsive Design

### 3.1 Breakpoints de Tailwind

```jsx
const ResponsiveEjemplo = () => (
  <div className="p-4">
    <div
      className="
      bg-red-400 
      sm:bg-green-400 
      md:bg-blue-400 
      lg:bg-yellow-400 
      xl:bg-purple-400 
      p-8 rounded text-white font-bold text-center
    "
    >
      Cambia de color según el tamaño de pantalla
    </div>

    <div
      className="
      text-sm 
      sm:text-base 
      md:text-lg 
      lg:text-xl 
      xl:text-2xl 
      mt-4 text-center
    "
    >
      Texto responsive
    </div>
  </div>
);
```

### 3.2 Grid Responsive

```jsx
const GridResponsive = () => (
  <div
    className="
    grid 
    grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-4 
    gap-4 
    p-8
  "
  >
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="bg-indigo-100 p-6 rounded-lg text-center">
        Card {i + 1}
      </div>
    ))}
  </div>
);
```

### 3.3 Navbar Responsive

```jsx
import { useState } from "react";

const NavbarResponsive = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-xl font-bold text-gray-800">MiApp</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Inicio
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Servicios
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contacto
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <a
              href="#"
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Inicio
            </a>
            <a
              href="#"
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Servicios
            </a>
            <a
              href="#"
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Contacto
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};
```

---

## 🎭 Módulo 4: Estados y Interacciones

### 4.1 Hover, Focus y Active

```jsx
const InteraccionesEjemplo = () => (
  <div className="p-8 space-y-4">
    <button
      className="
      bg-blue-500 hover:bg-blue-600 
      text-white px-6 py-2 rounded
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-300
      active:bg-blue-700
    "
    >
      Botón Interactivo
    </button>

    <div
      className="
      p-4 border border-gray-200 rounded
      hover:shadow-lg hover:border-gray-300
      transition-all duration-300
      cursor-pointer
    "
    >
      Card con Hover
    </div>
  </div>
);
```

### 4.2 Transiciones y Animaciones

```jsx
const AnimacionesEjemplo = () => (
  <div className="p-8 space-y-8">
    {/* Transición simple */}
    <div
      className="
      w-32 h-32 bg-red-400 rounded
      transition-all duration-500 ease-in-out
      hover:bg-blue-400 hover:scale-110 hover:rotate-45
    "
    />

    {/* Animación de pulso */}
    <div
      className="
      w-16 h-16 bg-green-400 rounded-full
      animate-pulse
    "
    />

    {/* Animación de rebote */}
    <div
      className="
      w-16 h-16 bg-purple-400 rounded
      animate-bounce
    "
    />
  </div>
);
```

---

## 🔧 Módulo 5: Componentes Avanzados (120 min)

### 5.1 Formularios Estilizados

```jsx
const FormularioCompleto = () => (
  <form className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Registro
    </h2>

    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Nombre completo
      </label>
      <input
        type="text"
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder-gray-400
        "
        placeholder="Tu nombre completo"
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Email
      </label>
      <input
        type="email"
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder-gray-400
        "
        placeholder="tu@email.com"
      />
    </div>

    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Contraseña
      </label>
      <input
        type="password"
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder-gray-400
        "
        placeholder="********"
      />
    </div>

    <button
      className="
      w-full bg-blue-500 hover:bg-blue-600 
      text-white font-bold py-2 px-4 rounded-md
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-300
    "
    >
      Registrarse
    </button>
  </form>
);
```

### 5.2 Cards con Diferentes Layouts

```jsx
const CardGallery = () => {
  const productos = [
    {
      id: 1,
      nombre: "Producto 1",
      precio: "$99",
      imagen: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      nombre: "Producto 2",
      precio: "$149",
      imagen: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      nombre: "Producto 3",
      precio: "$199",
      imagen: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {productos.map((producto) => (
        <div
          key={producto.id}
          className="
          bg-white rounded-lg shadow-md overflow-hidden
          hover:shadow-xl transition-shadow duration-300
        "
        >
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {producto.nombre}
            </h3>
            <p className="text-2xl font-bold text-green-600 mb-4">
              {producto.precio}
            </p>
            <button
              className="
              w-full bg-indigo-500 hover:bg-indigo-600 
              text-white py-2 px-4 rounded-md
              transition-colors duration-200
            "
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 5.3 Modal Component

```jsx
import { useState } from "react";

const ModalEjemplo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
      >
        Abrir Modal
      </button>

      {isOpen && (
        <div
          className="
          fixed inset-0 bg-black bg-opacity-50 
          flex items-center justify-center z-50
        "
        >
          <div
            className="
            bg-white rounded-lg p-8 max-w-md mx-4
            transform transition-all duration-300
          "
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Modal de Ejemplo
            </h2>
            <p className="text-gray-600 mb-6">
              Este es el contenido del modal. Aquí puedes poner cualquier
              información.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
```

---

## ⚙️ Módulo 6: Personalización y Configuración Avanzada (75 min)

### 6.1 Extendiendo el Tema

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
        "custom-gray": "#f8fafc",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
```

### 6.2 Creando Componentes Reutilizables

```jsx
// components/Button.jsx
const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
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

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Uso del componente
const ButtonShowcase = () => (
  <div className="p-8 space-y-4">
    <div className="space-x-4">
      <Button variant="primary">Primario</Button>
      <Button variant="secondary">Secundario</Button>
      <Button variant="danger">Peligro</Button>
    </div>

    <div className="space-x-4">
      <Button size="sm">Pequeño</Button>
      <Button size="md">Mediano</Button>
      <Button size="lg">Grande</Button>
    </div>

    <Button disabled>Deshabilitado</Button>
  </div>
);
```

### 6.3 Directivas @apply y Componentes CSS

```css
/* src/components.css */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }
}
```

---

## 🚀 Módulo 7: Optimización y Producción (45 min)

### 7.1 Purging CSS No Utilizado

```javascript
// tailwind.config.js - Configuración de purge
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Incluir archivos adicionales si es necesario
    "./src/components/**/*.{js,jsx}",
  ],
  // ... resto de la configuración
};
```

### 7.2 Análisis del Bundle

```bash
# Construir para producción
npm run build

# Analizar el tamaño del bundle
npm install -D vite-bundle-analyzer
```

### 7.3 Mejores Prácticas

- Usar clases condicionales eficientemente
- Evitar duplicación de estilos
- Organizar componentes por responsabilidades
- Utilizar variables CSS para valores dinámicos

---

## 🎯 Proyecto Final: Dashboard Completo (90 min)

### Características a Implementar:

1. **Header responsive** con navegación
2. **Sidebar** colapsable
3. **Grid de cards** con estadísticas
4. **Tabla** con datos dinámicos
5. **Formularios** de filtrado
6. **Modal** para acciones
7. **Componentes** reutilizables
8. **Responsive design** completo

```jsx
// Estructura base del Dashboard
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        {/* Header content */}
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          bg-white shadow-sm w-64 min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
        `}
        >
          {/* Sidebar content */}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">{/* Dashboard content */}</main>
      </div>
    </div>
  );
};
```

---

## 📝 Recursos Adicionales

### Herramientas Útiles:

- **Tailwind CSS IntelliSense** (VS Code Extension)
- **Headless UI** - Componentes accesibles
- **Heroicons** - Iconos optimizados
- **Tailwind UI** - Componentes premium

### Documentación:

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)

### Práctica Adicional:

- Recrear diseños de Dribbble/Behance
- Contribuir a proyectos open source
- Construir landing pages responsivas
- Crear sistemas de diseño

---

## ✅ Evaluación Final

### Criterios de Evaluación:

1. **Configuración correcta** de Tailwind con Vite
2. **Uso apropiado** de utilidades de Tailwind
3. **Responsive design** funcional
4. **Componentes reutilizables** bien estructurados
5. **Código limpio** y organizadas
6. **Optimización** para producción

### Proyecto a Entregar:

Dashboard completo con todas las características mencionadas, código fuente organizado y documentación básica de instalación y uso.

---

## 🎉 Conclusión

Al completar este taller, habrás dominado:

- Configuración e integración de Tailwind CSS
- Sistema completo de utilidades
- Responsive design moderno
- Componentes React con Tailwind
- Optimización y mejores prácticas
- Desarrollo de interfaces profesionales
