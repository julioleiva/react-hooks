import { useState } from "react";

export const App = () => {
  const [count, setCount] = useState(0);

  // Forma incorrecta (puede causar problemas en actualizaciones asíncronas)
  const incrementUnsafe = () => {
    setCount(count + 1);
    setCount(count + 1); // Esto no sumará 2, sino solo 1
  };

  // Forma correcta (usa el estado anterior garantizado)
  const incrementSafe = () => {
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1); // Esto sí sumará 2
  };

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={incrementUnsafe}>Incrementar (Inseguro)</button>
      <button onClick={incrementSafe}>Incrementar (Seguro)</button>
    </div>
  );
};

export default App;
