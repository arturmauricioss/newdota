// services/index.ts

import { Platform } from "react-native";

let app: any;
let auth: any;
let db: any;
let analytics: any;

if (Platform.OS === "web") {
  // carrega o módulo web dinamicamente
  const web = require("./firebase.web");
  app       = web.app;
  auth      = web.auth;
  db        = web.db;
  analytics = web.analytics;
} else {
  // carrega o módulo nativo
  const native = require("./firebase.native");
  app  = native.app;
  auth = native.auth;
  db   = native.db;
  // analytics nativo (caso queira)
  // const analyticsNative = require("@react-native-firebase/analytics").default();
  // analytics = analyticsNative;
}

export { analytics, app, auth, db };

