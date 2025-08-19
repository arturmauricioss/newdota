import { Platform } from "react-native";

const firebase =
  Platform.OS === "web"
    ? require("./firebase.web")
    : require("./firebase.native");

export const app = firebase.app;
export const auth = firebase.auth;
export const db = firebase.db;
export const analytics = firebase.analytics ?? {
  logEvent: (_eventName: string, _params?: Record<string, any>) =>
    Promise.resolve(),
};
