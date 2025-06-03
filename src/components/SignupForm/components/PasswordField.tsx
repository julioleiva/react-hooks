import React from "react";
import type { PasswordStrength } from "../FormTypes"; // Ajusta la ruta si es necesario
import { PasswordRequirements } from "./PasswordRequirements";

interface PasswordFieldProps {
  value: string;
  error?: string;
  showPassword: boolean;
  strength: PasswordStrength; // Este objeto viene de useFormValidation y debe tener .score y .label
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const PasswordField = React.forwardRef<
  HTMLInputElement,
  PasswordFieldProps
>(
  (
    {
      value,
      error,
      showPassword,
      strength,
      onChange,
      onToggleVisibility,
      onBlur,
    },
    ref
  ) => {
    // Función para obtener la clase de color del TEXTO de fortaleza.
    const getStrengthTextColorClass = (
      // Renombrada para mayor claridad
      currentStrength: PasswordStrength
    ): string => {
      // Asumimos que strength.score va de 0 (sin contraseña o muy débil) a 5 (muy fuerte)
      // y que la interfaz PasswordStrength tiene un `label` y un `score`.
      switch (currentStrength.score) {
        case 0: // Muy débil (ej. vacío o solo 1 criterio)
        case 1: // Débil (ej. 1 o 2 criterios)
          return "text-red-600";
        case 2: // Regular
          return "text-orange-500"; // Cambiado de text-orange-600 para consistencia con la barra
        case 3: // Buena
          return "text-yellow-500"; // Cambiado de text-yellow-600
        case 4: // Fuerte
        case 5: // Muy Fuerte / Excelente (score máximo)
          return "text-green-600"; // Color verde para los niveles más altos
        default: // Caso inesperado o inicial
          return "text-gray-600";
      }
    };

    // Función para obtener el ANCHO de la BARRA de fortaleza.
    const getStrengthBarWidth = (currentStrength: PasswordStrength): string => {
      // Si el score máximo es 5 (0-5 son 6 niveles de fortaleza, incluyendo "sin contraseña" o "muy débil" como score 0).
      // El ancho debe ser un porcentaje del score sobre el máximo posible (5).
      if (!currentStrength || typeof currentStrength.score === "undefined") {
        return "0%"; // Estado inicial o inválido
      }
      const maxScore = 5; // Define el score máximo para el 100% de la barra
      const percentage = (currentStrength.score / maxScore) * 100;
      return `${Math.min(Math.max(percentage, 0), 100)}%`; // Asegura que esté entre 0% y 100%
    };

    // Función para obtener la clase de color de la BARRA de fortaleza.
    const getStrengthBarColorClass = (
      currentStrength: PasswordStrength
    ): string => {
      if (!currentStrength || typeof currentStrength.score === "undefined") {
        return "bg-gray-300"; // Estado inicial o inválido
      }
      switch (currentStrength.score) {
        case 0: // Muy débil (la barra podría ser invisible o roja muy corta)
          return "bg-red-500";
        case 1: // Débil
          return "bg-red-500";
        case 2: // Regular
          return "bg-orange-500";
        case 3: // Buena
          return "bg-yellow-500"; // Un amarillo o un verde más claro
        case 4: // Fuerte
        case 5: // Muy Fuerte / Excelente
          return "bg-green-500"; // Verde para los niveles más altos
        default: // Si score es > 5 (inesperado) o < 0
          return "bg-gray-300";
      }
    };

    return (
      <div className="form-group mb-6">
        <label
          htmlFor="password"
          className="block text-base font-semibold text-gray-900 mb-2"
        >
          Contraseña{" "}
          <span className="text-red-600" aria-label="obligatorio">
            *
          </span>
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={`password-requirements password-strength ${
              error ? "password-error" : ""
            }`}
            autoComplete="new-password"
            className={`w-full px-4 py-3 pr-12 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                : "border-gray-400 focus:border-blue-600 focus:ring-blue-200 bg-white hover:border-gray-500"
            }`}
            placeholder="Crea una contraseña segura"
          />
          <button
            type="button"
            onClick={onToggleVisibility}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100"
          >
            <span aria-hidden="true" className="text-xl">
              {showPassword ? "🙈" : "👁️"}
            </span>
          </button>
        </div>

        {error && (
          <div
            id="password-error" // ID para aria-describedby
            className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded"
            role="alert"
          >
            <p className="text-sm font-medium text-red-800 flex items-center">
              <span className="mr-2" aria-hidden="true">
                ⚠
              </span>
              {error}
            </p>
          </div>
        )}

        {/* Componente que muestra los requisitos ✓/○ */}
        {/* Asegúrate que el prop `strength` que se le pasa aquí tenga las propiedades booleanas
            (hasMinLength, hasUpperCase, etc.) que `PasswordRequirements` espera. */}
        <PasswordRequirements strength={strength} />

        {/* Indicador de fortaleza de contraseña (texto y barra) */}
        {/* Se muestra solo si hay un valor en la contraseña, para no mostrarlo inicialmente vacío */}
        {value &&
          strength && ( // Añadida comprobación de `value` y `strength` para evitar errores si son undefined
            <div
              id="password-strength" // ID para aria-describedby
              className="mt-2 p-2 bg-white border border-gray-200 rounded"
            >
              <p className="text-sm">
                <span className="font-medium">Fortaleza: </span>
                {/* El label (ej. "Muy fuerte") y su color vienen del objeto strength */}
                <span
                  className={`font-bold ${getStrengthTextColorClass(strength)}`}
                >
                  {strength.label || "Indeterminada"}{" "}
                  {/* Fallback por si strength.label no está */}
                </span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColorClass(
                    strength
                  )}`}
                  style={{ width: getStrengthBarWidth(strength) }}
                  role="progressbar" // Añadido rol para accesibilidad
                  aria-valuenow={strength.score} // Valor actual
                  aria-valuemin={0} // Valor mínimo
                  aria-valuemax={5} // Valor máximo (ajustar si el score máximo es diferente)
                  aria-label={`Fortaleza de la contraseña: ${
                    strength.label || "Indeterminada"
                  }`}
                />
              </div>
            </div>
          )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
