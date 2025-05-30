/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // Safelist para asegurar que las clases dinámicas se incluyan
  safelist: [
    // Colores de fondo
    "bg-red-300",
    "bg-red-500",
    "bg-red-700",
    "bg-orange-300",
    "bg-orange-500",
    "bg-orange-700",
    "bg-yellow-300",
    "bg-yellow-500",
    "bg-yellow-700",
    "bg-green-300",
    "bg-green-500",
    "bg-green-700",
    "bg-blue-300",
    "bg-blue-500",
    "bg-blue-700",
    "bg-purple-300",
    "bg-purple-500",
    "bg-purple-700",
    "bg-pink-300",
    "bg-pink-500",
    "bg-pink-700",
    "bg-gray-300",
    "bg-gray-500",
    "bg-gray-700",

    // Otros colores que se usan dinámicamente
    "bg-red-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-purple-100",
    "text-red-800",
    "text-green-800",
    "text-blue-800",
    "text-purple-800",

    // Heights dinámicas
    "h-1",
    "h-2",
    "h-4",
    "h-8",
    "h-16",
  ],
};
