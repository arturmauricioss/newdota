import React, { useEffect, useState } from "react";
import "../style/meta.css";

type MetaHero = {
  id: number;
  localized_name: string;
  img: string;
  pub_pick: number;
  pub_win: number;
  pro_pick?: number;
  pro_ban?: number;
  winRate?: number;
  metaScore?: number;
};

type SortKey = "localized_name" | "winRate" | "metaScore";

const MetaTable = () => {
  const [heroes, setHeroes] = useState<MetaHero[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("metaScore");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data: MetaHero[]) => {
        const processed = data.map((hero) => ({
          ...hero,
          winRate: parseFloat(((hero.pub_win / hero.pub_pick) * 100).toFixed(2)),
          metaScore: (hero.pro_pick ?? 0) + (hero.pro_ban ?? 0),
        }));
        setHeroes(processed);
      })
      .catch((err) => console.error("Erro ao carregar meta:", err));
  }, []);

  const sortedHeroes = [...heroes].sort((a, b) => {
let result = 0;

if (sortKey === "localized_name") {
  result = a.localized_name.localeCompare(b.localized_name);
} else {
  const aVal = a[sortKey] as number;
  const bVal = b[sortKey] as number;
  result = aVal - bVal;
}

return sortAsc ? result : -result;
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc(!sortAsc); // inverte direção
    } else {
      setSortKey(key);
      setSortAsc(false); // padrão: decrescente
    }
  };

  return (
    <div className="meta-table-container">
      <h2>📋 Heróis do Meta</h2>
      <table className="meta-table">
<thead>
  <tr>
    <th> </th> {/* coluna da imagem sem título */}
    <th onClick={() => handleSort("localized_name")}>Herói</th>
    <th onClick={() => handleSort("winRate")}>Win Rate (%)</th>
    <th onClick={() => handleSort("metaScore")}>Meta Score</th>
  </tr>
</thead>
        <tbody>
          {sortedHeroes.map((hero) => (
            <tr key={hero.id}>
                              <td>
                <img
                  src={`https://cdn.cloudflare.steamstatic.com${hero.img}`}
                  alt={hero.localized_name}
                  className="hero-img"
                />
              </td>
              <td>{hero.localized_name}</td>

              <td>{hero.winRate}</td>
              <td>{hero.metaScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetaTable;
