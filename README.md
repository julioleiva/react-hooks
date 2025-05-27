---
title: React Accesible
description: Buenas prácticas para implementar accesibilidad en aplicaciones React.
---

# React Accesible

React proporciona todas las herramientas necesarias para crear aplicaciones web accesibles, pero requiere que los desarrolladores apliquen las mejores prácticas de accesibilidad durante el desarrollo. Este módulo explora cómo implementar accesibilidad de manera efectiva en aplicaciones React.

## Fundamentos de accesibilidad en React

React, como biblioteca de JavaScript, genera HTML que debe ser accesible. El marco no proporciona accesibilidad "automáticamente", sino que depende de cómo implementes tus componentes.

### JSX y accesibilidad

JSX es muy similar al HTML, pero con algunas diferencias clave que pueden afectar la accesibilidad:

```jsx
// HTML
<label for="username">Nombre de usuario</label>
<input id="username" type="text" />

// JSX: algunas propiedades tienen nombres diferentes
<label htmlFor="username">Nombre de usuario</label>
<input id="username" type="text" />
```

Atributos HTML que tienen nombres diferentes en JSX:

- `for` → `htmlFor`
- `class` → `className`
- `tabindex` → `tabIndex`
- `maxlength` → `maxLength`
- `readonly` → `readOnly`
- `autocomplete` → `autoComplete`

## Estructura y semántica

### Elementos semánticos en React

React permite usar todos los elementos semánticos de HTML5. Utilízalos adecuadamente:

```jsx
function ArticlePage() {
  return (
    <article>
      <header>
        <h1>Título del artículo</h1>
        <p>Autor: John Doe</p>
        <time dateTime="2023-06-15">15 de junio, 2023</time>
      </header>

      <section>
        <h2>Primera sección</h2>
        <p>Contenido de la primera sección...</p>
      </section>

      <section>
        <h2>Segunda sección</h2>
        <p>Contenido de la segunda sección...</p>
      </section>

      <aside>
        <h2>Contenido relacionado</h2>
        <ul>
          <li>
            <a href="/articulo1">Artículo relacionado 1</a>
          </li>
          <li>
            <a href="/articulo2">Artículo relacionado 2</a>
          </li>
        </ul>
      </aside>

      <footer>
        <p>© 2023 Mi Blog</p>
      </footer>
    </article>
  );
}
```

### Fragmentos para evitar divs innecesarios

Los Fragmentos en React te permiten agrupar elementos hijos sin añadir nodos adicionales al DOM:

```jsx
// Evita divs innecesarios
function ListItems() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </>
  );
}

// Uso
function List() {
  return (
    <ul>
      <ListItems />
    </ul>
  );
}
```

## Formularios accesibles en React

### Controlando inputs y labels

```jsx
import { useState } from "react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Procesar el formulario
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          required
          aria-required="true"
        />
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Validación de formularios y errores accesibles

```jsx
import { useState } from "react";

