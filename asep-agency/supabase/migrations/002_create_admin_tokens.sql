-- ============================================================
-- Migration 002 : Table `admin_tokens`
-- Stocke les tokens FCM des administrateurs pour les push
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token       text        NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.admin_tokens ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs anon peuvent insérer leur token
CREATE POLICY "Allow insert on admin_tokens"
  ON public.admin_tokens
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique : seul le service_role (edge functions) peut lire
CREATE POLICY "Allow service_role read on admin_tokens"
  ON public.admin_tokens
  FOR SELECT
  TO service_role
  USING (true);

-- Politique : anon peut lire pour vérifier si le token existe déjà
CREATE POLICY "Allow anon select on admin_tokens"
  ON public.admin_tokens
  FOR SELECT
  TO anon
  USING (true);

