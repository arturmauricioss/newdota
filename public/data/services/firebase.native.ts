import firebase from "@react-native-firebase/app";
import authModule from "@react-native-firebase/auth";
import firestoreModule from "@react-native-firebase/firestore";

// obtém a instância do app
const app  = firebase.app();
const auth = authModule();
const db   = firestoreModule();

// Se quiser analytics nativo, use:
// import analyticsModule from "@react-native-firebase/analytics";
// const analytics = analyticsModule();

export { app, auth, db /*, analytics*/ };
