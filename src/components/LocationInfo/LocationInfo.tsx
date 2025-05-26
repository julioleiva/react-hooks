import { useLocation } from "react-router-dom";
import styles from "./LocationInfo.module.css";

function LocationInfo() {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📍 Información de Ubicación</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <strong>Ruta actual:</strong>
          <span className={styles.pathname}>{location.pathname}</span>
        </div>

        <div className={styles.infoItem}>
          <strong>Parámetros de búsqueda:</strong>
          <span className={styles.search}>
            {location.search || "(ninguno)"}
          </span>
        </div>

        <div className={styles.infoItem}>
          <strong>Hash:</strong>
          <span className={styles.hash}>{location.hash || "(ninguno)"}</span>
        </div>

        {Object.keys(state).length > 0 && (
          <div className={styles.stateSection}>
            <strong>Estado recibido:</strong>
            <div className={styles.stateContent}>
              {state.message && <p>💬 Mensaje: {state.message}</p>}
              {state.from && <p>📤 Desde: {state.from}</p>}
              {state.timestamp && (
                <p>
                  ⏰ Timestamp: {new Date(state.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationInfo;
