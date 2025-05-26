import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.css";

export function Navigation() {
  return (
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
        <li className={styles.navItem}>
          <NavLink to="/products">🛍️ Productos</NavLink>{" "}
          {/* Con icono para destacar */}
        </li>
      </ul>
    </nav>
  );
}
