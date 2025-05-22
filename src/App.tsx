import { useState } from "react";
import { TodoDetail } from "./components/TodoDetail";

function App(): JSX.Element {
  const [currentTodoId, setCurrentTodoId] = useState<number>(1);

  let nonStateProp = "initial value";

  function handleNonStatePropChange() {
    nonStateProp = "new value";
    console.log("Non-state prop changed:", nonStateProp);
  }

  console.log(`🏠 App renderizándose con currentTodoId: ${currentTodoId}`);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🎯 Demostración useEffect - Array de Dependencias</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Controles para cambiar todoId:</h3>
        <button
          onClick={() => setCurrentTodoId(1)}
          style={{
            margin: "5px",
            padding: "10px 15px",
            backgroundColor: currentTodoId === 1 ? "#3b82f6" : "#e5e7eb",
            color: currentTodoId === 1 ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Todo #1
        </button>

        <button
          onClick={() => setCurrentTodoId(2)}
          style={{
            margin: "5px",
            padding: "10px 15px",
            backgroundColor: currentTodoId === 2 ? "#3b82f6" : "#e5e7eb",
            color: currentTodoId === 2 ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Todo #2
        </button>

        <button
          onClick={() => setCurrentTodoId(3)}
          style={{
            margin: "5px",
            padding: "10px 15px",
            backgroundColor: currentTodoId === 3 ? "#3b82f6" : "#e5e7eb",
            color: currentTodoId === 3 ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Todo #3
        </button>

        <button
          onClick={() => setCurrentTodoId(Math.floor(Math.random() * 200) + 1)}
          style={{
            margin: "5px",
            padding: "10px 15px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🎲 Todo Aleatorio
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#fef3c7",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h4>💡 Observa en la consola del navegador:</h4>
        <ul>
          <li>🔄 Cuándo se ejecuta el useEffect</li>
          <li>🎨 Cuándo se re-renderiza cada componente</li>
          <li>✅ Los datos que llegan de la API</li>
        </ul>
        <p>
          <strong>Punto clave:</strong> useEffect solo se ejecuta cuando{" "}
          <code>todoId</code> cambia
        </p>
      </div>

      <button onClick={handleNonStatePropChange}>Cambiar nonStateProp</button>

      <TodoDetail todoId={currentTodoId} nonStateProp={nonStateProp} />

      <div
        style={{
          marginTop: "20px",
          fontSize: "14px",
          color: "#6b7280",
          backgroundColor: "#f9fafb",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <p>
          Este es un ejemplo de cómo usar <code>useEffect</code> con un array de
          dependencias. El componente <code>TodoDetail</code> solo se vuelve a
          renderizar cuando cambia el <code>todoId</code>. La propiedad{" "}
          <code>nonStateProp</code> no afecta al re-renderizado.
        </p>
      </div>
    </div>
  );
}

export default App;
