import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { useTheme } from "./context/useTheme";
import { useCart } from "./context/useCart";
import { ProductList } from "./components/ProductList";
import { CartSummary } from "./components/CartSummary";
import { useEffect } from "react";
import "./App.css";

function ThemedComponent() {
  const themeContext = useTheme();
  if (!themeContext) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  const { theme, setTheme } = themeContext;

  // Aplicar el tema al documento cuando cambie
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <header className="header">
        <h1>Mi Tienda Online</h1>
        <div className="header-controls">
          <CartTotal />
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="theme-button"
          >
            {theme === "light" ? "🌙" : "☀️"} Cambiar Tema
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-grid">
          <ProductList />
          <CartSummary />
        </div>
      </main>
    </div>
  );
}

function CartTotal() {
  const { getTotalItems, getTotalPrice } = useCart();

  return (
    <div className="cart-total-header">
      <span className="cart-icon">🛒</span>
      <span className="cart-info">
        {getTotalItems()} artículos - ${getTotalPrice().toFixed(2)}
      </span>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <ThemedComponent />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
