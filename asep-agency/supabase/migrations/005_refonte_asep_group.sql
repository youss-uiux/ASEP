-- ============================================================
-- Migration 005 : Refonte ASEP Group — table services + leads
-- ============================================================

-- ══════════════════════════════════════════════════
-- 1. TABLE services
-- ══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.services (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  title            text NOT NULL,
  description      text NOT NULL,
  long_description text DEFAULT '',
  icon             text NOT NULL,
  image_url        text DEFAULT '',
  color            text DEFAULT '#00A3D9',
  grid_area        text DEFAULT '',
  features         jsonb DEFAULT '[]'::jsonb,
  display_order    int DEFAULT 0,
  is_active        boolean DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_active ON public.services (is_active, display_order);

-- ══════════════════════════════════════════════════
-- 2. SEED des 10 secteurs (INSERT OR IGNORE)
-- ══════════════════════════════════════════════════
INSERT INTO public.services (slug, title, description, long_description, icon, display_order, features)
VALUES
  ('personnel-rh', 'Personnel & RH',
   'Recrutement, formation et gestion de ressources humaines',
   'Mise à disposition de personnels temporaires et permanents. Recrutement ciblé, formation sur mesure et gestion complète des ressources humaines pour entreprises et institutions.',
   '👤', 1,
   '["Personnels temporaires", "Placement permanent", "Formation RH", "Gestion de paie"]'::jsonb),

  ('hygiene', 'Hygiène & Assainissement',
   'Nettoyage, entretien et désinfection professionnels',
   'Nettoyage industriel et résidentiel, désinfection, entretien de locaux administratifs et privés. Fourniture de produits et matériels d''entretien.',
   '🧹', 2,
   '["Nettoyage industriel", "Désinfection", "Entretien locaux", "Fourniture produits"]'::jsonb),

  ('multiservices', 'Multiservices Techniques',
   'Dépannage, maintenance et interventions techniques',
   'Dépannage mécanique, électricité, plomberie, soudure, froid, aménagement des espaces verts. Interventions à domicile ou en entreprise.',
   '🔧', 3,
   '["Plomberie", "Électricité", "Mécanique", "Espaces verts", "Soudure"]'::jsonb),

  ('evenementiel', 'Événementiel',
   'Organisation complète d''événements et traiteur',
   'Prestations de traiteur, coordination de cérémonies, conférences, ateliers, réceptions et autres festivités professionnelles ou privées.',
   '🎉', 4,
   '["Traiteur", "Cérémonies", "Conférences", "Réceptions"]'::jsonb),

  ('gardiennage', 'Gardiennage & Sécurité',
   'Surveillance et protection de biens et personnes',
   'Sécurité des biens et des personnes, surveillance de sites, gestion d''accès et protection rapprochée selon les normes en vigueur.',
   '🛡️', 5,
   '["Surveillance 24/7", "Gestion accès", "Rondes régulières", "Protection rapprochée"]'::jsonb),

  ('formation', 'Formation & Conseil',
   'Renforcement de capacités et accompagnement',
   'Renforcement des capacités, accompagnement en gestion, éducation financière, orientation professionnelle et innovation organisationnelle.',
   '🎓', 6,
   '["Gestion", "Éducation financière", "Coaching", "Innovation organisationnelle"]'::jsonb),

  ('fournitures', 'Fournitures de Bureau',
   'Matériel bureautique, informatique et logistique',
   'Vente et distribution de matériel bureautique, informatique et logistique pour entreprises et administrations.',
   '📦', 7,
   '["Bureautique", "Informatique", "Consommables", "Logistique"]'::jsonb),

  ('agrobusiness', 'Agro-business',
   'Production et commercialisation agroalimentaire',
   'Production, transformation et commercialisation de produits agroalimentaires locaux. Développement de projets agricoles durables.',
   '🌾', 8,
   '["Production", "Transformation", "Distribution", "Projets durables"]'::jsonb),

  ('logistique', 'Logistique & Transport',
   'Transport, manutention, stockage et distribution',
   'Gestion de flotte, transport de biens et de personnes, manutention, stockage et distribution à l''échelle nationale.',
   '🚚', 9,
   '["Transport", "Stockage", "Manutention", "Gestion de flotte"]'::jsonb),

  ('commerce', 'Commerce Général',
   'Import-export et négoce de biens divers',
   'Achat, vente et exportation de biens et produits divers, dans le respect des réglementations nationales et internationales.',
   '🌐', 10,
   '["Import", "Export", "Négoce", "Distribution"]'::jsonb)

ON CONFLICT (slug) DO NOTHING;

-- ══════════════════════════════════════════════════
-- 3. MISE À JOUR TABLE leads
-- ══════════════════════════════════════════════════
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS service_slug text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS client_type text DEFAULT 'particulier'
  CHECK (client_type IN ('particulier', 'entreprise', 'institution'));
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company text DEFAULT '';

-- Ajouter le statut 'in_progress'
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'in_progress', 'closed'));

-- Migrer les données existantes
UPDATE public.leads SET service_slug = service WHERE service_slug IS NULL;

UPDATE public.leads l SET service_id = s.id
FROM public.services s
WHERE (l.service = 'nanny'    AND s.slug = 'personnel-rh')
   OR (l.service = 'gardener' AND s.slug = 'multiservices')
   OR (l.service = 'guard'    AND s.slug = 'gardiennage');

CREATE INDEX IF NOT EXISTS idx_leads_service_slug ON public.leads (service_slug);

-- ══════════════════════════════════════════════════
-- 4. POLITIQUES RLS — TABLE services
-- ══════════════════════════════════════════════════
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services_public_read" ON public.services;
CREATE POLICY "services_public_read"
  ON public.services FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "services_admin_all" ON public.services;
CREATE POLICY "services_admin_all"
  ON public.services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ══════════════════════════════════════════════════
-- 5. POLITIQUES RLS — TABLE leads
-- ══════════════════════════════════════════════════
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_all_access" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated read on leads" ON public.leads;
DROP POLICY IF EXISTS "leads_public_insert" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_read" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_update" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_delete" ON public.leads;

CREATE POLICY "leads_public_insert"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "leads_admin_read"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "leads_admin_update"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "leads_admin_delete"
  ON public.leads FOR DELETE
  TO authenticated
  USING (true);

-- ══════════════════════════════════════════════════
-- 6. POLITIQUES RLS — TABLE admin_tokens
-- ══════════════════════════════════════════════════
DROP POLICY IF EXISTS "tokens_admin_delete" ON public.admin_tokens;
CREATE POLICY "tokens_admin_delete"
  ON public.admin_tokens FOR DELETE
  TO authenticated
  USING (true);

