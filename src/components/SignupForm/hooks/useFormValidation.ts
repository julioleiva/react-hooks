// En hooks/useFormValidation.ts

import type { FormData, FormErrors, PasswordStrength } from "../FormTypes";
export const useFormValidation = () => {
  const getPasswordStrength = (password: string): PasswordStrength => {
    // Calcula cada criterio individualmente
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9\s]/.test(password);

    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    const labels = [
      "Muy débil", // score 0 (o 1 si se considera que 0 es 'sin contraseña')
      "Débil", // score 1 (o 2)
      "Regular", // score 2 (o 3)
      "Buena", // score 3 (o 4)
      "Fuerte", // score 4 (o 5)
      "Muy fuerte", // score 5 (o si quieres un nivel más)
    ];

    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      label: labels[score] || "Muy débil",
      score: score,
    };
  };

  const validate = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    const passwordStrengthData = getPasswordStrength(formData.password);

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    } else if (formData.username.trim().length < 3) {
      newErrors.username =
        "El nombre de usuario debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = // Este es el mensaje que el test buscará
        "Solo se permiten letras, números, guiones y guiones bajos";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (!passwordStrengthData.hasMinLength) {
      // Usar las propiedades booleanas
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (passwordStrengthData.score < 2) {
      // Un score de 0 o 1 se considera muy débil/débil
      newErrors.password =
        "La contraseña es demasiado débil. Incluye más variedad de caracteres.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    return newErrors;
  };

  return {
    validate,
    getPasswordStrength,
  };
};
