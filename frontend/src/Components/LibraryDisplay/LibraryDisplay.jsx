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

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    // 1. Busca todos os livros do catálogo
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

    // 2. Busca os Favoritos e a Booklist se o usuário estiver logado
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };

      // Busca Favoritos
      axios
        .get("https://upgraded-library.onrender.com/favorites", { headers })
        .then((res) => {
          // O seu backend retorna: { status: 'success', data: { favorites: [...] } }
          const favList = res.data?.data?.favorites;
          if (Array.isArray(favList)) {
            setFavorites(favList.map((item) => item.bookId));
          }
        })
        .catch((err) => console.error("Erro ao buscar favoritos:", err));

      // Busca Booklist
      axios
        .get("https://upgraded-library.onrender.com/booklist", { headers })
        .then((res) => {
          // O seu backend retorna a array direto na raiz: [{...}]
          if (Array.isArray(res.data)) {
            setBooklist(res.data.map((item) => item.bookId || item.id));
          }
        })
        .catch((err) => console.error("Erro ao buscar booklist:", err));
    }
  }, [token]);

  // Função para salvar/remover da Booklist
  const toggleBooklist = async (bookId) => {
    if (!token) {
      alert("Você precisa estar logado para gerenciar sua lista!");
      return;
    }
    const inList = booklist.includes(bookId);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (inList) {
        await axios.delete(
          `https://upgraded-library.onrender.com/booklist/${bookId}`,
          { headers },
        );
        setBooklist(booklist.filter((id) => id !== bookId));
        // Se remover da booklist, remove automaticamente dos favoritos visualmente
        // já que o Prisma exige que o item esteja na lista para ser favorito
        setFavorites(favorites.filter((id) => id !== bookId));
      } else {
        await axios.post(
          "https://upgraded-library.onrender.com/booklist",
          { bookId },
          { headers },
        );
        setBooklist([...booklist, bookId]);
      }
    } catch (err) {
      console.error("Erro ao atualizar booklist:", err);
    }
  };

  // Função para Alternar Favorito (Coração)
  const toggleFavorite = async (bookId) => {
    if (!token) {
      alert("Você precisa estar logado para favoritar um livro!");
      return;
    }

    // Validação da regra do seu Banco de Dados (Prisma):
    // Só pode favoritar se o item já estiver salvo na Booklist
    if (!booklist.includes(bookId)) {
      alert("Adicione o livro à sua Booklist antes de favoritá-lo!");
      return;
    }

    const isFav = favorites.includes(bookId);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (isFav) {
        // DELETE na URL /favorites/:bookId
        await axios.delete(
          `https://upgraded-library.onrender.com/favorites/${bookId}`,
          { headers },
        );
        setFavorites(favorites.filter((id) => id !== bookId));
      } else {
        // POST na URL /favorites/:bookId (Passando corpo vazio {} porque o ID vai na URL)
        await axios.post(
          `https://upgraded-library.onrender.com/favorites/${bookId}`,
          {},
          { headers },
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
