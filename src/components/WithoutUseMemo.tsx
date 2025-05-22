import { useState } from "react";

export const WithoutUseMemo = () => {
  console.log("Renderizando WithoutUseMemo");
  const [count, setCount] = useState(0);
  const [numbers] = useState([1, 2, 3, 4, 5]);

  // Cálculo costoso que se ejecuta en cada render
  const total = numbers.reduce((sum, num) => {
    console.log("Recalculando total...");
    return sum + num;
  }, 0);

  return (
    <div>
      <p>Total: {total}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar {count}</button>
    </div>
  );
};
