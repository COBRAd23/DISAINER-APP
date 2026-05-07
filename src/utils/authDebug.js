import Constants from 'expo-constants';

export const checkGoogleAuthConfig = async () => {
  const config = {
    expoClientId: '622102470878-2hlejbsjp9mc4kp9cqjelfqdghccr13c.apps.googleusercontent.com',
    androidClientId: '622102470878-l9i730s0tnbj7bi7m4tqjdkcbv25saki.apps.googleusercontent.com',
    webClientId: '622102470878-2hlejbsjp9mc4kp9cqjelfqdghccr13c.apps.googleusercontent.com',
  };

  const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey || 'MISSING',
    authDomain: 'disainer-app.firebaseapp.com',
    projectId: 'disainer-app',
  };

  console.log('=== GOOGLE AUTH CONFIG ===');
  console.log('Expo Client ID:', config.expoClientId);
  console.log('Android Client ID:', config.androidClientId);
  console.log('Web Client ID:', config.webClientId);
  console.log('');
  console.log('=== FIREBASE CONFIG ===');
  console.log('API Key Status:', firebaseConfig.apiKey === 'MISSING' ? '❌ MISSING' : '✅ LOADED');
  console.log('Auth Domain:', firebaseConfig.authDomain);
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('');
  console.log('=== EXPO INFO ===');
  console.log('Platform:', Constants.platform?.web ? 'WEB' : Constants.platform?.ios ? 'iOS' : 'Android');
  console.log('Release Channel:', Constants.releaseChannel || 'default');
};

// Call this once on app startup for debugging
export const initAuthDebug = () => {
  checkGoogleAuthConfig();
};
