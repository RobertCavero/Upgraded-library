import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://upgraded-library.onrender.com/auth"; // Mude para a URL do seu backend

// Se estiver usando Cookies com cookie-parser no backend, descomente a linha abaixo:
// axios.defaults.withCredentials = true;

export default function AuthTabs() {
  const [tab, setTab] = useState("login");

  const navigate = useNavigate();
  // Estados para o formulário de LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados para o formulário de REGISTRO
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // Estados para mensagens de Feedback (Sucesso/Erro)
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Limpa os alertas quando troca de aba
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // 1. EVENTO DE LOGIN
  const handleLogin = async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      setSuccessMessage("Login realizado com sucesso!");
      console.log("Dados do Backend:", response.data);

      // Se seu backend retorna o token no JSON e você usa LocalStorage:
      if (response.data.data?.token) {
        localStorage.setItem("userToken", response.data.data.token);
      }

      setTimeout(() => {
        navigate("/perfil"); 
      }, 1500);

      // Aqui você redirecionaria o usuário (ex: usando useNavigate do react-router)
    } catch (error) {
      // Pega a mensagem de erro vinda do seu backend
      const message = error.response?.data?.error || "Erro ao fazer login.";
      setErrorMessage(message);
    }
  };

  // 2. EVENTO DE REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validação básica de senha idêntica no frontend
    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage("As senhas não coincidem!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });

      console.log(response.data);

      setSuccessMessage("Cadastro realizado com sucesso! Faça o login.");
      // Limpa os campos do registro
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      
      // Joga o usuário para a aba de login após alguns segundos
      setTimeout(() => handleTabChange("login"), 2000);
    } catch (error) {
      const message = error.response?.data?.error || "Erro ao registrar.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="container mt-5 p-4" style={{ maxWidth: "500px", backgroundColor: "white", borderRadius: "15px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
      {/* NAV PILLS */}
      <ul className="nav nav-pills nav-justified mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "login" ? "active" : ""}`}
            onClick={() => handleTabChange("login")}
            type="button"
          >
            Login
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "register" ? "active" : ""}`}
            onClick={() => handleTabChange("register")}
            type="button"
          >
            Registrar
          </button>
        </li>
      </ul>

      {/* ALERTAS DE COMPONENTES */}
      {errorMessage && <div className="alert alert-danger p-2 text-center">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success p-2 text-center">{successMessage}</div>}

      {/* FORMULÁRIO DE LOGIN */}
      {tab === "login" && (
        <form onSubmit={handleLogin}>
          <div className="form-outline mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
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

          <button type="submit" className="btn btn-primary w-100 mb-3">Fazer login</button>

          <p className="text-center">
            Não é membro?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => handleTabChange("register")}
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
              className="form-control" 
              placeholder="Nome de Usuário" 
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email" 
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Repita a senha"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
      )}
    </div>
  );
}