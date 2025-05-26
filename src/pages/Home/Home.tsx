import styles from "./Home.module.css";

export function Home() {
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
