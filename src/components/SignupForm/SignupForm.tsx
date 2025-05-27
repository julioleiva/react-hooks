import React, { useState, useRef, useEffect } from "react";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupForm = (): JSX.Element => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = ["Muy débil", "Débil", "Regular", "Buena", "Muy fuerte"];
    const colors = [
      "text-red-600",
      "text-orange-500",
      "text-yellow-500",
      "text-blue-600",
      "text-green-600",
    ];

    return {
      level: levels[strength] || "Muy débil",
      color: colors[strength] || "text-red-600",
      score: strength,
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validación username
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    } else if (formData.username.trim().length < 3) {
      newErrors.username =
        "El nombre de usuario debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username =
        "Solo se permiten letras, números, guiones y guiones bajos";
    }

    // Validación password
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (passwordStrength.score < 2) {
      newErrors.password =
        "La contraseña es demasiado débil. Incluye mayúsculas, minúsculas y números";
    }

    // Validación confirmPassword
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Limpiar error específico cuando el usuario empiece a corregir
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Simular API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setSubmitStatus("¡Registro completado exitosamente! Bienvenido/a.");
        setFormData({ username: "", password: "", confirmPassword: "" });
        console.log("Formulario enviado:", formData);
      } catch {
        setSubmitStatus("Error al registrar. Por favor, inténtalo de nuevo.");
      }
    } else {
      setSubmitStatus(
        "Por favor, corrige los errores indicados en el formulario."
      );

      // Enfocar el primer campo con error
      const firstErrorField = Object.keys(
        validationErrors
      )[0] as keyof FormErrors;
      if (firstErrorField === "username" && usernameRef.current) {
        usernameRef.current.focus();
      } else if (firstErrorField === "password" && passwordRef.current) {
        passwordRef.current.focus();
      } else if (
        firstErrorField === "confirmPassword" &&
        confirmPasswordRef.current
      ) {
        confirmPasswordRef.current.focus();
      }
    }

    setIsSubmitting(false);
  };

  // Enfocar resumen de errores cuando aparece
  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [errors]);

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <main role="main">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Crear cuenta
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Completa el formulario para registrarte
        </p>

        {/* Región de estado para anuncios */}
        <div role="status" aria-live="polite" aria-atomic="true">
          {submitStatus && (
            <div
              className={`p-4 mb-6 rounded-lg border font-medium ${
                submitStatus.includes("exitosamente")
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2" aria-hidden="true">
                  {submitStatus.includes("exitosamente") ? "✓" : "⚠"}
                </span>
                {submitStatus}
              </div>
            </div>
          )}
        </div>

        <div
          onSubmit={handleSubmit}
          role="form"
          aria-label="Formulario de registro"
        >
          {/* Resumen de errores para lectores de pantalla */}
          {Object.keys(errors).length > 0 && (
            <div
              ref={errorSummaryRef}
              className="error-summary mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg"
              role="alert"
              tabIndex={-1}
              aria-labelledby="error-summary-title"
            >
              <h2
                id="error-summary-title"
                className="text-lg font-semibold text-red-800 mb-3 flex items-center"
              >
                <span className="mr-2" aria-hidden="true">
                  ⚠
                </span>
                Errores en el formulario
              </h2>
              <p className="text-sm text-red-700 mb-3">
                Por favor, corrige los siguientes errores:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="text-sm text-red-700">
                    <button
                      type="button"
                      onClick={() => {
                        if (field === "username" && usernameRef.current)
                          usernameRef.current.focus();
                        if (field === "password" && passwordRef.current)
                          passwordRef.current.focus();
                        if (
                          field === "confirmPassword" &&
                          confirmPasswordRef.current
                        )
                          confirmPasswordRef.current.focus();
                      }}
                      className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
                    >
                      {error}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Campo Usuario */}
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
              ref={usernameRef}
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.username}
              aria-describedby={`username-hint ${
                errors.username ? "username-error" : ""
              }`}
              autoComplete="username"
              className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 ${
                errors.username
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
            {errors.username && (
              <div
                id="username-error"
                className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded"
                role="alert"
              >
                <p className="text-sm font-medium text-red-800 flex items-center">
                  <span className="mr-2" aria-hidden="true">
                    ⚠
                  </span>
                  {errors.username}
                </p>
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
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
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={`password-requirements password-strength ${
                  errors.password ? "password-error" : ""
                }`}
                autoComplete="new-password"
                className={`w-full px-4 py-3 pr-12 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                    : "border-gray-400 focus:border-blue-600 focus:ring-blue-200 bg-white hover:border-gray-500"
                }`}
                placeholder="Crea una contraseña segura"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100"
              >
                <span className="text-xl" aria-hidden="true">
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </button>
            </div>

            <div
              id="password-requirements"
              className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded"
            >
              <p className="font-medium mb-2">📋 Requisitos de contraseña:</p>
              <ul className="space-y-1 text-xs">
                <li
                  className={
                    formData.password.length >= 8
                      ? "text-green-600"
                      : "text-gray-600"
                  }
                >
                  {formData.password.length >= 8 ? "✓" : "○"} Al menos 8
                  caracteres
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password)
                      ? "text-green-600"
                      : "text-gray-600"
                  }
                >
                  {/[A-Z]/.test(formData.password) ? "✓" : "○"} Una letra
                  mayúscula
                </li>
                <li
                  className={
                    /[a-z]/.test(formData.password)
                      ? "text-green-600"
                      : "text-gray-600"
                  }
                >
                  {/[a-z]/.test(formData.password) ? "✓" : "○"} Una letra
                  minúscula
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password)
                      ? "text-green-600"
                      : "text-gray-600"
                  }
                >
                  {/[0-9]/.test(formData.password) ? "✓" : "○"} Un número
                </li>
              </ul>
            </div>

            {formData.password && (
              <div
                id="password-strength"
                className="mt-2 p-2 bg-white border border-gray-200 rounded"
              >
                <p className="text-sm">
                  <span className="font-medium">Fortaleza: </span>
                  <span className={`font-bold ${passwordStrength.color}`}>
                    {passwordStrength.level}
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 1
                        ? "bg-red-500"
                        : passwordStrength.score <= 2
                        ? "bg-yellow-500"
                        : passwordStrength.score <= 3
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {errors.password && (
              <div
                id="password-error"
                className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded"
                role="alert"
              >
                <p className="text-sm font-medium text-red-800 flex items-center">
                  <span className="mr-2" aria-hidden="true">
                    ⚠
                  </span>
                  {errors.password}
                </p>
              </div>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
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
                ref={confirmPasswordRef}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={`confirm-hint ${
                  errors.confirmPassword ? "confirm-password-error" : ""
                }`}
                autoComplete="new-password"
                className={`w-full px-4 py-3 pr-12 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                    : formData.confirmPassword &&
                      formData.password === formData.confirmPassword
                    ? "border-green-500 focus:border-green-500 focus:ring-green-200 bg-green-50"
                    : "border-gray-400 focus:border-blue-600 focus:ring-blue-200 bg-white hover:border-gray-500"
                }`}
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar confirmación de contraseña"
                    : "Mostrar confirmación de contraseña"
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100"
              >
                <span className="text-xl" aria-hidden="true">
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </button>
            </div>

            {formData.confirmPassword && (
              <p
                id="confirm-hint"
                className={`mt-2 text-sm p-2 rounded ${
                  formData.password === formData.confirmPassword
                    ? "text-green-700 bg-green-50"
                    : "text-orange-700 bg-orange-50"
                }`}
              >
                {formData.password === formData.confirmPassword
                  ? "✓ Las contraseñas coinciden"
                  : "⚠ Las contraseñas no coinciden"}
              </p>
            )}

            {errors.confirmPassword && (
              <div
                id="confirm-password-error"
                className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded"
                role="alert"
              >
                <p className="text-sm font-medium text-red-800 flex items-center">
                  <span className="mr-2" aria-hidden="true">
                    ⚠
                  </span>
                  {errors.confirmPassword}
                </p>
              </div>
            )}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            aria-describedby="submit-status"
            className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 transform ${
              isSubmitting
                ? "bg-gray-400 text-gray-700 cursor-not-allowed scale-95"
                : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creando cuenta...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2" aria-hidden="true">
                  👤
                </span>
                Registrarse
              </span>
            )}
          </button>

          <div
            id="submit-status"
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            {isSubmitting ? "Procesando registro, por favor espera" : ""}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-base font-semibold text-blue-900 mb-2">
            💡 Consejos de seguridad
          </h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Usa una contraseña única que no uses en otros sitios</li>
            <li>• Combina letras, números y símbolos especiales</li>
            <li>• Evita información personal fácil de adivinar</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SignupForm;
