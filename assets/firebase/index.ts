// src/firebase/index.ts
import { Platform } from "react-native";
import firebaseConfig from "./firebaseConfig";

export async function signInAnonymously() {
  if (Platform.OS === "web") {
    const { initializeApp } = await import("firebase/app");
    const { getAuth, signInAnonymously: webAnon } = await import("firebase/auth");
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await webAnon(auth);
  } else {
    const authNative = require("@react-native-firebase/auth").default;
    await authNative().signInAnonymously();
  }
}
export async function initFirestore() {
  if (Platform.OS === "web") {
    const { initializeApp } = await import("firebase/app");
    const { initializeFirestore, persistentLocalCache } = await import("firebase/firestore");

    const app = initializeApp(firebaseConfig);
    initializeFirestore(app, { localCache: persistentLocalCache() });
  } else {
    const firestoreNative = require("@react-native-firebase/firestore").default;
    firestoreNative().settings({ persistence: true });
  }
}
