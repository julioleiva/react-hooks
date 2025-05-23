# Casos de uso reales: useMemo vs useCallback

## ¿Cuándo usar useMemo?

### 1. Cálculos costosos que dependen de props/state

```jsx
// ❌ Sin optimización - se recalcula en cada render
function ProductList({ products, filters }) {
  const filteredProducts = products.filter((product) => {
    return (
      product.category === filters.category &&
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice &&
      product.name.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  return (
    <div>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ✅ Con useMemo - solo se recalcula cuando cambian las dependencias
function ProductList({ products, filters }) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        product.category === filters.category &&
        product.price >= filters.minPrice &&
        product.price <= filters.maxPrice &&
        product.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    });
  }, [products, filters]);

  return (
    <div>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Transformaciones de datos complejas

```jsx
// ❌ Transformación costosa en cada render
function SalesChart({ salesData }) {
  const chartData = salesData
    .map((sale) => ({
      date: new Date(sale.timestamp).toLocaleDateString(),
      revenue: sale.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      profit: sale.items.reduce(
        (sum, item) => sum + (item.price - item.cost) * item.quantity,
        0
      ),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return <Chart data={chartData} />;
}

// ✅ Con useMemo para evitar recálculos
function SalesChart({ salesData }) {
  const chartData = useMemo(() => {
    return salesData
      .map((sale) => ({
        date: new Date(sale.timestamp).toLocaleDateString(),
        revenue: sale.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        profit: sale.items.reduce(
          (sum, item) => sum + (item.price - item.cost) * item.quantity,
          0
        ),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [salesData]);

  return <Chart data={chartData} />;
}
```

### 3. Crear objetos complejos que se pasan como props

```jsx
// ❌ Se crea un nuevo objeto config en cada render
function MapComponent({ userLocation, markers }) {
  const mapConfig = {
    center: userLocation,
    zoom: 10,
    markers: markers.map((marker) => ({
      ...marker,
      distance: calculateDistance(userLocation, marker.position),
    })),
  };

  return <GoogleMap config={mapConfig} />;
}

// ✅ Con useMemo para mantener la referencia estable
function MapComponent({ userLocation, markers }) {
  const mapConfig = useMemo(
    () => ({
      center: userLocation,
      zoom: 10,
      markers: markers.map((marker) => ({
        ...marker,
        distance: calculateDistance(userLocation, marker.position),
      })),
    }),
    [userLocation, markers]
  );

  return <GoogleMap config={mapConfig} />;
}
```

## ¿Cuándo usar useCallback?

### 1. Funciones que se pasan a componentes hijos memorizados

```jsx
// ❌ Sin useCallback - el componente hijo se re-renderiza siempre
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleDelete = (id) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const handleToggle = (id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <TodoList todos={todos} onDelete={handleDelete} onToggle={handleToggle} />
    </div>
  );
}

// ✅ Con useCallback - evita re-renders innecesarios del componente hijo
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleDelete = useCallback((id) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }, []);

  const handleToggle = useCallback((id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  return (
    <div>
      <TodoList todos={todos} onDelete={handleDelete} onToggle={handleToggle} />
    </div>
  );
}

const TodoList = React.memo(({ todos, onDelete, onToggle }) => {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
});
```

### 2. Funciones usadas como dependencias en otros hooks

```jsx
// ❌ Sin useCallback - useEffect se ejecuta en cada render
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async (id) => {
    setLoading(true);
    try {
      const response = await api.getUser(id);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(userId);
  }, [fetchUser, userId]); // fetchUser cambia en cada render

  return loading ? <Spinner /> : <UserCard user={user} />;
}

// ✅ Con useCallback - useEffect solo se ejecuta cuando cambia userId
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await api.getUser(id);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  return loading ? <Spinner /> : <UserCard user={user} />;
}
```

### 3. Funciones que se usan en múltiples lugares del componente

```jsx
// ❌ Sin useCallback - se crean múltiples instancias de la función
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (searchTerm) => {
    if (searchTerm.length < 3) return;

    try {
      const response = await api.search(searchTerm);
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        onEnterPress={handleSearch}
      />
      <SearchResults results={results} />
    </div>
  );
}

// ✅ Con useCallback - función estable para múltiples usos
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = useCallback(async (searchTerm) => {
    if (searchTerm.length < 3) return;

    try {
      const response = await api.search(searchTerm);
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  }, []);

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        onEnterPress={handleSearch}
      />
      <SearchResults results={results} />
    </div>
  );
}
```

## Casos donde NO necesitas useMemo/useCallback

### 1. Cálculos simples

```jsx
// ❌ Innecesario - el cálculo es trivial
function UserCard({ user }) {
  const fullName = useMemo(() => `${user.firstName} ${user.lastName}`, [user]);
  return <div>{fullName}</div>;
}

// ✅ Mejor sin useMemo
function UserCard({ user }) {
  const fullName = `${user.firstName} ${user.lastName}`;
  return <div>{fullName}</div>;
}
```

### 2. Funciones que no se pasan como props

```jsx
// ❌ Innecesario - la función no se pasa a ningún componente hijo
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}

// ✅ Mejor sin useCallback
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((c) => c + 1);
  };

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

## Reglas generales

### useMemo

- Usa cuando tengas **cálculos costosos** que dependen de props/state
- Usa cuando necesites **mantener la referencia de un objeto** estable
- Usa cuando la **transformación de datos sea compleja**

### useCallback

- Usa cuando pases funciones a **componentes hijos memorizados**
- Usa cuando la función sea **dependencia de otros hooks**
- Usa cuando la función se use en **múltiples lugares** del componente

### Cuándo NO usar

- Para **cálculos simples** (concatenar strings, operaciones básicas)
- Para **funciones que no se pasan** como props
- Cuando la **optimización no sea necesaria** (mide primero)

Recuerda: la optimización prematura puede ser contraproducente. Mide el rendimiento antes de optimizar y usa estas herramientas solo cuando realmente aporten valor.
