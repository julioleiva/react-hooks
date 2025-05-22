import { useState } from "react";
import { ChildComponent } from "./ChildComponent";

export const WithoutUseCallback = () => {
  const [count, setCount] = useState(0);

  // Esta función se re-crea en cada render
  const handleClick = () => {
    console.log("Botón presionado");
  };

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Incrementar {count}</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
};
