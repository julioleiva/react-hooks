import React from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  onSubmit,
}) => {
  return (
    <>
      <button
        type="submit"
        onClick={onSubmit}
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
    </>
  );
};
