# Guide d'Installation - GESET Pro pour Windows

## 📦 Pour les Utilisateurs Finaux

### Installation Rapide

1. **Télécharger l'installateur**
   - Récupérez le fichier `GESET-Pro-Setup-1.0.0.exe`

2. **Lancer l'installation**
   - Double-cliquez sur le fichier `.exe`
   - Si Windows affiche un avertissement de sécurité, cliquez sur "Plus d'informations" puis "Exécuter quand même"

3. **Suivre l'assistant d'installation**
   - Acceptez les termes de la licence
   - Choisissez le dossier d'installation (par défaut : `C:\Program Files\GESET Pro\`)
   - Sélectionnez les options :
     - ✅ Créer un raccourci sur le bureau
     - ✅ Créer un raccourci dans le menu Démarrer
   - Cliquez sur "Installer"

4. **Lancer l'application**
   - Double-cliquez sur l'icône "GESET Pro" sur le bureau
   - Ou recherchez "GESET Pro" dans le menu Démarrer

5. **Première connexion**
   - Username : `admin`
   - Password : `admin123`
   - ⚠️ **Important** : Changez le mot de passe après la première connexion !

### Configuration Initiale

Après l'installation :

1. **Paramètres de l'école**
   - Allez dans Paramètres > Paramètres de l'École
   - Renseignez les informations de votre établissement
   - Téléchargez le logo de l'école

2. **Créer des utilisateurs**
   - Allez dans Gestion > Utilisateurs
   - Créez des comptes pour le personnel

3. **Configurer les classes et matières**
   - Créez les classes (CP1, CE1, 6ème, etc.)
   - Ajoutez les matières avec leurs coefficients

### Désinstallation

Pour désinstaller GESET Pro :

1. **Via le Panneau de configuration**
   - Ouvrez "Paramètres" > "Applications"
   - Recherchez "GESET Pro"
   - Cliquez sur "Désinstaller"

2. **Via le programme de désinstallation**
   - Allez dans `C:\Program Files\GESET Pro\`
   - Exécutez `Uninstall GESET Pro.exe`

### Mise à Jour

Pour mettre à jour vers une nouvelle version :

1. Téléchargez le nouvel installateur
2. Lancez-le (vos données seront préservées)
3. L'ancienne version sera automatiquement remplacée

## 🔧 Pour les Développeurs

### Créer l'Installateur

#### Prérequis

- **Node.js 18+** ([Télécharger](https://nodejs.org/))
- **Windows 10/11** (recommandé)
- **Git** ([Télécharger](https://git-scm.com/))

#### Méthode 1 : Script Automatique (Recommandé)

**Sur Windows :**
```bash
build-windows.bat
```

**Sur macOS/Linux :**
```bash
./build-windows.sh
```

Le script va :
1. Vérifier Node.js
2. Installer les dépendances
3. Compiler l'application
4. Créer l'installateur

#### Méthode 2 : Commandes Manuelles

```bash
# 1. Installer les dépendances
npm install

# 2. Compiler l'application
npm run build

