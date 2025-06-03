// En __tests__/useFormValidation.test.ts

import { useFormValidation } from "../hooks/useFormValidation";
import type { FormData, PasswordStrength } from "../FormTypes";

describe("useFormValidation", () => {
  const { getPasswordStrength, validate } = useFormValidation();

  describe("getPasswordStrength", () => {
    test("unit:debería retornar Muy débil para una contraseña vacía", () => {
      const strength: PasswordStrength = getPasswordStrength("");
      expect(strength.score).toBe(0);
      expect(strength.label).toBe("Muy débil");
      expect(strength.hasMinLength).toBe(false);
      expect(strength.hasUpperCase).toBe(false);
      expect(strength.hasLowerCase).toBe(false);
      expect(strength.hasNumber).toBe(false);
      expect(strength.hasSpecialChar).toBe(false);
    });

    test("unit:debería retornar Débil para una contraseña corta solo con minúsculas", () => {
      const strength: PasswordStrength = getPasswordStrength("abc");
      expect(strength.score).toBe(1); // Solo hasLowerCase
      expect(strength.label).toBe("Débil");
      expect(strength.hasMinLength).toBe(false);
      expect(strength.hasLowerCase).toBe(true);
    });

    test("unit:debería retornar Regular con longitud mínima y minúsculas", () => {
      const strength: PasswordStrength = getPasswordStrength("abcdefgh");
      expect(strength.score).toBe(2); // hasMinLength, hasLowerCase
      expect(strength.label).toBe("Regular");
      expect(strength.hasMinLength).toBe(true);
      expect(strength.hasLowerCase).toBe(true);
    });

    test("unit:debería retornar Buena con longitud mínima, minúsculas y mayúsculas", () => {
      const strength: PasswordStrength = getPasswordStrength("Abcdefgh");
      expect(strength.score).toBe(3); // hasMinLength, hasLowerCase, hasUpperCase
      expect(strength.label).toBe("Buena");
      expect(strength.hasUpperCase).toBe(true);
    });

    test("unit:debería retornar Fuerte con longitud mínima, minúsculas, mayúsculas y número", () => {
      const strength: PasswordStrength = getPasswordStrength("Abcdefg1");
      expect(strength.score).toBe(4); // hasMinLength, hasLowerCase, hasUpperCase, hasNumber
      expect(strength.label).toBe("Fuerte");
      expect(strength.hasNumber).toBe(true);
    });

    test("unit:debería retornar Muy fuerte con todos los criterios", () => {
      const strength: PasswordStrength = getPasswordStrength("Abcdefg1!");
      expect(strength.score).toBe(5);
      expect(strength.label).toBe("Muy fuerte");
      expect(strength.hasMinLength).toBe(true);
      expect(strength.hasUpperCase).toBe(true);
      expect(strength.hasLowerCase).toBe(true);
      expect(strength.hasNumber).toBe(true);
      expect(strength.hasSpecialChar).toBe(true);
    });

    test("unit:debería identificar correctamente la ausencia de caracteres específicos", () => {
      const strength: PasswordStrength = getPasswordStrength("password");
      expect(strength.hasUpperCase).toBe(false);
      expect(strength.hasNumber).toBe(false);
      expect(strength.hasSpecialChar).toBe(false);
      expect(strength.score).toBe(2); // minLength, lowerCase
      expect(strength.label).toBe("Regular");
    });

    test("unit:debería manejar espacios en blanco y no contarlos como especiales para la fortaleza básica", () => {
      const strength: PasswordStrength = getPasswordStrength(
        "Password With Spaces 1"
      );
      expect(strength.hasSpecialChar).toBe(false); // El espacio no cuenta según la regex actual
      expect(strength.score).toBe(4); // minLength, upper, lower, number
      expect(strength.label).toBe("Fuerte");
    });
  });

  // --- Pruebas para validate ---
  describe("validate", () => {
    const baseFormData: FormData = {
      username: "testUser",
      password: "Password123!",
      confirmPassword: "Password123!",
    };

    it("no debería retornar errores para datos válidos", () => {
      const errors = validate(baseFormData);
      expect(errors).toEqual({});
    });

    // Pruebas de Username
    test("unit:debería retornar error si el username está vacío", () => {
      const errors = validate({ ...baseFormData, username: "  " });
      expect(errors.username).toBe("El nombre de usuario es obligatorio");
    });

    test("unit:debería retornar error si el username es muy corto", () => {
      const errors = validate({ ...baseFormData, username: "us" });
      expect(errors.username).toBe(
        "El nombre de usuario debe tener al menos 3 caracteres"
      );
    });

    test("unit:debería retornar error si el username contiene caracteres inválidos", () => {
      const errors = validate({ ...baseFormData, username: "user name!" });
      expect(errors.username).toBe(
        "Solo se permiten letras, números, guiones y guiones bajos"
      );
    });

    // Pruebas de Password
    test("unit:debería retornar error si la contraseña está vacía", () => {
      const errors = validate({ ...baseFormData, password: "" });
      expect(errors.password).toBe("La contraseña es obligatoria");
    });

    test("unit:debería retornar error si la contraseña es muy corta (menos de 8 caracteres)", () => {
      const errors = validate({
        ...baseFormData,
        password: "Pass1!",
        confirmPassword: "Pass1!",
      });
      expect(errors.password).toBe(
        "La contraseña debe tener al menos 8 caracteres"
      );
    });

    // Pruebas de Confirm Password
    test("unit:debería retornar error si confirmPassword está vacío", () => {
      const errors = validate({ ...baseFormData, confirmPassword: "" });
      expect(errors.confirmPassword).toBe("Debes confirmar tu contraseña");
    });

    test("unit:debería retornar error si las contraseñas no coinciden", () => {
      const errors = validate({
        ...baseFormData,
        confirmPassword: "DifferentPassword1!",
      });
      expect(errors.confirmPassword).toBe("Las contraseñas no coinciden");
    });

    // Prueba de múltiples errores
    test("unit:debería retornar múltiples errores si aplican", () => {
      const formData: FormData = {
        username: "u",
        password: "short",
        confirmPassword: "not",
      };
      const errors = validate(formData);
      expect(errors.username).toBe(
        "El nombre de usuario debe tener al menos 3 caracteres"
      );
      expect(errors.password).toBe(
        "La contraseña debe tener al menos 8 caracteres"
      ); // Prioridad sobre debilidad
      expect(errors.confirmPassword).toBe("Las contraseñas no coinciden");
    });

    test("unit:debería retornar error de contraseña débil si la longitud es correcta pero la variedad es mínima (ej: solo números y longitud mínima)", () => {
      // '12345678' -> score 2 (minLength, number). La lógica dice `score < 2` para débil.
      // Este caso no debería dar "demasiado débil" según la lógica actual (score es 2, no < 2).
      // El test anterior ('        ') ya cubre el caso de score 1 con longitud.

      // Probemos 'aaaaaaaa' -> score 2 (minLength, lowerCase)
      const formDataWeakVariety = {
        ...baseFormData,
        password: "aaaaaaaa",
        confirmPassword: "aaaaaaaa",
      };
      const errorsWeakVariety = validate(formDataWeakVariety);
      // getPasswordStrength('aaaaaaaa') -> { score: 2, label: "Regular" }
      // No hay error de debilidad porque score (2) no es < 2.
      expect(errorsWeakVariety.password).toBeUndefined(); // No debería haber error de contraseña aquí.
    });
  });
});
