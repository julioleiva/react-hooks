import { useEffect, useState } from "react";

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface TodoDetailProps {
  todoId: number;
  nonStateProp: string; // Propiedad no relacionada con el estado. No se actualiza ni vuelve a forzar el re-renderizado.
}

export function TodoDetail({
  todoId,
  nonStateProp,
}: TodoDetailProps): JSX.Element {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(`🎨 TodoDetail renderizándose con todoId: ${todoId}`);
  console.log("Propiedad no relacionada con el estado:", nonStateProp);

  useEffect(() => {
    console.log(`🔄 useEffect ejecutándose para todoId: ${todoId}`);

    setLoading(true);

    fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`)
      .then((response) => response.json())
      .then((data: Todo) => {
        console.log(`✅ Datos recibidos para todo ${todoId}:`, data);
        setTodo(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error al cargar el todo:", error);
        setLoading(false);
      });
  }, [todoId]); // ⚠️ DEPENDENCIA: solo se ejecuta cuando todoId cambia

  if (loading) {
    return <div>⏳ Cargando todo #{todoId}...</div>;
  }

  if (!todo) {
    return <div>❌ Error al cargar el todo</div>;
  }

  return (
    <div
      style={{
        border: "2px solid #3b82f6",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f8fafc",
      }}
    >
      <h2>📝 Todo Detail</h2>
      <p>
        <strong>ID:</strong> {todo.id}
      </p>
      <p>
        <strong>Título:</strong> {todo.title}
      </p>
      <p>
        <strong>Usuario:</strong> {todo.userId}
      </p>
      <p>
        <strong>Estado:</strong>{" "}
        {todo.completed ? "✅ Completado" : "⏳ Pendiente"}
      </p>
    </div>
  );
}
