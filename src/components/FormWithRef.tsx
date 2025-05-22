import { useRef } from "react";

export const FormWithRef = () => {
  console.log("FormWithRef renderizado");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(`Valor ingresado: ${inputRef.current?.value}`);
    inputRef.current!.value = ""; // Limpiar el campo sin re-renderizar
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="text" placeholder="Escribe algo..." />
      <button type="submit">Enviar</button>
    </form>
  );
};
