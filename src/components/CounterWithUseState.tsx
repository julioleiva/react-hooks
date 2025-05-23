import { useState } from "react";

export function CounterWithUseState(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const [step, setStep] = useState<number>(1);

  const increment = (): void => {
    setCount(count + step);
  };

  const decrement = (): void => {
    setCount(count - step);
  };

  const updateStep = (newStep: number): void => {
    setStep(newStep);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <input
        type="number"
        value={step}
        onChange={(e) => updateStep(Number(e.target.value))}
      />
    </div>
  );
}
