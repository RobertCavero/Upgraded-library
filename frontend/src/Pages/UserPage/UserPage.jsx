import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importado para controle de rotas
import axios from "axios"; // Importado para chamadas HTTP
import default_user from "/user_default512.png";
import "./UserPage.css";
import Favorites from "../../Components/UserTabs/Favorites/Favorites";
import Booklist from "../../Components/UserTabs/BookList/Booklist";
import AboutUser from "../../Components/UserTabs/AboutUser/AboutUser";

const UserPage = () => {
  const [activeTab, setActiveTab] = useState("favorites");
  const navigate = useNavigate();

  // 1. Estados dinâmicos que vão receber os dados do seu Backend
  const [user, setUser] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("userToken");

      // Se não houver token, barra o usuário e joga pro formulário de login
      if (!token) {
        navigate("/"); // Supondo que seu login seja a rota raiz
        return;
      }

      try {
        // Configuração padrão do cabeçalho com o Token do usuário
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // 2. Faz as requisições em paralelo para o seu Render Backend
        const userRes = await axios.get(
          "https://upgraded-library.onrender.com/auth/me",
          config,
        );
        const favsRes = await axios.get(
          "https://upgraded-library.onrender.com/favorites",
          config,
        );
        const booksRes = await axios.get(
          "https://upgraded-library.onrender.com/booklist",
          config,
        );

        // 3. Atualiza os estados com os dados reais salvos no Banco via Prisma
        setUser(userRes.data.user);
        setFavoritesList(favsRes.data || []); // Adapte se a sua resposta tiver formatos como .data.favorites
        setBookList(booksRes.data || []);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        // Se o token falhar ou expirar, limpa o token quebrado e manda pro login
        localStorage.removeItem("userToken");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Enquanto a requisição do /auth/me não termina, exibe uma tela de carregamento
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Se por algum motivo o carregamento terminou e o usuário é nulo, impede de quebrar o HTML abaixo
  if (!user) return null;

  return (
    <div className="userpage">
      <div className="userpage-wrapper">
        <div className="upperbox">
          <div className="left-profile">
            <img
              className="user-img"
              src={user.image || default_user}
              alt="Profile"
            />
            <span className="user-name">{user.name}</span>{" "}
            {/* Mudado de username para name conforme seu controller */}
            <span className="user-id">ID: {user.id}</span>
          </div>

          <div className="right-profile">
            <p className="user-favorites-text">
              Livros Favoritados:{" "}
              <span className="user-favorites-number">
                {favoritesList.length}
              </span>{" "}
              {/* Dinâmico com base no array */}
            </p>

            <p className="user-read-text">
              Livros Lidos:{" "}
              <span className="user-read-number">{bookList.length}</span>{" "}
              {/* Dinâmico com base no array */}
            </p>
          </div>
        </div>

        <ul className="user-tabs">
          <li
            className={activeTab === "favorites" ? "active" : ""}
            onClick={() => setActiveTab("favorites")}
          >
            Favoritos
          </li>
          <li
            className={activeTab === "booklist" ? "active" : ""}
            onClick={() => setActiveTab("booklist")}
          >
            Lista de Livros
          </li>
          <li
            className={activeTab === "sobre" ? "active" : ""}
            onClick={() => setActiveTab("sobre")}
          >
            Sobre Usuário
          </li>
        </ul>

        <div className="user-tab-content">
          {activeTab === "favorites" && <Favorites favorites={favoritesList} />}
          {activeTab === "booklist" && <Booklist bookList={bookList} />}
          {activeTab === "sobre" && <AboutUser user={user} />}{" "}
          {/* Você pode passar o usuário como prop aqui se precisar exibir a Bio */}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
