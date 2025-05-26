import { useNavigate } from "react-router-dom";
import styles from "./About.module.css";

function About() {
  const navigate = useNavigate();

  const handleNavigateToUsers = () => {
    navigate("/users");
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateWithState = () => {
    navigate("/users", {
      state: {
        from: "about",
        message: "¡Viniste desde la página About!",
      },
    });
  };

  const handleGoBackInHistory = () => {
    navigate(-1); // Equivale a window.history.back()
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Acerca de Nosotros</h1>
      <div className={styles.pageContent}>
        <div className={styles.textContent}>
          <p className={styles.pageText}>
            Somos un equipo apasionado por crear experiencias web increíbles.
            Nuestro objetivo es proporcionar soluciones innovadoras y de alta
            calidad.
          </p>
          <p className={styles.pageText}>
            ¿Tienes alguna pregunta? No dudes en contactarnos.
          </p>
        </div>

        <div className={styles.navigationSection}>
          <h3 className={styles.sectionTitle}>Navegación con useNavigate:</h3>

          <div className={styles.buttonGroup}>
            <button onClick={handleNavigateHome} className={styles.button}>
              🏠 Ir al Inicio
            </button>

            <button onClick={handleNavigateToUsers} className={styles.button}>
              👥 Ver Usuarios
            </button>

            <button
              onClick={handleNavigateWithState}
              className={styles.buttonSpecial}
            >
              👥 Usuarios (con estado)
            </button>

            <button
              onClick={handleGoBackInHistory}
              className={styles.buttonSecondary}
            >
              ← Volver atrás
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;
