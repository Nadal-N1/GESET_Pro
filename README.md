# GESET Pro - Système de Gestion Scolaire

## 📋 Description

GESET Pro est un système complet de gestion scolaire pour les établissements au Burkina Faso. Il permet de gérer les élèves, enseignants, classes, notes, paiements et de générer des bulletins scolaires.

## ✨ Fonctionnalités

- **Gestion des Élèves** : Inscription, profils, suivi
- **Gestion des Enseignants** : Profils, affectations, spécialités
- **Gestion des Classes** : Maternelle, Primaire, Secondaire
- **Gestion des Matières** : Coefficients, niveaux
- **Gestion des Notes** : Devoirs, compositions, moyennes
- **Gestion des Frais** : Scolarité, cantine, transport
- **Gestion des Paiements** : Reçus, historique
- **Bulletins de Notes** : Génération PDF avec logo école
- **Paramètres École** : Logo, couleurs, informations
- **Multi-utilisateurs** : Rôles (Administrateur, Secrétaire, Comptable, Enseignant, Directeur)

## 💻 Installation Windows (Exécutable)

### Pour les Utilisateurs Finaux

Si vous souhaitez simplement **utiliser** l'application sans installer Node.js :

1. **Téléchargez l'installateur Windows** : `GESET-Pro-Setup-1.0.0.exe`
2. **Double-cliquez** sur le fichier pour lancer l'installation
3. **Suivez l'assistant** d'installation
4. **Lancez l'application** depuis le raccourci sur votre bureau

📖 **Guide complet** : Consultez [GUIDE_INSTALLATION_WINDOWS.md](GUIDE_INSTALLATION_WINDOWS.md)

### Pour les Développeurs - Créer l'Exécutable

Si vous souhaitez **créer votre propre installateur Windows** :

```bash
# Installation des dépendances
npm install

# Créer l'installateur Windows
npm run electron:build:win
```

L'installateur sera créé dans le dossier `release/`

📖 **Guide complet** : Consultez [COMMENT_CREER_EXECUTABLE.md](COMMENT_CREER_EXECUTABLE.md) ou [CREATION_EXECUTABLE_SIMPLE.txt](CREATION_EXECUTABLE_SIMPLE.txt)

---

## 🚀 Installation Locale (Mode Développement)

### Prérequis

