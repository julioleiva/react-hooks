import React from "react";

interface UsernameFieldProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onBlur prop para manejar la validación cuando el campo pierde el foco
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const UsernameField = React.forwardRef<
  HTMLInputElement,
  UsernameFieldProps
>(({ value, error, onChange, onBlur }, ref) => {
  return (
    <div className="form-group mb-6">
      <label
        htmlFor="username"
        className="block text-base font-semibold text-gray-900 mb-2"
      >
        Nombre de usuario{" "}
        <span className="text-red-600" aria-label="obligatorio">
          *
        </span>
      </label>
      <input
        ref={ref}
        type="text"
        id="username"
        name="username"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={`username-hint ${error ? "username-error" : ""}`}
        autoComplete="username"
        className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
            : "border-gray-400 focus:border-blue-600 focus:ring-blue-200 bg-white hover:border-gray-500"
        }`}
        placeholder="Elige tu nombre de usuario"
      />
      <p
        id="username-hint"
        className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
      >
        💡 Mínimo 3 caracteres. Solo letras, números, - y _
      </p>
      {error && (
        <div
          id="username-error"
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
});

UsernameField.displayName = "UsernameField";
