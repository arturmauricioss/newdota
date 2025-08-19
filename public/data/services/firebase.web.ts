import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);

const isBrowser = typeof window !== "undefined";

type AnalyticsWrapper = {
  logEvent: (eventName: string, params?: Record<string, any>) => Promise<void>;
};

let analytics: AnalyticsWrapper = {
  logEvent: async () => {},
};

if (isBrowser && firebaseConfig.measurementId) {
  import("firebase/analytics")
    .then(({ getAnalytics, logEvent }) => {
      const nativeAnalytics = getAnalytics(app);
      analytics = {
        logEvent: (eventName, params) =>
          Promise.resolve(logEvent(nativeAnalytics, eventName, params)),
      };
    })
    .catch((err) => {
      console.warn("Analytics não pôde ser carregado:", err);
    });
}


export const auth = isBrowser ? getAuth(app) : undefined;
export const db = isBrowser ? getFirestore(app) : undefined;
export { analytics, app };

