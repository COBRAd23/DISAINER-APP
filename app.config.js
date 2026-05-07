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
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
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
      firebaseApiKey: env.FIREBASE_API_KEY || '',
    },
  },
};
