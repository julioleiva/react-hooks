import React from "react";

interface ConfirmPasswordFieldProps {
  value: string;
  passwordValue: string;
  error?: string;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const ConfirmPasswordField = React.forwardRef<
  HTMLInputElement,
  ConfirmPasswordFieldProps
>(
  (
    {
      value,
      passwordValue,
      error,
      showPassword,
      onChange,
      onToggleVisibility,
      onBlur,
    },
    ref
  ) => {
    const passwordsMatch = value && passwordValue === value;

    return (
      <div className="form-group mb-8">
        <label
          htmlFor="confirmPassword"
          className="block text-base font-semibold text-gray-900 mb-2"
        >
          Confirmar contraseña{" "}
          <span className="text-red-600" aria-label="obligatorio">
            *
          </span>
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={`confirm-hint ${
              error ? "confirm-password-error" : ""
            }`}
            autoComplete="new-password"
            className={`w-full px-4 py-3 pr-12 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                : passwordsMatch
                ? "border-green-500 focus:border-green-500 focus:ring-green-200 bg-green-50"
                : "border-gray-400 focus:border-blue-600 focus:ring-blue-200 bg-white hover:border-gray-500"
            }`}
            placeholder="Repite tu contraseña"
          />
          <button
            type="button"
            onClick={onToggleVisibility}
            aria-label={
              showPassword
                ? "Ocultar confirmación de contraseña"
                : "Mostrar confirmación de contraseña"
            }
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100"
          >
            <span className="text-xl" aria-hidden="true">
              {showPassword ? "🙈" : "👁️"}
            </span>
          </button>
        </div>

        {/* Muestra el mensaje de coincidencia/no coincidencia solo si hay valor */}
        {value && (
          <p
            id="confirm-hint" // Este ID es usado por aria-describedby
            className={`mt-2 text-sm p-2 rounded ${
              passwordsMatch
                ? "text-green-700 bg-green-50"
                : "text-orange-700 bg-orange-50"
            }`}
          >
            {passwordsMatch
              ? "✓ Las contraseñas coinciden"
              : "⚠ Las contraseñas no coinciden"}
          </p>
        )}

        {error && (
          <div
            id="confirm-password-error"
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
      </div>
    );
  }
);

ConfirmPasswordField.displayName = "ConfirmPasswordField";
