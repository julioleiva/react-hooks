import { useSearchParams, useNavigate } from "react-router-dom";
import LocationInfo from "../../components/LocationInfo/LocationInfo";
import styles from "./ProductList.module.css";

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "name";
  const search = searchParams.get("search") || "";

  const products = [
    {
      id: 1,
      name: "iPhone 15",
      category: "electronics",
      price: 999,
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "MacBook Pro",
      category: "electronics",
      price: 1999,
      date: "2024-02-10",
    },
    {
      id: 3,
      name: "Camiseta Nike",
      category: "clothing",
      price: 45,
      date: "2024-01-20",
    },
    {
      id: 4,
      name: "Pantalón Levi's",
      category: "clothing",
      price: 89,
      date: "2024-03-05",
    },
    {
      id: 5,
      name: "Samsung Galaxy",
      category: "electronics",
      price: 799,
      date: "2024-02-20",
    },
    {
      id: 6,
      name: "Zapatillas Adidas",
      category: "clothing",
      price: 120,
      date: "2024-01-30",
    },
  ];

  // Filtrar productos
  let filteredProducts = products;

  if (category !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  if (search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Ordenar productos
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleCategoryChange = (newCategory: string) => {
    const newParams: { sort: string; category?: string; search?: string } = {
      sort: sortBy,
    };
    if (newCategory !== "all") newParams.category = newCategory;
    if (search) newParams.search = search;
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: string) => {
    const newParams: { sort: string; category?: string; search?: string } = {
      sort: newSort,
    };
    if (category !== "all") newParams.category = category;
    if (search) newParams.search = search;
    setSearchParams(newParams);
  };

  type SearchParams = Record<string, string>;

  const handleSearchChange = (newSearch: string) => {
    const newParams: SearchParams = { sort: sortBy };
    if (category !== "all") newParams.category = category;
    if (newSearch) newParams.search = newSearch;
    setSearchParams(newParams);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`, {
      state: {
        from: "product-list",
        filters: { category, sortBy, search },
        timestamp: Date.now(),
      },
    });
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>🛍️ Lista de Productos</h1>

      <LocationInfo />

      <div className={styles.pageContent}>
        <div className={styles.filtersSection}>
          <h3>Filtros y Ordenación</h3>

          <div className={styles.filterGroup}>
            <label>🔍 Buscar:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar productos..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>📂 Categoría:</label>
            <div className={styles.categoryButtons}>
              <button
                onClick={() => handleCategoryChange("all")}
                className={`${styles.categoryButton} ${
                  category === "all" ? styles.active : ""
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleCategoryChange("electronics")}
                className={`${styles.categoryButton} ${
                  category === "electronics" ? styles.active : ""
                }`}
              >
                📱 Electrónica
              </button>
              <button
                onClick={() => handleCategoryChange("clothing")}
                className={`${styles.categoryButton} ${
                  category === "clothing" ? styles.active : ""
                }`}
              >
                👕 Ropa
              </button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>🔄 Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="date">Fecha</option>
            </select>
          </div>
        </div>

        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              Mostrando {filteredProducts.length} productos
              {category !== "all" && ` en "${category}"`}
              {search && ` que contienen "${search}"`}, ordenados por: {sortBy}
            </p>
            <button onClick={handleGoHome} className={styles.homeButton}>
              🏠 Volver al Inicio
            </button>
          </div>

          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={styles.productCard}
                onClick={() => handleProductClick(product.id)}
              >
                <h4 className={styles.productName}>{product.name}</h4>
                <p className={styles.productCategory}>
                  {product.category === "electronics"
                    ? "📱 Electrónica"
                    : "👕 Ropa"}
                </p>
                <p className={styles.productPrice}>${product.price}</p>
                <p className={styles.productDate}>
                  📅 {new Date(product.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className={styles.noResults}>
              <p>😔 No se encontraron productos con los filtros actuales</p>
              <button
                onClick={() => setSearchParams({})}
                className={styles.clearFiltersButton}
              >
                🗑️ Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProductList;
