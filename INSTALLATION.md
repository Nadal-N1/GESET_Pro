# Guide d'Installation Détaillé - GESET Pro

## 🎯 Guide Rapide (5 minutes)

```bash
# 1. Installer Node.js (si non installé)
# Télécharger depuis https://nodejs.org/

# 2. Vérifier l'installation
node --version  # Doit afficher v18.0.0 ou supérieur
npm --version   # Doit afficher 9.0.0 ou supérieur

# 3. Naviguer vers le dossier du projet
cd chemin/vers/project

# 4. Installer les dépendances
npm install

# 5. Lancer l'application
npm run dev

# 6. Ouvrir dans le navigateur
# http://localhost:5173

# 7. Se connecter
# Username: admin
# Password: admin123
```

## 📋 Installation Complète Pas à Pas

### Étape 1 : Installer Node.js

#### Windows
1. Télécharger Node.js depuis [nodejs.org](https://nodejs.org/)
2. Choisir la version LTS (Long Term Support)
3. Exécuter l'installateur
4. Suivre les instructions à l'écran
5. Redémarrer l'ordinateur

#### macOS
```bash
# Option 1 : Avec le site officiel
# Télécharger depuis https://nodejs.org/

# Option 2 : Avec Homebrew
brew install node
```

#### Linux (Ubuntu/Debian)
```bash
# Installer Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### Étape 2 : Télécharger le Projet

#### Option A : Avec Git
```bash
# Cloner le dépôt
git clone <url-du-projet>
cd project
```

#### Option B : Téléchargement ZIP
1. Télécharger le fichier ZIP du projet
2. Extraire dans un dossier de votre choix
3. Ouvrir un terminal dans ce dossier

### Étape 3 : Installer les Dépendances

```bash
# Se placer dans le dossier du projet
cd project

# Installer toutes les dépendances
npm install

# Attendre la fin de l'installation (peut prendre 2-5 minutes)
```

**En cas d'erreur :**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Étape 4 : Configuration de la Base de Données

#### Option A : Utiliser Supabase Existant (Recommandé)
Le fichier `.env` est déjà configuré. Aucune action nécessaire.

#### Option B : Créer Votre Propre Supabase

1. **Créer un compte Supabase**
   - Aller sur [supabase.com](https://supabase.com)
   - Cliquer sur "Start your project"
   - Créer un compte gratuit

2. **Créer un nouveau projet**
   - Cliquer sur "New Project"
   - Choisir un nom pour votre projet
   - Choisir un mot de passe pour la base de données
   - Sélectionner une région proche de vous
   - Cliquer sur "Create new project"

3. **Récupérer les identifiants**
   - Aller dans "Settings" > "API"
   - Copier "Project URL"
   - Copier "anon public" key

4. **Configurer le fichier .env**
   ```bash
   # Éditer le fichier .env
   VITE_SUPABASE_URL=votre_project_url
   VITE_SUPABASE_ANON_KEY=votre_anon_key
   ```

5. **Créer les tables**
   - Aller dans "SQL Editor" dans le tableau de bord Supabase
   - Cliquer sur "New query"
   - Copier tout le contenu du fichier `supabase/migrations/001_create_school_management_schema.sql`
   - Coller dans l'éditeur SQL
   - Cliquer sur "Run" pour exécuter

### Étape 5 : Lancer l'Application

```bash
# Mode développement
npm run dev

# L'application sera accessible sur :
# http://localhost:5173
```

**Ouvrir dans le navigateur :**
- Copier l'URL affichée dans le terminal
- Coller dans votre navigateur (Chrome, Firefox, Edge, Safari)

### Étape 6 : Première Connexion

**Identifiants par défaut :**
```
Username : admin
Password : admin123
```

**Après la première connexion :**
1. Aller dans "Paramètres" > "Utilisateurs"
2. Modifier le mot de passe admin
3. Créer d'autres utilisateurs si nécessaire

### Étape 7 : Configuration Initiale

#### 1. Paramètres de l'École
- Aller dans "Paramètres" > "Paramètres de l'École"
- Renseigner les informations de l'établissement
- Uploader le logo
- Choisir les couleurs
- Sauvegarder

#### 2. Créer les Classes
- Aller dans "Classes"
- Cliquer sur "+ Nouvelle Classe"
- Renseigner les informations
- Répéter pour chaque classe

#### 3. Créer les Matières
- Aller dans "Matières"
- Cliquer sur "+ Nouvelle Matière"
- Renseigner nom, code, coefficient
- Sélectionner les niveaux concernés
- Répéter pour chaque matière

#### 4. Ajouter des Enseignants
- Aller dans "Enseignants"
- Cliquer sur "+ Nouvel Enseignant"
- Remplir le formulaire
- Sauvegarder

#### 5. Inscrire des Élèves
- Aller dans "Élèves"
- Cliquer sur "+ Nouvel Élève"
- Remplir le formulaire
- Sélectionner la classe
- Sauvegarder

## 🔧 Configuration Avancée

### Changer le Port de Développement

```bash
# Par défaut : 5173
# Pour utiliser le port 3000
npm run dev -- --port 3000
```

### Variables d'Environnement

Créer un fichier `.env.local` pour vos paramètres personnels :
```env
VITE_SUPABASE_URL=votre_url
VITE_SUPABASE_ANON_KEY=votre_cle
VITE_APP_NAME=Nom de votre école
```

### Mode Production

```bash
# Créer un build optimisé
npm run build

# Le dossier dist/ contiendra l'application compilée

# Prévisualiser le build
npm run preview
```

## 🚀 Déploiement

### Netlify (Gratuit et Simple)

1. **Créer un compte sur [Netlify](https://www.netlify.com)**

2. **Déployer**
   ```bash
   # Créer le build
   npm run build

   # Option A : Glisser-déposer le dossier dist/ sur Netlify

   # Option B : Avec Netlify CLI
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Configurer les variables d'environnement**
   - Dans le tableau de bord Netlify
   - Site settings > Environment variables
   - Ajouter VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

### Vercel (Alternative)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
npm run build
vercel deploy --prod
```

### Serveur Local (Windows/Linux)

#### Windows avec XAMPP
1. Installer XAMPP
2. Copier le dossier `dist/` dans `C:\xampp\htdocs\geset`
3. Accéder via `http://localhost/geset`

#### Linux avec Nginx
```bash
# Installer Nginx
sudo apt install nginx

# Copier les fichiers
sudo cp -r dist/* /var/www/html/geset/

# Configurer Nginx
sudo nano /etc/nginx/sites-available/geset
```

## 🐛 Résolution de Problèmes

### Erreur : "npm: command not found"
**Solution :** Node.js n'est pas installé ou pas dans le PATH
```bash
# Windows : Réinstaller Node.js en tant qu'administrateur
# Mac/Linux : Vérifier l'installation
which node
which npm
```

### Erreur : "Port 5173 is already in use"
**Solution :** Un autre processus utilise le port
```bash
# Option 1 : Utiliser un autre port
npm run dev -- --port 3000

# Option 2 : Tuer le processus (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Option 2 : Tuer le processus (Mac/Linux)
lsof -ti:5173 | xargs kill -9
```

### Erreur : "Cannot find module"
**Solution :** Dépendances manquantes
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Failed to fetch"
**Solution :** Problème de connexion Supabase
- L'application basculera automatiquement sur localStorage
- Vérifier votre connexion internet
- Vérifier les variables d'environnement

### Build qui échoue
```bash
# Vérifier les erreurs
npm run build

# Nettoyer le cache
rm -rf node_modules dist .vite
npm install
npm run build
```

### Page blanche après le build
**Solution :** Problème de configuration de base
- Vérifier que le fichier `.env` existe
- Vérifier les chemins dans `vite.config.ts`
- Vérifier la console du navigateur (F12)

## 📊 Vérification de l'Installation

### Checklist Complète

```bash
# ✅ Node.js installé
node --version
# Doit afficher : v18.x.x ou supérieur

# ✅ npm installé
npm --version
# Doit afficher : 9.x.x ou supérieur

# ✅ Dépendances installées
ls node_modules
# Doit contenir des dossiers

# ✅ Build fonctionne
npm run build
# Doit créer le dossier dist/

# ✅ Application démarre
npm run dev
# Doit afficher l'URL locale

# ✅ Connexion possible
# Ouvrir http://localhost:5173
# Se connecter avec admin/admin123
```

## 💡 Conseils de Performance

### Optimiser le Chargement
```bash
# Nettoyer régulièrement
npm run build
rm -rf dist

# Utiliser la compression
# (automatique avec Netlify/Vercel)
```

### Limiter l'Utilisation Mémoire
- Fermer les onglets inutilisés du navigateur
- Redémarrer le serveur de développement régulièrement
- Vider le cache du navigateur si lent

## 📱 Accès depuis d'Autres Appareils

### Sur le Réseau Local

```bash
# Trouver votre IP locale
# Windows
ipconfig

# Mac/Linux
ifconfig

# Lancer avec accès réseau
npm run dev -- --host

# Accéder depuis un autre appareil
# http://VOTRE_IP:5173
# Exemple : http://192.168.1.10:5173
```

## 🔐 Sécurité

### Changements Importants Après Installation

1. **Changer le mot de passe admin**
2. **Configurer Supabase RLS** (déjà fait dans la migration)
3. **Activer HTTPS** en production
4. **Sauvegarder régulièrement** les données
5. **Limiter l'accès** aux comptes utilisateurs

## 📞 Support

### Ressources Utiles
- Documentation Supabase : https://supabase.com/docs
- Documentation React : https://react.dev
- Documentation Vite : https://vitejs.dev

### En Cas de Blocage
1. Vérifier les logs dans la console (F12 dans le navigateur)
2. Vérifier le terminal pour les erreurs
3. Consulter la documentation du projet
4. Vérifier que toutes les étapes ont été suivies

## ✅ Installation Réussie !

Si vous voyez l'écran de connexion, félicitations ! L'installation est complète.

**Prochaines Étapes :**
1. Se connecter avec les identifiants par défaut
2. Configurer les paramètres de l'école
3. Créer les classes et matières
4. Commencer à utiliser GESET Pro

**Bon usage ! 🎉**
