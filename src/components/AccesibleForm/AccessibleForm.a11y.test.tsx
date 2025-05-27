// AccessibleForm.a11y.test.tsx - VERSIÓN COMPLETAMENTE COMENTADA
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { AccessibleForm } from "./AccessibleForm";

// Extender los matchers de Vitest para incluir toHaveNoViolations
// Esto nos permite usar expect(results).toHaveNoViolations() en nuestros tests
expect.extend(toHaveNoViolations);

describe("AccessibleForm - Accessibility Tests (WCAG 2.1 AA)", () => {
  beforeEach(() => {
    // Limpiar completamente el DOM antes de cada test para evitar interferencias
    // Esto asegura que cada test empiece con un estado limpio
    document.body.innerHTML = "";
  });

  describe("WCAG 2.1 AA Compliance", () => {
    test("should not have accessibility violations", async () => {
      // PASO 1: Renderizar el componente en el DOM virtual
      const { container } = render(<AccessibleForm />);

      // PASO 2: Ejecutar el analizador de accesibilidad axe-core
      // axe-core verifica automáticamente cientos de reglas WCAG
      const results = await axe(container);

      // PASO 3: Verificar que no hay violaciones de accesibilidad
      // Si hay violaciones, el test fallará mostrando detalles específicos
      expect(results).toHaveNoViolations();
    });

    test("should not have accessibility violations with errors shown", async () => {
      const { container } = render(<AccessibleForm />);
      const user = userEvent.setup();

      // PASO 1: Generar errores intencionalmente enviando formulario vacío
      // Esto simula un escenario real donde el usuario comete errores
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 2: Esperar a que aparezcan los mensajes de error
      // waitFor es crucial para elementos que aparecen asincrónicamente
      await waitFor(async () => {
        // PASO 3: Verificar accesibilidad DESPUÉS de mostrar errores
        // Es importante probar que los estados de error también son accesibles
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    test("should not have accessibility violations during form submission", async () => {
      const { container } = render(<AccessibleForm />);
      const user = userEvent.setup();

      // PASO 1: Llenar formulario con datos válidos
      // Simulamos un usuario completando correctamente el formulario
      await user.type(screen.getByLabelText(/nombre completo/i), "Juan Pérez");
      await user.type(
        screen.getByRole("textbox", { name: /correo electrónico/i }),
        "juan@ejemplo.com"
      );
      await user.type(
        screen.getByLabelText(/mensaje/i),
        "Mensaje de prueba con suficientes caracteres"
      );

      // PASO 2: Enviar formulario para activar estado de carga
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 3: Verificar accesibilidad durante el estado de carga
      // Los estados de carga deben ser accesibles para usuarios con lectores de pantalla
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Keyboard Navigation (2.1.1)", () => {
    test("should be fully keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE NAVEGACIÓN SECUENCIAL CON TAB
      // Verificamos que cada elemento recibe focus en el orden correcto

      // PASO 1: Navegar al primer campo (nombre)
      await user.tab();
      expect(screen.getByLabelText(/nombre completo/i)).toHaveFocus();

      // PASO 2: Navegar al segundo campo (email)
      await user.tab();
      expect(
        screen.getByRole("textbox", { name: /correo electrónico/i })
      ).toHaveFocus();

      // PASO 3: Navegar al tercer campo (mensaje)
      await user.tab();
      expect(screen.getByLabelText(/mensaje/i)).toHaveFocus();

      // PASO 4: Navegar al checkbox
      await user.tab();
      expect(screen.getByLabelText(/suscribirse al boletín/i)).toHaveFocus();

      // PASO 5: Navegar al botón de envío
      await user.tab();
      expect(
        screen.getByRole("button", { name: /enviar mensaje/i })
      ).toHaveFocus();
    });

    test("should navigate backwards with Shift+Tab", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE NAVEGACIÓN INVERSA
      // Los usuarios deben poder navegar hacia atrás con Shift+Tab

      // PASO 1: Posicionarse en el último elemento manualmente
      const submitButton = screen.getByRole("button", {
        name: /enviar mensaje/i,
      });
      submitButton.focus();

      // PASO 2: Navegar hacia atrás al checkbox
      await user.tab({ shift: true });
      expect(screen.getByLabelText(/suscribirse al boletín/i)).toHaveFocus();

      // PASO 3: Navegar hacia atrás al campo mensaje
      await user.tab({ shift: true });
      expect(screen.getByLabelText(/mensaje/i)).toHaveFocus();

      // Esta prueba asegura que el orden de tabulación es bidireccional
    });

    test("should submit form with Enter key", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE ACTIVACIÓN POR TECLADO
      // Los botones deben funcionar tanto con clic como con Enter

      // PASO 1: Preparar datos válidos para envío
      await user.type(screen.getByLabelText(/nombre completo/i), "Juan Pérez");
      await user.type(
        screen.getByRole("textbox", { name: /correo electrónico/i }),
        "juan@ejemplo.com"
      );
      await user.type(
        screen.getByLabelText(/mensaje/i),
        "Mensaje de prueba con suficientes caracteres"
      );

      // PASO 2: Posicionar focus en el botón
      const submitButton = screen.getByRole("button", {
        name: /enviar mensaje/i,
      });
      submitButton.focus();

      // PASO 3: Activar con Enter (no con clic)
      await user.keyboard("{Enter}");

      // PASO 4: Verificar que el formulario se envió correctamente
      expect(screen.getByText(/enviando mensaje/i)).toBeInTheDocument();
    });
  });

  describe("Focus Management (2.4.3, 2.4.7)", () => {
    test("should focus on first error field when validation fails", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE GESTIÓN DE FOCO EN ERRORES
      // Cuando hay errores, el foco debe ir al primer campo problemático

      // PASO 1: Intentar enviar formulario vacío
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 2: Verificar que el foco va al primer campo con error
      // Esto ayuda a usuarios con lectores de pantalla a encontrar errores rápidamente
      await waitFor(() => {
        expect(screen.getByLabelText(/nombre completo/i)).toHaveFocus();
      });
    });

    test("should have visible focus indicators", () => {
      render(<AccessibleForm />);

      // PRUEBA DE INDICADORES VISUALES DE FOCO
      // Crítico para usuarios que navegan solo con teclado

      const nameInput = screen.getByLabelText(/nombre completo/i);
      nameInput.focus();

      // Verificar que el campo tiene las clases CSS necesarias
      // focus:outline-none elimina el outline predeterminado
      // focus:ring-4 proporciona un anillo de foco personalizado
      expect(nameInput).toHaveClass("focus:outline-none", "focus:ring-4");
    });

    test("should maintain focus order during error states", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE ORDEN DE FOCO CON ERRORES
      // Los errores no deben romper la navegación por teclado

      // PASO 1: Generar errores
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 2: Esperar a que aparezcan los mensajes de error
      await waitFor(() => {
        expect(
          screen.getByText(/el nombre es obligatorio/i)
        ).toBeInTheDocument();
      });

      // PASO 3: Verificar que la navegación sigue funcionando
      await user.tab();
      expect(
        screen.getByRole("textbox", { name: /correo electrónico/i })
      ).toHaveFocus();
    });
  });

  describe("Form Labels and Descriptions (3.3.2)", () => {
    test("should have proper labels for all form controls", () => {
      render(<AccessibleForm />);

      // PRUEBA DE ETIQUETAS APROPIADAS
      // Todos los controles deben tener labels asociados programáticamente

      // PASO 1: Verificar que podemos encontrar cada input por su label
      // getByLabelText falla si no hay asociación correcta
      const nameInput = screen.getByLabelText(/nombre completo/i);
      const emailInput = screen.getByRole("textbox", {
        name: /correo electrónico/i,
      });
      const messageInput = screen.getByLabelText(/mensaje/i);
      const newsletterInput = screen.getByLabelText(/suscribirse al boletín/i);

      // PASO 2: Verificar que cada input tiene el ID correcto
      expect(nameInput).toHaveAttribute("id", "name");
      expect(emailInput).toHaveAttribute("id", "email");
      expect(messageInput).toHaveAttribute("id", "message");
      expect(newsletterInput).toHaveAttribute("id", "newsletter");
    });

    test("should have proper aria-describedby associations", () => {
      render(<AccessibleForm />);

      // PRUEBA DE DESCRIPCIONES ARIA
      // Los campos deben estar asociados con sus textos de ayuda

      const emailInput = screen.getByRole("textbox", {
        name: /correo electrónico/i,
      });
      const messageInput = screen.getByLabelText(/mensaje/i);

      // Verificar que aria-describedby apunta a los elementos de ayuda correctos
      // Esto permite que lectores de pantalla lean automáticamente las instrucciones
      expect(emailInput).toHaveAttribute(
        "aria-describedby",
        expect.stringContaining("email-hint")
      );
      expect(messageInput).toHaveAttribute(
        "aria-describedby",
        expect.stringContaining("message-hint")
      );
    });

    test("should associate error messages with form controls", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE ASOCIACIÓN DE ERRORES
      // Los mensajes de error deben estar vinculados programáticamente

      // PASO 1: Generar errores
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 2: Verificar asociaciones después de que aparezcan los errores
      await waitFor(() => {
        const nameInput = screen.getByLabelText(/nombre completo/i);
        const emailInput = screen.getByRole("textbox", {
          name: /correo electrónico/i,
        });
        const messageInput = screen.getByLabelText(/mensaje/i);

        // aria-describedby debe incluir los IDs de los mensajes de error
        expect(nameInput).toHaveAttribute("aria-describedby", "name-error");
        expect(emailInput).toHaveAttribute(
          "aria-describedby",
          expect.stringContaining("email-error")
        );
        expect(messageInput).toHaveAttribute(
          "aria-describedby",
          expect.stringContaining("message-error")
        );
      });
    });
  });

  describe("Error Identification and Suggestions (3.3.1, 3.3.3)", () => {
    test("should clearly identify validation errors", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE IDENTIFICACIÓN DE ERRORES
      // Los campos con errores deben marcarse como inválidos

      // PASO 1: Generar errores
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 2: Verificar que los campos se marcan como aria-invalid="true"
      // Esto informa a lectores de pantalla que hay un problema
      await waitFor(() => {
        expect(screen.getByLabelText(/nombre completo/i)).toHaveAttribute(
          "aria-invalid",
          "true"
        );
        expect(
          screen.getByRole("textbox", { name: /correo electrónico/i })
        ).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByLabelText(/mensaje/i)).toHaveAttribute(
          "aria-invalid",
          "true"
        );
      });
    });

    test("should provide constructive error messages", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE MENSAJES CONSTRUCTIVOS
      // Los errores deben explicar qué está mal y cómo solucionarlo

      // PASO 1: Escribir datos inválidos específicos
      await user.type(screen.getByLabelText(/nombre completo/i), "A");
      await user.type(
        screen.getByRole("textbox", { name: /correo electrónico/i }),
        "email-inválido"
      );
      await user.type(screen.getByLabelText(/mensaje/i), "Corto");

      // PASO 2: Activar validación
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 3: Verificar que los mensajes son específicos y útiles
      await waitFor(() => {
        expect(
          screen.getByText(/el nombre debe tener al menos 2 caracteres/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/por favor, introduce un correo electrónico válido/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/el mensaje debe tener al menos 10 caracteres/i)
        ).toBeInTheDocument();
      });
    });

    test("should announce errors to screen readers", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE ANUNCIOS A LECTORES DE PANTALLA
      // Los errores deben anunciarse automáticamente

      // PASO 1: Generar errores
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      await waitFor(() => {
        // PASO 2: Verificar que los mensajes tienen role="alert"
        // role="alert" hace que lectores de pantalla anuncien el mensaje inmediatamente
        const errorMessages = screen.getAllByRole("alert");
        expect(errorMessages).toHaveLength(3); // 3 campos con error

        // PASO 3: Verificar contenido de los anuncios
        expect(
          errorMessages.some((alert) =>
            alert.textContent?.includes("El nombre es obligatorio")
          )
        ).toBe(true);
      });
    });
  });

  describe("Status Messages (4.1.3)", () => {
    test("should announce form submission status", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE ANUNCIOS DE ESTADO
      // Los cambios de estado deben comunicarse a lectores de pantalla

      // PASO 1: Llenar formulario válido
      await user.type(screen.getByLabelText(/nombre completo/i), "Juan Pérez");
      await user.type(
        screen.getByRole("textbox", { name: /correo electrónico/i }),
        "juan@ejemplo.com"
      );
      await user.type(
        screen.getByLabelText(/mensaje/i),
        "Mensaje de prueba con suficientes caracteres"
      );

      // PASO 2: Enviar formulario
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 3: Verificar la región de estado
      const statusRegion = screen.getByRole("status");

      // aria-live="polite" hace que los cambios se anuncien cuando el usuario no está ocupado
      expect(statusRegion).toHaveAttribute("aria-live", "polite");
      // aria-atomic="true" hace que se lea todo el contenido, no solo los cambios
      expect(statusRegion).toHaveAttribute("aria-atomic", "true");

      // PASO 4: Verificar mensaje de éxito
      await waitFor(
        () => {
          expect(
            screen.getByText(/formulario enviado correctamente/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    test("should have proper live region for loading state", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE REGIÓN LIVE PARA ESTADO DE CARGA
      // Los estados de carga deben anunciarse apropiadamente

      // PASO 1: Llenar y enviar formulario
      await user.type(screen.getByLabelText(/nombre completo/i), "Juan Pérez");
      await user.type(
        screen.getByRole("textbox", { name: /correo electrónico/i }),
        "juan@ejemplo.com"
      );
      await user.type(
        screen.getByLabelText(/mensaje/i),
        "Mensaje de prueba con suficientes caracteres"
      );

      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 2: Buscar específicamente el elemento de estado de carga
      // Usamos getElementById porque hay múltiples elementos con role="status"
      const submitStatus = document.getElementById("submit-status");

      // PASO 3: Verificar atributos de región live
      expect(submitStatus).toBeInTheDocument();
      expect(submitStatus).toHaveAttribute("aria-live", "polite");
      expect(submitStatus).toHaveAttribute("aria-atomic", "true");

      // PASO 4: Verificar que está oculto visualmente pero accesible
      // sr-only = screen reader only
      expect(submitStatus).toHaveClass("sr-only");

      // PASO 5: Verificar contenido del anuncio
      expect(submitStatus).toHaveTextContent(
        /enviando formulario, por favor espera/i
      );
    });
  });

  describe("Required Field Indication (3.3.2)", () => {
    test("should clearly mark required fields", () => {
      render(<AccessibleForm />);

      // PRUEBA DE INDICACIÓN DE CAMPOS OBLIGATORIOS
      // Los usuarios deben saber qué campos son requeridos

      // PASO 1: Verificar que campos obligatorios tienen aria-required="true"
      expect(screen.getByLabelText(/nombre completo/i)).toHaveAttribute(
        "aria-required",
        "true"
      );
      expect(
        screen.getByRole("textbox", { name: /correo electrónico/i })
      ).toHaveAttribute("aria-required", "true");
      expect(screen.getByLabelText(/mensaje/i)).toHaveAttribute(
        "aria-required",
        "true"
      );

      // PASO 2: Verificar que campo opcional NO tiene aria-required
      expect(
        screen.getByLabelText(/suscribirse al boletín/i)
      ).not.toHaveAttribute("aria-required");
    });

    test("should have visual indicators for required fields", () => {
      render(<AccessibleForm />);

      // PRUEBA DE INDICADORES VISUALES
      // Los asteriscos deben estar presentes y ser accesibles

      // PASO 1: Encontrar todos los indicadores de campo obligatorio
      const requiredIndicators = screen.getAllByLabelText("obligatorio");
      expect(requiredIndicators).toHaveLength(3); // Solo campos obligatorios

      // PASO 2: Verificar cada indicador
      requiredIndicators.forEach((indicator) => {
        // Debe mostrar asterisco
        expect(indicator).toHaveTextContent("*");
        // Debe ser rojo para destacar
        expect(indicator).toHaveClass("text-red-600");
      });
    });
  });

  describe("Form Validation Timing (3.3.4)", () => {
    test("should provide real-time validation feedback", async () => {
      const user = userEvent.setup();
      render(<AccessibleForm />);

      // PRUEBA DE VALIDACIÓN EN TIEMPO REAL
      // Los errores deben desaparecer cuando el usuario los corrige

      const nameInput = screen.getByLabelText(/nombre completo/i);

      // PASO 1: Crear error escribiendo valor inválido
      await user.type(nameInput, "A");
      await user.click(screen.getByRole("button", { name: /enviar mensaje/i }));

      // PASO 2: Verificar que aparece el error
      await waitFor(() => {
        expect(
          screen.getByText(/el nombre debe tener al menos 2 caracteres/i)
        ).toBeInTheDocument();
      });

      // PASO 3: Corregir el valor
      await user.type(nameInput, "nna"); // Ahora será "Anna"

      // PASO 4: Verificar que el error desaparece inmediatamente
      // Esto proporciona feedback instantáneo al usuario
      await waitFor(() => {
        expect(
          screen.queryByText(/el nombre debe tener al menos 2 caracteres/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Semantic HTML and ARIA (4.1.2)", () => {
    test("should use proper semantic HTML structure", () => {
      render(<AccessibleForm />);

      // PRUEBA DE ESTRUCTURA SEMÁNTICA
      // El HTML debe usar elementos apropiados para su propósito

      // Verificar landmarks principales
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        /formulario de contacto/i
      );
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        /información sobre privacidad/i
      );
    });

    test("should have proper form semantics", () => {
      render(<AccessibleForm />);

      // PRUEBA DE SEMÁNTICA DEL FORMULARIO
      // El formulario debe identificarse correctamente

      const formContainer = screen.getByRole("form");
      expect(formContainer).toHaveAttribute(
        "aria-label",
        "Formulario de contacto"
      );
    });
  });
});
