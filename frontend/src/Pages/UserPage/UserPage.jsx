import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importado para controle de rotas
import axios from "axios"; // Importado para chamadas HTTP
import default_user from "/user_default512.png";
import "./UserPage.css";
import Favorites from "../../Components/UserTabs/Favorites/Favorites";
import Booklist from "../../Components/UserTabs/BookList/Booklist";
import AboutUser from "../../Components/UserTabs/AboutUser/AboutUser";
import Navbar from "../../Components/Navbar/Navbar";

const UserPage = () => {
  const [activeTab, setActiveTab] = useState("favorites");
  const navigate = useNavigate();

  // Estados dinâmicos iniciando com valores padrões seguros
  const [user, setUser] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("userToken");

      // Se não houver token, barra o usuário e joga pro formulário de login
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Faz as requisições em paralelo para melhor performance no Render
        const [userRes, favsRes, booksRes] = await Promise.all([
          axios.get("https://upgraded-library.onrender.com/auth/me", config),
          axios.get("https://upgraded-library.onrender.com/favorites", config),
          axios.get("https://upgraded-library.onrender.com/booklist", config),
        ]);

        // 🔍 Útil para debugar no console do navegador se necessário:
        console.log("Dados do Backend:", {
          user: userRes.data,
          favs: favsRes.data,
          books: booksRes.data,
        });

        // 1. Atualiza o Usuário
        setUser(userRes.data.user || userRes.data);

        // 2. Trata e atualiza Favoritos (Garante que seja um Array)
        const dadosFavoritos =
          favsRes.data.favorites ||
          favsRes.data.data ||
          (Array.isArray(favsRes.data) ? favsRes.data : []);
        setFavoritesList(dadosFavoritos);

        // 3. Trata e atualiza Lista de Livros (Garante que seja um Array)
        const dadosLivros =
          booksRes.data.booklist ||
          booksRes.data.books ||
          booksRes.data.data ||
          (Array.isArray(booksRes.data) ? booksRes.data : []);
        setBookList(dadosLivros);
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

  // Enquanto as requisições não terminam, exibe a tela de carregamento
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Se o carregamento terminou e o usuário é nulo, impede de quebrar o HTML abaixo
  if (!user) return null;

  return (
    <section>
      <Navbar />
      <div className="userpage">
        <div className="userpage-wrapper">
          <div className="upperbox">
            <div className="left-profile">
              <img
                className="user-img"
                src={user.image || default_user}
                alt="Profile"
              />
              <span className="user-name">{user.name}</span>
              <span className="user-id">ID: {user.id}</span>
            </div>

            <div className="right-profile">
              <p className="user-favorites-text">
                Livros Favoritados:{" "}
                <span className="user-favorites-number">
                  {favoritesList.length || 0}{" "}
                  {/* Se for undefined, força o número 0 */}
                </span>
              </p>

              <p className="user-read-text">
                Livros Lidos:{" "}
                <span className="user-read-number">
                  {bookList.length || 0}{" "}
                  {/* Se for undefined, força o número 0 */}
                </span>
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
            {activeTab === "favorites" && (
              <Favorites favorites={favoritesList} />
            )}
            {activeTab === "booklist" && <Booklist bookList={bookList} />}
            {activeTab === "sobre" && <AboutUser user={user} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage;
