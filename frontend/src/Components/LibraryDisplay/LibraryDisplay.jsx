import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LibraryDisplay.css";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Substitui o antigo controle por token manual

  useEffect(() => {
    // 1. Busca todos os livros do catálogo (Rota pública)
    fetch("https://upgraded-library.onrender.com/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar livros:", err);
        setLoading(false);
      });

    // 2. Verifica se há um usuário ativo/validado via Cookie no Backend
    // O axios envia o cookie automaticamente por conta do defaults.withCredentials = true
    axios
      .get("https://upgraded-library.onrender.com/auth/me") // Use a mesma rota de checagem da sua Navbar
      .then(() => {
        setIsLoggedIn(true);

        // Se o usuário está validado, busca os Favoritos
        axios
          .get("https://upgraded-library.onrender.com/favorites")
          .then((res) => {
            const favList = res.data?.data?.favorites;
            if (Array.isArray(favList)) {
              setFavorites(favList.map((item) => item.bookId));
            }
          })
          .catch((err) => console.error("Erro ao buscar favoritos:", err));

        // E busca a Booklist
        axios
          .get("https://upgraded-library.onrender.com/booklist")
          .then((res) => {
            if (Array.isArray(res.data)) {
              setBooklist(res.data.map((item) => item.bookId || item.id));
            }
          })
          .catch((err) => console.error("Erro ao buscar booklist:", err));
      })
      .catch(() => {
        // Se a rota /auth/me falhar (401/403), significa que não há cookie ou ele expirou
        setIsLoggedIn(false);
      });
  }, []);

  // Função para salvar/remover da Booklist
  const toggleBooklist = async (bookId) => {
    if (!isLoggedIn) {
      alert("Você precisa estar logado para gerenciar sua lista!");
      return;
    }
    const inList = booklist.includes(bookId);

    try {
      if (inList) {
        // Removido o { headers } do objeto de configuração
        await axios.delete(
          `https://upgraded-library.onrender.com/booklist/${bookId}`,
        );
        setBooklist(booklist.filter((id) => id !== bookId));
        setFavorites(favorites.filter((id) => id !== bookId));
      } else {
        // Removido o { headers } do terceiro parâmetro
        await axios.post("https://upgraded-library.onrender.com/booklist", {
          bookId,
        });
        setBooklist([...booklist, bookId]);
      }
    } catch (err) {
      console.error("Erro ao atualizar booklist:", err);
    }
  };

  // Função para Alternar Favorito (Coração)
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
        // Removido o { headers }
        await axios.delete(
          `https://upgraded-library.onrender.com/favorites/${bookId}`,
        );
        setFavorites(favorites.filter((id) => id !== bookId));
      } else {
        // Removido o { headers }, mantendo o corpo vazio {} exigido pelo POST
        await axios.post(
          `https://upgraded-library.onrender.com/favorites/${bookId}`,
          {},
        );
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
