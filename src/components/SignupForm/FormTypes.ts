export interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  label: string; // Ej: "Muy débil", "Débil", "Moderada", "Fuerte", "Muy fuerte"
  score: number; // Ej: 0, 1, 2, 3, 4
}
