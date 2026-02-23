-- ============================================================
-- Migration 001 : Table `leads`
-- Stocke les demandes de clients depuis le formulaire Angular
-- ============================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service     text        NOT NULL,
  "fullName"  text        NOT NULL,
  email       text        NOT NULL,
  phone       text        NOT NULL,
  address     text        NOT NULL DEFAULT '',
  date        text        NOT NULL DEFAULT '',
  duration    text        NOT NULL DEFAULT '',
  notes       text        DEFAULT '',
  status      text        NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'contacted', 'closed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index pour recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_leads_status     ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Politique : tout le monde peut insérer (formulaire public)
CREATE POLICY "Allow public insert on leads"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique : seuls les utilisateurs authentifiés peuvent lire
CREATE POLICY "Allow authenticated read on leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- ── Webhook / Trigger ───────────────────────────────────────
-- Ce trigger appelle la Edge Function via pg_net (optionnel)
-- Vous pouvez aussi configurer un Database Webhook depuis le Dashboard.

-- CREATE OR REPLACE FUNCTION public.notify_new_lead()
-- RETURNS trigger AS $$
-- BEGIN
--   PERFORM net.http_post(
--     url     := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/on-new-lead',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'
--     ),
--     body    := row_to_json(NEW)::text
--   );
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_lead_inserted
--   AFTER INSERT ON public.leads
--   FOR EACH ROW
--   EXECUTE FUNCTION public.notify_new_lead();

