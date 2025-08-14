import requests
from bs4 import BeautifulSoup
import json
import time
import os

# Caminho para o JSON de entrada
input_path = os.path.join("..", "assets", "heroes_with_images.json")

# Novo nome do arquivo de saída
output_path = os.path.join("..", "assets", "lores.json")

# Função para buscar a lore
def get_lore(soup):
    bio_div = soup.find('div', {'id': 'heroBio'})
    if bio_div:
        italic_cell = bio_div.find('div', style=lambda s: s and 'font-style: italic' in s)
        if italic_cell:
            return italic_cell.get_text(strip=True)

    lore_span = soup.find('span', {'id': 'Lore'})
    if lore_span:
        header = lore_span.find_parent(['h2', 'h3'])
        if header:
            lore_paragraphs = []
            next_tag = header.find_next_sibling()
            while next_tag and next_tag.name not in ['h2', 'h3']:
                if next_tag.name == 'p':
                    lore_paragraphs.append(next_tag.get_text(strip=True))
                next_tag = next_tag.find_next_sibling()
            if lore_paragraphs:
                return ' '.join(lore_paragraphs)

    return "Lore não encontrada"

# Carrega os heróis
with open(input_path, 'r', encoding='utf-8') as f:
    heroes = json.load(f)

heroes_with_lore = []

for hero in heroes:
    name = hero['localized_name']
    wiki_name = name.replace(" ", "_")  # Ex: "Anti-Mage" → "Anti_Mage"
    print(f"🔍 Buscando lore de {name}...")

    url = f"https://dota2.fandom.com/pt/wiki/{wiki_name}"

    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    lore = get_lore(soup)
    if lore == "Lore não encontrada":
        print(f"⚠️ Lore não encontrada para {name}")
    else:
        print(f"✅ Lore encontrada para {name}")

    # Monta o novo objeto
    hero_data = {
        "id": hero["id"],
        "localized_name": name,
        "lore": lore,
        "image_url": hero.get("image_url", "")
    }

    heroes_with_lore.append(hero_data)
    time.sleep(1)

# Salva o novo JSON com nome simplificado
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(heroes_with_lore, f, ensure_ascii=False, indent=4)

print(f"✅ JSON salvo como 'lores.json' em {output_path}")
