import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: any = null;
let analytics: {
  logEvent: (eventName: string, params?: Record<string, any>) => Promise<void>;
} = {
  logEvent: async () => {},
};

if (typeof window !== "undefined") {
  // Só inicializa Firebase no cliente
  const { getFirestore } = await import("firebase/firestore");
  const { getAnalytics, logEvent: logFirebaseEvent } = await import("firebase/analytics");

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  if (location.protocol === "https:" && firebaseConfig.measurementId) {
    try {
      const nativeAnalytics = getAnalytics(app);
      analytics = {
        logEvent: (eventName, params) =>
          Promise.resolve(logFirebaseEvent(nativeAnalytics, eventName, params)),
      };
    } catch (err) {
      console.warn("Analytics não pôde ser carregado:", err);
    }
  }
}

export { analytics, app, auth, db };

