// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const playerList: Record<number, string> = {
//   150271786: "Avallon",
//   349788368: "Moura",
//   117971659: "Bigode",
//   151810911: "Fixão",
//   1099436573: "Alexandre",
//   182711567: "Mavrik",
//   157738281: "Bode",
//   100712161: "Mayo",
//   174193083: "Battz",
//   105470040: "Cebola",
//   88635515: "Kratus",
//   113999109: "Kanguru",
//   109817781: "Marley",
//   405921406: "Abracadabra",
//   313194291: "AlexOld",
//   192598340: "DodgeCoin",
//   200320174: "Dr.Stephan",
//   1066375785: "Foxy",
//   179644367: "Kelwin",
//   1071948454: "Licarco",
//   170367146: "Macarrão",
//   214333921: "Megan",
//   117004622: "Megaterium",
//   165724950: "OTioDoSuco",
//   1076286412: "PickyHipster",
//   127066684: "Spider",
//   336009148: "TesleKey",
//   115036909: "W1zrd",
//   334536657: "Winx",
//   360116352: "YYZ",
//   1507753674: "ZéDoCachimbo"
// };

// export default function Players() {
//   const [players, setPlayers] = useState<[number, string][]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const sorted = Object.entries(playerList).sort((a, b) =>
//       a[1].localeCompare(b[1])
//     );
//     setPlayers(sorted.map(([id, name]) => [Number(id), name]));
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>🎮 Jogadores</h1>
//       <div style={styles.grid}>
//         {players.map(([id, name]) => (
//           <button
//             key={id}
//             style={styles.card}
//             onClick={() => navigate(`/players/${id}`)}
//           >
//             {name}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// const styles: Record<string, React.CSSProperties> = {
//   container: {
//     padding: "2rem",
//     maxWidth: "800px",
//     margin: "0 auto",
//     fontFamily: "sans-serif"
//   },
//   title: {
//     fontSize: "2rem",
//     marginBottom: "1.5rem",
//     textAlign: "center"
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//     gap: "1rem"
//   },
//   card: {
//     backgroundColor: "#1e1e2f",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     padding: "1rem",
//     fontSize: "1rem",
//     cursor: "pointer",
//     transition: "transform 0.2s ease",
//     boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
//   }
// };

// // Adiciona hover via CSS-in-JS
// styles.card[':hover'] = {
//   transform: "scale(1.05)"
// };
