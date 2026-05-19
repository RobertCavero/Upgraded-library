import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import bookIcon from "../../assets/book-icon.svg";
import GlowBorder from "../Effects/GlowBorder/GlowBorder";

// Create a dedicated API instance to avoid polluting global Axios defaults
// Substitua a criação do seu 'api' por isto:
const api = axios.create({
  baseURL: "https://upgraded-library.onrender.com",
  withCredentials: true,
});

// Adiciona o token do localStorage em todas as chamadas dessa instância
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // 1. Verifica se o token existe no navegador
      const token = localStorage.getItem("userToken");

      // 2. Se não tem token, nem perde tempo perguntando ao servidor!
      if (!token) {
        if (isMounted) setIsLoggedIn(false);
        return; // Para a execução da função aqui
      }

      // 3. Se tiver token, aí sim faz a validação
      try {
        await api.get("/auth/me");
        if (isMounted) setIsLoggedIn(true);
      } catch {
        if (isMounted) setIsLoggedIn(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // Prevents memory leaks / setting state on unmounted components
    };
    // REMOVED 'location' dependency.
    // Ideally, pass an auth check function from a React Context provider instead.
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Erro ao deslogar no servidor", err);
    } finally {
      // 1. Limpa o token do navegador
      localStorage.removeItem("userToken");

      // 2. Reseta a interface
      setIsLoggedIn(false);
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

          <nav aria-label="Menu principal">
            <ul className="navbar-links">
              <li>
                <Link
                  to="/"
                  className={location.pathname === "/" ? "active-link" : ""}
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className={
                    location.pathname === "/catalogo" ? "active-link" : ""
                  }
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/perfil"
                  className={
                    location.pathname === "/perfil" ? "active-link" : ""
                  }
                >
                  Perfil
                </Link>
              </li>
            </ul>
          </nav>

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
        </div>
      </GlowBorder>
    </div>
  );
};

export default Navbar;
