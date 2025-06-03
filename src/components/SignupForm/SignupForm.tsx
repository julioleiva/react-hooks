import React, { useState, useRef, useEffect } from "react";
import type { FormData, FormErrors } from "./FormTypes";
import { useFormValidation } from "./hooks/useFormValidation";
import { ErrorSummary } from "./components/ErrorSummary";
import { StatusMessage } from "./components/StatusMessage";
import { UsernameField } from "./components/UsernameField";
import { PasswordField } from "./components/PasswordField";
import { ConfirmPasswordField } from "./components/ConfirmPasswordField";
import { SubmitButton } from "./components/SubmitButton";
import { SecurityTips } from "./components/SecurityTips";

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

  const { validate, getPasswordStrength } = useFormValidation();
  const passwordStrength = getPasswordStrength(formData.password);

  // En SignupForm.tsx
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // LOG MUY IMPORTANTE:
    console.log(
      `[SignupForm handleChange] Name: "<span class="math-inline">\{name\}", Value\: "</span>{value}"`
    );

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      // LOG MUY IMPORTANTE:
      console.log(
        `[SignupForm handleChange] setFormData para "<span class="math-inline">\{name\}", nuevo valor en estado \(potencial\)\: "</span>{newData[name as keyof FormData]}"`
      );
      return newData;
    });

    if (errors[name as keyof FormErrors]) {
      console.log(`[SignupForm handleChange] Limpiando error para: ${name}`);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    // Validar solo el campo que ha perdido el foco.
    // Pasamos el formData completo para que la función validate tenga acceso a todos los valores
    // (es importante para la validación de confirmación de contraseña, por ejemplo).
    const fieldErrors = validate(formData); // validate devuelve todos los errores, escogeremos el específico

    // Si hay un error para el campo que perdió el foco, actualizar el estado de errores.
    if (fieldErrors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name as keyof FormErrors],
      }));
    } else {
      // Si el campo es ahora válido (no hay error para él), asegúrate de que el error se elimine del estado.
      setErrors((prev) => {
        const newErrors = { ...prev };

        delete newErrors[name as keyof FormErrors]; // Elimina la propiedad si no hay error
        return newErrors;
      });
    }
  };

  const handleErrorClick = (field: keyof FormErrors) => {
    if (field === "username" && usernameRef.current) {
      usernameRef.current.focus();
    } else if (field === "password" && passwordRef.current) {
      passwordRef.current.focus();
    } else if (field === "confirmPassword" && confirmPasswordRef.current) {
      confirmPasswordRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
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
      handleErrorClick(Object.keys(validationErrors)[0] as keyof FormErrors);
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [errors]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <main role="main">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Crear cuenta
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Completa el formulario para registrarte
        </p>

        <StatusMessage message={submitStatus} />

        <div role="form" aria-label="Formulario de registro">
          <ErrorSummary
            ref={errorSummaryRef}
            errors={errors}
            onErrorClick={handleErrorClick}
          />

          <UsernameField
            ref={usernameRef}
            value={formData.username}
            error={errors.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <PasswordField
            ref={passwordRef}
            value={formData.password}
            error={errors.password}
            showPassword={showPassword}
            strength={passwordStrength}
            onChange={handleChange}
            onBlur={handleBlur}
            onToggleVisibility={() => setShowPassword(!showPassword)}
          />

          <ConfirmPasswordField
            ref={confirmPasswordRef}
            value={formData.confirmPassword}
            passwordValue={formData.password}
            error={errors.confirmPassword}
            showPassword={showConfirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            onToggleVisibility={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <SubmitButton isSubmitting={isSubmitting} onSubmit={handleSubmit} />
        </div>

        <SecurityTips />
      </main>
    </div>
  );
};

export default SignupForm;
