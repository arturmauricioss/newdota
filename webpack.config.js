require("dotenv").config({ path: ".env.local" });
console.log("📦 API KEY:", process.env.EXPO_PUBLIC_FIREBASE_API_KEY);

const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const webpack = require("webpack");

module.exports = async (env, argv) => {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env.EXPO_PUBLIC_FIREBASE_API_KEY": JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_API_KEY),
      "process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN),
      "process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID": JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID),
      "process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET),
      "process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
      "process.env.EXPO_PUBLIC_FIREBASE_APP_ID": JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_APP_ID),
      "process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID": JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID),
    })
  );

  return config;
};
