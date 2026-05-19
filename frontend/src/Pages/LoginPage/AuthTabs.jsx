import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Dedicated isolated instance matching your other components
const api = axios.create({
  baseURL: "https://upgraded-library.onrender.com/auth",
  withCredentials: true,
});

export default function AuthTabs() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  // Grouped form states for clean data handling
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [feedback, setFeedback] = useState({ error: "", success: "" });

  // Refs to clean up asynchronous timers securely if component unmounts
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Cleanup any pending timeouts on component unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setFeedback({ error: "", success: "" });
  };

  // Reusable handler to sync input fields into objects dynamically
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 1. LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback({ error: "", success: "" });
    setIsLoading(true);

    try {
      const response = await api.post("/login", {
        email: loginData.email,
        password: loginData.password,
      });

      setFeedback({
        error: "",
        success: "Login realizado com sucesso! Redirecionando...",
      });
      console.log("Dados do Backend:", response.data);

      timeoutRef.current = setTimeout(() => {
        navigate("/perfil");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao fazer login.";
      setFeedback({ error: message, success: "" });
      setIsLoading(false);
    }
  };

  // 2. REGISTER HANDLER
  const handleRegister = async (e) => {
    e.preventDefault();
    setFeedback({ error: "", success: "" });

    if (registerData.password !== registerData.confirmPassword) {
      setFeedback({ error: "As senhas não coincidem!", success: "" });
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/register", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });

      setFeedback({
        error: "",
        success:
          "Cadastro realizado com sucesso! Redirecionando para o login...",
      });

      // Reset registration form fields safely
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      timeoutRef.current = setTimeout(() => {
        handleTabChange("login");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao registrar.";
      setFeedback({ error: message, success: "" });
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container mt-5 p-4"
      style={{
        maxWidth: "450px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      {/* NAV PILLS */}
      <ul className="nav nav-pills nav-justified mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "login" ? "active" : ""}`}
            onClick={() => handleTabChange("login")}
            disabled={isLoading}
            type="button"
          >
            Login
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "register" ? "active" : ""}`}
            onClick={() => handleTabChange("register")}
            disabled={isLoading}
            type="button"
          >
            Registrar
          </button>
        </li>
      </ul>

      {/* GLOBAL ALERTS */}
      {feedback.error && (
        <div className="alert alert-danger p-2 text-center small">
          {feedback.error}
        </div>
      )}
      {feedback.success && (
        <div className="alert alert-success p-2 text-center small">
          {feedback.success}
        </div>
      )}

      {/* FORMULÁRIO DE LOGIN */}
      {tab === "login" && (
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="E-mail"
              value={loginData.email}
              onChange={(e) => handleInputChange(e, "login")}
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Senha"
              value={loginData.password}
              onChange={(e) => handleInputChange(e, "login")}
              disabled={isLoading}
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 small">
            <label className="form-check-label d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                defaultChecked
                disabled={isLoading}
              />
              Lembre-se de mim
            </label>
            <a href="#!" className="text-decoration-none">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Fazer login"}
          </button>

          <p className="text-center small mb-0">
            Não é membro?{" "}
            <button
              type="button"
              className="btn btn-link p-0 small text-decoration-none"
              onClick={() => handleTabChange("register")}
              disabled={isLoading}
            >
              Registre-se
            </button>
          </p>
        </form>
      )}

      {/* FORMULÁRIO DE REGISTRO */}
      {tab === "register" && (
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Nome de Usuário"
              value={registerData.name}
              onChange={(e) => handleInputChange(e, "register")}
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="E-mail"
              value={registerData.email}
              onChange={(e) => handleInputChange(e, "register")}
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Senha"
              value={registerData.password}
              onChange={(e) => handleInputChange(e, "register")}
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Repita a senha"
              value={registerData.confirmPassword}
              onChange={(e) => handleInputChange(e, "register")}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Registrar"}
          </button>
        </form>
      )}
    </div>
  );
}
