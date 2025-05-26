import styles from "./About.module.css";

export function About() {
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
