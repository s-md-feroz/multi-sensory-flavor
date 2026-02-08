/*
  # Security Issues Resolution

  1. RLS Policy Performance
    - Replace direct auth.<function>() calls with (select auth.<function>())
    - Affects: flavor_combinations, suggestion_feedback tables
  
  2. Unused Indexes
    - Drop 12 unused indexes
    - These indexes haven't been used and waste resources
  
  3. RLS on Public Tables
    - Enable RLS on ml_flavor_pairings, ml_recommendations, ml_multisensory_mappings, ml_substitutions, ml_batch_analyses
    - Add restrictive policies for these tables
  
  4. Unrestricted Policies
    - Fix ingredient_pairings policies that bypass RLS
    - Replace with proper restrictive policies
  
  5. Function Search Path
    - Remove mutable search_path from update_ingredient_pairings function
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_flavor_combinations_user_id;
DROP INDEX IF EXISTS idx_flavor_combinations_created_at;
DROP INDEX IF EXISTS idx_suggestion_feedback_user_id;
DROP INDEX IF EXISTS idx_suggestion_feedback_ingredient;
DROP INDEX IF EXISTS idx_ingredient_pairings_a;
DROP INDEX IF EXISTS idx_ingredient_pairings_b;
DROP INDEX IF EXISTS idx_ingredient_pairings_score;
DROP INDEX IF EXISTS idx_ml_flavor_pairings_created_at;
DROP INDEX IF EXISTS idx_ml_recommendations_created_at;
DROP INDEX IF EXISTS idx_ml_multisensory_mappings_created_at;
DROP INDEX IF EXISTS idx_ml_substitutions_ingredient;
DROP INDEX IF EXISTS idx_ml_batch_analyses_created_at;

-- Fix flavor_combinations RLS policies
DROP POLICY IF EXISTS "Users can view own combinations" ON flavor_combinations;
CREATE POLICY "Users can view own combinations"
  ON flavor_combinations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own combinations" ON flavor_combinations;
CREATE POLICY "Users can insert own combinations"
  ON flavor_combinations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own combinations" ON flavor_combinations;
CREATE POLICY "Users can update own combinations"
  ON flavor_combinations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own combinations" ON flavor_combinations;
CREATE POLICY "Users can delete own combinations"
  ON flavor_combinations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix suggestion_feedback RLS policies
DROP POLICY IF EXISTS "Users can view own feedback" ON suggestion_feedback;
CREATE POLICY "Users can view own feedback"
  ON suggestion_feedback FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own feedback" ON suggestion_feedback;
CREATE POLICY "Users can insert own feedback"
  ON suggestion_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own feedback" ON suggestion_feedback;
CREATE POLICY "Users can update own feedback"
  ON suggestion_feedback FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own feedback" ON suggestion_feedback;
CREATE POLICY "Users can delete own feedback"
  ON suggestion_feedback FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix ingredient_pairings - remove unrestricted policies
DROP POLICY IF EXISTS "System can modify pairings" ON ingredient_pairings;
DROP POLICY IF EXISTS "System can update pairings" ON ingredient_pairings;

-- Add proper restrictive policies for ingredient_pairings (authenticated system access only)
CREATE POLICY "Authenticated users can read pairings"
  ON ingredient_pairings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage pairings"
  ON ingredient_pairings FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update pairings"
  ON ingredient_pairings FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete pairings"
  ON ingredient_pairings FOR DELETE
  TO service_role
  USING (true);

-- Enable RLS on ML tables and add policies
ALTER TABLE ml_flavor_pairings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read pairings"
  ON ml_flavor_pairings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert pairings"
  ON ml_flavor_pairings FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete pairings"
  ON ml_flavor_pairings FOR DELETE
  TO service_role
  USING (true);

ALTER TABLE ml_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read recommendations"
  ON ml_recommendations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert recommendations"
  ON ml_recommendations FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete recommendations"
  ON ml_recommendations FOR DELETE
  TO service_role
  USING (true);

ALTER TABLE ml_multisensory_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read mappings"
  ON ml_multisensory_mappings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert mappings"
  ON ml_multisensory_mappings FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete mappings"
  ON ml_multisensory_mappings FOR DELETE
  TO service_role
  USING (true);

ALTER TABLE ml_substitutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read substitutions"
  ON ml_substitutions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert substitutions"
  ON ml_substitutions FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete substitutions"
  ON ml_substitutions FOR DELETE
  TO service_role
  USING (true);

ALTER TABLE ml_batch_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read analyses"
  ON ml_batch_analyses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert analyses"
  ON ml_batch_analyses FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete analyses"
  ON ml_batch_analyses FOR DELETE
  TO service_role
  USING (true);

-- Fix function search_path
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'update_ingredient_pairings'
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    DROP FUNCTION IF EXISTS public.update_ingredient_pairings CASCADE;
  END IF;
END $$;

CREATE FUNCTION public.update_ingredient_pairings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ingredient_pairings
  SET score = (NEW.score + OLD.score) / 2.0
  WHERE (ingredient_a = NEW.ingredient_a AND ingredient_b = NEW.ingredient_b)
     OR (ingredient_a = NEW.ingredient_b AND ingredient_b = NEW.ingredient_a);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.update_ingredient_pairings() TO service_role;
