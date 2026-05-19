import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row">

          {/* coluna 1 */}
          <div className="col-md-4">
            <h5>Upgraded Library</h5>
            <p>
              Descubra livros incríveis e novas histórias todos os dias.
            </p>
          </div>

          {/* coluna 2 */}
          <div className="col-md-4">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Home</a></li>
              <li><a href="#" className="text-light text-decoration-none">Livros</a></li>
              <li><a href="#" className="text-light text-decoration-none">Novidades</a></li>
            </ul>
          </div>

          {/* coluna 3 */}
          <div className="col-md-4">
            <h5>Contato</h5>
            <p>Email: contato@upgradedlibrary.com</p>
            <p>Telefone: +55 11 99999-9999</p>
          </div>

        </div>

        <hr className="border-light" />

        <div className="text-center">
          <small>© {new Date().getFullYear()} Upgraded Library. Todos os direitos reservados.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;