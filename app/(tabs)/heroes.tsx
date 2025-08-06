import React, { useEffect, useState } from "react";
import "../style/heroes.css";

type Hero = {
  id: number;
  localized_name: string;
  image_url: string;
};

const Heroes = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);

  useEffect(() => {
fetch("/data/heroes_with_images.json") // Ajuste o caminho conforme seu projeto
// Ajuste o caminho conforme seu projeto
      .then((res) => res.json())
      .then((data) => setHeroes(data))
      .catch((err) => console.error("Erro ao carregar heróis:", err));
  }, []);

  return (
    <div className="heroes-container">
      {heroes.map((hero) => (
        <div key={hero.id} className="hero-card">
          <img src={hero.image_url} alt={hero.localized_name} className="hero-image" />
          <p className="hero-name">{hero.localized_name}</p>
        </div>
      ))}
    </div>
  );
};

export default Heroes;
