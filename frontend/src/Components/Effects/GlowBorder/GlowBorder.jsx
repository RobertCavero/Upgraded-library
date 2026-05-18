import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./GlowBorder.css";

const GlowBorder = ({ children, speed = 3 }) => {
  const effectRef = useRef(null);
  useEffect(() => {
    const el = effectRef.current;
    const anim = gsap.fromTo(
      el,
      { backgroundPosition: "0% 50%" },
      {
        backgroundPosition: "200% 50%",
        duration: speed,
        ease: "none",
        repeat: -1,
      },
    );

    return () => anim.kill();
  }, [speed]);

  return (
    <div className="glow-border">
      <div ref={effectRef} className="glow-border__effect" />
      <div className="glow-border__inner">{children}</div>
    </div>
  );
};

export default GlowBorder;
