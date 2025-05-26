import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Users.module.css";

function Users() {
  const navigate = useNavigate();

  const users = [
    { id: "1", name: "Ana García", role: "Desarrolladora Frontend" },
    { id: "2", name: "Carlos López", role: "Diseñador UX/UI" },
    { id: "3", name: "María Rodríguez", role: "Desarrolladora Backend" },
  ];

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Usuarios</h1>
      <div className={styles.pageContent}>
        <div className={styles.headerSection}>
          <p className={styles.pageText}>
            Haz clic en cualquier usuario para ver su perfil:
          </p>
          <button onClick={handleGoHome} className={styles.homeButton}>
            🏠 Volver al Inicio
          </button>
        </div>

        <div className={styles.userGrid}>
          {users.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <h3 className={styles.userName}>{user.name}</h3>
              <p className={styles.userRole}>{user.role}</p>
              <div className={styles.cardActions}>
                <NavLink to={`/users/${user.id}`} className={styles.userLink}>
                  Ver Perfil (Link)
                </NavLink>
                <button
                  onClick={() => handleUserClick(user.id)}
                  className={styles.userButton}
                >
                  Ver Perfil (Navigate)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Users;
