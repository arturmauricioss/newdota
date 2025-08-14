const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const heroesData = require("../assets/heroes_with_images.json");
const baseUrl = "https://dota2.fandom.com/wiki";

const axiosInstance = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36",
    Accept: "text/html",
  },
});

const formatNameForWiki = (name) =>
  encodeURIComponent(name.replace(/\s+/g, "_").replace(/’/g, "'"));

const fetchLoreFromSubpage = async (wikiName) => {
  try {
    const url = `${baseUrl}/${wikiName}/Lore`;
    const { data } = await axiosInstance.get(url);
    const $ = cheerio.load(data);

    const loreText = $(".mw-parser-output")
      .find("p, div[style*='font-style:italic'][style*='font-size:13px']")
      .map((i, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0)
      .join("\n\n");

    return loreText || null;
  } catch (error) {
    return null;
  }
};

const fetchLoreFromMainPage = async (wikiName) => {
  try {
    const url = `${baseUrl}/${wikiName}`;
    const { data } = await axiosInstance.get(url);
    const $ = cheerio.load(data);

    // Tenta encontrar a seção "Lore"
    const loreHeader = $("h2, h3").filter((i, el) =>
      $(el).text().trim().toLowerCase().includes("lore")
    );

    let loreText = "";

    if (loreHeader.length > 0) {
      let el = loreHeader.next();
      while (el.length && (el[0].tagName === "p" || el[0].tagName === "div")) {
        const text = $(el).text().trim();
        if (text.length > 0) {
          loreText += text + "\n\n";
        }
        el = el.next();
      }
    }

    // Fallback: busca lore na célula com estilo italic
    if (!loreText) {
      const loreCell = $("div[style*='display:table-cell'][style*='font-style: italic']");
      if (loreCell.length > 0) {
        loreText = loreCell
          .html()
          .replace(/<br\s*\/?>/gi, "\n\n") // converte quebras de linha
          .replace(/<\/?[^>]+(>|$)/g, "") // remove tags HTML
          .trim();
      }
    }

    return loreText || null;
  } catch (error) {
    return null;
  }
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const cleanText = (text) =>
  text.replace(/\n{3,}/g, "\n\n").replace(/\s+\n/g, "\n").trim();

const run = async () => {
  const loreData = {};

  for (const hero of heroesData) {
    const wikiName = formatNameForWiki(hero.localized_name);
    console.log(`🔍 Buscando lore de ${hero.localized_name} (${wikiName})...`);

    let lore = await fetchLoreFromSubpage(wikiName);
    if (!lore) {
      console.log(`↪️ Tentando buscar lore na página principal de ${hero.localized_name}...`);
      lore = await fetchLoreFromMainPage(wikiName);
    }

    if (lore) {
      loreData[hero.id] = cleanText(lore);
    } else {
      console.warn(`⚠️ Lore não encontrada para ${hero.localized_name}`);
    }

    await delay(1500); // respeita o servidor
  }

  fs.writeFileSync("assets/hero_lore.json", JSON.stringify(loreData, null, 2), "utf-8");
  console.log("✅ Lore salva em assets/hero_lore.json");
};

run();
