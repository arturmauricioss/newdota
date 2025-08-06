import axios from 'axios';
import 'dotenv/config';
import fs from 'fs';

const STRATZ_TOKEN = process.env.STRATZ_TOKEN;

async function fetchHeroesGraphQL() {
  const res = await axios.post(
    'https://api.stratz.com/graphql',
    {
      query: `{
        heroes {
          id
          displayName
          shortName
        }
      }`
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': STRATZ_TOKEN,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // ← simula navegador
      }
    }
  );

  fs.writeFileSync('public/data/heroes.json', JSON.stringify(res.data.data.heroes, null, 2));
  console.log('✅ Heroes salvos via GraphQL + Axios!');
}

fetchHeroesGraphQL().catch(console.error);
