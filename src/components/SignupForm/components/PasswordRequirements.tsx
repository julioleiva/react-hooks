import React from "react";
// Import the PasswordStrength interface
import type { PasswordStrength } from "../FormTypes"; // Adjust path if needed

interface PasswordRequirementsProps {
  // MODIFICADO: Ahora recibe el objeto strength en lugar de solo la contraseña
  strength: PasswordStrength;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  // MODIFICADO: Desestructura strength
  strength,
}) => {
  // MODIFICADO: Define los requisitos usando las propiedades del objeto strength
  const requirements = [
    {
      test: strength.hasMinLength,
      text: "Al menos 8 caracteres",
    },
    {
      test: strength.hasUpperCase,
      text: "Una letra mayúscula",
    },
    {
      test: strength.hasLowerCase,
      text: "Una letra minúscula",
    },
    {
      test: strength.hasNumber,
      text: "Un número",
    },
    {
      // AÑADIDO: Incluir la validación de carácter especial si tu `useFormValidation` la tiene
      test: strength.hasSpecialChar,
      text: "Un carácter especial (!@#$%^&*)",
    },
  ];

  return (
    <div
      id="password-requirements"
      className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded"
    >
      <p className="font-medium mb-2">📋 Requisitos de contraseña:</p>
      <ul className="space-y-1 text-xs">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={req.test ? "text-green-600" : "text-gray-600"}
          >
            {req.test ? "✓" : "○"} {req.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
