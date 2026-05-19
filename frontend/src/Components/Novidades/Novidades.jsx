import React, { useState, useEffect } from "react";
import "./Novidades.css";

const Novidades = () => {
  const [books, setBooks] = useState([]);
  const [index, setIndex] = useState(0);
  
  // Estado para controlar quantos livros aparecem por vez (desktop = 3, mobile = 1)
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    // 1. Monitora o tamanho da tela para ajustar a paginação
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(3);
      }
    };

    // Executa uma vez ao montar o componente
    handleResize();

    // Ouvinte de evento para quando a tela mudar de tamanho
    window.addEventListener("resize", handleResize);
    
    // Limpeza do evento ao desmontar o componente
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("https://upgraded-library.onrender.com/books")
      .then((res) => res.json())
      .then((data) => {
        const novos = data.data.filter((book) => book.new === true);
        setBooks(novos);
      });
  }, []);

  // Avança com base no itemsPerPage (1 ou 3)
  const next = () => {
    setIndex((prev) => 
      prev + itemsPerPage >= books.length ? 0 : prev + itemsPerPage
    );
  };

  // Retrocede com base no itemsPerPage (1 ou 3)
  const prev = () => {
    setIndex((prev) =>
      prev - itemsPerPage < 0 
        ? Math.max(books.length - itemsPerPage, 0) 
        : prev - itemsPerPage
    );
  };

  // Fatiamento dinâmico usando a variável do estado
  const visibleBooks = books.slice(index, index + itemsPerPage);

  return (
    <div className="novidades">
      <h1 className="novidades-title">Novidades!</h1>
      <div className="carousel-container">
        <button onClick={prev} className="prev-btn">
          {/* Corrigida a seta para apontar para a esquerda (transform) */}
          <svg className="icon" width="18" height="18" viewBox="0 0 24 24" style={{ transform: "rotate(180deg)" }}>
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