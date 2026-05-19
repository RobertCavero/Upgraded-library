import React from "react";
import "./Catalog.css";
import LibraryDisplay from "../../Components/LibraryDisplay/LibraryDisplay";
import Navbar from "../../Components/Navbar/Navbar";
const Catalog = () => {
  return (
      <section>
        <Navbar />
        <LibraryDisplay />
      </section>
  );
};

export default Catalog;
