import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LibraryDisplay.css";

// 1. Criamos a instância padronizada igual fizemos na Navbar
const api = axios.create({
  baseURL: "https://upgraded-library.onrender.com",
  withCredentials: true,
});

// 2. O Interceptor injeta o Token do localStorage em TODAS as chamadas automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const LibraryDisplay = () => {
  const normalizeText = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [booklist, setBooklist] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 1. Busca pública de livros (Sempre acontece, logado ou não)
    api
      .get("/books")
      .then((res) => {
        setBooks(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar livros:", err);
        setLoading(false);
      });

    // 2. A TRAVA: Verifica se o token existe antes de perturbar o backend
    const token = localStorage.getItem("userToken");

    if (!token) {
      return; // Para por aqui! Não faz o /auth/me se não tem token.
    }

    // 3. Verifica usuário e busca listas protegidas (Só roda se passou da trava acima)
    api
      .get("/auth/me")
      .then(() => {
        setIsLoggedIn(true);

        api
          .get("/favorites")
          .then((res) => {
            const favList = res.data?.data?.favorites;
            if (Array.isArray(favList)) {
              setFavorites(favList.map((item) => item.bookId));
            }
          })
          .catch((err) => console.error("Erro ao buscar favoritos:", err));

        api
          .get("/booklist")
          .then((res) => {
            if (Array.isArray(res.data)) {
              setBooklist(res.data.map((item) => item.bookId || item.id));
            }
          })
          .catch((err) => console.error("Erro ao buscar booklist:", err));
      })
      .catch(() => {
        // Se o token existir mas estiver expirado, ele cai aqui
        setIsLoggedIn(false);
      });
  }, []);

  const toggleBooklist = async (bookId) => {
    if (!isLoggedIn) {
      alert("Você precisa estar logado para gerenciar sua lista!");
      return;
    }
    const inList = booklist.includes(bookId);

    try {
      if (inList) {
        await api.delete(`/booklist/${bookId}`);
        setBooklist(booklist.filter((id) => id !== bookId));
        setFavorites(favorites.filter((id) => id !== bookId));
      } else {
        await api.post("/booklist", { bookId });
        setBooklist([...booklist, bookId]);
      }
    } catch (err) {
      console.error("Erro ao atualizar booklist:", err);
    }
  };

  const toggleFavorite = async (bookId) => {
    if (!isLoggedIn) {
      alert("Você precisa estar logado para favoritar um livro!");
      return;
    }

    if (!booklist.includes(bookId)) {
      alert("Adicione o livro à sua Booklist antes de favoritá-lo!");
      return;
    }

    const isFav = favorites.includes(bookId);

    try {
      if (isFav) {
        await api.delete(`/favorites/${bookId}`);
        setFavorites(favorites.filter((id) => id !== bookId));
      } else {
        // Agora o post não precisa mais do config manual, o 'api' faz sozinho
        await api.post(`/favorites/${bookId}`, {});
        setFavorites([...favorites, bookId]);
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
      alert("Não foi possível atualizar o favorito.");
    }
  };

  const filteredBooks = books.filter((book) => {
    const title = normalizeText(book.title ?? "");
    const author = normalizeText(book.author ?? "");
    const query = normalizeText(search);
    return title.includes(query) || author.includes(query);
  });

  const displayedBooks = showAll ? filteredBooks : filteredBooks.slice(0, 3);

  return (
    <div className="library-container">
      <input
        type="text"
        placeholder="Procure por titulo ou autor..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="library-list">
        {loading ? (
          <li className="no-books">Carregando livros...</li>
        ) : filteredBooks.length === 0 ? (
          <li className="no-books">Nenhum livro encontrado!</li>
        ) : (
          displayedBooks.map((book) => {
            const isFav = favorites.includes(book.id);
            const inList = booklist.includes(book.id);

            return (
              <li key={book.id} className="book">
                <div className="book-actions">
                  <button
                    className={`action-btn fav-btn ${isFav ? "active" : ""}`}
                    onClick={() => toggleFavorite(book.id)}
                    title={isFav ? "Remover dos favoritos" : "Favoritar"}
                  >
                    <i className={isFav ? "fas fa-heart" : "far fa-heart"}></i>
                  </button>

                  <button
                    className={`action-btn list-btn ${inList ? "active" : ""}`}
                    onClick={() => toggleBooklist(book.id)}
                    title={
                      inList ? "Remover da Booklist" : "Adicionar à Booklist"
                    }
                  >
                    <i
                      className={inList ? "fas fa-bookmark" : "far fa-bookmark"}
                    ></i>
                  </button>
                </div>

                <img className="img-book" src={book.img} alt={book.title} />
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
                <p className="book-year">{book.releaseYear}</p>
                <p className="book-desc">{book.desc}</p>
              </li>
            );
          })
        )}
      </ul>

      {filteredBooks.length > 3 && (
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Mostrar Menos" : "Mostrar Mais"}
        </button>
      )}
    </div>
  );
};

export default LibraryDisplay;
