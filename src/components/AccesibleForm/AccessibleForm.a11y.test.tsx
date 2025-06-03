import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SignupForm from "../SignupForm/SignupForm";

describe("SignupForm - Tests de Integración", () => {
  // Mock de console.log para verificar envíos
  const mockConsoleLog = vi.fn();

  beforeEach(() => {
    console.log = mockConsoleLog;
    vi.clearAllMocks();
  });

  test("1. Renderiza todos los elementos esenciales del formulario", () => {
    render(<SignupForm />);

    // Verificar que el formulario tiene todos sus elementos
    expect(
      screen.getByRole("heading", { name: /crear cuenta/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrarse/i })
    ).toBeInTheDocument();

    // Verificar texto de ayuda
    expect(screen.getByText(/mínimo 3 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/requisitos de contraseña/i)).toBeInTheDocument();
  });

  test("2. Valida campos vacíos y muestra errores", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    // Intentar enviar el formulario vacío
    await user.click(screen.getByRole("button", { name: /registrarse/i }));

    // Verificar que aparecen mensajes de error
    await waitFor(() => {
      // Los mensajes pueden aparecer en múltiples lugares (resumen y campo)
      const usernameErrors = screen.getAllByText(
        /el nombre de usuario es obligatorio/i
      );
      const passwordErrors = screen.getAllByText(
        /la contraseña es obligatoria/i
      );

      expect(usernameErrors.length).toBeGreaterThan(0);
      expect(passwordErrors.length).toBeGreaterThan(0);
    });

    // Verificar que los campos están marcados como inválidos
    expect(screen.getByLabelText(/nombre de usuario/i)).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(screen.getByLabelText(/^contraseña/i)).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  test("3. Valida formato del nombre de usuario", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    // Probar con caracteres no permitidos
    await user.type(screen.getByLabelText(/nombre de usuario/i), "user@123!");
    await user.click(screen.getByRole("button", { name: /registrarse/i }));

    // Verificar mensaje de error específico
    await waitFor(() => {
      const errorMsg = screen.getAllByText(
        /solo se permiten letras, números, guiones y guiones bajos/i
      );
      expect(errorMsg.length).toBeGreaterThan(0);
    });

    // Corregir con un nombre válido
    await user.clear(screen.getByLabelText(/nombre de usuario/i));
    await user.type(screen.getByLabelText(/nombre de usuario/i), "usuario_123");

    // El campo debe ser válido ahora
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre de usuario/i)).toHaveAttribute(
        "aria-invalid",
        "false"
      );
    });
  });

  test("4. Muestra indicador de fortaleza de contraseña", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const passwordField = screen.getByLabelText(/^contraseña/i);

    // Contraseña muy corta
    await user.type(passwordField, "123");
    await waitFor(() => {
      expect(screen.getByText(/débil/i)).toBeInTheDocument();
    });

    // Contraseña media - el componente muestra "Buena"
    await user.clear(passwordField);
    await user.type(passwordField, "password123");
    await waitFor(() => {
      expect(screen.getByText(/buena/i)).toBeInTheDocument();
    });

    // Contraseña fuerte
    await user.clear(passwordField);
    await user.type(passwordField, "MiPassword123!");
    await waitFor(() => {
      expect(screen.getByText(/muy fuerte/i)).toBeInTheDocument();
    });
  });

  test("5. Valida que las contraseñas coincidan", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    // Escribir contraseñas diferentes
    await user.type(screen.getByLabelText(/^contraseña/i), "Password123");
    await user.type(
      screen.getByLabelText(/confirmar contraseña/i),
      "OtraPassword123"
    );

    // Verificar mensaje de no coincidencia
    await waitFor(() => {
      expect(
        screen.getByText(/las contraseñas no coinciden/i)
      ).toBeInTheDocument();
    });

    // Corregir para que coincidan
    await user.clear(screen.getByLabelText(/confirmar contraseña/i));
    await user.type(
      screen.getByLabelText(/confirmar contraseña/i),
      "Password123"
    );

    // Verificar mensaje de coincidencia
    await waitFor(() => {
      expect(
        screen.getByText(/las contraseñas coinciden/i)
      ).toBeInTheDocument();
    });
  });

  test("6. Envía el formulario con datos válidos", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    // Llenar el formulario con datos válidos
    await user.type(
      screen.getByLabelText(/nombre de usuario/i),
      "usuario_test"
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "Password123");
    await user.type(
      screen.getByLabelText(/confirmar contraseña/i),
      "Password123"
    );

    // Verificar que el botón está habilitado
    const submitButton = screen.getByRole("button", { name: /registrarse/i });
    expect(submitButton).not.toBeDisabled();

    // Enviar el formulario
    await user.click(submitButton);

    // Verificar que el botón cambia a estado de carga
    await waitFor(() => {
      expect(screen.getByText(/creando cuenta/i)).toBeInTheDocument();
    });

    // Esperar a que se complete (el componente simula un delay de 2 segundos)
    await waitFor(
      () => {
        expect(mockConsoleLog).toHaveBeenCalledWith("Formulario enviado:", {
          username: "usuario_test",
          password: "Password123",
          confirmPassword: "Password123",
        });
      },
      { timeout: 3000 }
    );
  });
});

/*
 * IDEAS ADICIONALES PARA TESTS DE INTEGRACIÓN:
 * ==========================================
 *
 * INTERACTIVIDAD Y UX:
 * - Probar que los botones de mostrar/ocultar contraseña funcionan correctamente
 * - Verificar que el formulario se puede enviar con Enter
 * - Comprobar navegación con Tab entre campos
 * - Validar que el foco se mueve al primer campo con error
 * - Probar que los mensajes de error desaparecen al corregir el campo
 *
 * VALIDACIONES AVANZADAS:
 * - Verificar mínimo de caracteres en nombre de usuario (3)
 * - Comprobar todos los requisitos de contraseña individualmente
 * - Validar espacios en blanco al inicio/final de campos
 * - Probar límites máximos de caracteres si existen
 *
 * ESTADOS Y FEEDBACK:
 * - Verificar mensaje de éxito tras registro exitoso
 * - Validar que el formulario se limpia después del envío exitoso
 * - Comprobar que no se puede enviar mientras está procesando
 * - Verificar animaciones y transiciones
 *
 * ACCESIBILIDAD:
 * - Verificar que todos los errores tienen role="alert"
 * - Comprobar que el resumen de errores es navegable
 * - Validar anuncios para lectores de pantalla
 * - Verificar contraste de colores en estados de error
 *
 * CASOS EDGE:
 * - Probar envío rápido múltiple (prevenir doble envío)
 * - Verificar comportamiento con emojis y caracteres unicode
 * - Comprobar copiar/pegar en campos de contraseña
 * - Validar comportamiento con autocompletado del navegador
 *
 * INTEGRACIÓN CON BACKEND (cuando aplique):
 * - Simular respuestas exitosas del servidor
 * - Manejar errores de red o timeout
 * - Validar username duplicado
 * - Verificar reintentos en caso de fallo
 *
 * RENDIMIENTO:
 * - Medir tiempo de validación en campos
 * - Verificar que no hay re-renders innecesarios
 * - Comprobar que las validaciones son eficientes
 *
 * SEGURIDAD:
 * - Verificar que las contraseñas no se muestran en logs
 * - Comprobar que no hay XSS en campos de entrada
 * - Validar sanitización de inputs
 */
