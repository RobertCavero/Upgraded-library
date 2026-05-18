import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import React, { useState } from "react";

export default function AuthTabs() {
  const [tab, setTab] = useState("login");

  return (
    <div className="container mt-5 p-4" style={{ maxWidth: "500px", backgroundColor: "white", borderRadius:"15px"}}>
      {/* NAV PILLS */}
      <ul className="nav nav-pills nav-justified mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "login" ? "active" : ""}`}
            onClick={() => setTab("login")}
            type="button"
          >
            Login
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "register" ? "active" : ""}`}
            onClick={() => setTab("register")}
            type="button"
          >
            Register
          </button>
        </li>
      </ul>

      {/* LOGIN */}
      {tab === "login" && (
        <form>
         
          <div className="form-outline mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email ou Nome de Usuário"
            />
          </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
            />
          </div>

          <div className="d-flex justify-content-between mb-4">
            <div>
              <input
                type="checkbox"
                className="form-check-input me-2"
                defaultChecked
              />
              Lembre-se de mim
            </div>

            <a href="#!">Esqueceu a senha?</a>
          </div>

          <button className="btn btn-primary w-100 mb-3">Fazer login</button>

          <p className="text-center">
            Não é membro?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => setTab("register")}
            >
              Registre-se
            </button>
          </p>
        </form>
      )}

      {/* REGISTER */}
      {tab === "register" && (
        <form>

          <div className="mb-3">
            <input className="form-control" placeholder="Nome de Usuário" />
          </div>

          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email" />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Repita a senha"
            />
          </div>

          
          
          <button className="btn btn-primary w-100">Registrar</button>
        </form>
      )}
    </div>
  );
}