- **Node.js** : Version 18 ou supérieure ([Télécharger ici](https://nodejs.org/))
- **npm** : Inclus avec Node.js
- **Git** : Pour cloner le projet ([Télécharger ici](https://git-scm.com/))
- **Navigateur moderne** : Chrome, Firefox, Edge ou Safari

### Étapes d'Installation

#### 1. Cloner le Projet

```bash
git clone <url-du-projet>
cd project
```

Ou télécharger le ZIP et extraire dans un dossier.

#### 2. Installer les Dépendances

```bash
npm install
```

Cette commande installe toutes les bibliothèques nécessaires.

#### 3. Configuration de l'Environnement

Le fichier `.env` est déjà configuré avec Supabase. Vous pouvez l'utiliser tel quel ou créer votre propre base de données Supabase.

**Option A : Utiliser la configuration existante** (Recommandé)
```bash
# Le fichier .env est déjà configuré
# Aucune action nécessaire
```

**Option B : Créer votre propre base de données Supabase**
```bash
# 1. Créer un compte sur https://supabase.com
# 2. Créer un nouveau projet
# 3. Copier l'URL et la clé ANON
# 4. Modifier le fichier .env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

#### 4. Initialiser la Base de Données (Si nouvelle Supabase)

Si vous avez créé votre propre projet Supabase, exécutez la migration SQL :

```bash
# Aller sur votre tableau de bord Supabase
# SQL Editor > New Query
# Copier le contenu de supabase/migrations/001_create_school_management_schema.sql
# Exécuter la requête
```

#### 5. Lancer l'Application

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:5173**

#### 6. Connexion par Défaut

**Identifiants par défaut :**
- Username : `admin`
- Password : `admin123`

⚠️ **Important** : Changez le mot de passe après la première connexion !

## 🏗️ Architecture du Projet

```
project/
├── src/
│   ├── components/          # Composants React
│   │   ├── Dashboard.tsx
│   │   ├── StudentManagement.tsx
│   │   ├── TeacherManagement.tsx
│   │   ├── ClassManagement.tsx
│   │   ├── SubjectManagement.tsx
│   │   ├── GradeManagement.tsx
│   │   ├── FeeManagement.tsx
│   │   ├── SchoolSettings.tsx
│   │   └── ...
│   ├── utils/              # Utilitaires
│   │   ├── auth.ts        # Authentification
│   │   ├── storage.ts     # LocalStorage
│   │   ├── validators.ts  # Validations
│   │   ├── errorHandler.ts # Gestion erreurs
│   │   └── ...
│   ├── services/          # Services
│   │   └── database.ts    # Service Supabase
│   ├── lib/               # Bibliothèques
│   │   └── supabase.ts    # Client Supabase
│   ├── hooks/             # Hooks React
│   │   └── useDatabase.ts
│   ├── types/             # Types TypeScript
│   │   └── index.ts
│   ├── App.tsx            # Composant principal
│   └── main.tsx           # Point d'entrée
├── supabase/
│   └── migrations/        # Migrations SQL
├── public/                # Fichiers statiques
├── .env                   # Variables d'environnement
├── package.json           # Dépendances
└── vite.config.ts        # Configuration Vite
```

## 🔧 Commandes Disponibles

### Mode Web (Développement)

```bash
# Développement
npm run dev              # Lancer en mode développement web
npm run build            # Créer un build de production
npm run preview          # Prévisualiser le build

# Qualité du code
npm run lint             # Vérifier le code avec ESLint
```

### Mode Desktop (Electron)

```bash
# Développement
npm run electron:dev     # Lancer l'application Electron en mode dev

# Production - Créer les installateurs
npm run electron:build:win    # Créer installateur Windows (.exe)
npm run electron:build:mac    # Créer installateur macOS (.dmg)
npm run electron:build:linux  # Créer installateurs Linux (.AppImage, .deb)
npm run electron:build        # Créer pour toutes les plateformes
```

## 📦 Technologies Utilisées

- **React 18** : Interface utilisateur
- **TypeScript** : Typage statique
- **Vite** : Build tool moderne
- **Tailwind CSS** : Styles
- **Electron** : Framework desktop cross-platform
- **Supabase** : Base de données PostgreSQL
- **jsPDF** : Génération de PDF
- **Lucide React** : Icônes
- **IndexedDB (idb)** : Stockage local avancé

## 🔒 Sécurité

- **Validation des entrées** : Tous les champs sont validés
- **Sanitization** : Protection contre les injections
- **Row Level Security (RLS)** : Politique de sécurité Supabase
- **Gestion des erreurs** : Try-catch sur toutes les opérations
- **Authentification** : Système de login sécurisé

## 💾 Stockage des Données

Le système utilise une **architecture hybride** :

1. **Supabase (Priorité)** : Base de données cloud PostgreSQL
2. **LocalStorage (Fallback)** : Stockage local si Supabase indisponible

### Avantages
- ✅ Fonctionne hors ligne
- ✅ Synchronisation automatique
- ✅ Pas de perte de données
- ✅ Backup cloud automatique

## 📱 Fonctionnement Hors Ligne

L'application fonctionne **entièrement hors ligne** grâce au localStorage :
- Les données sont sauvegardées localement
- Synchronisation automatique quand la connexion revient
- Aucune perte de données

## 🎨 Personnalisation

### Logo de l'École
1. Aller dans **Paramètres > Paramètres de l'École**
2. Cliquer sur "Choisir un fichier" pour le logo
3. Le logo apparaîtra sur les bulletins PDF

### Couleurs
1. Aller dans **Paramètres > Paramètres de l'École**
2. Modifier les couleurs primaire et secondaire
3. Les couleurs s'appliquent à l'interface et aux bulletins

## 📄 Génération de Bulletins

Les bulletins PDF incluent :
- Logo et informations de l'école
- Photo et informations de l'élève
- Notes par matière avec coefficients
- Moyenne générale
- Appréciation automatique
- Signature du directeur

## 🐛 Dépannage

### Erreur d'installation des dépendances
```bash
# Nettoyer le cache et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème de connexion à Supabase
- Vérifier votre connexion internet
- L'application basculera automatiquement sur localStorage
- Vérifier que les variables d'environnement sont correctes

### Port déjà utilisé
```bash
# Utiliser un autre port
npm run dev -- --port 3000
```

### Erreur de build
```bash
# Vérifier les erreurs TypeScript
npm run build
```

## 📚 Documentation Complète

- **`ERROR_PREVENTION_GUIDE.md`** : Guide de prévention des erreurs
- **`SUPABASE_SETUP_GUIDE.md`** : Configuration Supabase détaillée
- **`ZERO_ERROR_CONFIGURATION.md`** : Architecture de sécurité

## 🆘 Support

En cas de problème :
1. Vérifier les logs dans la console du navigateur (F12)
2. Consulter la documentation dans le dossier du projet
3. Vérifier le statut de Supabase : https://status.supabase.com

## 📊 Données de Test

Pour tester l'application, vous pouvez créer :
- Des classes (ex: CP1, CE1, 6ème)
- Des matières (ex: Français, Mathématiques)
- Des élèves
- Des enseignants
- Des notes

## 🚀 Déploiement en Production

### Option 1 : Netlify (Recommandé)
```bash
npm run build
# Déposer le dossier dist/ sur Netlify
```

### Option 2 : Vercel
```bash
npm run build
vercel deploy
```

### Option 3 : Serveur Local
```bash
npm run build
# Servir le dossier dist/ avec nginx ou apache
```

## 📝 Notes Importantes

- **Backup régulier** : Exporter vos données régulièrement
- **Sécurité** : Changer les identifiants par défaut
- **Performance** : Le système supporte jusqu'à 10,000+ élèves
- **Support navigateurs** : Testé sur Chrome, Firefox, Edge, Safari

## 🔄 Mises à Jour

Pour mettre à jour le projet :
```bash
git pull origin main
npm install
npm run build
```

## 📖 Licence

Tous droits réservés © 2024 GESET Pro

## 👥 Contribution

Pour contribuer au projet, veuillez suivre les bonnes pratiques :
- Validation des données
- Tests avant commit
- Documentation du code
- Messages de commit clairs

## ✅ Checklist de Démarrage

- [ ] Node.js installé (v18+)
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` configuré
- [ ] Migration Supabase exécutée (si nouvelle DB)
- [ ] Application lancée (`npm run dev`)
- [ ] Connexion avec identifiants par défaut
- [ ] Mot de passe changé
- [ ] Logo école uploadé
- [ ] Paramètres école configurés
- [ ] Classes créées
- [ ] Matières créées
- [ ] Prêt à utiliser ! 🎉
