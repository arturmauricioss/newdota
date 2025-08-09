import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

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
    fontSize: 16,
    color: "#f0f0f0",
    marginVertical: 8,
    alignSelf: "flex-start",
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
  },
  tableSection: {
    marginVertical: 16,
    width: "100%",
    paddingHorizontal: 8,
  },
  tableContainer: {
    minWidth: screenWidth > 800 ? screenWidth : 960,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#222",
    paddingVertical: 6,
    marginBottom: 8,
  },
  tableHeaderCell: {
    width: 120,
    fontWeight: "bold",
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    paddingHorizontal: 4,
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
    width: 40,
    height: 40,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  tableCell: {
    width: 120,
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
});
