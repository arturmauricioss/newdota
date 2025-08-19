import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { Platform } from "react-native";

type AnalyticsWrapper = {
  logEvent: (eventName: string, params?: Record<string, any>) => Promise<void>;
};

// Web SDK
import {
  analytics as webAnalytics,
  app as webApp,
  auth as webAuth,
  db as webDb,
} from "./firebase.web";

// Native SDK
import {
  app as nativeApp,
  auth as nativeAuth,
  db as nativeDb,
} from "./firebase.native";

// Narrowing para garantir que não seja null/undefined
export const app: FirebaseApp =
  Platform.OS === "web" ? (webApp as FirebaseApp) : nativeApp;

export const auth: Auth =
  Platform.OS === "web" ? (webAuth as Auth) : nativeAuth;

export const db: Firestore =
  Platform.OS === "web" ? (webDb as Firestore) : nativeDb;

export const analytics: AnalyticsWrapper =
  Platform.OS === "web"
    ? webAnalytics
    : {
        logEvent: async () => Promise.resolve(),
      };
