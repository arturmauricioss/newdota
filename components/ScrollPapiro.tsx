import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ScrollPapiroProps = {
  width?: number;
  text: string;
};

const ScrollPapiro = ({ width = 300, text }: ScrollPapiroProps) => {
  const handleWidth = 20;
  const tubeHeight = 25;

  return (
    <View style={[styles.container, { width: width + handleWidth * 2 }]}>
      <View style={[styles.tubeRow, { width: width + handleWidth * 2, height: tubeHeight }]}>
        <View style={[styles.handle, { height: tubeHeight }]} />
        <View style={[styles.tube, { width, height: tubeHeight }]} />
        <View style={[styles.handle, { height: tubeHeight }]} />
      </View>

      <View style={[styles.body, { width }]}>
        <Text style={styles.text}>{text}</Text>
      </View>

      <View style={[styles.tubeRow, { width: width + handleWidth * 2, height: tubeHeight }]}>
        <View style={[styles.handle, { height: tubeHeight }]} />
        <View style={[styles.tube, { width, height: tubeHeight }]} />
        <View style={[styles.handle, { height: tubeHeight }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  tubeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 10,
    backgroundColor: "#5c3b1a",
    borderRadius: 8,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  tube: {
    backgroundColor: "#8b5a2b",
    borderColor: "#5c3b1a",
    borderWidth: 2,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  body: {
    backgroundColor: "#f5f0dc",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#c2a97f",
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: "Ringbearer",
    color: "#3e2f1c",
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
  },
});

export default ScrollPapiro;
