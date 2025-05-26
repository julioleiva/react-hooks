import { NavLink } from "react-router-dom";
import styles from "./Users.module.css";

export function Users() {
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
