// supabase/functions/on-new-lead/index.ts
// ============================================================
// Edge Function : Déclenchée via Database Webhook sur INSERT leads
// 1) Envoie un email de notification à l'agence via Resend
// 2) Envoie une notification push FCM à tous les admin_tokens
// ============================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── Types ───────────────────────────────────────────────────
interface Lead {
  id: string;
  service: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  duration: string;
  notes: string;
  status: string;
  created_at: string;
}

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: Lead;
  schema: string;
}

// ── Constantes d'environnement ──────────────────────────────
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const AGENCY_EMAIL = Deno.env.get('AGENCY_EMAIL') || 'contact@asep-agency.com';

// Firebase Cloud Messaging
const FCM_PROJECT_ID = Deno.env.get('FCM_PROJECT_ID')!;
const FCM_SERVICE_ACCOUNT_EMAIL = Deno.env.get('FCM_SERVICE_ACCOUNT_EMAIL')!;
const FCM_PRIVATE_KEY = Deno.env.get('FCM_PRIVATE_KEY')!;

// ── Helpers ─────────────────────────────────────────────────

/**
 * Génère un JWT pour l'API FCM HTTP v1 via un Service Account Google.
 */
async function getFCMAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      iss: FCM_SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  );

  const textEncoder = new TextEncoder();
  const signingInput = `${header}.${payload}`;

  // Import de la clé privée RSA
  const pemContents = FCM_PRIVATE_KEY
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    textEncoder.encode(signingInput)
  );

  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  const jwt = `${signingInput}.${base64Signature}`;

  // Échange du JWT contre un access_token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

/**
 * Envoie un email de notification via l'API Resend.
 */
async function sendEmailNotification(lead: Lead): Promise<void> {
  const serviceLabels: Record<string, string> = {
    nanny: '👶 Nounou',
    gardener: '🌿 Jardinier',
    guard: '🛡️ Gardien',
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'ASEP Agency <notifications@asep-agency.com>',
      to: [AGENCY_EMAIL],
      subject: `🔔 Nouvelle demande — ${serviceLabels[lead.service] || lead.service}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00A3D9;">Nouvelle demande de service</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: 600;">Service</td><td style="padding: 8px;">${serviceLabels[lead.service] || lead.service}</td></tr>
            <tr style="background: #f8f8f8;"><td style="padding: 8px; font-weight: 600;">Nom</td><td style="padding: 8px;">${lead.fullName}</td></tr>
            <tr><td style="padding: 8px; font-weight: 600;">Email</td><td style="padding: 8px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
            <tr style="background: #f8f8f8;"><td style="padding: 8px; font-weight: 600;">Téléphone</td><td style="padding: 8px;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: 600;">Adresse</td><td style="padding: 8px;">${lead.address}</td></tr>
            <tr style="background: #f8f8f8;"><td style="padding: 8px; font-weight: 600;">Date</td><td style="padding: 8px;">${lead.date}</td></tr>
            <tr><td style="padding: 8px; font-weight: 600;">Durée</td><td style="padding: 8px;">${lead.duration}</td></tr>
            ${lead.notes ? `<tr style="background: #f8f8f8;"><td style="padding: 8px; font-weight: 600;">Notes</td><td style="padding: 8px;">${lead.notes}</td></tr>` : ''}
          </table>
          <p style="margin-top: 24px; font-size: 0.85rem; color: #888;">
            Reçu le ${new Date(lead.created_at).toLocaleString('fr-FR')}
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[Resend] Erreur envoi email:', error);
  } else {
    console.log('[Resend] Email envoyé avec succès à', AGENCY_EMAIL);
  }
}

/**
 * Envoie une notification push FCM à tous les tokens admin.
 */
async function sendPushNotifications(lead: Lead): Promise<void> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Récupère tous les tokens
  const { data: tokens, error } = await supabase
    .from('admin_tokens')
    .select('token');

  if (error || !tokens || tokens.length === 0) {
    console.log('[FCM] Aucun token admin trouvé, push ignoré.');
    return;
  }

  const accessToken = await getFCMAccessToken();

  const serviceLabels: Record<string, string> = {
    nanny: '👶 Nounou',
    gardener: '🌿 Jardinier',
    guard: '🛡️ Gardien',
  };

  const results = await Promise.allSettled(
    tokens.map(({ token }) =>
      fetch(
        `https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: {
              token,
              notification: {
                title: `🔔 Nouvelle demande — ${serviceLabels[lead.service] || lead.service}`,
                body: `${lead.fullName} recherche un(e) ${serviceLabels[lead.service]?.toLowerCase() || lead.service}. Contactez-le au ${lead.phone}.`,
              },
              webpush: {
                fcm_options: {
                  link: `${SUPABASE_URL.replace('.supabase.co', '')}/leads`,
                },
              },
              data: {
                lead_id: lead.id,
                service: lead.service,
              },
            },
          }),
        }
      )
    )
  );

  const successes = results.filter((r) => r.status === 'fulfilled').length;
  const failures = results.filter((r) => r.status === 'rejected').length;
  console.log(`[FCM] Notifications envoyées: ${successes} succès, ${failures} échecs`);
}

// ── Handler principal ───────────────────────────────────────

serve(async (req: Request) => {
  try {
    // Vérification CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const payload: WebhookPayload = await req.json();

    // Vérification que c'est bien un INSERT sur leads
    if (payload.type !== 'INSERT' || payload.table !== 'leads') {
      return new Response(
        JSON.stringify({ message: 'Événement ignoré' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const lead = payload.record;
    console.log(`[on-new-lead] Nouveau lead reçu: ${lead.id} — ${lead.fullName}`);

    // Exécute les deux actions en parallèle
    await Promise.allSettled([
      sendEmailNotification(lead),
      sendPushNotifications(lead),
    ]);

    return new Response(
      JSON.stringify({ success: true, lead_id: lead.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[on-new-lead] Erreur:', err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

