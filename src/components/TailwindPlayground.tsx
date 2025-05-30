import { useState } from "react";

const TailwindPlayground = () => {
  const [activeTab, setActiveTab] = useState("basics");
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: string }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
    newsletter: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cardHovered, setCardHovered] = useState<number | null>(null);
  const [buttonStates, setButtonStates] = useState<
    Record<string, string | null>
  >({});
  const [sliderValue, setSliderValue] = useState(50);
  const [toggles, setToggles] = useState({
    darkMode: false,
    notifications: true,
    autoSave: false,
  });

  // Utility function para combinar clases
  const classNames = (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  // Simulación de datos
  const statsData = [
    {
      id: 1,
      title: "Usuarios Activos",
      value: "2,432",
      change: "+12%",
      trend: "up",
      color: "blue",
    },
    {
      id: 2,
      title: "Ventas Totales",
      value: "$45,678",
      change: "+8%",
      trend: "up",
      color: "green",
    },
    {
      id: 3,
      title: "Conversiones",
      value: "1,234",
      change: "-3%",
      trend: "down",
      color: "red",
    },
    {
      id: 4,
      title: "Engagement",
      value: "67%",
      change: "+5%",
      trend: "up",
      color: "purple",
    },
  ];

  const tableData = [
    {
      id: 1,
      name: "Ana García",
      email: "ana@email.com",
      status: "active",
      role: "Admin",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@email.com",
      status: "pending",
      role: "User",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "María Rodríguez",
      email: "maria@email.com",
      status: "inactive",
      role: "Moderator",
      lastLogin: "2024-01-10",
    },
    {
      id: 4,
      name: "Juan Pérez",
      email: "juan@email.com",
      status: "active",
      role: "User",
      lastLogin: "2024-01-16",
    },
  ];

  // Función para añadir notificaciones
  const addNotification = (message: string, type: string = "info") => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications((prev) => [...prev, notification]);

    // Auto remove después de 3 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Manejar envío de formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de envío
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    addNotification("Formulario enviado exitosamente!", "success");
    setFormData({
      name: "",
      email: "",
      category: "",
      message: "",
      newsletter: false,
    });
  };

  // Toggle functions
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    setToggles((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleButtonClick = (id: string | number, action: string) => {
    setButtonStates((prev) => ({ ...prev, [id]: action }));
    addNotification(`Acción "${action}" ejecutada`, "info");

    // Reset después de 1 segundo
    setTimeout(() => {
      setButtonStates((prev) => ({ ...prev, [id]: null }));
    }, 1000);
  };

  // Tabs configuration
  const tabs = [
    { id: "basics", label: "🎨 Básico", icon: "🎨" },
    { id: "layout", label: "📐 Layout", icon: "📐" },
    { id: "forms", label: "📝 Formularios", icon: "📝" },
    { id: "interactive", label: "🎯 Interactivo", icon: "🎯" },
    { id: "advanced", label: "🚀 Avanzado", icon: "🚀" },
  ];

  return (
    <div
      className={classNames(
        "min-h-screen transition-all duration-500",
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      )}
    >
      {/* Fixed Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={classNames(
              "px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-in slide-in-from-right",
              notification.type === "success" && "bg-green-500 text-white",
              notification.type === "error" && "bg-red-500 text-white",
              notification.type === "info" && "bg-blue-500 text-white"
            )}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header
        className={classNames(
          "sticky top-0 z-40 backdrop-blur-sm border-b transition-colors duration-300",
          theme === "dark"
            ? "bg-gray-800/90 border-gray-700"
            : "bg-white/90 border-gray-200"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={classNames(
                  "p-2 rounded-lg transition-colors duration-200 lg:hidden",
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                )}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tailwind Playground
              </h1>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={classNames(
                  "p-2 rounded-lg transition-all duration-200 transform hover:scale-110",
                  theme === "dark"
                    ? "bg-yellow-500 text-yellow-900 hover:bg-yellow-400"
                    : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                )}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>

              {/* Profile */}
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={classNames(
            "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200",
            "border-r"
          )}
        >
          <div className="h-full pt-20 lg:pt-4 px-4 overflow-y-auto">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={classNames(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                    activeTab === tab.id
                      ? theme === "dark"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-blue-500 text-white shadow-lg"
                      : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Sidebar Stats */}
            <div className="mt-8 space-y-4">
              <h3
                className={classNames(
                  "text-sm font-semibold uppercase tracking-wide",
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                )}
              >
                Estado del Sistema
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">60%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">RAM</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">80%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Tab: Básico */}
          {activeTab === "basics" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Elementos Básicos</h2>
                <p
                  className={classNames(
                    "text-lg",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  Colores, tipografía y espaciado fundamentales
                </p>
              </div>

              {/* Color Palette */}
              <div
                className={classNames(
                  "p-6 rounded-xl shadow-lg",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Paleta de Colores
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                  {[
                    "red",
                    "orange",
                    "yellow",
                    "green",
                    "blue",
                    "purple",
                    "pink",
                    "gray",
                  ].map((color) => (
                    <div key={color} className="space-y-2">
                      {[300, 500, 700].map((shade) => (
                        <div
                          key={`${color}-${shade}`}
                          className={`h-12 rounded-lg bg-${color}-${shade} flex items-center justify-center text-white text-xs font-semibold shadow-sm cursor-pointer transform hover:scale-105 transition-transform duration-200`}
                          onClick={() =>
                            addNotification(`Color: ${color}-${shade}`, "info")
                          }
                        >
                          {shade}
                        </div>
                      ))}
                      <p className="text-center text-sm font-medium capitalize">
                        {color}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div
                className={classNames(
                  "p-6 rounded-xl shadow-lg",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <h3 className="text-xl font-semibold mb-4">Tipografía</h3>
                <div className="space-y-4">
                  <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Heading 1
                  </div>
                  <div className="text-4xl font-bold">Heading 2</div>
                  <div className="text-2xl font-semibold">Heading 3</div>
                  <div className="text-xl font-medium">Heading 4</div>
                  <div className="text-lg">Large text</div>
                  <div className="text-base">Base text</div>
                  <div className="text-sm text-gray-500">Small text</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">
                    Extra small text
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div
                className={classNames(
                  "p-6 rounded-xl shadow-lg",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <h3 className="text-xl font-semibold mb-4">Espaciado</h3>
                <div className="space-y-4">
                  {[1, 2, 4, 8, 16].map((space) => (
                    <div key={space} className="flex items-center space-x-4">
                      <div
                        className={`w-16 h-${space} bg-blue-500 rounded`}
                      ></div>
                      <span className="text-sm font-mono">h-{space}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Layout */}
          {activeTab === "layout" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Layout y Grid</h2>
                <p
                  className={classNames(
                    "text-lg",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  Flexbox, Grid y sistemas de layout
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat) => (
                  <div
                    key={stat.id}
                    className={classNames(
                      "p-6 rounded-xl shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105",
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-50"
                    )}
                    onMouseEnter={() => setCardHovered(stat.id)}
                    onMouseLeave={() => setCardHovered(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={classNames(
                            "text-sm font-medium",
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )}
                        >
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div
                        className={classNames(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          `bg-${stat.color}-100`,
                          cardHovered === stat.id && "animate-pulse"
                        )}
                      >
                        <div
                          className={`w-6 h-6 bg-${stat.color}-500 rounded-full`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <span
                        className={classNames(
                          "text-sm font-medium",
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {stat.change}
                      </span>
                      <span
                        className={classNames(
                          "ml-2 text-sm",
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        )}
                      >
                        vs último mes
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Flexbox Examples */}
              <div
                className={classNames(
                  "p-6 rounded-xl shadow-lg",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Ejemplos de Flexbox
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                    <div className="bg-red-300 p-3 rounded">
                      justify-between
                    </div>
                    <div className="bg-green-300 p-3 rounded">items-center</div>
                    <div className="bg-blue-300 p-3 rounded">flex</div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="bg-purple-300 p-3 rounded flex-1 min-w-0">
                      flex-1
                    </div>
                    <div className="bg-yellow-300 p-3 rounded flex-1 min-w-0">
                      flex-1
                    </div>
                    <div className="bg-pink-300 p-3 rounded flex-none">
                      flex-none
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive Grid */}
              <div
                className={classNames(
                  "p-6 rounded-xl shadow-lg",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <h3 className="text-xl font-semibold mb-4">Grid Responsive</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-lg text-center aspect-square flex items-center justify-center font-semibold text-gray-700"
                    >
                      Item {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Formularios */}
          {activeTab === "forms" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Formularios Interactivos
                </h2>
                <p
                  className={classNames(
                    "text-lg",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  Campos, validación y estados de formulario
                </p>
              </div>

              {/* Main Form */}
              <div
                className={classNames(
                  "p-8 rounded-xl shadow-lg max-w-2xl",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      Formulario de Contacto
                    </h3>
                    <p
                      className={classNames(
                        "text-sm",
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      Completa todos los campos para enviar tu mensaje
                    </p>
                  </div>

                  {/* Grid de campos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={classNames(
                          "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 placeholder-gray-400"
                        )}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={classNames(
                          "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 placeholder-gray-400"
                        )}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Select */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className={classNames(
                        "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      )}
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="general">Consulta General</option>
                      <option value="support">Soporte Técnico</option>
                      <option value="sales">Ventas</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  {/* Textarea */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensaje
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={4}
                      className={classNames(
                        "w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 placeholder-gray-400"
                      )}
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      checked={formData.newsletter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newsletter: e.target.checked,
                        })
                      }
                      className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="newsletter" className="text-sm">
                      Quiero recibir newsletters y actualizaciones por email
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={classNames(
                        "flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2",
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transform hover:scale-[1.02] active:scale-[0.98]",
                        "text-white"
                      )}
                    >
                      {isLoading && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {isLoading ? "Enviando..." : "Enviar Mensaje"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          name: "",
                          email: "",
                          category: "",
                          message: "",
                          newsletter: false,
                        })
                      }
                      className={classNames(
                        "flex-1 px-6 py-3 rounded-lg font-semibold transition-colors duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-gray-300",
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      )}
                    >
                      Limpiar
                    </button>
                  </div>
                </form>
              </div>

              {/* Form Controls Showcase */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sliders y Range */}
                <div
                  className={classNames(
                    "p-6 rounded-xl shadow-lg",
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  )}
                >
                  <h4 className="text-lg font-semibold mb-4">
                    Controles de Rango
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Valor: {sliderValue}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${sliderValue}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div
                  className={classNames(
                    "p-6 rounded-xl shadow-lg",
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  )}
                >
                  <h4 className="text-lg font-semibold mb-4">Interruptores</h4>
                  <div className="space-y-4">
                    {Object.entries(toggles).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <button
                          onClick={() =>
                            setToggles((prev) => ({
                              ...prev,
                              [key as keyof typeof toggles]:
                                !prev[key as keyof typeof toggles],
                            }))
                          }
                          className={classNames(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                            value ? "bg-blue-600" : "bg-gray-300"
                          )}
                        >
                          <span
                            className={classNames(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                              value ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Interactivo */}
          {activeTab === "interactive" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Elementos Interactivos
                </h2>
                <p
                  className={classNames(
                    "text-lg",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  Botones, animaciones y efectos hover
                </p>
              </div>

              {/* Button Showcase */}
              <div
                className={classNames(
                  "p-6 rounded-xl shadow-lg",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <h3 className="text-xl font-semibold mb-6">
                  Galería de Botones
                </h3>

                <div className="space-y-8">
                  {/* Variantes principales */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      Variantes Principales
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {[
                        {
                          variant: "primary",
                          label: "Primario",
                          classes: "bg-blue-600 hover:bg-blue-700 text-white",
                        },
                        {
                          variant: "secondary",
                          label: "Secundario",
                          classes:
                            "bg-gray-200 hover:bg-gray-300 text-gray-800",
                        },
                        {
                          variant: "success",
                          label: "Éxito",
                          classes: "bg-green-600 hover:bg-green-700 text-white",
                        },
                        {
                          variant: "warning",
                          label: "Advertencia",
                          classes:
                            "bg-yellow-500 hover:bg-yellow-600 text-white",
                        },
                        {
                          variant: "danger",
                          label: "Peligro",
                          classes: "bg-red-600 hover:bg-red-700 text-white",
                        },
                      ].map((btn) => (
                        <button
                          key={btn.variant}
                          onClick={() =>
                            handleButtonClick(btn.variant, "clicked")
                          }
                          className={classNames(
                            "px-6 py-3 rounded-lg font-semibold transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2",
                            "transform hover:scale-105 active:scale-95",
                            btn.classes,
                            buttonStates[btn.variant] === "clicked" &&
                              "animate-pulse"
                          )}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botones con iconos */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Con Iconos</h4>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() =>
                          handleButtonClick("download", "downloading")
                        }
                        className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Descargar</span>
                      </button>

                      <button
                        onClick={() => handleButtonClick("share", "sharing")}
                        className="flex items-center space-x-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                        <span>Compartir</span>
                      </button>

                      <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Abrir Modal</span>
                      </button>
                    </div>
                  </div>

                  {/* Formas especiales */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      Formas Especiales
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                        Píldora
                      </button>
                      <button className="px-6 py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-semibold transition-all duration-200">
                        Outline
                      </button>
                      <button className="px-6 py-3 text-blue-500 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200">
                        Ghost
                      </button>
                      <button className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110">
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animation Showcase */}
              <div
                className={classNames(
                  "p-6 rounded-xl shadow-lg",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <h3 className="text-xl font-semibold mb-6">Animaciones</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-red-400 rounded-full animate-pulse mx-auto"></div>
                    <p className="text-sm font-medium">Pulse</p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-green-400 rounded animate-bounce mx-auto"></div>
                    <p className="text-sm font-medium">Bounce</p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-400 rounded animate-spin mx-auto"></div>
                    <p className="text-sm font-medium">Spin</p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-400 rounded animate-ping mx-auto"></div>
                    <p className="text-sm font-medium">Ping</p>
                  </div>
                </div>

                {/* Custom animations */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                    <h4 className="font-semibold mb-3">Hover Transform</h4>
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg mx-auto transition-all duration-500 ease-in-out cursor-pointer hover:scale-110 hover:rotate-12 hover:shadow-xl"></div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                    <h4 className="font-semibold mb-3">Shape Morph</h4>
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mx-auto transition-all duration-700 ease-in-out cursor-pointer hover:rounded-lg hover:bg-gradient-to-br hover:from-pink-400 hover:to-red-400"></div>
                  </div>
                </div>
              </div>

              {/* Interactive Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Card Hover",
                    desc: "Efecto de elevación",
                    color: "blue",
                  },
                  {
                    title: "Card Tilt",
                    desc: "Efecto de inclinación",
                    color: "green",
                  },
                  {
                    title: "Card Glow",
                    desc: "Efecto de brillo",
                    color: "purple",
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className={classNames(
                      "group p-6 rounded-xl cursor-pointer transition-all duration-300",
                      "hover:shadow-2xl hover:-translate-y-2",
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-50",
                      index === 1 && "hover:rotate-1",
                      index === 2 && `hover:ring-4 hover:ring-${card.color}-300`
                    )}
                  >
                    <div
                      className={`w-12 h-12 bg-${card.color}-500 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                    ></div>
                    <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
                    <p
                      className={classNames(
                        "text-sm",
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Avanzado */}
          {activeTab === "advanced" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Componentes Avanzados
                </h2>
                <p
                  className={classNames(
                    "text-lg",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  Tablas, datos complejos y componentes profesionales
                </p>
              </div>

              {/* Data Table */}
              <div
                className={classNames(
                  "rounded-xl shadow-lg overflow-hidden",
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                )}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold">Tabla de Usuarios</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead
                      className={
                        theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }
                    >
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Último Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={classNames(
                        "divide-y divide-gray-200",
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      )}
                    >
                      {tableData.map((user, index) => (
                        <tr
                          key={user.id}
                          className={classNames(
                            "transition-colors duration-200",
                            theme === "dark"
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50"
                          )}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 bg-gradient-to-r from-${
                                  index % 2 === 0 ? "blue" : "purple"
                                }-400 to-${
                                  index % 2 === 0 ? "purple" : "pink"
                                }-400 rounded-full flex items-center justify-center text-white font-semibold mr-3`}
                              >
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {user.name}
                                </div>
                                <div
                                  className={classNames(
                                    "text-sm",
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  )}
                                >
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={classNames(
                                "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                user.status === "active" &&
                                  "bg-green-100 text-green-800",
                                user.status === "pending" &&
                                  "bg-yellow-100 text-yellow-800",
                                user.status === "inactive" &&
                                  "bg-red-100 text-red-800"
                              )}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.lastLogin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() =>
                                addNotification(
                                  `Editando usuario ${user.name}`,
                                  "info"
                                )
                              }
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                addNotification(
                                  `Usuario ${user.name} eliminado`,
                                  "error"
                                )
                              }
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div
                  className={classNames(
                    "p-6 rounded-xl shadow-lg",
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  )}
                >
                  <h4 className="text-lg font-semibold mb-4">
                    Gráfico de Ingresos
                  </h4>
                  <div className="h-64 bg-gradient-to-t from-blue-100 to-blue-50 rounded-lg flex items-end justify-center space-x-2 p-4">
                    {[65, 78, 45, 88, 92, 67, 85].map((height, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-t-lg w-8 transition-all duration-500 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div
                  className={classNames(
                    "p-6 rounded-xl shadow-lg",
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  )}
                >
                  <h4 className="text-lg font-semibold mb-4">
                    Distribución de Usuarios
                  </h4>
                  <div className="h-64 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
                      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-400 via-green-500 to-yellow-500"></div>
                      <div
                        className={classNames(
                          "absolute inset-8 rounded-full flex items-center justify-center",
                          theme === "dark" ? "bg-gray-800" : "bg-white"
                        )}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold">1,234</div>
                          <div className="text-sm text-gray-500">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: "🎨",
                    title: "Diseño Responsivo",
                    desc: "Adaptable a todos los dispositivos",
                  },
                  {
                    icon: "⚡",
                    title: "Alto Rendimiento",
                    desc: "Optimizado para velocidad",
                  },
                  {
                    icon: "🔒",
                    title: "Seguridad",
                    desc: "Protección de datos avanzada",
                  },
                  {
                    icon: "📊",
                    title: "Analytics",
                    desc: "Métricas detalladas en tiempo real",
                  },
                  {
                    icon: "🌙",
                    title: "Tema Oscuro",
                    desc: "Cambio automático de tema",
                  },
                  {
                    icon: "🚀",
                    title: "Escalabilidad",
                    desc: "Crece con tu negocio",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={classNames(
                      "group p-6 rounded-xl transition-all duration-300 cursor-pointer",
                      "hover:shadow-xl hover:-translate-y-1",
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h5 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h5>
                    <p
                      className={classNames(
                        "text-sm",
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />

            <div
              className={classNames(
                "inline-block w-full max-w-md p-8 my-8 overflow-hidden text-left align-middle transition-all transform shadow-2xl rounded-2xl",
                theme === "dark" ? "bg-gray-800" : "bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Modal de ejemplo</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className={classNames(
                    "p-2 rounded-full transition-colors duration-200",
                    theme === "dark"
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p
                  className={classNames(
                    "text-base leading-relaxed",
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  Este es un modal completamente funcional con animaciones
                  suaves, backdrop blur y diseño responsive. Puedes cerrarlo
                  haciendo clic fuera del modal o presionando el botón de
                  cerrar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    addNotification("Acción confirmada!", "success");
                    setModalOpen(false);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className={classNames(
                    "flex-1 px-6 py-3 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2",
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 focus:ring-gray-500"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-300"
                  )}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailwindPlayground;
