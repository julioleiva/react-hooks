// src/setupTests.ts - VERSIÓN CORREGIDA PARA VITEST

// Extensiones de Jest DOM
import "@testing-library/jest-dom";

// Configuración de jest-axe
import { toHaveNoViolations } from "jest-axe";

// Extender matchers de Vitest (usa expect global)
expect.extend(toHaveNoViolations);

// Mock de ResizeObserver (común en componentes React)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de matchMedia (para responsive tests)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de IntersectionObserver (común para scroll/lazy loading)
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de requestIdleCallback (requerido por axe-core/react)
global.requestIdleCallback = vi.fn().mockImplementation((callback) => {
  return setTimeout(callback, 0);
});

global.cancelIdleCallback = vi.fn().mockImplementation((id) => {
  clearTimeout(id);
});

// Configuración de axe-core para desarrollo
// Solo habilitar en desarrollo real del navegador, no en tests
/*
if (import.meta.env.DEV && typeof window !== 'undefined') {
  import('@axe-core/react').then(axe => {
    Promise.all([
      import('react'),
      import('react-dom')
    ]).then(([React, ReactDOM]) => {
      axe.default(React.default, ReactDOM.default, 1000)
    })
  })
}
*/
