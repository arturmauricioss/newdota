import { getAnalytics as getFirebaseAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);

const isBrowser = typeof window !== "undefined";

export const analytics = isBrowser && firebaseConfig.measurementId
  ? getFirebaseAnalytics(app)
  : {
      logEvent: (_eventName: string, _params?: Record<string, any>) =>
        Promise.resolve(),
    };

export const auth = isBrowser ? getAuth(app) : undefined;
export const db = isBrowser ? getFirestore(app) : undefined;

export { app };

