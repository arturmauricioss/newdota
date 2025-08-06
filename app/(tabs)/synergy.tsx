import React, { useEffect, useState } from "react";
import "../style/synergy.css";

type Hero = {
  id: number;
  localized_name: string;
  image_url: string;
};

type SynergyData = {
  with: { heroId2: number; synergy: number }[];
  vs: { heroId2: number; synergy: number }[];
};

type SynergyMatrix = Record<string, SynergyData>;

const Synergy = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [synergies, setSynergies] = useState<SynergyMatrix>({});
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/heroes_with_images.json")
      .then((res) => res.json())
      .then(setHeroes)
      .catch((err) => console.error("Erro ao carregar heróis:", err));

    fetch("/data/synergyMatrix.json")
      .then((res) => res.json())
      .then(setSynergies)
      .catch((err) => console.error("Erro ao carregar sinergias:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHeroId(Number(e.target.value));
  };

  const synergy = selectedHeroId !== null ? synergies[String(selectedHeroId)] : null;
  const currentHero = heroes.find((h) => h.id === selectedHeroId);

  return (
    <div className="synergy-container">
      <h2>🔗 Sinergias e Counters de Heróis</h2>
      <select onChange={handleChange} defaultValue="">
        <option value="" disabled>Escolha um herói</option>
        {heroes.map((hero) => (
          <option key={hero.id} value={hero.id}>{hero.localized_name}</option>
        ))}
      </select>

      {synergy && currentHero && (
        <div className="synergy-details">
          <h3>{currentHero.localized_name}</h3>
          <img src={currentHero.image_url} alt={currentHero.localized_name} className="hero-image" />

          <div className="synergy-subsection">
            <h4>🛡️ Top 10 Aliados</h4>
            <div className="synergy-list">
              {synergy.with
                .sort((a, b) => b.synergy - a.synergy)
                .slice(0, 10)
                .map((pair) => {
                  const partner = heroes.find((h) => h.id === pair.heroId2);
                  if (!partner) return null;
                  return (
                    <div key={partner.id} className="synergy-item">
                      <img src={partner.image_url} alt={partner.localized_name} className="partner-image" />
                      <span className="synergy-score positive">+{pair.synergy.toFixed(2)}%</span>
                      <p>{partner.localized_name}</p>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="synergy-subsection">
            <h4>⚔️ Top 10 Counters</h4>
            <div className="synergy-list">
              {synergy.vs
                .sort((a, b) => b.synergy - a.synergy)
                .slice(0, 10)
                .map((pair) => {
                  const enemy = heroes.find((h) => h.id === pair.heroId2);
                  if (!enemy) return null;
                  return (
                    <div key={enemy.id} className="synergy-item">
                      <img src={enemy.image_url} alt={enemy.localized_name} className="partner-image" />
                      <span className="synergy-score negative">-{pair.synergy.toFixed(2)}%</span>
                      <p>{enemy.localized_name}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Synergy;
