import React from "react";
import type { PasswordStrength } from "../FormTypes";

interface PasswordStrengthIndicatorProps {
  password: string;
  strength: PasswordStrength;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, strength }) => {
  if (!password) return null;

  return (
    <div
      id="password-strength"
      className="mt-2 p-2 bg-white border border-gray-200 rounded"
    >
      <p className="text-sm">
        <span className="font-medium">Fortaleza: </span>
        <span className={`font-bold ${strength.color}`}>{strength.level}</span>
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            strength.score <= 1
              ? "bg-red-500"
              : strength.score <= 2
              ? "bg-yellow-500"
              : strength.score <= 3
              ? "bg-blue-500"
              : "bg-green-500"
          }`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};
