# Casos de uso reales: useRef para persistir valores entre renders

## ¿Por qué useRef para persistir valores?

`useRef` permite mantener valores mutables que persisten durante todo el ciclo de vida del componente **sin causar re-renders** cuando cambian. Es perfecto para datos que necesitas mantener pero que no afectan directamente la UI.

## 1. Tracking de valores previos

### Comparar valor actual con el anterior

```jsx
// Hook personalizado para obtener el valor anterior
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

// Componente que muestra si un precio subió o bajó
function PriceIndicator({ price }) {
  const previousPrice = usePrevious(price);

  const getPriceChange = () => {
    if (previousPrice === undefined) return "new";
    if (price > previousPrice) return "up";
    if (price < previousPrice) return "down";
    return "same";
  };

  const priceChange = getPriceChange();

  return (
    <div className={`price ${priceChange}`}>
      <span>${price}</span>
      {priceChange === "up" && <span className="arrow">↗️</span>}
      {priceChange === "down" && <span className="arrow">↘️</span>}
      {previousPrice !== undefined && <small>Anterior: ${previousPrice}</small>}
    </div>
  );
}
```

### Detectar cambios en props complejas

```jsx
function UserProfile({ user }) {
  const prevUserRef = useRef();
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (prevUserRef.current) {
      // Comparar propiedades específicas
      const fieldsChanged =
        prevUserRef.current.name !== user.name ||
        prevUserRef.current.email !== user.email ||
        prevUserRef.current.avatar !== user.avatar;

      if (fieldsChanged) {
        setHasChanged(true);
        // Auto-ocultar después de 3 segundos
        setTimeout(() => setHasChanged(false), 3000);
      }
    }

    prevUserRef.current = user;
  }, [user]);

  return (
    <div className="user-profile">
      {hasChanged && <div className="update-banner">✅ Perfil actualizado</div>}
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## 2. Contadores y acumuladores

### Contador de renders para debugging

```jsx
function ExpensiveComponent({ data }) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  // Incrementar en cada render
  renderCount.current += 1;

  const currentTime = Date.now();
  const timeSinceLastRender = currentTime - lastRenderTime.current;
  lastRenderTime.current = currentTime;

  // Solo para desarrollo
  if (process.env.NODE_ENV === "development") {
    console.log(`Component rendered ${renderCount.current} times`);
    console.log(`Time since last render: ${timeSinceLastRender}ms`);
  }

  return (
    <div>
      <div className="debug-info">Renders: {renderCount.current}</div>
      {/* Componente costoso aquí */}
      <ComplexDataVisualization data={data} />
    </div>
  );
}
```

### Contador de clics sin re-renders

```jsx
function AnalyticsButton({ onAnalytics, children }) {
  const clickCount = useRef(0);
  const firstClickTime = useRef(null);

  const handleClick = () => {
    clickCount.current += 1;

    if (clickCount.current === 1) {
      firstClickTime.current = Date.now();
    }

    // Enviar analytics cada 5 clics o después de 30 segundos
    const timeSinceFirst = Date.now() - (firstClickTime.current || Date.now());

    if (clickCount.current % 5 === 0 || timeSinceFirst > 30000) {
      onAnalytics({
        totalClicks: clickCount.current,
        sessionDuration: timeSinceFirst,
        timestamp: Date.now(),
      });

      // Reset counters
      clickCount.current = 0;
      firstClickTime.current = null;
    }
  };

  return <button onClick={handleClick}>{children}</button>;
}
```

## 3. Caching y memoización manual

### Cache de resultados costosos

```jsx
function SearchResults({ query, filters }) {
  const cacheRef = useRef(new Map());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchKey = JSON.stringify({ query, filters });

    // Verificar cache primero
    if (cacheRef.current.has(searchKey)) {
      setResults(cacheRef.current.get(searchKey));
      return;
    }

    const searchData = async () => {
      setLoading(true);
      try {
        const response = await api.search(query, filters);
        const data = response.data;

        // Guardar en cache (limitar tamaño del cache)
        if (cacheRef.current.size >= 50) {
          const firstKey = cacheRef.current.keys().next().value;
          cacheRef.current.delete(firstKey);
        }

        cacheRef.current.set(searchKey, data);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    searchData();
  }, [query, filters]);

  return (
    <div>
      {loading && <div>Buscando...</div>}
      <div>Cache size: {cacheRef.current.size}</div>
      {results.map((result) => (
        <SearchResultItem key={result.id} result={result} />
      ))}
    </div>
  );
}
```

### Cache de imágenes cargadas

```jsx
function ImageGallery({ images }) {
  const loadedImagesRef = useRef(new Set());
  const [loadedCount, setLoadedCount] = useState(0);

  const handleImageLoad = useCallback((imageId) => {
    if (!loadedImagesRef.current.has(imageId)) {
      loadedImagesRef.current.add(imageId);
      setLoadedCount(loadedImagesRef.current.size);
    }
  }, []);

  const progress = (loadedCount / images.length) * 100;

  return (
    <div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span>
          {loadedCount}/{images.length} imágenes cargadas
        </span>
      </div>

      <div className="gallery">
        {images.map((image) => (
          <LazyImage
            key={image.id}
            src={image.url}
            onLoad={() => handleImageLoad(image.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

## 4. Timers y intervalos

### Cleanup automático de timers

```jsx
function AutoSaveEditor({ content, onSave }) {
  const saveTimeoutRef = useRef();
  const lastSaveRef = useRef(Date.now());

  useEffect(() => {
    // Limpiar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Auto-save después de 2 segundos de inactividad
    saveTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      const timeSinceLastSave = now - lastSaveRef.current;

      // Solo guardar si han pasado al menos 5 segundos desde el último guardado
      if (timeSinceLastSave >= 5000) {
        onSave(content);
        lastSaveRef.current = now;
      }
    }, 2000);

    // Cleanup en unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, onSave]);

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribir aquí... (se guarda automáticamente)"
      />
      <small>
        Último guardado: {new Date(lastSaveRef.current).toLocaleTimeString()}
      </small>
    </div>
  );
}
```

### Medición de tiempo de sesión

```jsx
function SessionTracker({ onSessionEnd }) {
  const sessionStartRef = useRef(Date.now());
  const lastActivityRef = useRef(Date.now());
  const inactivityTimerRef = useRef();

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Reiniciar timer de inactividad
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Considerar sesión inactiva después de 10 minutos
    inactivityTimerRef.current = setTimeout(() => {
      const sessionDuration = Date.now() - sessionStartRef.current;
      onSessionEnd({
        duration: sessionDuration,
        endReason: "inactivity",
      });
    }, 10 * 60 * 1000);
  }, [onSessionEnd]);

  useEffect(() => {
    // Escuchar actividad del usuario
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Inicializar timer
    updateActivity();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [updateActivity]);

  const getSessionDuration = () => {
    return Math.floor((Date.now() - sessionStartRef.current) / 1000);
  };

  return (
    <div className="session-info">Sesión activa: {getSessionDuration()}s</div>
  );
}
```

## 5. Flags y estados booleanos

### Prevenir múltiples llamadas simultáneas

```jsx
function DataFetcher({ url, onData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const fetchData = useCallback(async () => {
    // Prevenir múltiples llamadas simultáneas
    if (isLoadingRef.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      onData?.(result);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [url, onData]);

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Cargando..." : "Cargar datos"}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### Componente montado/desmontado

```jsx
function AsyncComponent() {
  const [data, setData] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simular delay
        const response = await api.getData();

        // Solo actualizar state si el componente sigue montado
        if (isMountedRef.current) {
          setData(response.data);
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error("Error:", error);
        }
      }
    };

    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <div>
      {data ? <div>Datos: {JSON.stringify(data)}</div> : <div>Cargando...</div>}
    </div>
  );
}
```

## 6. Configuraciones y constantes dinámicas

### Configuración que cambia sin re-render

```jsx
function ConfigurableChart({ data }) {
  const configRef = useRef({
    animation: true,
    theme: "light",
    refreshRate: 1000,
  });

  const updateConfig = useCallback((newConfig) => {
    configRef.current = { ...configRef.current, ...newConfig };
    // Aplicar configuración sin re-render del componente
    if (chartInstanceRef.current) {
      chartInstanceRef.current.updateConfig(configRef.current);
    }
  }, []);

  useEffect(() => {
    // Configurar chart con la configuración actual
    const chart = new Chart(canvasRef.current, {
      data,
      config: configRef.current,
    });

    chartInstanceRef.current = chart;

    return () => chart.destroy();
  }, [data]);

  return (
    <div>
      <div className="config-panel">
        <label>
          <input
            type="checkbox"
            onChange={(e) => updateConfig({ animation: e.target.checked })}
            defaultChecked={configRef.current.animation}
          />
          Animación
        </label>

        <select
          onChange={(e) => updateConfig({ theme: e.target.value })}
          defaultValue={configRef.current.theme}
        >
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
}
```

## Ventajas de useRef para persistir valores

### ✅ Cuándo usar useRef

- **Valores que cambian frecuentemente** pero no afectan la UI
- **Caching manual** de resultados costosos
- **Tracking de valores anteriores** para comparaciones
- **Flags y estados internos** que no requieren re-render
- **Timers y intervalos** que necesitan cleanup
- **Contadores y métricas** para debugging/analytics

### ❌ Cuándo NO usar useRef

- **Datos que afectan la UI** directamente (usar useState)
- **Props que se pasan** a componentes hijos
- **Valores que necesitan** provocar re-renders
- **Estado complejo** que requiere reducers

## Regla de oro

**Si el cambio del valor debe actualizar la UI → useState**  
**Si el valor debe persistir pero no actualizar la UI → useRef**
