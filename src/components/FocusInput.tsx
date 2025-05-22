import { useRef, useEffect } from "react";

export const FocusInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // Enfoca el input al montar el componente
  }, []);

  return <input ref={inputRef} type="text" placeholder="Escribe aquí..." />;
};
