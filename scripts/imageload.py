import json
import os

# Caminhos relativos
data_path = os.path.join("..", "data", "heroes.json")  # indo da pasta scripts para data
output_path = os.path.join("..", "data", "heroes_with_images.json")

# Abre o arquivo original
with open(data_path, "r", encoding="utf-8") as f:
    heroes = json.load(f)

# Adiciona o campo de imagem para cada herói
for hero in heroes:
    raw_name = hero["name"].replace("npc_dota_hero_", "")
    image_url = f"https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/{raw_name}_full.png"
    hero["image_url"] = image_url

# Salva o novo JSON
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(heroes, f, ensure_ascii=False, indent=2)

print("Arquivo salvo com imagens em 'public/data/heroes_with_images.json'")


##dawnbreaker - https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZgLAlUV4CgOxaLBHiGPQmax5S3ZQDiqi6_g&s