function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "El nombre de usuario es obligatorio";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Procesar el formulario
      console.log("Formulario enviado:", formData);
    } else {
      setIsSubmitting(false);

      // Enfocar el primer campo con error
      const firstErrorField = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorField)?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Resumen de errores para lectores de pantalla */}
      {Object.keys(errors).length > 0 && (
        <div className="error-summary" role="alert">
          <h2>Por favor, corrige los siguientes errores:</h2>
          <ul>
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="username">Nombre de usuario</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <div id="username-error" className="error-message" role="alert">
            {errors.username}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          aria-invalid={!!errors.password}
          aria-describedby="password-requirements password-error"
        />
        <div id="password-requirements" className="form-hint">
          La contraseña debe tener al menos 8 caracteres.
        </div>
        {errors.password && (
          <div id="password-error" className="error-message" role="alert">
            {errors.password}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmar contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? "confirm-password-error" : undefined
          }
        />
        {errors.confirmPassword && (
          <div
            id="confirm-password-error"
            className="error-message"
            role="alert"
          >
            {errors.confirmPassword}
          </div>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Registrarse"}
      </button>
    </form>
  );
}
```

## Manejo del foco

El manejo adecuado del foco es crucial para una buena accesibilidad, especialmente en aplicaciones de una sola página (SPA) donde la navegación tradicional entre páginas no ocurre.

### Uso de refs para manejar el foco

```jsx
import { useRef, useEffect } from "react";

function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Guardar el elemento que tenía el foco antes de abrir el modal
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Guardar referencia al elemento actualmente enfocado
      previouslyFocused.current = document.activeElement;

      // Enfocar el botón de cerrar cuando se abre el modal
      closeButtonRef.current?.focus();

      // Configurar la trampa de foco
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }

        // Solo atrapar Tab cuando el modal está abierto
        if (e.key === "Tab" && isOpen) {
          // Encontrar todos los elementos enfocables dentro del modal
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          // Si presionan Shift+Tab en el primer elemento, ir al último
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
          // Si presionan Tab en el último elemento, ir al primero
          else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      // Añadir listener de eventos
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Restaurar el foco cuando se cierra el modal
  useEffect(() => {
    if (!isOpen && previouslyFocused.current) {
      previouslyFocused.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            ref={closeButtonRef}
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
```

### Restaurar el foco en la navegación SPA

En aplicaciones de una sola página, debes manejar el foco manualmente cuando el usuario navega entre "páginas":

```jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const mainContentRef = useRef(null);

  useEffect(() => {
    // Desplazarse al inicio de la página
    window.scrollTo(0, 0);

    // Enfocar el contenido principal
    mainContentRef.current?.focus();
  }, [pathname]);

  return (
    <main ref={mainContentRef} tabIndex="-1" style={{ outline: "none" }}>
      {/* Contenido de la página */}
    </main>
  );
}
```

## Componentes accesibles en React

### Botones vs. Enlaces

```jsx
// Botón que parece un enlace
function ButtonLink({ onClick, children }) {
  return (
    <button className="button-link" onClick={onClick}>
      {children}
    </button>
  );
}

// Enlace que parece un botón
function LinkButton({ href, children }) {
  return (
    <a href={href} className="link-button" role="button">
      {children}
    </a>
  );
}
```

### Componente de Tabs accesible

```jsx
import { useState } from "react";

function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleKeyDown = (e, index) => {
    let newIndex;

    switch (e.key) {
      case "ArrowRight":
        newIndex = (index + 1) % tabs.length;
        e.preventDefault();
        setActiveTab(newIndex);
        document.getElementById(`tab-${newIndex}`)?.focus();
        break;
      case "ArrowLeft":
        newIndex = (index - 1 + tabs.length) % tabs.length;
        e.preventDefault();
        setActiveTab(newIndex);
        document.getElementById(`tab-${newIndex}`)?.focus();
        break;
      case "Home":
        e.preventDefault();
        setActiveTab(0);
        document.getElementById("tab-0")?.focus();
        break;
      case "End":
        e.preventDefault();
        setActiveTab(tabs.length - 1);
        document.getElementById(`tab-${tabs.length - 1}`)?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <div className="tabs-container">
      <div
        role="tablist"
        aria-label="Pestañas de contenido"
        className="tabs-list"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            id={`tab-${index}`}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`panel-${index}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`tab ${activeTab === index ? "active" : ""}`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={index}
          id={`panel-${index}`}
          role="tabpanel"
          aria-labelledby={`tab-${index}`}
          hidden={activeTab !== index}
          tabIndex={0}
          className="tab-panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

// Uso del componente
function App() {
  const tabsData = [
    {
      title: "Pestaña 1",
      content: <p>Contenido de la pestaña 1</p>,
    },
    {
      title: "Pestaña 2",
      content: <p>Contenido de la pestaña 2</p>,
    },
    {
      title: "Pestaña 3",
      content: <p>Contenido de la pestaña 3</p>,
    },
  ];

  return <Tabs tabs={tabsData} />;
}
```

### Menú desplegable accesible

```jsx
import { useState, useRef, useEffect } from "react";

function DropdownMenu({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    console.log("Item seleccionado:", item);
    setIsOpen(false);
    // Ejecutar acción asociada al item
  };

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Manejar navegación con teclado
  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case "Escape":
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        if (!isOpen) {
          setIsOpen(true);
        } else {
          e.preventDefault();
          const nextIndex =
            index === undefined ? 0 : (index + 1) % items.length;
          document.getElementById(`menu-item-${nextIndex}`)?.focus();
        }
        break;
      case "ArrowUp":
        if (!isOpen) {
          setIsOpen(true);
        } else {
          e.preventDefault();
          const prevIndex =
            index === undefined
              ? items.length - 1
              : (index - 1 + items.length) % items.length;
          document.getElementById(`menu-item-${prevIndex}`)?.focus();
        }
        break;
      case "Home":
        if (isOpen) {
          e.preventDefault();
          document.getElementById("menu-item-0")?.focus();
        }
        break;
      case "End":
        if (isOpen) {
          e.preventDefault();
          document.getElementById(`menu-item-${items.length - 1}`)?.focus();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="dropdown-toggle"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleMenu}
        onKeyDown={(e) => handleKeyDown(e)}
      >
        {label}
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu"
          role="menu"
          aria-labelledby="dropdown-toggle"
        >
          {items.map((item, index) => (
            <li key={index} role="none">
              <button
                id={`menu-item-${index}`}
                role="menuitem"
                className="dropdown-item"
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                tabIndex={0}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Uso del componente
function App() {
  const menuItems = [
    { label: "Perfil", action: "profile" },
    { label: "Configuración", action: "settings" },
    { label: "Ayuda", action: "help" },
    { label: "Cerrar sesión", action: "logout" },
  ];

  return <DropdownMenu label="Mi cuenta" items={menuItems} />;
}
```

## Manejo de roles y atributos ARIA

React permite usar todos los atributos ARIA directamente en los componentes:

```jsx
function AlertMessage({ type, message }) {
  // Determinar el rol y el ícono basado en el tipo
  let role = "status";
  let icon = "💬";

  if (type === "error") {
    role = "alert";
    icon = "❌";
  } else if (type === "warning") {
    role = "alert";
    icon = "⚠️";
  } else if (type === "success") {
    icon = "✅";
  }

  return (
    <div
      className={`alert alert-${type}`}
      role={role}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span className="alert-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="alert-message">{message}</span>
    </div>
  );
}
```

### Uso de aria-live para anuncios dinámicos

```jsx
import { useState, useEffect } from "react";

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  // Simular recepción de notificaciones
  useEffect(() => {
    const timer = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: `Nueva notificación: ${Date.now()}`,
        read: false,
      };

      setNotifications((prev) => [...prev, newNotification]);
    }, 5000); // Nueva notificación cada 5 segundos

    return () => clearInterval(timer);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-center">
      <h2>Notificaciones</h2>

      {/* Indicador de conteo accesible */}
      <div className="indicator">
        <span>Tienes </span>
        <span className="count">{unreadCount}</span>
        <span className="visually-hidden"> notificaciones sin leer</span>
      </div>

      {/* Región live para anunciar nuevas notificaciones */}
      <div aria-live="polite" aria-atomic="true" className="live-region">
        {unreadCount > 0 && <p>Nueva notificación recibida</p>}
      </div>

      <ul className="notification-list">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={notification.read ? "read" : "unread"}
          >
            <p>{notification.message}</p>
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                aria-label={`Marcar como leída: ${notification.message}`}
              >
                Marcar como leída
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## React Portal para modales accesibles

React Portal es ideal para crear modales accesibles, ya que permite renderizar componentes fuera de la jerarquía normal del DOM.

```jsx
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function Modal({ isOpen, onClose, title, children }) {
  const [portalRoot, setPortalRoot] = useState(null);
  const previousFocusRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Crear el elemento portal si no existe
    let portalElement = document.getElementById("modal-portal");
    if (!portalElement) {
      portalElement = document.createElement("div");
      portalElement.setAttribute("id", "modal-portal");
      document.body.appendChild(portalElement);
    }

    setPortalRoot(portalElement);

    return () => {
      // Opcional: limpiar el portal cuando el componente se desmonte
      if (!document.getElementById("modal-portal").childElementCount) {
        document.getElementById("modal-portal").remove();
      }
    };
  }, []);

  // Guardar el elemento enfocado previamente y establecer el foco en el modal
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();

      // Evitar que el fondo se desplace cuando el modal está abierto
      document.body.style.overflow = "hidden";
    }

    return () => {
      // Restaurar el foco cuando el modal se cierra
      if (isOpen && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }

      // Restaurar el desplazamiento
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC para cerrar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !portalRoot) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar diálogo"
          >
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>,
    portalRoot
  );
}

// Uso del componente
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Abrir modal</button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ejemplo de modal accesible"
      >
        <p>Este es un modal accesible creado con React Portal.</p>
        <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
}
```

## Navegación por teclado con React Router

Cuando utilizas React Router, debes gestionar manualmente el foco al cambiar entre rutas:

```jsx
import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

function AccessibleRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}

function FocusManager({ children }) {
  const { pathname } = useLocation();
  const mainContentRef = useRef(null);

  useEffect(() => {
    // Desplazarse al inicio de la página
    window.scrollTo(0, 0);

    // Enfocar el contenido principal
    mainContentRef.current?.focus();
  }, [pathname]);

  return (
    <main
      ref={mainContentRef}
      tabIndex={-1}
      style={{ outline: "none" }}
      id="main-content"
    >
      {children}
    </main>
  );
}

function HomePage() {
  return (
    <FocusManager>
      <h1>Página de inicio</h1>
      <p>Bienvenido a nuestra aplicación.</p>
    </FocusManager>
  );
}

// AboutPage y ContactPage tienen estructura similar...
```

## Skip Link en React

```jsx
import { useRef } from "react";
import { Link } from "react-router-dom";

function Layout({ children }) {
  const contentRef = useRef(null);

  return (
    <div className="app-layout">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          contentRef.current?.focus();
        }}
      >
        Saltar al contenido principal
      </a>

      <header className="app-header">
        <nav>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/about">Acerca de</Link>
            </li>
            <li>
              <Link to="/contact">Contacto</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main
        id="main-content"
        ref={contentRef}
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        {children}
      </main>

      <footer className="app-footer">
        <p>© 2023 Mi Aplicación. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

// Estilos para el skip link
const styles = `
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: 8px;
    background-color: #fff;
    color: #000;
    z-index: 1000;
    transition: top 0.2s;
  }
  
  .skip-link:focus {
    top: 0;
  }
`;
```

## useId para generar IDs accesibles

React 18 introdujo el hook `useId`, que es perfecto para generar IDs únicos para etiquetas y otros atributos de accesibilidad:

```jsx
import { useId } from "react";

function AccessibleInput({ label, type = "text", ...props }) {
  const id = useId();

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} {...props} />
    </div>
  );
}

