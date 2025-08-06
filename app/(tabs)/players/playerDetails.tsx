// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// type HeroStats = {
//   hero_id: number;
//   games: number;
//   win: number;
// };

// export default function PlayerDetails() {
//   const { id } = useParams();
//   const [stats, setStats] = useState<HeroStats[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await fetch(`/data/players/${id}.json`);
//         const data = await res.json();
//         setStats(data);
//       } catch (err) {
//         console.error("Erro ao carregar dados:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, [id]);

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>📈 Detalhes do Jogador</h1>
//       {loading ? (
//         <p>Carregando...</p>
//       ) : (
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Hero ID</th>
//               <th>Partidas</th>
//               <th>Vitórias</th>
//               <th>Winrate</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stats.map((hero) => (
//               <tr key={hero.hero_id}>
//                 <td>{hero.hero_id}</td>
//                 <td>{hero.games}</td>
//                 <td>{hero.win}</td>
//                 <td>{((hero.win / hero.games) * 100).toFixed(1)}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
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
//   table: {
//     width: "100%",
//     borderCollapse: "collapse"
//   },
//   th: {
//     backgroundColor: "#333",
//     color: "#fff",
//     padding: "0.5rem"
//   },
//   td: {
//     padding: "0.5rem",
//     borderBottom: "1px solid #ccc"
//   }
// };
