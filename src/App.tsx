import { useFetch } from "./hook/useFetch";

function App(): JSX.Element {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/todos"
  );

  return (
    <>
      <h1>App</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && (
        <ul>
          {data.slice(0, 10).map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