// Para elementos relacionados
function PasswordInput({ label, helperText, ...props }) {
  const id = useId();
  const inputId = `${id}-input`;
  const helperId = `${id}-helper`;

  return (
    <div className="form-group">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type="password"
        aria-describedby={helperId}
        {...props}
      />
      <p id={helperId} className="helper-text">
        {helperText}
      </p>
    </div>
  );
}
```

## Pruebas de accesibilidad en React

Para asegurarte de que tus componentes React sean accesibles, debes incluir pruebas de accesibilidad en tu flujo de desarrollo.

### Herramientas para pruebas de accesibilidad

- **ESLint con eslint-plugin-jsx-a11y**: Proporciona feedback en tiempo real sobre problemas de accesibilidad en tu código JSX.
- **jest-axe**: Permite añadir pruebas de accesibilidad automatizadas a tus pruebas de Jest.
- **@testing-library/jest-dom**: Proporciona aserciones personalizadas para probar accesibilidad.

```jsx
// Ejemplo de configuración de eslint con reglas de a11y
// .eslintrc.js
module.exports = {
  extends: ["react-app", "plugin:jsx-a11y/recommended"],
  plugins: ["jsx-a11y"],
  rules: {
    // Personaliza las reglas según sea necesario
  },
};
```

```jsx
// Ejemplo de prueba con jest-axe
import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import AccessibleForm from "./AccessibleForm";

