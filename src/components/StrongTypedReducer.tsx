import { useReducer } from "react";

// Definición de tipos para un formulario
interface FormState {
  username: string;
  email: string;
  password: string;
  isSubmitting: boolean;
  errors: {
    username?: string;
    email?: string;
    password?: string;
  };
}

// Unión discriminada para acciones
type FormAction =
  | {
      type: "SET_FIELD";
      field: keyof Omit<FormState, "errors" | "isSubmitting">;
      value: string;
    }
  | { type: "SET_ERROR"; field: keyof FormState["errors"]; error: string }
  | { type: "CLEAR_ERROR"; field: keyof FormState["errors"] }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_FAILURE" };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case "CLEAR_ERROR": {
      const { [action.field]: _, ...restErrors } = state.errors;
      return { ...state, errors: restErrors };
    }
    case "SUBMIT_START":
      return { ...state, isSubmitting: true };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        username: "",
        email: "",
        password: "",
        errors: {},
      };
    case "SUBMIT_FAILURE":
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
}

// Estado inicial del formulario
const initialState: FormState = {
  username: "",
  email: "",
  password: "",
  isSubmitting: false,
  errors: {},
};

// Funciones de validación
const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "El email es requerido";
  if (!emailRegex.test(email)) return "El email no es válido";
  return undefined;
};

const validateUsername = (username: string): string | undefined => {
  if (!username) return "El nombre de usuario es requerido";
  if (username.length < 3)
    return "El nombre de usuario debe tener al menos 3 caracteres";
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return "La contraseña es requerida";
  if (password.length < 6)
    return "La contraseña debe tener al menos 6 caracteres";
  return undefined;
};

export default function FormComponent() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleFieldChange = (
    field: keyof Omit<FormState, "errors" | "isSubmitting">,
    value: string
  ) => {
    dispatch({ type: "SET_FIELD", field, value });

    // Limpiar error cuando el usuario empiece a escribir
    if (state.errors[field]) {
      dispatch({ type: "CLEAR_ERROR", field });
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    const usernameError = validateUsername(state.username);
    if (usernameError) {
      dispatch({ type: "SET_ERROR", field: "username", error: usernameError });
      isValid = false;
    }

    const emailError = validateEmail(state.email);
    if (emailError) {
      dispatch({ type: "SET_ERROR", field: "email", error: emailError });
      isValid = false;
    }

    const passwordError = validatePassword(state.password);
    if (passwordError) {
      dispatch({ type: "SET_ERROR", field: "password", error: passwordError });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    dispatch({ type: "SUBMIT_START" });

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular éxito (puedes cambiar esto para probar errores)
      const success = Math.random() > 0.3;

      if (success) {
        dispatch({ type: "SUBMIT_SUCCESS" });
        alert("¡Formulario enviado exitosamente!");
      } else {
        throw new Error("Error en el servidor");
      }
    } catch (error) {
      dispatch({ type: "SUBMIT_FAILURE" });
      dispatch({
        type: "SET_ERROR",
        field: "email",
        error: "Error al enviar el formulario. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Completa todos los campos para registrarte
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={state.username}
                onChange={(e) => handleFieldChange("username", e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  state.errors.username ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Ingresa tu nombre de usuario"
                disabled={state.isSubmitting}
              />
              {state.errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={state.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  state.errors.email ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Ingresa tu email"
                disabled={state.isSubmitting}
              />
              {state.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={state.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  state.errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Ingresa tu contraseña"
                disabled={state.isSubmitting}
              />
              {state.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={state.isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                state.isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              } transition duration-150 ease-in-out`}
            >
              {state.isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </div>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </div>

          {/* Form State Debug Info (opcional, para desarrollo) */}
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs">
            <details>
              <summary className="cursor-pointer text-gray-600">
                Ver estado del formulario
              </summary>
              <pre className="mt-2 text-gray-800">
                {JSON.stringify(state, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
