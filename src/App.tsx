import { BrowserRouter } from "react-router-dom";
import { Navigation } from "./components/Navigation/Navigation";
import AppRoutes from "./routes/AppRoutes";

import styles from "./App.module.css";
function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <Navigation />
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
