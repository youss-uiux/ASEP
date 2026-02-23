-- ============================================================
-- Migration 003 : Correctif RLS sur `leads` et `admin_tokens`
-- Supprime les anciennes policies restrictives et les recrée
-- sans clause TO anon pour couvrir tous les rôles (anon,
-- authenticated, clés publishable Supabase v2)
-- ============================================================

-- ── leads ───────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow public insert on leads"       ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated read on leads"  ON public.leads;

-- INSERT ouvert à tous les rôles (formulaire public, pas de auth)
CREATE POLICY "Allow public insert on leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- SELECT réservé aux utilisateurs authentifiés (dashboard admin)
CREATE POLICY "Allow authenticated read on leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- ── admin_tokens ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow insert on admin_tokens"              ON public.admin_tokens;
DROP POLICY IF EXISTS "Allow service_role read on admin_tokens"   ON public.admin_tokens;
DROP POLICY IF EXISTS "Allow anon select on admin_tokens"         ON public.admin_tokens;
DROP POLICY IF EXISTS "Allow public insert on admin_tokens"       ON public.admin_tokens;
DROP POLICY IF EXISTS "Allow public select on admin_tokens"       ON public.admin_tokens;

-- INSERT ouvert (enregistrement du token FCM côté frontend)
CREATE POLICY "Allow public insert on admin_tokens"
  ON public.admin_tokens
  FOR INSERT
  WITH CHECK (true);

-- SELECT ouvert (vérif doublon token côté frontend)
CREATE POLICY "Allow public select on admin_tokens"
  ON public.admin_tokens
  FOR SELECT
  USING (true);

