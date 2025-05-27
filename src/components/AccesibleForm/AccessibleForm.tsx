import React, { useState, useRef } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
  newsletter: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const AccessibleForm = (): JSX.Element => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    newsletter: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Por favor, introduce un correo electrónico válido";
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);

    // Focus en el primer campo con error
    if (newErrors.name && nameRef.current) {
      nameRef.current.focus();
    } else if (newErrors.email && emailRef.current) {
      emailRef.current.focus();
    } else if (newErrors.message && messageRef.current) {
      messageRef.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitMessage("Por favor, corrige los errores del formulario");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    // Simular envío
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage("¡Formulario enviado correctamente!");
      setFormData({ name: "", email: "", message: "", newsletter: false });
      setErrors({});
    }, 2000);
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <main role="main">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Formulario de Contacto
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Completa todos los campos marcados con asterisco (*) para enviar tu
          mensaje.
        </p>

        {/* Mensaje de estado - Región live para anuncios */}
        <div role="status" aria-live="polite" aria-atomic="true">
          {submitMessage && (
            <div
              className={`p-4 mb-6 rounded-lg border text-base font-medium ${
                submitMessage.includes("correctamente")
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2" aria-hidden="true">
                  {submitMessage.includes("correctamente") ? "✓" : "⚠"}
                </span>
                {submitMessage}
              </div>
            </div>
          )}
        </div>

        <div
          onSubmit={handleSubmit}
          role="form"
          aria-label="Formulario de contacto"
        >
          {/* Campo Nombre */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Nombre completo{" "}
              <span className="text-red-600" aria-label="obligatorio">
                *
              </span>
            </label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                  : "border-gray-400 focus:border-blue-600 focus:ring-blue-200 bg-white hover:border-gray-500"
              }`}
              placeholder="Introduce tu nombre completo"
            />
            {errors.name && (
              <div
                id="name-error"
                role="alert"
                className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded"
              >
                <p className="text-sm font-medium text-red-800 flex items-center">
                  <span className="mr-2" aria-hidden="true">
                    ⚠
                  </span>
                  {errors.name}
                </p>
              </div>
            )}
          </div>

          {/* Campo Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Correo electrónico{" "}
              <span className="text-red-600" aria-label="obligatorio">
                *
              </span>
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={`email-hint ${
                errors.email ? "email-error" : ""
              }`}
              className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                  : "border-gray-400 focus:border-blue-600 focus:ring-blue-200 bg-white hover:border-gray-500"
              }`}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
            />
            <p
              id="email-hint"
              className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
            >
              💡 Usaremos tu correo solo para responderte
            </p>
            {errors.email && (
              <div
                id="email-error"
                role="alert"
                className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded"
              >
                <p className="text-sm font-medium text-red-800 flex items-center">
                  <span className="mr-2" aria-hidden="true">
                    ⚠
                  </span>
                  {errors.email}
                </p>
              </div>
            )}
          </div>

          {/* Campo Mensaje */}
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-base font-semibold text-gray-900 mb-2"
            >
              Mensaje{" "}
              <span className="text-red-600" aria-label="obligatorio">
                *
              </span>
            </label>
            <textarea
              ref={messageRef}
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={`message-hint ${
                errors.message ? "message-error" : ""
              }`}
              className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-200 resize-vertical min-h-32 ${
                errors.message
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
                  : "border-gray-400 focus:border-blue-600 focus:ring-blue-200 bg-white hover:border-gray-500"
              }`}
              placeholder="Escribe tu mensaje aquí..."
            />
            <p
              id="message-hint"
              className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
            >
              📝 Mínimo 10 caracteres. Actual: {formData.message.length}
            </p>
            {errors.message && (
              <div
                id="message-error"
                role="alert"
                className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded"
              >
                <p className="text-sm font-medium text-red-800 flex items-center">
                  <span className="mr-2" aria-hidden="true">
                    ⚠
                  </span>
                  {errors.message}
                </p>
              </div>
            )}
          </div>

          {/* Checkbox Newsletter */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={(e) =>
                  handleInputChange("newsletter", e.target.checked)
                }
                className="h-5 w-5 text-blue-600 border-2 border-gray-400 rounded focus:ring-4 focus:ring-blue-200 focus:ring-offset-1 mt-1"
              />
              <label
                htmlFor="newsletter"
                className="ml-3 text-base text-gray-800 cursor-pointer leading-relaxed"
              >
                <span className="font-medium">Suscribirse al boletín</span>
                <br />
                <span className="text-sm text-gray-600">
                  Recibe actualizaciones ocasionales por correo electrónico
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            aria-describedby="submit-status"
            className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 transform ${
              isSubmitting
                ? "bg-gray-400 text-gray-700 cursor-not-allowed scale-95"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
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
                Enviando mensaje...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2" aria-hidden="true">
                  📧
                </span>
                Enviar mensaje
              </span>
            )}
          </button>

          <div
            id="submit-status"
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            {isSubmitting ? "Enviando formulario, por favor espera" : ""}
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Información sobre privacidad
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Tus datos personales serán tratados de forma confidencial y
            únicamente utilizados para responder a tu consulta. No compartimos
            información personal con terceros.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AccessibleForm;
