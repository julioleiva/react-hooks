import { render, screen, waitFor, within, act } from "@testing-library/react";
// userEvent simula interacciones del usuario
import userEvent from "@testing-library/user-event";
// vi es la utilidad de mocking de Vitest (similar a jest)
import { vi } from "vitest";

import SignupForm from "../SignupForm";

describe("SignupForm - Tests de Integración", () => {
  // crea una función mock para espiar llamadas, como console.log.
  const mockConsoleLog = vi.fn();
  let originalConsoleLog: typeof console.log; //  console.log después de los tests.

  // `beforeEach` se ejecuta antes de cada `test` dentro de este `describe` block.
  // Útil para setup común o limpieza.
  beforeEach(() => {
    originalConsoleLog = console.log; // Guarda el console.log original
    console.log = mockConsoleLog; // Lo reemplaza con el mock
    vi.clearAllMocks(); // Limpia el estado de todos los mocks (llamadas, instancias)
    // La función retornada por beforeEach es una función de limpieza que se ejecuta DESPUÉS de cada test.
    return () => {
      console.log = originalConsoleLog; // Restaura el console.log original
    };
  });

  test("int: 1. Renderiza todos los elementos esenciales del formulario", () => {
    // `render` dibuja el componente en un entorno DOM simulado (JSDOM).
    render(<SignupForm />);

    // `screen` es un objeto que tiene queries para encontrar elementos en el DOM renderizado.
    // `getByRole` busca elementos por su rol ARIA (muy bueno para accesibilidad).
    // La opción `name` usa el "Accessible Name Calculation" para encontrar elementos por su texto visible o etiquetas.
    expect(
      screen.getByRole("heading", { name: /crear cuenta/i })
    ).toBeInTheDocument();
    // `getByLabelText` encuentra un input basado en el texto de su <label> asociado.
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument(); // Regex para ser específico.
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrarse/i })
    ).toBeInTheDocument();
    // matcher de @testing-library/jest-dom para verificar si un elemento está en el DOM.
  });

  test("int: 2. Valida campos vacíos y muestra errores al enviar", async () => {
    // `userEvent.setup()` inicializa una instancia de userEvent para interacciones.
    const user = userEvent.setup();
    render(<SignupForm />);

    // `await user.click(element)` simula un clic de usuario en el elemento especificado.
    await user.click(screen.getByRole("button", { name: /registrarse/i }));

    // `waitFor` es una utilidad para esperar a que una o más aserciones dentro de su callback pasen.
    // Es útil cuando una acción (como un clic) desencadena actualizaciones asíncronas del DOM (ej. mostrar errores).
    // El callback de waitFor se reintenta hasta que no lance un error o se alcance un timeout.
    // `findByRole` combina `getByRole` con `waitFor`, esperando que el elemento aparezca.
    const errorSummary = await screen.findByRole("alert", {
      name: /Errores en el formulario/i,
    });
    expect(errorSummary).toBeInTheDocument();

    // `within(element)` permite hacer queries solo dentro de los descendientes de `element`.
    // Es útil para asegurar que los mensajes de error están dentro del `ErrorSummary`.
    expect(
      within(errorSummary).getByText("El nombre de usuario es obligatorio")
    ).toBeInTheDocument();
    expect(
      within(errorSummary).getByText("La contraseña es obligatoria")
    ).toBeInTheDocument();
    expect(
      within(errorSummary).getByText("Debes confirmar tu contraseña")
    ).toBeInTheDocument();
  });

  test("int: 3. Valida formato del nombre de usuario y limpia error al corregir", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    const usernameInput = screen.getByLabelText(
      /nombre de usuario/i
    ) as HTMLInputElement;

    // --- Parte 1: Simular error de formato ---
    // simula la escritura del usuario en un input.
    await user.type(usernameInput, "user@!");
    // simula la pulsación de la tecla Tab, usualmente para cambiar el foco y disparar eventos `onBlur`.
    await user.tab();

    await waitFor(() => {
      // verifica si un elemento tiene un atributo con un valor específico.
      expect(usernameInput).toHaveAttribute("aria-invalid", "true");
      const errorContainer =
        usernameInput.ownerDocument.getElementById("username-error");
      expect(errorContainer).toBeInTheDocument();
      expect(
        within(errorContainer!).getByText(
          "Solo se permiten letras, números, guiones y guiones bajos"
        )
      ).toBeInTheDocument();
    });

    // --- Parte 2: Simular corrección del error ---
    // `act` es una utilidad para envolver código que causa actualizaciones de estado en React.
    // `userEvent` v14 generalmente maneja `act` internamente para sus APIs, pero usarlo explícitamente
    // puede ayudar en secuencias complejas o para asegurar que las promesas se resuelvan.
    await act(async () => {
      // simula la limpieza del contenido de un input.
      await user.clear(usernameInput);
    });
    // Esperar a que el DOM refleje que el input está vacío.
    await waitFor(() => expect(usernameInput).toHaveValue(""));

    await act(async () => {
      // La opción `delay` en `user.type` simula un pequeño retraso entre cada pulsación de tecla.
      // Puede ayudar en tests donde el comportamiento depende de interacciones más lentas.
      await user.type(usernameInput, "valid_user", { delay: 50 });
    });

    // Esperar a que el valor completo "valid_user" se refleje en el input.
    // Este es un punto crítico donde los tests a veces fallan si el estado no se actualiza
    // lo suficientemente rápido en el DOM de prueba.
    await waitFor(
      () => {
        // `toHaveValue` verifica el valor actual de un elemento de formulario (input, textarea, select).
        expect(usernameInput).toHaveValue("valid_user");
      },
      { timeout: 3000 } // Opción para aumentar el timeout por defecto de waitFor.
    );

    await user.tab(); // Disparar onBlur con el valor corregido.

    await waitFor(() => {
      expect(usernameInput).toHaveAttribute("aria-invalid", "false");
      // `queryByText` es similar a `getByText` pero devuelve `null` si no encuentra el elemento,
      // en lugar de lanzar un error. Es ideal para verificar la ausencia de un elemento.
      expect(
        screen.queryByText(
          "Solo se permiten letras, números, guiones y guiones bajos"
        )
      ).not.toBeInTheDocument();
    });
  });

  test("int: 4. Muestra indicador de fortaleza de contraseña y actualiza requisitos", async () => {
    // Este test asume que `useFormValidation` y `PasswordField` han sido corregidos
    // para que `getPasswordStrength` devuelva la estructura completa de `PasswordStrength`
    // y que `PasswordField` renderice correctamente el score 5 (barra verde al 100%).
    const user = userEvent.setup();
    render(<SignupForm />);
    const passwordField = screen.getByLabelText(/^contraseña/i);

    // --- Parte 1: Contraseña débil ("pass") ---
    await user.type(passwordField, "pass"); // Simula una contraseña débil.
    await waitFor(() => {
      // `getByText` busca un elemento que contenga el texto proporcionado.
      expect(screen.getByText("Débil")).toBeInTheDocument(); // Verifica el label de fortaleza.

      // Encuentra la lista de requisitos y verifica su contenido.
      const reqList = screen
        .getByText("📋 Requisitos de contraseña:")
        .parentElement!.querySelector("ul")!;
      expect(
        within(reqList).getByText("✓ Una letra minúscula")
      ).toBeInTheDocument(); // "pass" cumple esto.
      expect(
        within(reqList).getByText("○ Al menos 8 caracteres")
      ).toBeInTheDocument(); // "pass" no cumple esto.

      // Verifica la barra de fortaleza.
      const strengthBarContainer =
        screen.getByText(/Fortaleza:/i).parentElement!;
      const strengthBar =
        strengthBarContainer.nextElementSibling!.querySelector(
          "div > div"
        ) as HTMLElement;
      // `toHaveClass` verifica si el elemento tiene la clase CSS especificada.
      expect(strengthBar).toHaveClass("bg-red-500");
      // `toHaveStyle` verifica los estilos computados del elemento.
      expect(strengthBar).toHaveStyle("width: 20%"); // 20% para score 1 (1/5 * 100%)
    });

    // --- Parte 2: Contraseña fuerte ("Pass123!") ---
    await user.clear(passwordField);
    await user.type(passwordField, "Pass123!"); // Simula una contraseña fuerte (score 5).
    await waitFor(() => {
      expect(screen.getByText("Muy fuerte")).toBeInTheDocument(); // Label para score 5.

      const reqList = screen
        .getByText("📋 Requisitos de contraseña:")
        .parentElement!.querySelector("ul")!;
      // `getAllByText` busca TODOS los elementos que coincidan. Útil para contar.
      expect(within(reqList).getAllByText(/✓/).length).toBe(5); // Todos los 5 requisitos cumplidos.

      const strengthBarContainer =
        screen.getByText(/Fortaleza:/i).parentElement!;
      const strengthLabelSpan = screen.getByText("Muy fuerte");
      const strengthBar =
        strengthBarContainer.nextElementSibling!.querySelector(
          "div > div"
        ) as HTMLElement;

      // Estas aserciones esperan que PasswordField.tsx esté corregido para score 5.
      expect(strengthLabelSpan).toHaveClass("text-green-600");
      expect(strengthBar).toHaveClass("bg-green-500");
      expect(strengthBar).toHaveStyle("width: 100%");
    });

    await user.tab(); // Disparar onBlur.
    await waitFor(() => {
      // La contraseña fuerte no debería tener errores.
      expect(passwordField).toHaveAttribute("aria-invalid", "false");
    });
  });

  test("int: 5. Envía el formulario con datos válidos", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    // Rellenar el formulario con datos válidos.
    await user.type(
      screen.getByLabelText(/nombre de usuario/i),
      "testvaliduser"
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "ValidPass123!"); // Contraseña que cumpla requisitos.
    await user.type(
      screen.getByLabelText(/confirmar contraseña/i),
      "ValidPass123!"
    );

    // Esperar a que cualquier validación onBlur se complete y no haya errores.
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre de usuario/i)).not.toHaveAttribute(
        "aria-invalid",
        "true"
      );
      expect(screen.getByLabelText(/^contraseña/i)).not.toHaveAttribute(
        "aria-invalid",
        "true"
      );
      expect(
        screen.getByLabelText(/confirmar contraseña/i)
      ).not.toHaveAttribute("aria-invalid", "true");
    });

    // Enviar el formulario.
    await user.click(screen.getByRole("button", { name: /registrarse/i }));

    // Esperar el estado de carga (texto del botón cambia a "Creando cuenta...").
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /creando cuenta.../i })
      ).toBeInTheDocument()
    );

    // Esperar el resultado del envío.
    await waitFor(
      () => {
        // `toHaveBeenCalledWith` verifica que el mock fue llamado con argumentos específicos.
        // `expect.objectContaining` es útil para verificar un subconjunto de propiedades de un objeto.
        expect(mockConsoleLog).toHaveBeenCalledWith(
          "Formulario enviado:",
          expect.objectContaining({
            username: "testvaliduser",
            password: "ValidPass123!",
            confirmPassword: "ValidPass123!",
          })
        );
        expect(
          screen.getByText(/¡Registro completado exitosamente! Bienvenido\/a./i)
        ).toBeInTheDocument();
      },
      { timeout: 3500 } // Timeout para la simulación de envío asíncrona.
    );

    // Verificar que los campos se limpian después de un envío exitoso.
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre de usuario/i)).toHaveValue("");
      expect(screen.getByLabelText(/^contraseña/i)).toHaveValue("");
      expect(screen.getByLabelText(/confirmar contraseña/i)).toHaveValue("");
    });
  });
});
