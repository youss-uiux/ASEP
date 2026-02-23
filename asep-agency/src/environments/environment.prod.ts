export const environment = {
  production: true,

  // ── Supabase ──────────────────────────────────────────────
  supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',

  // ── Firebase ──────────────────────────────────────────────
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },

  // ── FCM VAPID Key (Web Push) ──────────────────────────────
  fcmVapidKey: 'YOUR_VAPID_KEY',
};

