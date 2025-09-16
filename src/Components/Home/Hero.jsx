import React, { useEffect, useState } from "react";
import "./Hero.css";

const Hero = () => {
  const slides = ["/church1.jpg", "/church2.jpg", "/church3.jpg"];
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Autoplay every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => {
        let next = prev + direction;
        if (next === slides.length) {
          setDirection(-1); // reverse at the end
          next = prev - 1;
        } else if (next < 0) {
          setDirection(1); // reverse at the start
          next = prev + 1;
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [direction, slides.length]);

  // Manual navigation
  const prevSlide = () => {
    setDirection(-1);
    setCurrent(prev => (prev === 0 ? 0 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent(prev => (prev === slides.length - 1 ? slides.length - 1 : prev + 1));
  };

  return (
    <div className="hero-container">
      <div className="hero-overlay">
        <h1 className="hero-welcome">Welcome to Our Catholic Community</h1>
      </div>

      <div className="carousel">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div className="carousel-slide" key={idx}>
              <img src={slide} alt={`Slide ${idx + 1}`} className="image" />
            </div>
          ))}
        </div>

        {/* <button className="carousel-button prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="carousel-button next" onClick={nextSlide}>
          &#10095;
        </button> */}
      </div>
    </div>
  );
};

export default Hero;
