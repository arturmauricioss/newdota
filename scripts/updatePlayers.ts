import fs from "fs";
import fetch from "node-fetch";
import path from "path";

import { playerNames as players } from "../public/data/utils/playerNames";

const outputDir = path.join(__dirname, "../public/data/players");

async function fetchPlayerData(id: number) {
  const url = `https://api.opendota.com/api/players/${id}/heroes?game_mode=22`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro ao buscar dados do jogador ${id}: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}

async function updateAllPlayers() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const [idStr, name] of Object.entries(players)) {
    const id = Number(idStr);
    try {
      console.log(`🔄 Atualizando ${name} (${id})...`);
      const data = await fetchPlayerData(id);
      const filePath = path.join(outputDir, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Dados salvos em ${filePath}`);
    } catch (err) {
      console.error(`❌ Erro com ${name}:`, err);
    }
  }
}

updateAllPlayers();
