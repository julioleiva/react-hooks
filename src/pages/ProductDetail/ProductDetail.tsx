import { useParams, useNavigate, useLocation } from "react-router-dom";
import LocationInfo from "../../components/LocationInfo/LocationInfo";
import styles from "./ProductDetail.module.css";

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener estado pasado desde la navegación
  const navigationState = location.state || {};

  // Datos de ejemplo
  const products = {
    "1": {
      id: 1,
      name: "iPhone 15",
      category: "electronics",
      price: 999,
      date: "2024-01-15",
      description:
        "El iPhone más avanzado hasta ahora con chip A17 Pro, cámaras mejoradas y diseño en titanio.",
      features: [
        "Chip A17 Pro",
        "Cámara de 48MP",
        "Diseño en titanio",
        "USB-C",
        "Action Button",
      ],
      stock: 15,
      rating: 4.8,
    },
    "2": {
      id: 2,
      name: "MacBook Pro",
      category: "electronics",
      price: 1999,
      date: "2024-02-10",
      description:
        "MacBook Pro con chip M3 Pro, perfecto para profesionales creativos y desarrolladores.",
      features: [
        "Chip M3 Pro",
        "16GB RAM",
        "512GB SSD",
        "Pantalla Liquid Retina XDR",
        "14 pulgadas",
      ],
      stock: 8,
      rating: 4.9,
    },
    "3": {
      id: 3,
      name: "Camiseta Nike",
      category: "clothing",
      price: 45,
      date: "2024-01-20",
      description:
        "Camiseta deportiva Nike con tecnología Dri-FIT para mantener la comodidad durante el ejercicio.",
      features: [
        "Tecnología Dri-FIT",
        "100% Poliéster",
        "Ajuste regular",
        "Lavable a máquina",
        "Varios colores",
      ],
      stock: 25,
      rating: 4.5,
    },
    "4": {
      id: 4,
      name: "Pantalón Levi's",
      category: "clothing",
      price: 89,
      date: "2024-03-05",
      description:
        "Jeans clásicos Levi's 501 con corte recto y calidad duradera.",
      features: [
        "Corte recto",
        "100% Algodón",
        "5 bolsillos",
        "Botón y cremallera",
        "Lavado stone",
      ],
      stock: 12,
      rating: 4.7,
    },
    "5": {
      id: 5,
      name: "Samsung Galaxy",
      category: "electronics",
      price: 799,
      date: "2024-02-20",
      description:
        "Samsung Galaxy S24 con inteligencia artificial integrada y cámaras profesionales.",
      features: [
        "IA integrada",
        "Cámara de 50MP",
        "Pantalla Dynamic AMOLED",
        "5G",
        "One UI 6.1",
      ],
      stock: 20,
      rating: 4.6,
    },
    "6": {
      id: 6,
      name: "Zapatillas Adidas",
      category: "clothing",
      price: 120,
      date: "2024-01-30",
      description:
        "Zapatillas Adidas Ultraboost con tecnología Boost para máxima comodidad y rendimiento.",
      features: [
        "Tecnología Boost",
        "Upper Primeknit",
        "Suela Continental",
        "Soporte Torsion",
        "Varios colores",
      ],
      stock: 18,
      rating: 4.8,
    },
  };

  const product = productId
    ? products[productId as keyof typeof products]
    : undefined;

  const handleGoBack = () => {
    // Si tenemos filtros guardados en el estado, volvemos con ellos
    if (navigationState.filters) {
      const { category, sortBy, search } = navigationState.filters;
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (sortBy && sortBy !== "name") params.set("sort", sortBy);
      if (search) params.set("search", search);

      const queryString = params.toString();
      navigate(`/products${queryString ? `?${queryString}` : ""}`);
    } else {
      navigate("/products");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        product: product,
        from: "product-detail",
        timestamp: Date.now(),
      },
    });
  };

  const handleRelatedProduct = (relatedId: number) => {
    navigate(`/products/${relatedId}`, {
      state: {
        from: "product-detail",
        previousProduct: product ? product.name : undefined,
        timestamp: Date.now(),
      },
    });
  };

  if (!product) {
    return (
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>❌ Producto no encontrado</h1>
        <div className={styles.notFound}>
          <p>El producto con ID "{productId}" no existe en nuestro catálogo.</p>
          <div className={styles.buttonGroup}>
            <button onClick={handleGoBack} className={styles.backButton}>
              ← Volver a Productos
            </button>
            <button onClick={handleGoHome} className={styles.homeButton}>
              🏠 Ir al Inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Encontrar productos relacionados (misma categoría)
  const relatedProducts = Object.values(products)
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <main className={styles.main}>
      <div className={styles.breadcrumb}>
        <button onClick={handleGoHome} className={styles.breadcrumbLink}>
          🏠 Inicio
        </button>
        <span className={styles.breadcrumbSeparator}>/</span>
        <button onClick={handleGoBack} className={styles.breadcrumbLink}>
          📦 Productos
        </button>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </div>

      <LocationInfo />

      {navigationState.from && (
        <div className={styles.navigationInfo}>
          <p>
            📍 Llegaste desde: <strong>{navigationState.from}</strong>
          </p>
          {navigationState.previousProduct && (
            <p>
              📱 Producto anterior:{" "}
              <strong>{navigationState.previousProduct}</strong>
            </p>
          )}
          {navigationState.filters && (
            <p>🔍 Filtros activos guardados para regresar</p>
          )}
        </div>
      )}

      <div className={styles.productContainer}>
        <div className={styles.productHeader}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.productMeta}>
            <span className={styles.category}>
              {product.category === "electronics"
                ? "📱 Electrónica"
                : "👕 Ropa"}
            </span>
            <span className={styles.rating}>⭐ {product.rating}/5</span>
            <span className={styles.stock}>📦 {product.stock} disponibles</span>
          </div>
        </div>

        <div className={styles.productContent}>
          <div className={styles.productInfo}>
            <div className={styles.priceSection}>
              <span className={styles.price}>${product.price}</span>
              <span className={styles.date}>
                📅 Agregado: {new Date(product.date).toLocaleDateString()}
              </span>
            </div>

            <div className={styles.description}>
              <h3>📋 Descripción</h3>
              <p>{product.description}</p>
            </div>

            <div className={styles.features}>
              <h3>✨ Características</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className={styles.actions}>
              <button onClick={handleBuyNow} className={styles.buyButton}>
                🛒 Comprar Ahora
              </button>
              <button onClick={handleGoBack} className={styles.backButton}>
                ← Volver a Productos
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h3>🔗 Productos Relacionados</h3>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((related) => (
                <button
                  key={related.id}
                  onClick={() => handleRelatedProduct(related.id)}
                  className={styles.relatedCard}
                >
                  <h4>{related.name}</h4>
                  <p className={styles.relatedPrice}>${related.price}</p>
                  <p className={styles.relatedRating}>⭐ {related.rating}/5</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProductDetail;
