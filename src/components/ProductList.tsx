import { useCart } from "../context/useCart";

export function ProductList() {
  const { products, addToCart, getAvailableUnits } = useCart();

  return (
    <div className="product-list">
      <h2>Productos Disponibles</h2>
      <div className="products-grid">
        {products.map((product) => {
          const availableUnits = getAvailableUnits(product.id);
          const isOutOfStock = availableUnits <= 0;

          return (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <p className="units">
                Disponibles: {availableUnits} / {product.availableUnits}
              </p>
              <button
                onClick={() => addToCart(product.id)}
                disabled={isOutOfStock}
                className={`add-button ${isOutOfStock ? "disabled" : ""}`}
              >
                {isOutOfStock ? "Sin Stock" : "Agregar al Carrito"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