# 3. Créer l'installateur Windows
npm run electron:build:win
```

#### Résultat

L'installateur sera créé dans le dossier `release/` :
- **GESET-Pro-Setup-1.0.0.exe** (installateur complet)

### Tester Avant Build

Pour tester l'application Electron en mode développement :

```bash
npm run electron:dev
```

Cela lance :
- Le serveur de développement Vite
- L'application Electron
- Les outils de développement (DevTools)

### Personnalisation

#### Changer le Numéro de Version

Dans `package.json` :
```json
"version": "1.0.0"
```

#### Changer l'Icône

Remplacez `public/image.png` par votre propre icône :
- Format : PNG 512x512px ou ICO
- Nom : `image.png`

#### Changer les Informations de l'Application

Dans `package.json` :
```json
{
  "name": "geset-pro",
  "productName": "GESET Pro",
  "description": "Système de Gestion Scolaire",
  "author": "Votre Nom"
}
```

### Builds Multi-Plateformes

#### macOS
```bash
npm run electron:build:mac
```
Crée : `GESET-Pro-1.0.0.dmg`

#### Linux
```bash
npm run electron:build:linux
```
Crée :
- `GESET-Pro-1.0.0.AppImage`
- `geset-pro_1.0.0_amd64.deb`

### Structure des Fichiers

```
project/
├── electron/
│   ├── main.js          # Processus principal Electron
│   └── preload.js       # Script de préchargement
├── dist/                # Application compilée (généré)
├── release/             # Installateurs (généré)
├── build-windows.bat    # Script de build Windows
├── build-windows.sh     # Script de build Linux/macOS
└── BUILD_INSTRUCTIONS.md # Documentation détaillée
```

## ❓ Questions Fréquentes

### L'installateur ne se lance pas

**Solution 1 :** Exécutez en tant qu'administrateur
- Clic droit sur le `.exe` > "Exécuter en tant qu'administrateur"

**Solution 2 :** Désactivez temporairement l'antivirus
- Certains antivirus bloquent les fichiers non signés

### L'application ne démarre pas après installation

**Vérifiez :**
1. Windows 10/11 est à jour
2. Vous avez les droits d'administrateur
3. Le dossier d'installation n'est pas en lecture seule

**Réinstallez :**
1. Désinstallez complètement
2. Supprimez `C:\Program Files\GESET Pro\`
3. Réinstallez

### Erreur "Application has been moved"

L'application a été déplacée après installation. Réinstallez-la.

### Les données ne sont pas sauvegardées

**Vérifiez :**
1. La connexion internet (pour Supabase)
2. Les permissions de l'application
3. Le localStorage du navigateur interne

### L'icône n'apparaît pas

Lors du build, assurez-vous que `public/image.png` existe et est valide.

## 🔒 Sécurité

### Signature du Code

Pour signer l'exécutable (évite les avertissements Windows) :

1. Obtenez un certificat de signature de code
2. Ajoutez dans `package.json` :

```json
"win": {
  "certificateFile": "cert.pfx",
  "certificatePassword": "password",
  "signingHashAlgorithms": ["sha256"]
}
```

### Protection des Données

- Les données sont stockées dans Supabase (cloud)
- Backup local avec localStorage
- Chiffrement HTTPS pour les communications
- Row Level Security (RLS) sur la base de données

## 📊 Taille de l'Application

- **Installateur** : ~70-100 MB
- **Application installée** : ~200 MB
- **Inclut** :
  - Electron
  - Chromium
  - Node.js
  - Application React

## 🚀 Distribution

### Distribution Privée

1. Partagez le fichier `.exe` directement
2. Hébergez sur un serveur/cloud
3. Distribuez via USB/clé

### Distribution Publique

1. **GitHub Releases**
   - Créez une release sur GitHub
   - Uploadez le fichier `.exe`
   - Les utilisateurs peuvent télécharger

2. **Site Web**
   - Hébergez le fichier sur votre site
   - Créez une page de téléchargement

3. **Microsoft Store** (avancé)
   - Nécessite un compte développeur
   - Signature obligatoire

## 💡 Conseils

1. **Versioning** : Incrémentez la version à chaque release
2. **Changelog** : Documentez les changements
3. **Tests** : Testez sur différentes machines Windows
4. **Antivirus** : Faites scanner l'exécutable avant distribution
5. **Documentation** : Incluez un guide utilisateur

## 📞 Support

Pour obtenir de l'aide :

1. Consultez la documentation complète dans `/docs`
2. Vérifiez les logs dans `%APPDATA%\GESET Pro\logs\`
3. Contactez le support technique

## 🔄 Mises à Jour Automatiques (Optionnel)

Pour activer les mises à jour automatiques :

1. Configurez un serveur de mise à jour
2. Ajoutez dans `package.json` :

```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "votre-username",
    "repo": "geset-pro"
  }
}
```

3. Les utilisateurs recevront les notifications de mise à jour
