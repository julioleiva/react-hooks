import React from "react";
import type { FormErrors } from "../FormTypes";

interface ErrorSummaryProps {
  errors: FormErrors;
  onErrorClick: (field: keyof FormErrors) => void;
}

export const ErrorSummary = React.forwardRef<HTMLDivElement, ErrorSummaryProps>(
  ({ errors, onErrorClick }, ref) => {
    if (Object.keys(errors).length === 0) return null;

    return (
      <div
        ref={ref}
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
                onClick={() => onErrorClick(field as keyof FormErrors)}
                className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
              >
                {error}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

ErrorSummary.displayName = "ErrorSummary";
