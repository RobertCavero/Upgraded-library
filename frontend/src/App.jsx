import { Routes, Route } from "react-router-dom";

import Home from "./Pages/HomePage/Home";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Catalog from "./Pages/CatalogPage/Catalog";
import UserPage from "./Pages/UserPage/UserPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/catalogo" element={<Catalog />} />
      <Route path="/perfil" element={<UserPage />} />
    </Routes>
  );
}

export default App;
