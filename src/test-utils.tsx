import React from "react";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import type { RenderResult, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Wrapper personalizado para providers globales (si los tienes)
export const AllTheProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      {/* Aquí irían tus providers globales como ThemeProvider, etc. */}
      {children}
    </div>
  );
};

// Custom render que incluye providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// Utilidades específicas para accesibilidad
export const a11yUtils = {
  /**
   * Simula navegación por teclado Tab
   */
  async navigateByTab(steps: number = 1): Promise<void> {
    const user = userEvent.setup();
    for (let i = 0; i < steps; i++) {
      await user.tab();
    }
  },

  /**
   * Simula navegación por teclado Shift+Tab
   */
  async navigateByShiftTab(steps: number = 1): Promise<void> {
    const user = userEvent.setup();
    for (let i = 0; i < steps; i++) {
      await user.tab({ shift: true });
    }
  },

  /**
   * Verifica que un elemento tiene focus visible
   */
  expectToHaveFocusVisible(element: HTMLElement): void {
    expect(element).toHaveFocus();
    // Verificar que tiene clases de focus apropiadas
    expect(element).toHaveClass("focus:outline-none");
  },

  /**
   * Obtiene todos los elementos focusables en orden
   */
  getFocusableElements(): HTMLElement[] {
    const selector = [
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  },
};

// Utilidades para formularios
export const formUtils = {
  /**
   * Llena un formulario con datos de prueba válidos
   */
  async fillValidForm(user: ReturnType<typeof userEvent.setup>): Promise<void> {
    const { screen } = await import("@testing-library/react");

    await user.type(screen.getByLabelText(/nombre completo/i), "Juan Pérez");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "juan.perez@ejemplo.com"
    );
    await user.type(
      screen.getByLabelText(/mensaje/i),
      "Este es un mensaje de prueba con más de 10 caracteres para cumplir la validación"
    );
  },

  /**
   * Llena un formulario con datos inválidos
   */
  async fillInvalidForm(
    user: ReturnType<typeof userEvent.setup>
  ): Promise<void> {
    const { screen } = await import("@testing-library/react");

    await user.type(screen.getByLabelText(/nombre completo/i), "A");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "email-invalido"
    );
    await user.type(screen.getByLabelText(/mensaje/i), "Corto");
  },
};

// Matchers personalizados para Vitest
export const customMatchers = {
  toBeAccessible: async (received: HTMLElement) => {
    const { axe } = await import("jest-axe");
    const results = await axe(received);

    return {
      pass: results.violations.length === 0,
      message: () =>
        results.violations.length === 0
          ? `Expected element to have accessibility violations`
          : `Expected element to be accessible, but found ${
              results.violations.length
            } violations:\n${results.violations
              .map((v) => `- ${v.description}`)
              .join("\n")}`,
    };
  },
};

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
export { userEvent };

// Constantes útiles para tests
export const TEST_IDS = {
  FORM_CONTAINER: "accessible-form",
  ERROR_SUMMARY: "error-summary",
  SUCCESS_MESSAGE: "success-message",
  LOADING_SPINNER: "loading-spinner",
} as const;

export const FORM_LABELS = {
  NAME: /nombre completo/i,
  EMAIL: /correo electrónico/i,
  MESSAGE: /mensaje/i,
  NEWSLETTER: /suscribirse al boletín/i,
  SUBMIT_BUTTON: /enviar mensaje/i,
} as const;

export const ERROR_MESSAGES = {
  NAME_REQUIRED: /el nombre es obligatorio/i,
  NAME_TOO_SHORT: /el nombre debe tener al menos 2 caracteres/i,
  EMAIL_REQUIRED: /el correo electrónico es obligatorio/i,
};
