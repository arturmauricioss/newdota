const fs = require("fs");
const path = require("path");

// Caminho absoluto para a pasta de jogadores
const playersDir = path.join(__dirname, "..", "assets", "data", "players");

// Caminho do arquivo de saída
const outputFile = path.join(playersDir, "players.json");

const mergedData = {};

fs.readdirSync(playersDir).forEach((file) => {
  if (file.endsWith(".json") && file !== "players.json") {
    const filePath = path.join(playersDir, file);
    const rawData = fs.readFileSync(filePath, "utf-8");
    try {
      const parsed = JSON.parse(rawData);
      const id = path.basename(file, ".json");
      mergedData[id] = parsed;
    } catch (err) {
      console.error(`❌ Erro ao processar ${file}:`, err.message);
    }
  }
});

fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2), "utf-8");
console.log(`✅ Arquivo players.json gerado com sucesso em ${outputFile}`);
