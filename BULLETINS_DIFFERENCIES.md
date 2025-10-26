# Système de Bulletins Différenciés - GESET Pro

## Vue d'ensemble

GESET Pro génère automatiquement des bulletins adaptés au niveau d'enseignement :
- **Bulletin Primaire** : Format simplifié avec moyennes par matière
- **Bulletin Secondaire** : Format détaillé conforme au modèle burkinabè

## Fonctionnement

### Détection Automatique

Le système détecte automatiquement le type de bulletin à générer selon la classe :

```typescript
const isSecondaire = classe.niveauType === 'SECONDAIRE';
```

- **PRIMAIRE** → Bulletin primaire simple
- **SECONDAIRE** → Bulletin secondaire professionnel

### Bulletin Secondaire (Implémenté)

Basé sur le modèle officiel du Burkina Faso, le bulletin secondaire comprend :

#### En-tête
- Logo de l'établissement (gauche)
- Nom de l'établissement (centre)
- Devise et slogan
- Adresse et contacts
- Burkina Faso + Année scolaire (droite)

#### Informations de l'élève
**Colonne Gauche :**
- Nom de l'élève
- Prénom(s)
- Né(e) le
- À (lieu de naissance)
- Sexe

**Colonne Droite :**
- Matricule
- Classe
- Effectif
- Classe redoublée

#### Tableau des Notes
Colonnes :
1. **Disciplines** - Liste des matières
2. **Notes** :
   - Devoir (moyenne des devoirs)
   - Compo (moyenne des compositions)
   - Moyenne (moyenne générale de la matière)
3. **Coef** - Coefficient de la matière
4. **Pondéré** - Moyenne × Coefficient
5. **Appréciation** - Évaluation qualitative
6. **Signature du Professeur** - Espace pour signature

#### Ligne spéciale
- **Retrait de points** - Ligne pour déductions disciplinaires

#### Totaux et Statistiques
- Total des coefficients
- Total pondéré
- **Moyenne du trimestre**
- **Rang** de l'élève dans la classe
- Statistiques de la classe :
  - Faible moyenne
  - Forte moyenne
  - Moyenne de classe

#### Appréciation Générale
**Section TRAVAIL** (cases à cocher) :
- EXCELLENT
- TRES BIEN
- BIEN
- ASSEZ BIEN
- PASSABLE
- TRES INSUFFISANT

**Section SANCTIONS** (cases à cocher) :
- Tableau d'Honneur
- Encouragements
- Félicitations
- Avertissements
- Blâme

**Section CONDUITE** (cases à cocher) :
- Bonne
- Passable
- Mauvaise

#### Signature
- Espace pour signature et cachet du Proviseur
- Nom du directeur (si configuré)
- Date et lieu

### Bulletin Primaire (À personnaliser)

Format plus simple adapté au primaire :
- En-tête avec logo et établissement
- Informations élève basiques
- Tableau matière/coefficient/moyenne
- Moyenne générale
- Appréciation du directeur

**Note :** En attente du modèle spécifique du primaire pour mise à jour.

## Calcul des Moyennes

### Secondaire
```
Moyenne Matière = (Moyenne Devoirs + Moyenne Compositions) / 2
Pondéré = Moyenne Matière × Coefficient
Moyenne Trimestre = Σ(Pondérés) / Σ(Coefficients)
```

### Primaire
```
Moyenne Matière = Moyenne de toutes les notes
Moyenne Générale = Σ(Moyenne × Coef) / Σ(Coefficients)
```

## Calcul du Rang

Le rang est calculé en comparant la moyenne de l'élève avec celles de tous les élèves de la classe :

1. Calcul de la moyenne de chaque élève
2. Tri décroissant des moyennes
3. Position de l'élève dans la liste
4. Affichage : 1er, 2e, 3e, etc.

## Appréciations Automatiques

### Par matière
- ≥ 16 : **Excellent**
- ≥ 14 : **Très Bien**
- ≥ 12 : **Bien**
- ≥ 10 : **Passable**
- < 10 : **Insuffisant**

### Générale (Primaire)
- ≥ 16 : Excellent travail
- ≥ 14 : Très bien
- ≥ 12 : Bien
- ≥ 10 : Assez bien
- ≥ 8 : Passable
- < 8 : Insuffisant

## Génération des PDFs

### Processus
1. Sélection de la classe et du trimestre
2. Détection automatique du type de bulletin
3. Génération pour chaque élève
4. Téléchargement individuel ou groupé

### Fichiers générés
- **Secondaire** : `Bulletins_[Classe]_T[Trim]_[Nom].pdf`
- **Primaire** : `bulletin_[Classe]_T[Trim].pdf` (tous les élèves)

## Architecture Technique

### Fichiers impliqués
```
src/
├── components/
│   ├── GradeManagement.tsx      # Interface et logique principale
│   └── BulletinGenerator.tsx    # Générateur bulletin secondaire
├── types/
│   └── index.ts                 # Types TypeScript
└── utils/
    └── schoolSettings.ts        # Configuration établissement
```

### Classe BulletinGenerator
```typescript
class BulletinGenerator {
  static generateSecondaireBulletin(
    student: Student,
    classInfo: Class,
    subjects: Subject[],
    grades: Grade[],
    trimester: 1 | 2 | 3,
    classStudents: Student[],
    allGrades: Grade[]
  ): jsPDF
}
```

## Personnalisation

### Données de l'établissement
Toutes les informations proviennent des **Paramètres de l'école** :
- Nom de l'établissement
- Logo
- Adresse et contacts
- Devise
- Nom du directeur
- Année scolaire

### Couleurs et Style
- Couleur primaire pour les en-têtes (bulletin primaire)
- Police Helvetica (standard PDF)
- Mise en page professionnelle

## Types d'évaluations

### Secondaire
- **Devoir** : Évaluations continues
- **Composition** : Examens trimestriels
- Calcul séparé pour affichage détaillé

### Primaire
- Toutes notes confondues
- Moyenne simple par matière

## Prochaines Améliorations

### En attente
1. **Modèle bulletin primaire personnalisé**
   - Format adapté aux classes primaires
   - Disposition spécifique
   - Appréciations adaptées

2. **Options d'impression**
   - Aperçu avant génération
   - Impression par lots
   - Choix du format (A4/Letter)

3. **Statistiques avancées**
   - Évolution trimestre par trimestre
   - Graphiques de progression
   - Comparaison avec la classe

4. **Personnalisation**
   - Choix des sections à afficher
   - Textes personnalisables
   - Formats multiples

## Utilisation

### Pour les administrateurs
1. Aller dans **Gestion des Notes**
2. Sélectionner la classe et le trimestre
3. Cliquer sur **Générer Bulletin**
4. Le système détecte automatiquement le type
5. PDFs téléchargés automatiquement

### Pour les enseignants
1. Saisir les notes (devoirs et compositions)
2. Vérifier les moyennes
3. Demander la génération à l'administrateur

## Support et Questions

Pour personnaliser davantage les bulletins ou signaler un problème :
1. Vérifier la configuration dans **Paramètres de l'école**
2. S'assurer que toutes les notes sont saisies
3. Vérifier que les élèves sont bien affectés aux classes
4. Contrôler que les matières ont des coefficients définis

---

**Version actuelle :** 1.0.0
**Dernière mise à jour :** Octobre 2024
**Statut Bulletin Secondaire :** ✅ Implémenté
**Statut Bulletin Primaire :** ⏳ En attente du modèle
