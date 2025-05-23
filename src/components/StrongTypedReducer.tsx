import { useReducer } from "react";
import styles from "./FormComponent.module.css";

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
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Crear cuenta</h2>
          <p className={styles.subtitle}>
            Completa todos los campos para registrarte
          </p>
        </div>

        <div className={styles.formSection}>
          <div className={styles.fieldsContainer}>
            {/* Username Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="username" className={styles.label}>
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={state.username}
                onChange={(e) => handleFieldChange("username", e.target.value)}
                className={`${styles.input} ${
                  state.errors.username ? styles.inputError : ""
                }`}
                placeholder="Ingresa tu nombre de usuario"
                disabled={state.isSubmitting}
              />
              {state.errors.username && (
                <p className={styles.errorMessage}>{state.errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={state.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className={`${styles.input} ${
                  state.errors.email ? styles.inputError : ""
                }`}
                placeholder="Ingresa tu email"
                disabled={state.isSubmitting}
              />
              {state.errors.email && (
                <p className={styles.errorMessage}>{state.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={state.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                className={`${styles.input} ${
                  state.errors.password ? styles.inputError : ""
                }`}
                placeholder="Ingresa tu contraseña"
                disabled={state.isSubmitting}
              />
              {state.errors.password && (
                <p className={styles.errorMessage}>{state.errors.password}</p>
              )}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={state.isSubmitting}
              className={`${styles.submitButton} ${
                state.isSubmitting ? styles.submitButtonDisabled : ""
              }`}
            >
              {state.isSubmitting ? (
                <div className={styles.loadingContainer}>
                  <svg
                    className={styles.loadingSpinner}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className={styles.spinnerCircle}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className={styles.spinnerPath}
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

          <div className={styles.debugSection}>
            <details>
              <summary className={styles.debugSummary}>
                Ver estado del formulario
              </summary>
              <pre className={styles.debugContent}>
                {JSON.stringify(state, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
