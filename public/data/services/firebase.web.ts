// public/data/services/firebase.web.ts

import { getAnalytics as getFirebaseAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);

// Analytics só em ambiente browser e se tiver measurementId
export const analytics = (
  typeof window !== "undefined" &&
  firebaseConfig.measurementId
)
  ? getFirebaseAnalytics(app)
  : {
      logEvent: (_eventName: string, _params?: Record<string, any>) =>
        Promise.resolve(),
    };

// Auth e Firestore funcionam normalmente no web
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app };

