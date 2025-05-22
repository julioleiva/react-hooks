import { useState, useCallback } from "react";
import { ChildComponent } from "./ChildComponent";

export const WithUseCallback = () => {
  const [count, setCount] = useState(0);

  // Memoriza la función y solo se vuelve a crear si `count` cambia
  const handleClick = useCallback(() => {
    console.log("Botón presionado");
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Incrementar {count}</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
};
