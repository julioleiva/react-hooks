import React from "react";

export const SecurityTips: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h2 className="text-base font-semibold text-blue-900 mb-2">
        💡 Consejos de seguridad
      </h2>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• Usa una contraseña única que no uses en otros sitios</li>
        <li>• Combina letras, números y símbolos especiales</li>
        <li>• Evita información personal fácil de adivinar</li>
      </ul>
    </div>
  );
};
