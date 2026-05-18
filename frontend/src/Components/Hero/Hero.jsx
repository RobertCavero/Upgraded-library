import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Hero.css";

const Hero = () => {
  const hero_status = [
    { id: 1, title: "Dia da Literatura Brasileira", text: "O Dia da Literatura Brasileira é comemorado em 1º de maio", img: "/reading1.jpg" },
    { id: 2, title: "Ler melhora a saúde", text: "Um estudo da University of Sussex mostrou que ler pode reduzir o estresse em cerca de até 68%, mais do que música ou caminhada.", img: "/reading2.jpg" },
    { id: 3, title: "Importância das Bibliotecas", text: "A importância das bibliotecas está relacionada ao incentivo à leitura, ao acesso à informação e ao apoio ao desenvolvimento educacional e cultural da sociedade.", img: "/reading3.jpg" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const textRef = useRef(null);
  const imgRef = useRef(null);

  const hero = hero_status[currentIndex];
  const length = hero_status.length;

  useEffect(() => {
    const interval = setInterval(() => {
      // EXIT animation FIRST (must complete fully)
      const tl = gsap.timeline({
        onComplete: () => {
          // ONLY change state AFTER exit completes
          setCurrentIndex((prev) =>
            prev === length - 1 ? 0 : prev + 1
          );
        },
      });

      tl.to(textRef.current, {
        opacity: 0,
        y: -50,
        duration: 1.5,
        ease: "power2.inOut",
      });

      tl.to(
        imgRef.current,
        {
          opacity: 0,
          scale: 0.95,
          duration: 1.5 ,
          ease: "power2.inOut",
        },
        "<"
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [length]);

  // ENTER animation AFTER DOM update
  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

    gsap.fromTo(
      imgRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );
  }, [currentIndex]);

  return (
    <div className="hero">
      <div className="box-left">
        <div ref={textRef} className="hero-textbox">
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-text">{hero.text}</p>
        </div>
      </div>

      <div className="box-right">
        <img ref={imgRef} src={hero.img} alt="" />
      </div>
    </div>
  );
};

export default Hero;