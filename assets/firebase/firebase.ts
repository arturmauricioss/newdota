import { Platform } from "react-native";

import {
  analytics as webAnalytics,
  app as webApp,
  auth as webAuth,
  db as webDb,
} from "./firebase.web";

import {
  app as nativeApp,
  auth as nativeAuth,
  db as nativeDb,
} from "./firebase.native";

export const app = Platform.OS === "web" ? webApp : nativeApp;
export const auth = Platform.OS === "web" ? webAuth : nativeAuth;
export const db = Platform.OS === "web" ? webDb : nativeDb;
export const analytics = Platform.OS === "web" ? webAnalytics : {
  logEvent: async (_eventName: string, _params?: Record<string, any>) => {},
};