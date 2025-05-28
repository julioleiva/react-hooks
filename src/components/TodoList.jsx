import useFetch from "../hook/useFetch";

export function TodoList() {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/todos"
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data.slice(0, 5).map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
