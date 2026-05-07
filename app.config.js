const fs = require('fs');
const path = require('path');
const appJson = require('./app.json');

const envPath = path.resolve(__dirname, '.env');
let env = {};

if (fs.existsSync(envPath)) {
  const contents = fs.readFileSync(envPath, 'utf8');
  contents.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match) {
      let value = match[2];
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      env[match[1]] = value;
    }
  });
}

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra || {}),
      // Firebase
      firebaseApiKey: env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: env.FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: env.FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: env.FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: env.FIREBASE_APP_ID || '',
      // Google OAuth
      googleWebClientId: env.GOOGLE_WEB_CLIENT_ID || '',
      googleAndroidClientId: env.GOOGLE_ANDROID_CLIENT_ID || '',
      googleIosClientId: env.GOOGLE_IOS_CLIENT_ID || '',
    },
  },
};