import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Carga inmediata
import { Home } from "../pages/Home/Home";

// Lazy loading
const About = lazy(() => import("../pages/About/About"));
const Users = lazy(() => import("../pages/Users/Users"));
const UserProfile = lazy(() => import("../pages/UserProfile/UserProfile"));

function AppRoutes() {
  return (
    <Suspense fallback={<div>⏳ Cargando...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
