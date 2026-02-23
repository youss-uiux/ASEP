import { Injectable, signal, inject } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private app: FirebaseApp;
  private messaging: Messaging;
  private supabase = inject(SupabaseService);

  /** Token FCM actuel */
  readonly fcmToken = signal<string | null>(null);

  /** Permission accordée ? */
  readonly permissionGranted = signal(false);

  /** Dernière notification reçue au premier plan */
  readonly lastNotification = signal<{ title: string; body: string } | null>(null);

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.messaging = getMessaging(this.app);
    this.listenToForegroundMessages();
  }

  /**
   * Demande la permission de notification et récupère le token FCM.
   * Stocke le token dans Supabase `admin_tokens`.
   */
  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.warn('[FCM] Permission refusée par l\'utilisateur.');
        this.permissionGranted.set(false);
        return null;
      }

      this.permissionGranted.set(true);

      const token = await getToken(this.messaging, {
        vapidKey: environment.fcmVapidKey,
      });

      if (token) {
        this.fcmToken.set(token);
        await this.supabase.saveAdminToken(token);
        console.log('[FCM] Token enregistré:', token.substring(0, 20) + '...');
      }

      return token;
    } catch (err) {
      console.error('[FCM] Erreur lors de la récupération du token:', err);
      return null;
    }
  }

  /**
   * Écoute les messages reçus quand l'application est au premier plan.
   */
  private listenToForegroundMessages(): void {
    onMessage(this.messaging, (payload) => {
      console.log('[FCM] Message reçu au premier plan:', payload);

      this.lastNotification.set({
        title: payload.notification?.title ?? 'Nouvelle notification',
        body: payload.notification?.body ?? '',
      });
    });
  }
}

