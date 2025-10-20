-- ============================================
-- GESET Pro - Données de Test
-- ============================================
-- Ce fichier contient des données de test pour démarrer rapidement
-- Exécutez ce script dans votre base de données Supabase après la migration initiale

-- IMPORTANT: Ce script suppose que la migration 001_create_school_management_schema.sql a été exécutée

-- ============================================
-- 1. CLASSES
-- ============================================

INSERT INTO classes (nom, niveau_type, niveau, effectif_max, annee_scolaire) VALUES
-- Maternelle
('Petite Section A', 'MATERNELLE', 'Petite Section', 30, '2024-2025'),
('Moyenne Section A', 'MATERNELLE', 'Moyenne Section', 30, '2024-2025'),
('Grande Section A', 'MATERNELLE', 'Grande Section', 30, '2024-2025'),

-- Primaire
('CP1 A', 'PRIMAIRE', 'CP1', 40, '2024-2025'),
('CP2 A', 'PRIMAIRE', 'CP2', 40, '2024-2025'),
('CE1 A', 'PRIMAIRE', 'CE1', 40, '2024-2025'),
('CE2 A', 'PRIMAIRE', 'CE2', 40, '2024-2025'),
('CM1 A', 'PRIMAIRE', 'CM1', 40, '2024-2025'),
('CM2 A', 'PRIMAIRE', 'CM2', 40, '2024-2025'),

-- Secondaire
('6ème A', 'SECONDAIRE', '6e', 50, '2024-2025'),
('5ème A', 'SECONDAIRE', '5e', 50, '2024-2025'),
('4ème A', 'SECONDAIRE', '4e', 50, '2024-2025'),
('3ème A', 'SECONDAIRE', '3e', 50, '2024-2025'),
('2nde A', 'SECONDAIRE', '2de', 45, '2024-2025'),
('1ère A', 'SECONDAIRE', '1re', 45, '2024-2025'),
('Terminale A', 'SECONDAIRE', 'Tle', 45, '2024-2025')
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. MATIÈRES
-- ============================================

INSERT INTO subjects (nom, code, coefficient, niveaux_type, niveaux) VALUES
-- Maternelle
('Éveil', 'EVEIL', 2, ARRAY['MATERNELLE'], ARRAY['Petite Section', 'Moyenne Section', 'Grande Section']),
('Graphisme', 'GRAPH', 2, ARRAY['MATERNELLE'], ARRAY['Petite Section', 'Moyenne Section', 'Grande Section']),
('Motricité', 'MOTR', 1, ARRAY['MATERNELLE'], ARRAY['Petite Section', 'Moyenne Section', 'Grande Section']),

-- Primaire
('Français', 'FR', 3, ARRAY['PRIMAIRE'], ARRAY['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']),
('Mathématiques', 'MATH', 3, ARRAY['PRIMAIRE'], ARRAY['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']),
('Sciences', 'SCI', 2, ARRAY['PRIMAIRE'], ARRAY['CE1', 'CE2', 'CM1', 'CM2']),
('Histoire-Géographie', 'HIST', 2, ARRAY['PRIMAIRE'], ARRAY['CE1', 'CE2', 'CM1', 'CM2']),
('Éducation Civique et Morale', 'ECM', 1, ARRAY['PRIMAIRE'], ARRAY['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']),
('Anglais', 'ANG', 2, ARRAY['PRIMAIRE'], ARRAY['CM1', 'CM2']),
('Éducation Physique', 'EPS', 1, ARRAY['PRIMAIRE'], ARRAY['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2']),

-- Secondaire
('Français', 'FR-SEC', 4, ARRAY['SECONDAIRE'], ARRAY['6e', '5e', '4e', '3e', '2de', '1re', 'Tle']),
('Mathématiques', 'MATH-SEC', 4, ARRAY['SECONDAIRE'], ARRAY['6e', '5e', '4e', '3e', '2de', '1re', 'Tle']),
('Sciences Physiques', 'PHYS', 3, ARRAY['SECONDAIRE'], ARRAY['4e', '3e', '2de', '1re', 'Tle']),
('Sciences de la Vie et de la Terre', 'SVT', 3, ARRAY['SECONDAIRE'], ARRAY['6e', '5e', '4e', '3e', '2de', '1re', 'Tle']),
('Histoire-Géographie', 'HIST-SEC', 3, ARRAY['SECONDAIRE'], ARRAY['6e', '5e', '4e', '3e', '2de', '1re', 'Tle']),
('Anglais', 'ANG-SEC', 3, ARRAY['SECONDAIRE'], ARRAY['6e', '5e', '4e', '3e', '2de', '1re', 'Tle']),
('Philosophie', 'PHILO', 4, ARRAY['SECONDAIRE'], ARRAY['Tle']),
('Économie', 'ECO', 3, ARRAY['SECONDAIRE'], ARRAY['2de', '1re', 'Tle']),
('Éducation Physique', 'EPS-SEC', 2, ARRAY['SECONDAIRE'], ARRAY['6e', '5e', '4e', '3e', '2de', '1re', 'Tle'])
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. ENSEIGNANTS
-- ============================================