expect.extend(toHaveNoViolations);

describe("AccessibleForm", () => {
  it("should not have any accessibility violations", async () => {
    const { container } = render(<AccessibleForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Lista de verificación de accesibilidad para React

- [ ] Usa elementos semánticos de HTML5 adecuadamente
- [ ] Proporciona textos alternativos para imágenes (`alt`)
- [ ] Asegúrate de que todos los controles tengan etiquetas apropiadas
- [ ] Implementa una navegación por teclado efectiva
- [ ] Maneja adecuadamente el foco en componentes interactivos
- [ ] Usa atributos ARIA cuando sea necesario (sin abusar de ellos)
- [ ] Proporciona skip links para saltar a contenido principal
- [ ] Asegura un contraste de color adecuado en todos los textos
- [ ] Implementa manejo de errores de formulario accesible
- [ ] Prueba tus componentes con herramientas de accesibilidad
- [ ] Verifica la accesibilidad en diferentes dispositivos y navegadores

## Mejores prácticas para equipos de desarrollo

1. **Incluye la accesibilidad desde el principio** en tus historias de usuario y planificación.
2. **Crea componentes reutilizables accesibles** para elementos comunes como botones, formularios, etc.
3. **Establece directrices de accesibilidad** para tu equipo.
4. **Automatiza las pruebas de accesibilidad** en tu pipeline de CI/CD.
5. **Realiza revisiones de accesibilidad** como parte de tu proceso de revisión de código.

## Conclusión

React proporciona todas las herramientas necesarias para crear aplicaciones web completamente accesibles. Implementar accesibilidad en React no es particularmente más difícil que en HTML puro, pero requiere conocimiento y atención a los detalles.

Al seguir las prácticas descritas en este módulo, puedes crear aplicaciones React que sean utilizables por todos, incluyendo personas con discapacidades, lo que no solo cumple con los estándares y regulaciones, sino que también mejora la experiencia general para todos los usuarios.

---

Los **test-utils NO son necesarios** para que funcionen tus tests, pero son **muy útiles** para proyectos que crecen. Te explico cuándo y por qué usarlos:

## 🤔 **¿Es necesario?**

**❌ NO es obligatorio** - Tus tests funcionarán perfectamente sin él.

**✅ SÍ es recomendado** si tienes:

- Múltiples componentes que testear
- Tests que se repiten mucho
- Proyecto que va a crecer
- Equipo de desarrollo

## 🎯 **¿Para qué sirve?**

### **1. Evitar Repetición de Código**

**❌ Sin test-utils (repetitivo):**

```typescript
// En cada test file
test("should fill form", async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/nombre completo/i), "Juan Pérez");
  await user.type(
    screen.getByLabelText(/correo electrónico/i),
    "juan@ejemplo.com"
  );
  await user.type(screen.getByLabelText(/mensaje/i), "Mensaje largo...");
});
```

**✅ Con test-utils (reutilizable):**

```typescript
// En cualquier test
test("should fill form", async () => {
  const user = userEvent.setup();
  await formUtils.fillValidForm(user); // ¡Una línea!
});
```

### **2. Mantener Consistencia**

**❌ Sin utils:**

```typescript
// Cada desarrollador usa selectores diferentes
screen.getByLabelText(/nombre completo/i);
screen.getByLabelText(/Nombre Completo/i);
screen.getByLabelText("nombre completo");
```

**✅ Con utils:**

```typescript
// Todos usan la misma constante
screen.getByLabelText(FORM_LABELS.NAME);
```

### **3. Tests de Accesibilidad Más Fáciles**

**❌ Sin utils:**

```typescript
test("keyboard navigation", async () => {
  const user = userEvent.setup();
  await user.tab();
  expect(screen.getByLabelText(/nombre/i)).toHaveFocus();
  await user.tab();
  expect(screen.getByLabelText(/email/i)).toHaveFocus();
  // ... repetir en cada test
});
```

**✅ Con utils:**

```typescript
test("keyboard navigation", async () => {
  await a11yUtils.navigateByTab(2);
  a11yUtils.expectToHaveFocusVisible(screen.getByLabelText(FORM_LABELS.EMAIL));
});
```

## 🚀 **Cómo usarlo**

### **Opción 1: Empezar SIN test-utils (Recomendado para principiantes)**

```typescript
// AccessibleForm.test.tsx - Simple y directo
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessibleForm } from "./AccessibleForm";

test("should submit valid form", async () => {
  const user = userEvent.setup();
  render(<AccessibleForm />);

  // Escribir directamente
  await user.type(screen.getByLabelText(/nombre completo/i), "Juan");
  await user.type(
    screen.getByLabelText(/correo electrónico/i),
    "juan@test.com"
  );
  await user.type(screen.getByLabelText(/mensaje/i), "Mensaje de prueba largo");

  await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

  expect(screen.getByText(/enviando mensaje/i)).toBeInTheDocument();
});
```

### **Opción 2: Migrar a test-utils cuando necesites**

```typescript
// src/test-utils.ts - Versión MÍNIMA
export const FORM_LABELS = {
  NAME: /nombre completo/i,
  EMAIL: /correo electrónico/i,
  MESSAGE: /mensaje/i,
  SUBMIT_BUTTON: /enviar mensaje/i,
};

export const fillValidForm = async (user: any) => {
  const { screen } = await import("@testing-library/react");
  await user.type(screen.getByLabelText(FORM_LABELS.NAME), "Juan Pérez");
  await user.type(screen.getByLabelText(FORM_LABELS.EMAIL), "juan@test.com");
  await user.type(
    screen.getByLabelText(FORM_LABELS.MESSAGE),
    "Mensaje válido con más de 10 caracteres"
  );
};
```

```typescript
// AccessibleForm.test.tsx - Usando utils
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessibleForm } from "./AccessibleForm";
import { FORM_LABELS, fillValidForm } from "../test-utils";

test("should submit valid form", async () => {
  const user = userEvent.setup();
  render(<AccessibleForm />);

  await fillValidForm(user); // ¡Más simple!
  await user.click(
    screen.getByRole("button", { name: FORM_LABELS.SUBMIT_BUTTON })
  );

  expect(screen.getByText(/enviando mensaje/i)).toBeInTheDocument();
});
```

## 📋 **Mi Recomendación**

### **Para tu caso actual:**

1. **✅ Empezar SIN test-utils** - Usa los tests que te di directamente
2. **🔄 Migrar después** si ves que repites mucho código
3. **📈 Escalar gradualmente** según necesites

### **Cuándo SÍ usarlos:**

- ✅ Tienes más de 3-4 componentes con tests
- ✅ El equipo tiene más de 2 desarrolladores
- ✅ Tests empiezan a repetir mucho código
- ✅ Quieres estandarizar selectores y utilidades

### **Cuándo NO los necesitas:**

- ❌ Solo testeas 1-2 componentes
- ❌ Proyecto pequeño/personal
- ❌ Prefieres simplicidad directa
- ❌ Equipo de 1 persona

## 🎯 **Conclusión**

**Empieza con los tests simples que te di**. Los test-utils son una optimización que puedes agregar más tarde si los necesitas. ¡No te compliques al principio!

¿Prefieres que te muestre los tests finales SIN utils para que sean más directos?
