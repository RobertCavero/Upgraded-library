import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Hero.css";

const Hero = () => {
  const hero_status = [
    {
      id: 1,
      title: "Dia da Literatura Brasileira",
      text: "O Dia da Literatura Brasileira é comemorado em 1º de maio",
      img: "/reading1.jpg",
    },
    {
      id: 2,
      title: "Ler melhora a saúde",
      text: "Um estudo da University of Sussex mostrou que ler pode reduzir o estresse em cerca de até 68%, mais do que música ou caminhada.",
      img: "/reading2.jpg",
    },
    {
      id: 3,
      title: "Importância das Bibliotecas",
      text: "A importância das bibliotecas está relacionada ao incentivo à leitura, ao acesso à informação e ao apoio ao desenvolvimento educacional e cultural da sociedade.",
      img: "/reading3.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const textRef = useRef(null);
  const imgRef = useRef(null);

  const hero = hero_status[currentIndex];
  const length = hero_status.length;

  useEffect(() => {
    // 1. ANIMAÇÃO DE ENTRADA (Roda toda vez que o currentIndex muda)
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
    );

    gsap.fromTo(
      imgRef.current,
      { opacity: 0, scale: 1.05 }, // Reduzido de 1.1 para 1.05 para não quebrar o mobile
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
    );

    // 2. CONTADOR PARA A PRÓXIMA TROCA (Aguarda 7 segundos livre, depois inicia o Exit)
    const interval = setInterval(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Muda o estado APENAS quando a animação de saída terminar completamente
          setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
        },
      });

      // ANIMAÇÃO DE SAÍDA
      tl.to(textRef.current, {
        opacity: 0,
        y: -40,
        duration: 0.8,
        ease: "power2.inIn",
      });

      tl.to(
        imgRef.current,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: "power2.inIn",
        },
        "<", // Roda junto com o texto
      );
    }, 7000); // 7s de exibição + ~0.8s de transição de saída

    return () => clearInterval(interval);
  }, [currentIndex, length]);

  return (
    <div className="hero">
      <div className="box-left">
        <div ref={textRef} className="hero-textbox">
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-text">{hero.text}</p>
        </div>
      </div>

      <div className="box-right">
        <img ref={imgRef} src={hero.img} alt={hero.title} />
      </div>
    </div>
  );
};

export default Hero;
