import fs from "fs";
import fetch from "node-fetch";
import path from "path";

const players: Record<number, string> = {
  150271786: "Avallon",
  349788368: "Moura",
  117971659: "Bigode",
  151810911: "Fixão",
  1099436573: "Alexandre",
  182711567: "Mavrik",
  157738281: "Bode",
  100712161: "Mayo",
  174193083: "Battz",
  105470040: "Cebola",
  88635515: "Kratus",
  113999109: "Kanguru",
  109817781: "Marley",
  405921406: "Abracadabra",
  313194291: "AlexOld",
  192598340: "DodgeCoin",
  200320174: "Dr.Stephan",
  1066375785: "Foxy",
  179644367: "Kelwin",
  1071948454: "Licarco",
  170367146: "Macarrão",
  214333921: "Megan",
  117004622: "Megaterium",
  165724950: "OTioDoSuco",
  1076286412: "PickyHipster",
  127066684: "Spider",
  336009148: "TesleKey",
  115036909: "W1zrd",
  334536657: "Winx",
  360116352: "YYZ",
  1507753674: "ZéDoCachimbo"
};

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
