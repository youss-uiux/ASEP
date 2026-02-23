-- ============================================================
-- Migration 004 : Normalisation snake_case + Fix RLS définitif
-- ============================================================

-- 1. Supprimer TOUTES les policies existantes sur leads
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'leads'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.leads', pol.policyname);
  END LOOP;
END $$;

-- 2. Renommer la colonne "fullName" en full_name (snake_case standard)
--    Ignorer si déjà renommée
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'fullName'
  ) THEN
    ALTER TABLE public.leads RENAME COLUMN "fullName" TO full_name;
  END IF;
END $$;

-- 3. Reset RLS
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Policy unique ultra-permissive (tous rôles, toutes opérations)
CREATE POLICY "public_all_access"
  ON public.leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Vérification
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'leads' ORDER BY ordinal_position;

SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'leads';

