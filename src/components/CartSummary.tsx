import { useCart } from "../context/useCart";

export function CartSummary() {
  const { cartItems, removeFromCart, getTotalItems, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-summary">
        <h2>Carrito</h2>
        <p className="empty-cart">El carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <h2>Carrito</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-price">
                ${item.price} x {item.quantity}
              </span>
            </div>
            <div className="item-actions">
              <span className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-button"
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <div className="total-line">
          <span>Total de artículos: {getTotalItems()}</span>
        </div>
        <div className="total-line">
          <strong>Total a pagar: ${getTotalPrice().toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}