INSERT INTO teachers (
  matricule, nom, prenom, date_naissance, lieu_naissance, sexe, adresse,
  telephone, email, diplome, specialite, niveaux_type, matieres,
  date_recrutement, situation_matrimoniale, nombre_enfants,
  personne_urgence, telephone_urgence, statut
) VALUES
('ENS202400001', 'OUEDRAOGO', 'Marie', '1985-06-15', 'Ouagadougou', 'F', 'Ouaga 2000',
 '70123456', 'marie.ouedraogo@example.com', 'Licence', 'Français', ARRAY['PRIMAIRE', 'SECONDAIRE'],
 ARRAY['Français'], '2020-09-01', 'marie', 2, 'OUEDRAOGO Jean', '70654321', 'actif'),

('ENS202400002', 'KABORE', 'Paul', '1982-03-20', 'Bobo-Dioulasso', 'M', 'Somgandé',
 '75987654', 'paul.kabore@example.com', 'Master', 'Mathématiques', ARRAY['PRIMAIRE', 'SECONDAIRE'],
 ARRAY['Mathématiques'], '2019-09-01', 'marie', 3, 'KABORE Sophie', '75456789', 'actif'),

('ENS202400003', 'SAWADOGO', 'Fatima', '1990-11-10', 'Koudougou', 'F', 'Gounghin',
 '76543210', 'fatima.sawadogo@example.com', 'Licence', 'Sciences', ARRAY['PRIMAIRE', 'SECONDAIRE'],
 ARRAY['Sciences', 'Sciences Physiques', 'SVT'], '2021-09-01', 'celibataire', 0, 'SAWADOGO Ali', '76111222', 'actif'),

('ENS202400004', 'TRAORE', 'Ibrahim', '1988-09-05', 'Ouagadougou', 'M', 'Tanghin',
 '77123456', 'ibrahim.traore@example.com', 'Licence', 'Histoire-Géographie', ARRAY['PRIMAIRE', 'SECONDAIRE'],
 ARRAY['Histoire-Géographie'], '2020-09-01', 'marie', 1, 'TRAORE Aminata', '77654321', 'actif'),

('ENS202400005', 'SOME', 'Aïcha', '1992-04-18', 'Ouahigouya', 'F', 'Kossodo',
 '78987654', 'aicha.some@example.com', 'Licence', 'Anglais', ARRAY['PRIMAIRE', 'SECONDAIRE'],
 ARRAY['Anglais'], '2022-09-01', 'celibataire', 0, 'SOME Moussa', '78111222', 'actif')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. FRAIS SCOLAIRES
-- ============================================

INSERT INTO fees (nom, montant, type, obligatoire, classe_ids) VALUES
-- Frais d'inscription (toutes les classes)
('Inscription 2024-2025', 25000, 'inscription', true,
 (SELECT array_agg(id::text) FROM classes)),

-- Scolarité Maternelle
('Scolarité Maternelle - Trimestre 1', 50000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'MATERNELLE')),

('Scolarité Maternelle - Trimestre 2', 50000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'MATERNELLE')),

('Scolarité Maternelle - Trimestre 3', 50000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'MATERNELLE')),

-- Scolarité Primaire
('Scolarité Primaire - Trimestre 1', 75000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'PRIMAIRE')),

('Scolarité Primaire - Trimestre 2', 75000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'PRIMAIRE')),

('Scolarité Primaire - Trimestre 3', 75000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'PRIMAIRE')),

-- Scolarité Secondaire
('Scolarité Secondaire - Trimestre 1', 100000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'SECONDAIRE')),

('Scolarité Secondaire - Trimestre 2', 100000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'SECONDAIRE')),

('Scolarité Secondaire - Trimestre 3', 100000, 'scolarite', true,
 (SELECT array_agg(id::text) FROM classes WHERE niveau_type = 'SECONDAIRE')),

-- Autres frais
('Cantine mensuelle', 20000, 'cantine', false,
 (SELECT array_agg(id::text) FROM classes)),

('Transport mensuel', 15000, 'transport', false,
 (SELECT array_agg(id::text) FROM classes)),

('Fournitures scolaires', 30000, 'fournitures', false,
 (SELECT array_agg(id::text) FROM classes))
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES IMPORTANTES
-- ============================================
-- Les élèves, notes et paiements doivent être ajoutés via l'interface
-- pour générer automatiquement les matricules et numéros de reçu

-- Pour ajouter des élèves de test, utilisez l'interface web :
-- Menu > Élèves > + Nouvel Élève

-- Pour ajouter des notes de test :
-- Menu > Notes > + Nouvelle Note

-- Pour enregistrer des paiements :
-- Menu > Frais > Onglet Paiements > + Nouveau Paiement

-- ============================================
-- VÉRIFICATION DES DONNÉES
-- ============================================

-- Compter les données insérées
SELECT
  'Classes' as table_name,
  COUNT(*) as count
FROM classes
UNION ALL
SELECT
  'Matières' as table_name,
  COUNT(*) as count
FROM subjects
UNION ALL
SELECT
  'Enseignants' as table_name,
  COUNT(*) as count
FROM teachers
UNION ALL
SELECT
  'Frais' as table_name,
  COUNT(*) as count
FROM fees;

-- Afficher la structure
SELECT
  niveau_type,
  COUNT(*) as nombre_classes
FROM classes
GROUP BY niveau_type
ORDER BY
  CASE
    WHEN niveau_type = 'MATERNELLE' THEN 1
    WHEN niveau_type = 'PRIMAIRE' THEN 2
    WHEN niveau_type = 'SECONDAIRE' THEN 3
  END;
