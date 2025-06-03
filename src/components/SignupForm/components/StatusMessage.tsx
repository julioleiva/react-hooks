import React from "react";

interface StatusMessageProps {
  message: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  if (!message) return null;

  const isSuccess = message.includes("exitosamente");

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      <div
        className={`p-4 mb-6 rounded-lg border font-medium ${
          isSuccess
            ? "bg-green-50 border-green-300 text-green-800"
            : "bg-red-50 border-red-300 text-red-800"
        }`}
      >
        <div className="flex items-center">
          <span className="mr-2" aria-hidden="true">
            {isSuccess ? "✓" : "⚠"}
          </span>
          {message}
        </div>
      </div>
    </div>
  );
};
