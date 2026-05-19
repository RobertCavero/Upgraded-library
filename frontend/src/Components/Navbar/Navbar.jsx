import React from "react";
import "./Navbar.css";
import bookIcon from "../../assets/book-icon.svg";
import GlowBorder from "../Effects/GlowBorder/GlowBorder";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

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
              <Link to="/contato">Contato</Link>
            </li>
          </ul>

          <div className="btns">
            <button className="btn-login" onClick={() => navigate("/login")}>
              Login / Registrar
            </button>
          </div>
        </div>
      </GlowBorder>
    </div>
  );
};

export default Navbar;
