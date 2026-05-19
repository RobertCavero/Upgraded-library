import "./Favorites.css";

const Favorites = ({ favorites = [] }) => {
  // 💡 GARANTIA ANTIBUG: Se não for um Array, transforma em uma lista vazia para não quebrar o .map()
  const cleanFavorites = Array.isArray(favorites) ? favorites : [];

  return (
    <div className="favorites">
      <ul className="favorites-list">
        {cleanFavorites.length === 0 ? (
          <li className="no-books">Nenhum livro favoritado!</li>
        ) : (
          cleanFavorites.map((favorite) => {
            // Se o dado vier envelopado pelo Prisma (.book), usa ele. Caso contrário, usa a raiz.
            const bookData = favorite.book || favorite;

            return (
              <li key={favorite.id} className="book">
                <img
                  className="img-book"
                  src={bookData.img || "https://a.imagem.app/GzTEvv.png"}
                  alt={bookData.title}
                />
                <p className="book-title">{bookData.title}</p>
                <p className="book-author">{bookData.author}</p>
                <p className="book-year">{bookData.releaseYear}</p>
                <p className="book-desc">{bookData.desc}</p>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default Favorites;
