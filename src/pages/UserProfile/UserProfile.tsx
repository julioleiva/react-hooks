import { useParams, useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Datos de ejemplo para diferentes usuarios
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

  const user =
    userId && userId in users ? users[userId as keyof typeof users] : undefined;

  // Explicación de este tipado tan WTF 🤯:

  // userId - Primero verifica que userId tenga un valor "truthy" (no sea null, undefined, "", 0, etc.)
  // && - Operador AND lógico
  // userId in users - Si userId existe, verifica si existe como propiedad en el objeto users

  // ? users[userId as keyof typeof users] - Si la condición es verdadera:

  // Accede al valor del usuario en el objeto users
  // as keyof typeof users es una aserción de tipo de TypeScript que le dice al compilador que userId es una clave válida del objeto users

  // : undefined - Si la condición es falsa:

  // Retorna undefined

  const handleGoBack = () => {
    navigate("/users");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleNavigateToUser = (newUserId: string) => {
    navigate(`/users/${newUserId}`);
  };

  if (!user) {
    return (
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Usuario no encontrado</h1>
        <div className={styles.pageContent}>
          <p className={styles.pageText}>
            El usuario con ID "{userId}" no existe en nuestro sistema.
          </p>
          <div className={styles.buttonGroup}>
            <button onClick={handleGoBack} className={styles.button}>
              ← Volver a Usuarios
            </button>
            <button onClick={handleGoHome} className={styles.buttonSecondary}>
              🏠 Ir al Inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Obtener otros usuarios para navegación rápida
  const otherUsers = Object.entries(users)
    .filter(([id]) => id !== userId)
    .map(([id, userData]) => ({ id, name: userData.name }));

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

        <div className={styles.navigation}>
          <div className={styles.buttonGroup}>
            <button onClick={handleGoBack} className={styles.button}>
              ← Volver a Usuarios
            </button>
            <button onClick={handleGoHome} className={styles.buttonSecondary}>
              🏠 Inicio
            </button>
          </div>

          {otherUsers.length > 0 && (
            <div className={styles.quickNavigation}>
              <h3 className={styles.quickNavTitle}>Ver otros usuarios:</h3>
              <div className={styles.userButtons}>
                {otherUsers.map(({ id, name }) => (
                  <button
                    key={id}
                    onClick={() => handleNavigateToUser(id)}
                    className={styles.userButton}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default UserProfile;
