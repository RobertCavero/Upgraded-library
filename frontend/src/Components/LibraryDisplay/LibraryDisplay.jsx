import React, { useState, useEffect } from "react";
import "./LibraryDisplay.css";

const LibraryDisplay = () => {
  const normalizeText = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("https://upgraded-library.onrender.com/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  // Filter books based on search term
  const filteredBooks = books.filter((book) => {
    const title = normalizeText(book.title ?? "");
    const author = normalizeText(book.author ?? "");
    const query = normalizeText(search);

    return title.includes(query) || author.includes(query);
  });

  const displayedBooks = showAll ? filteredBooks : filteredBooks.slice(0, 3);
  console.log(filteredBooks.length, search);

  return (
    <div className="library-container">
      {/* Search input */}
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
          displayedBooks.map((book) => (
            <li key={book.id} className="book">
              <img className="img-book" src={book.img} alt={book.title} />
              <p className="book-title">{book.title}</p>
              <p className="book-author">{book.author}</p>
              <p className="book-year">{book.releaseYear}</p>
              <p className="book-desc">{book.desc}</p>
            </li>
          ))
        )}
      </ul>
      {filteredBooks.length > 3 && (
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default LibraryDisplay;
