import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home/Home";
import About from "../pages/About/About";
import UserProfile from "../pages/UserProfile/UserProfile";
import Users from "../pages/Users/Users";
import ProductList from "../pages/ProductList/ProductList";
import ProductDetail from "../pages/ProductDetail/ProductDetail";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:userId" element={<UserProfile />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
    </Routes>
  );
}

export default AppRoutes;
