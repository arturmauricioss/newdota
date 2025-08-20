import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
type AnalyticsType = {
  logEvent: (eventName: string, params?: Record<string, any>) => Promise<void>;
};

let analytics: AnalyticsType = {
  logEvent: async () => {},
};

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let db: any = null;


async function initFirebaseWeb() {
  const { getFirestore } = await import("firebase/firestore");
  const { getAnalytics, logEvent: logFirebaseEvent } = (await import("firebase/analytics")) as typeof import("firebase/analytics");

  db = getFirestore(app);

  if (location.protocol === "https:" && firebaseConfig.measurementId) {
    try {
      const nativeAnalytics = getAnalytics(app);
      analytics = {
        logEvent: (eventName: string, params?: Record<string, any>) =>
          Promise.resolve(logFirebaseEvent(nativeAnalytics, eventName, params)),
      };
    } catch (err) {
      console.warn("Analytics não pôde ser carregado:", err);
    }
  }
}
