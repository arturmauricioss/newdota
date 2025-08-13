import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;
export const totalTableWidth =
  // 0 + // Herói
  40 + // Final
  40 + // Pessoal
  40 + // Meta
  // 40 + // Sinergia
  40 + // Aliado
  40 + // Inimigo
  40;  // Bans

export const draftStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    padding: 16,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f5f5f5",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginVertical: 8,
    alignSelf: "center",
  },
  teamSection: {
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  teamRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  slotWrapper: {
    margin: 1,
    width: "18%",
    
  },
  banSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
    gap: 0,
  },
  tableSection: {
    marginVertical: 16,
    width: "100%",
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#222",
    paddingVertical: 4,
    marginBottom: 6,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#ccc",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    backgroundColor: "#1e1e1e",
    paddingVertical: 6,
    borderRadius: 4,
  },
  tableImage: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  tableCell: {
    width: 50,
    fontSize: 13,
    color: "#f0f0f0",
    textAlign: "left",
    paddingHorizontal: 4,
  },
  playersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    marginVertical: 12,
    gap: 8,
  },
  playerSelectWrapper: {
    width: "18%",
  },
  cellName: {
    width: 50,
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "left",
    paddingHorizontal: 4,
  },
  cellFinal: {
    width: 50,
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "center",
  },
  cellRP: {
    width: 50,
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "center",
  },
  cellScore: {
    width: 50,
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "center",
  },
  cellSynergy: {
    width: 50,
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "center",
  },
  cellAlly: {
    width: 50,
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "center",
  },
  cellEnemy: {
    width: 50,
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "center",
  },
  cellBan: {
    width: 50,
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "center",
  },
  heroCell: {
    flexDirection: "row",
    alignItems: "center",
    width: 50,
  },
  heroImage: {
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: 4,

  },
  heroName: {
    fontSize: 14,
    flexShrink: 1,
    color: "#f0f0f0",
  },
  tableContainer: {
    minWidth: totalTableWidth,
    alignSelf: "center", // centraliza dentro do pai
  },
});
