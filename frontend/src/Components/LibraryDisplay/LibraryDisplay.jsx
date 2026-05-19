import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import "./LibraryDisplay.css";

// Move utility functions outside the component so they aren't recreated on every render
const normalizeText = (text) =>
  String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Configure a base axios instance to avoid repeating URLs and configs
const api = axios.create({
  baseURL: "https://upgraded-library.onrender.com",
  withCredentials: true,
});

const LibraryDisplay = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [booklist, setBooklist] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch user data (Favorites & Booklist) if logged in
  const fetchUserData = useCallback(async () => {
    try {
      // Run both requests in parallel to save time
      const [favRes, listRes] = await Promise.all([
        api.get("/favorites"),
        api.get("/booklist"),
      ]);

      const favList = favRes.data?.data?.favorites;
      if (Array.isArray(favList)) {
        setFavorites(favList.map((item) => item.bookId));
      }

      if (Array.isArray(listRes.data)) {
        setBooklist(listRes.data.map((item) => item.bookId || item.id));
      }
    } catch (err) {
      console.error("Error fetching user library data:", err);
    }
  }, []);

  // Main initialization effect
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        // 1. Fetch public books
        const booksRes = await api.get("/books");
        if (isMounted) setBooks(booksRes.data?.data || []);

        // 2. Check Authentication
        await api.get("/auth/me");
        if (isMounted) {
          setIsLoggedIn(true);
          await fetchUserData();
        }
      } catch (err) {
        console.error(
          "Initialization error (User might be unauthenticated):",
          err,
        );
        if (isMounted) setIsLoggedIn(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeData();

    return () => {
      isMounted = false; // Clean up to prevent memory leaks on unmounted component
    };
  }, [fetchUserData]);

  // Toggle Booklist
  const toggleBooklist = async (bookId) => {
    if (!isLoggedIn) {
      alert("Você precisa estar logado para gerenciar sua lista!");
      return;
    }

    const inList = booklist.includes(bookId);

    // Optimistic UI updates update state instantly for a snappy feel, revert if API fails
    const previousBooklist = [...booklist];
    const previousFavorites = [...favorites];

    if (inList) {
      setBooklist((prev) => prev.filter((id) => id !== bookId));
      setFavorites((prev) => prev.filter((id) => id !== bookId)); // Removing from booklist removes from favs
    } else {
      setBooklist((prev) => [...prev, bookId]);
    }

    try {
      if (inList) {
        await api.delete(`/booklist/${bookId}`);
      } else {
        await api.post("/booklist", { bookId });
      }
    } catch (err) {
      console.error("Erro ao atualizar booklist:", err);
      alert("Não foi possível atualizar sua lista. Tente novamente.");
      // Rollback state on failure
      setBooklist(previousBooklist);
      setFavorites(previousFavorites);
    }
  };

  // Toggle Favorite
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
    const previousFavorites = [...favorites];

    // Optimistic update
    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== bookId) : [...prev, bookId],
    );

    try {
      if (isFav) {
        await api.delete(`/favorites/${bookId}`);
      } else {
        await api.post(`/favorites/${bookId}`);
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
      alert("Não foi possível atualizar o favorito.");
      setFavorites(previousFavorites); // Rollback
    }
  };

  // Memoize filtering so it doesn't run on unrelated state changes (like showAll toggles)
  const filteredBooks = useMemo(() => {
    const query = normalizeText(search);
    if (!query) return books;

    return books.filter((book) => {
      const title = normalizeText(book.title);
      const author = normalizeText(book.author);
      return title.includes(query) || author.includes(query);
    });
  }, [books, search]);

  const displayedBooks = useMemo(() => {
    return showAll ? filteredBooks : filteredBooks.slice(0, 3);
  }, [filteredBooks, showAll]);

  return (
    <div className="library-container">
      <input
        type="text"
        placeholder="Procure por título ou autor..."
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

                <img
                  className="img-book"
                  src={book.img}
                  alt={book.title}
                  loading="lazy"
                />
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
