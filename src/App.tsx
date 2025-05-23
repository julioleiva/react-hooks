import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useParams,
} from "react-router-dom";
import styles from "./App.module.css";

function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Página de Inicio</h1>
      <div className={styles.pageContent}>
        <p className={styles.pageText}>
          ¡Bienvenido a nuestra aplicación! Esta es la página principal donde
          encontrarás toda la información más importante.
        </p>
        <p className={styles.pageText}>
          Explora el menú de navegación para descubrir más contenido.
        </p>
      </div>
    </main>
  );
}

function About() {
  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Acerca de Nosotros</h1>
      <div className={styles.pageContent}>
        <p className={styles.pageText}>
          Somos un equipo apasionado por crear experiencias web increíbles.
          Nuestro objetivo es proporcionar soluciones innovadoras y de alta
          calidad.
        </p>
        <p className={styles.pageText}>
          ¿Tienes alguna pregunta? No dudes en contactarnos.
        </p>
      </div>
    </main>
  );
}

// Nueva página que usa useParams
function UserProfile() {
  const { userId } = useParams();

  // Datos de ejemplo para diferentes usuarios
  const users: Record<string, { name: string; role: string; email: string }> = {
    "1": {
      name: "Ana García",
      role: "Desarrolladora Frontend",
      email: "ana@ejemplo.com",
    },
    "2": {
      name: "Carlos López",
      role: "Diseñador UX/UI",
      email: "carlos@ejemplo.com",
    },
    "3": {
      name: "María Rodríguez",
      role: "Desarrolladora Backend",
      email: "maria@ejemplo.com",
    },
  };

  const user = userId ? users[userId] : undefined;

  if (!user) {
    return (
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Usuario no encontrado</h1>
        <div className={styles.pageContent}>
          <p className={styles.pageText}>
            El usuario con ID "{userId}" no existe en nuestro sistema.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Perfil de {user.name}</h1>
      <div className={styles.pageContent}>
        <p className={styles.pageText}>
          <strong>ID:</strong> {userId}
        </p>
        <p className={styles.pageText}>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p className={styles.pageText}>
          <strong>Rol:</strong> {user.role}
        </p>
        <p className={styles.pageText}>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </main>
  );
}

// Página con lista de usuarios
function Users() {
  const users = [
    { id: "1", name: "Ana García" },
    { id: "2", name: "Carlos López" },
    { id: "3", name: "María Rodríguez" },
  ];

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Usuarios</h1>
      <div className={styles.pageContent}>
        <p className={styles.pageText}>
          Haz clic en cualquier usuario para ver su perfil:
        </p>
        <div className={styles.userList}>
          {users.map((user) => (
            <NavLink
              key={user.id}
              to={`/users/${user.id}`}
              className={styles.userLink}
            >
              {user.name}
            </NavLink>
          ))}
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                Inicio
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                Acerca
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                Usuarios
              </NavLink>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
