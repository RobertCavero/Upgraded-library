import React, { useState, useEffect } from "react";
import "./Navbar.css";
import bookIcon from "../../assets/book-icon.svg";
import GlowBorder from "../Effects/GlowBorder/GlowBorder";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ADICIONADO: { withCredentials: true } como segundo parâmetro do get
    axios
      .get("https://upgraded-library.onrender.com/auth/me", {
        withCredentials: true,
      })
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, [location]);

  const handleLogout = async () => {
    try {
      // O logout ideal limpa o cookie no backend
      await axios.post("https://upgraded-library.onrender.com/auth/logout");
    } catch (err) {
      console.error("Erro ao deslogar no servidor", err);
    }
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="navbar-wrapper">
      <GlowBorder speed={3}>
        <div className="navbar">
          <img className="navbar-logo" src={bookIcon} alt="book-icon" />

          <ul className="navbar-links">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/catalogo">Catálogo</Link>
            </li>
            <li>
              <Link to="/perfil">Perfil</Link>
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
        </div>
      </GlowBorder>
    </div>
  );
};

export default Navbar;
