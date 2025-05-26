import { useParams } from "react-router-dom";
import styles from "./UserProfile.module.css";

export function UserProfile() {
  const { userId } = useParams();

  const users = {
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
        <div className={styles.profileInfo}>
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
      </div>
    </main>
  );
}
