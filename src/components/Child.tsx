export function Child() {
  console.log("Componente hijo renderizado");
  return (
    <div>
      <h2>Componente Hijo</h2>
      <p>Este es un componente hijo que no tiene estado propio.</p>
    </div>
  );
}
