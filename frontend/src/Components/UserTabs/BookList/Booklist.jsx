import React from "react";
import "./Booklist.css";

const Booklist = ({ bookList = [] }) => {
  return (
    <div className="booklist-list">
      <ul className="book-list">
        {bookList.length === 0 ? (
          <li className="no-books">Nenhum livro na sua lista!</li>
        ) : (
          bookList.map((bookListItem) => (
            // O id do item da lista (BookListItem) continua na raiz
            <li key={bookListItem.id} className="book">
              {/* Ajustado de bookListItem.img para bookListItem.book.img */}
              <img
                className="img-book"
                src={
                  bookListItem.book?.img || "https://a.imagem.app/GzTEvv.png"
                }
                alt={bookListItem.book?.title}
              />

              {/* Ajustado para buscar de dentro do objeto .book */}
              <p className="book-title">{bookListItem.book?.title}</p>
              <p className="book-author">{bookListItem.book?.author}</p>
              <p className="book-year">{bookListItem.book?.releaseYear}</p>
              <p className="book-desc">{bookListItem.book?.desc}</p>

              {/* BÔNUS: Se você quiser exibir o status (Lendo, Lido, Quero Ler) salvo no banco */}
              {bookListItem.status && (
                <span className="book-status-badge">{bookListItem.status}</span>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Booklist;
