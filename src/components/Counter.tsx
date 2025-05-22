import { useRef, useState } from "react";

export const Counter = () => {
  // useRef se utiliza para mantener un valor mutable que no causa un nuevo renderizado
  console.log("Counter renderizado");
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  renderCount.current += 1;

  // Cambia renderCount sin causar re-render
  const incrementRenderCount = () => {
    renderCount.current += 1;
    console.log("RenderCount ahora es:", renderCount.current);
  };

  return (
    <div>
      <p>Has hecho click {count} veces.</p>
      <p>El componente se ha renderizado {renderCount.current} veces.</p>
      <button onClick={() => setCount(count + 1)}>Incrementar count</button>
      <button onClick={incrementRenderCount}>
        Incrementar renderCount (sin re-render)
      </button>
    </div>
  );
};
