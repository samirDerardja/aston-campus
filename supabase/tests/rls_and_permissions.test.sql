-- Test automatisé de conformité RLS et règles de sécurité
-- Fichier : supabase/tests/rls_and_permissions.test.sql

BEGIN;

-- 1. Test : Vérifier le déclenchement de l'erreur sur tentative de mise à jour d'un cours Nevea en lecture seule
DO $$
DECLARE
  v_session_id UUID;
  v_error_caught BOOLEAN := FALSE;
BEGIN
  SELECT id INTO v_session_id FROM sessions WHERE source_type = 'nevea_readonly' LIMIT 1;
  
  IF v_session_id IS NOT NULL THEN
    BEGIN
      UPDATE sessions SET title = 'Tentative de modification illégale cours Nevea' WHERE id = v_session_id;
    EXCEPTION WHEN OTHERS THEN
      v_error_caught := TRUE;
    END;

    IF NOT v_error_caught THEN
      RAISE EXCEPTION 'TEST FAILED: La protection de modification des cours Nevea n a pas bloqué l UPDATE !';
    ELSE
      RAISE NOTICE 'TEST PASSED: La règle d immutabilité des séances Nevea a correctement rejeté l altération.';
    END IF;
  END IF;
END $$;

-- 2. Test : Vérifier l'unicité des codes cursus et promotions
DO $$
BEGIN
  IF (SELECT count(*) FROM cursus GROUP BY code HAVING count(*) > 1) > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Doublon détecté dans le référentiel des cursus';
  END IF;
  
  IF (SELECT count(*) FROM promotions GROUP BY code HAVING count(*) > 1) > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Doublon détecté dans les codes de promotions';
  END IF;

  RAISE NOTICE 'TEST PASSED: Contraintes d unicité valides sur les cursus et promotions.';
END $$;

ROLLBACK;
