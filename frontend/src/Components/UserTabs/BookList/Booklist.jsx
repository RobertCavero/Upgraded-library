import React from 'react'
import "./Booklist.css"
const Booklist = ({ bookList = [] }) => {
  return (
    <div className="booklist-list"> 
      {/* <div>Favorites</div> */}

      <ul className="book-list">
        {bookList.length === 0 ? (
          <li className="no-books">Nenhum livro favoritado!</li>
        ) : (
          bookList.map((bookListItem) => (
            <li key={bookListItem.id} className="book">
              <img
                className="img-book"
                src={bookListItem.img}
                alt={bookListItem.title}
              />
              <p className="book-title">{bookListItem.title}</p>
              <p className="book-author">{bookListItem.author}</p>
              <p className="book-year">{bookListItem.releaseYear}</p>
              <p className="book-desc">{bookListItem.desc}</p>
            </li>
          ))
        )}
      </ul>
    </div>
    
  )
}

export default Booklist