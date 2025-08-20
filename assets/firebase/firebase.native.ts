import firebase from "@react-native-firebase/app";
import authModule from "@react-native-firebase/auth";
import firestoreModule from "@react-native-firebase/firestore";

const app = firebase.app();
const auth = authModule();
const db = firestoreModule();

export { app, auth, db };
