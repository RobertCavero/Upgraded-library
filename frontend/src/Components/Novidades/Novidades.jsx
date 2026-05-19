import React, { useState, useEffect } from "react";
import "./Novidades.css";

const Novidades = () => {
  const [books, setBooks] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("https://upgraded-library.onrender.com/books")
      .then((res) => res.json())
      .then((data) => {
        const novos = data.data.filter((book) => book.new === true);
        setBooks(novos);
      });
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 3 >= books.length ? 0 : prev + 3));
  };

  const prev = () => {
    setIndex((prev) =>
      prev - 3 < 0 ? Math.max(books.length - 3, 0) : prev - 3,
    );
  };

  const visibleBooks = books.slice(index, index + 3);

  return (
    <div className="novidades">
      <h1 className="novidades-title">Novidades!</h1>
      <div className="carousel-container">
        <button onClick={prev} className="prev-btn">
          <svg className="icon" width="18" height="18" viewBox="0 0 24 24">
            <path fill="white" d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="cards-wrapper">
          {visibleBooks.map((book) => (
            <div key={book.id} className="card">
              <img src={book.img} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <span>{book.releaseYear}</span>
            </div>
          ))}
        </div>

        <button onClick={next} className="next-btn">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="white" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Novidades;
