import "./Favorites.css"

const Favorites = ({ favorites = [] }) => {
  return (
    //not really using favorites class tbh 
    <div className="favorites"> 
      {/* <div>Favorites</div> */}

      <ul className="favorites-list">
        {favorites.length === 0 ? (
          <li className="no-books">Nenhum livro favoritado!</li>
        ) : (
          favorites.map((favorite) => (
            <li key={favorite.id} className="book">
              <img
                className="img-book"
                src={favorite.img}
                alt={favorite.title}
              />
              <p className="book-title">{favorite.title}</p>
              <p className="book-author">{favorite.author}</p>
              <p className="book-year">{favorite.releaseYear}</p>
              <p className="book-desc">{favorite.desc}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Favorites;
