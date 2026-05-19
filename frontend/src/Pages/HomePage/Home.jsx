import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Hero from "../../Components/Hero/Hero";
import Novidades from "../../Components/Novidades/Novidades";
import Footer from "../../Components/Footer/Footer";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <Navbar />

      <section>
        <Hero />
      </section>

      <section>
        <Novidades />
      </section>

      <Footer />
    </div>
  );
};

export default Home;