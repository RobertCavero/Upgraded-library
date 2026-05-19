import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import bookIcon from "../../assets/book-icon.svg";
import GlowBorder from "../Effects/GlowBorder/GlowBorder";

const api = axios.create({
  baseURL: "https://upgraded-library.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        if (isMounted) setIsLoggedIn(false);
        return;
      }
      try {
        await api.get("/auth/me");
        if (isMounted) setIsLoggedIn(true);
      } catch {
        if (isMounted) setIsLoggedIn(false);
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Erro ao deslogar no servidor", err);
    } finally {
      localStorage.removeItem("userToken");
      setIsLoggedIn(false);
      setMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <div className="navbar-wrapper">
      <GlowBorder speed={3}>
        <div className="navbar">
          <Link to="/" className="navbar-logo-link">
            <img
              className="navbar-logo"
              src={bookIcon}
              alt="Logotipo da Biblioteca"
            />
          </Link>

          {/* Botão Hamburger */}
          <button 
            className={`menu-toggle ${menuOpen ? "open" : ""}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu de navegação"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Nav Menu */}
          <nav aria-label="Menu principal" className={`nav-menu ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-links">
              <li>
                <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>
                  Início
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className={location.pathname === "/catalogo" ? "active-link" : ""}>
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/perfil" className={location.pathname === "/perfil" ? "active-link" : ""}>
                  Perfil
                </Link>
              </li>
            </ul>

            <div className="btns">
              {isLoggedIn ? (
                <button className="btn-login btn-logout" onClick={handleLogout}>
                  Sair
                </button>
              ) : (
                <button className="btn-login" onClick={() => navigate("/login")}>
                  Seja Membro!
                </button>
              )}
            </div>
          </nav>
        </div>
      </GlowBorder>
    </div>
  );
};

export default Navbar;