import React, { useState, useEffect } from "react";
import default_user from "/user_default512.png";
import "./UserPage.css";
import Favorites from "../../Components/UserTabs/Favorites/Favorites";
import Booklist from "../../Components/UserTabs/BookList/Booklist";
import AboutUser from "../../Components/UserTabs/AboutUser/AboutUser";

const UserPage = () => {
  const [activeTab, setActiveTab] = useState("favorites");

  const user = {
    id: "123",
    username: "João Silva",
    favorites: 12,
    booksRead: 34,
    bio: "Leitor apaixonado por fantasia e ficção científica.",
    image: default_user,
  };

  const favoritesList = [
    {
      id: 1,
      title: "Dune",
      author: "Frank Herbert",
      releaseYear: 1965,
      img: "https://a.imagem.app/GzTEvv.png",
      desc: "Sci-fi clássico.",
    },
    {
      id: 2,
      title: "Harry Potter",
      author: "J.K. Rowling",
      releaseYear: 1997,
      img: "https://a.imagem.app/GzTEvv.png",
      desc: "Mundo mágico.",
    },
    {
      id: 3,
      title: "Harry Potter",
      author: "J.K. Rowling",
      releaseYear: 1997,
      img: "https://a.imagem.app/GzTEvv.png",
      desc: "Mundo mágico.",
    },
  ];

  const bookList = [
    {
      id: 1,
      title: "Dune",
      author: "Frank Herbert",
      releaseYear: 1965,
      img: "https://a.imagem.app/GzTEvv.png",
      desc: "Sci-fi clássico.",
    },
    {
      id: 2,
      title: "Harry Potter",
      author: "J.K. Rowling",
      releaseYear: 1997,
      img: "https://a.imagem.app/GzTEvv.png",
      desc: "Mundo mágico.",
    },
    {
      id: 3,
      title: "Harry Potter",
      author: "J.K. Rowling",
      releaseYear: 1997,
      img: "https://a.imagem.app/GzTEvv.png",
      desc: "Mundo mágico.",
    },
    {
      id: 4,
      title: "Someone Potter",
      author: "J.K. Someone",
      releaseYear: 1997,
      img: "https://a.imagem.app/GzTEvv.png",
      desc: "Mundo mágico.",
    },
  ];

  useEffect(() => {}, []);

  return (
    <div className="userpage">
      <div className="userpage-wrapper">
        <div className="upperbox">
          <div className="left-profile">
            <img className="user-img" src={default_user} alt="" />
            <span className="user-name">{user.username}</span>
            <span className="user-id">{user.id}</span>
          </div>

          <div className="right-profile">
            <p className="user-favorites-text">
              Livros Favoritados:{" "}
              <span className="user-favorites-number">{user.favorites}</span>
            </p>

            <p className="user-read-text">
              Livros Lidos:{" "}
              <span className="user-read-number">{user.booksRead}</span>
            </p>
          </div>
        </div>

        <ul className="user-tabs">
          <li
            className={activeTab === "favorites" ? "active" : ""}
            onClick={() => setActiveTab("favorites")}
          >
            Favoritos
          </li>
          <li
            className={activeTab === "booklist" ? "active" : ""}
            onClick={() => setActiveTab("booklist")}
          >
            Lista de Livros
          </li>
          <li
            className={activeTab === "sobre" ? "active" : ""}
            onClick={() => setActiveTab("sobre")}
          >
            Sobre Usuario
          </li>
        </ul>

        <div className="user-tab-content">
          {activeTab === "favorites" && <Favorites favorites={favoritesList} />}
          {activeTab === "booklist" && <Booklist  bookList={bookList} />}
          {activeTab === "sobre" && <AboutUser  />}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
