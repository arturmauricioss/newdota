import { Platform } from "react-native";

type AnalyticsWrapper = {
  logEvent: (eventName: string, params?: Record<string, any>) => Promise<void>;
};

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
type AppInstance = typeof webApp | typeof nativeApp;
type AuthInstance = typeof webAuth | typeof nativeAuth;
type DBInstance = typeof webDb | typeof nativeDb;

export const app = Platform.OS === "web" ? webApp : nativeApp;
export const auth = Platform.OS === "web" ? webAuth : nativeAuth;
export const db = Platform.OS === "web" ? webDb : nativeDb;

export const analytics: AnalyticsWrapper =
  Platform.OS === "web"
    ? webAnalytics
    : {
        logEvent: async () => Promise.resolve(),
      };
