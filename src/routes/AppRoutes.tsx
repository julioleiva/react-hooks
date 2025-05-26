import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home/Home";
import { About } from "../pages/About/About";
import { UserProfile } from "../pages/UserProfile/UserProfile";
import { Users } from "../pages/Users/Users";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:userId" element={<UserProfile />} />
    </Routes>
  );
}

export default AppRoutes;
