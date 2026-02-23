export const environment = {
  production: false,

  // ── Supabase ──────────────────────────────────────────────
  supabaseUrl: 'https://pgomyxwhnrikpwwopywj.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnb215eHdobnJpa3B3d29weXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTgyOTUsImV4cCI6MjA4NzQzNDI5NX0.g9E5YKg2mkVIbSluFGHEfUlXI92e2VYAJwKUu6mtt5Q',

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

