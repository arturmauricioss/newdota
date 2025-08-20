import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let db: any = null;
let analytics: {
  logEvent: (eventName: string, params?: Record<string, any>) => Promise<void>;
} = {
  logEvent: async () => {},
};

if (typeof window !== "undefined") {
  (async () => {
    const { getFirestore } = await import("firebase/firestore");
    const { getAnalytics, logEvent: logFirebaseEvent } = await import("firebase/analytics");

    db = getFirestore(app);

    if (location.protocol === "https:" && firebaseConfig.measurementId) {
      try {
        const nativeAnalytics = getAnalytics(app);
        analytics = {
          logEvent: async (eventName: string, params?: Record<string, any>) =>
            logFirebaseEvent(nativeAnalytics, eventName, params),
        };
      } catch (err) {
        console.warn("Analytics não pôde ser carregado:", err);
      }
    }
  })();
}

export { analytics, app, auth, db };

