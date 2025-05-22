import { useState, useMemo } from "react";

export const WithUseMemo = () => {
  console.log("Renderizando WithUseMemo");
  const [count, setCount] = useState(0);
  const [numbers] = useState([1, 2, 3, 4, 5]);

  // Memoriza el total y solo se recalcula si `numbers` cambia
  const total = useMemo(() => {
    console.log("Calculando total...");
    return numbers.reduce((sum, num) => sum + num, 0);
  }, [numbers]);

  return (
    <div>
      <p>Total: {total}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar {count}</button>
    </div>
  );
};
