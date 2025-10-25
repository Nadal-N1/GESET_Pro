# Comment Créer l'Exécutable Windows - GESET Pro

## 🎯 Résumé Rapide

Pour créer l'installateur Windows, exécutez simplement :

```bash
# Sur Windows
build-windows.bat

# Sur macOS/Linux
./build-windows.sh
```

L'installateur sera créé dans le dossier `release/` : **GESET-Pro-Setup-1.0.0.exe**

---

## 📋 Guide Complet

### Étape 1 : Vérifier les Prérequis

#### Node.js
Vérifiez que Node.js 18+ est installé :
```bash
node --version
```

Si non installé, téléchargez sur : https://nodejs.org/

#### Vérifier npm
```bash
npm --version
```

### Étape 2 : Préparer le Projet

#### Cloner ou Télécharger le Projet
```bash
git clone <url-du-projet>
cd project
```

#### Installer les Dépendances
```bash
npm install
```

Cela installe :
- React et ses dépendances
- Vite (bundler)
- Electron (framework desktop)
- electron-builder (création d'installateur)
- Et toutes les autres dépendances

**Durée estimée** : 2-5 minutes

### Étape 3 : Configuration (Optionnel)

#### A. Modifier les Informations de l'Application

Éditez `package.json` :

```json
{
  "name": "geset-pro",
  "productName": "GESET Pro",
  "version": "1.0.0",
  "description": "Système de Gestion Scolaire",
  "author": "Votre Nom"
}
```

#### B. Changer l'Icône

Remplacez `public/image.png` par votre icône :
- Format recommandé : PNG 512x512px
- Nom du fichier : `image.png`

#### C. Configurer Supabase (si besoin)

Éditez `.env.production` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

### Étape 4 : Créer l'Installateur

#### Méthode Automatique (Recommandé)

**Sur Windows :**
```bash
build-windows.bat
```

**Sur macOS/Linux :**
```bash
chmod +x build-windows.sh
./build-windows.sh
```

Le script effectue automatiquement :
1. ✅ Vérification de Node.js
2. ✅ Installation des dépendances
3. ✅ Compilation de l'application
4. ✅ Création de l'installateur Windows

**Durée estimée** : 5-10 minutes

#### Méthode Manuelle

Si vous préférez exécuter les commandes une par une :

```bash
# 1. Installer les dépendances (si pas déjà fait)
npm install

# 2. Compiler l'application React
npm run build

# 3. Créer l'installateur Windows
npm run electron:build:win
```

### Étape 5 : Récupérer l'Installateur

L'installateur est créé dans le dossier `release/` :

```
release/
├── GESET-Pro-Setup-1.0.0.exe    ← Installateur Windows
├── win-unpacked/                 ← Version portable (non packagée)
└── builder-effective-config.yaml ← Config utilisée
```

**Fichier principal** : `GESET-Pro-Setup-1.0.0.exe`

- **Taille** : ~70-100 MB
- **Architecture** : x64 et x86 (32-bit et 64-bit)
- **Type** : Installateur NSIS

### Étape 6 : Tester l'Installateur

#### Test sur la même machine

1. Double-cliquez sur `GESET-Pro-Setup-1.0.0.exe`
2. Suivez l'assistant d'installation
3. Lancez l'application installée
4. Vérifiez toutes les fonctionnalités

#### Test sur une autre machine Windows

1. Copiez le fichier `.exe` sur une clé USB
2. Testez sur un autre ordinateur Windows
3. Vérifiez que l'installation fonctionne

### Étape 7 : Distribution

#### Distribution Simple

Partagez le fichier `GESET-Pro-Setup-1.0.0.exe` :
- Par email (si taille acceptable)
- Via Google Drive, Dropbox, etc.
- Sur un serveur web
- Sur clé USB

#### Distribution Professionnelle

1. **Créer une Release GitHub**
   ```bash
   # Créer un tag
   git tag v1.0.0
   git push origin v1.0.0

   # Sur GitHub : Releases > Create Release
   # Uploader GESET-Pro-Setup-1.0.0.exe
   ```

2. **Héberger sur votre Site**
   - Uploadez le fichier sur votre serveur
   - Créez une page de téléchargement
   - Ajoutez des instructions d'installation

---

## 🔍 Vérifications Importantes

### Avant de Distribuer

✅ **Testez l'installateur**
- Installez sur une machine propre
- Vérifiez toutes les fonctionnalités
- Testez les différents rôles utilisateur

✅ **Vérifiez la configuration**
- Les variables d'environnement sont correctes
- Le logo s'affiche correctement
- Les couleurs sont bonnes

✅ **Testez la sécurité**
- Le mot de passe par défaut peut être changé
- Les permissions fonctionnent
- Les données sont bien sauvegardées

✅ **Documentation**
- Incluez le fichier `LISEZ-MOI-INSTALLATION.txt`
- Préparez un guide utilisateur
- Listez les bugs connus (si présents)

---

## 🐛 Résolution de Problèmes

### Erreur : "electron-builder not found"

**Solution** :
```bash
npm install --save-dev electron-builder
```

### Erreur : "Cannot find module 'electron'"

**Solution** :
```bash
npm install --save-dev electron
```

### Erreur : "Build failed"

**Solutions** :
```bash
# Nettoyer et réinstaller
rm -rf node_modules dist release
npm install
npm run build
npm run electron:build:win
```

### Erreur : "Icon not found"

**Vérifiez** :
- Le fichier `public/image.png` existe
- Le format est correct (PNG ou ICO)
- Les permissions de lecture sont OK

### Build très lent

**Normal !** Le premier build est long car :
- Téléchargement de Electron
- Compilation de tous les modules
- Création de l'installateur

Les builds suivants seront plus rapides.

### Antivirus bloque l'installateur

**Normal** pour les fichiers non signés.

**Solutions** :
1. Signer le code (certificat payant)
2. Soumettre à l'antivirus pour whitelist
3. Informer les utilisateurs qu'il est sûr

---

## 📦 Builds Multi-Plateformes

### Windows (actuel)
```bash
npm run electron:build:win
```
Crée : `GESET-Pro-Setup-1.0.0.exe`

### macOS
```bash
npm run electron:build:mac
```
Crée : `GESET-Pro-1.0.0.dmg`

### Linux
```bash
npm run electron:build:linux
```
Crée :
- `GESET-Pro-1.0.0.AppImage`
- `geset-pro_1.0.0_amd64.deb`

---

## 🔄 Workflow de Release

### Version Mineure (1.0.0 → 1.0.1)

1. Modifier `package.json` :
   ```json
   "version": "1.0.1"
   ```

2. Rebuild :
   ```bash
   npm run electron:build:win
   ```

3. Nouveau fichier :
   ```
   GESET-Pro-Setup-1.0.1.exe
   ```

### Version Majeure (1.0.0 → 2.0.0)

1. Mettre à jour la version
2. Documenter les changements
3. Tester exhaustivement
4. Créer un changelog
5. Builder et distribuer

---

## 💡 Conseils Pro

### Optimiser la Taille

Pour réduire la taille de l'installateur :

1. **Optimiser les images**
   - Compresser les PNG
   - Utiliser WebP quand possible

2. **Code splitting**
   - Le projet utilise déjà Vite
   - Éviter les grosses librairies

3. **Production build**
   - Toujours utiliser `npm run build`
   - Minification automatique

### Signature du Code

Pour éviter les avertissements Windows :

1. **Obtenir un certificat** (~200-400€/an)
   - DigiCert
   - Sectigo
   - GlobalSign

2. **Configurer dans package.json** :
   ```json
   "win": {
     "certificateFile": "cert.pfx",
     "certificatePassword": "password",
     "signingHashAlgorithms": ["sha256"]
   }
   ```

3. **Avantages** :
   - Pas d'avertissement Windows
   - Plus professionnel
   - Confiance des utilisateurs

### Auto-Update

Pour les mises à jour automatiques :

```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "votre-username",
    "repo": "geset-pro"
  }
}
```

Les utilisateurs seront notifiés des nouvelles versions.

---

## 📊 Structure des Fichiers

```
project/
├── electron/                    # Configuration Electron
│   ├── main.js                 # Processus principal
│   └── preload.js              # Preload script
├── src/                        # Code source React
├── public/                     # Fichiers statiques
├── dist/                       # Build de production (généré)
├── release/                    # Installateurs (généré)
├── build-windows.bat           # Script de build Windows
├── build-windows.sh            # Script de build Unix
├── package.json                # Configuration du projet
├── vite.config.ts              # Configuration Vite
├── LICENSE.txt                 # Licence
├── GUIDE_INSTALLATION_WINDOWS.md
├── BUILD_INSTRUCTIONS.md
└── COMMENT_CREER_EXECUTABLE.md # Ce fichier
```

---

## ✅ Checklist Finale

Avant de distribuer, vérifiez :

- [ ] Le build compile sans erreur
- [ ] L'installateur se crée correctement
- [ ] L'application s'installe sur une machine propre
- [ ] Toutes les fonctionnalités marchent
- [ ] Le logo et les couleurs sont corrects
- [ ] Les identifiants par défaut fonctionnent
- [ ] La connexion Supabase fonctionne
- [ ] Le mode hors ligne fonctionne
- [ ] La génération de PDF fonctionne
- [ ] Tous les rôles utilisateur fonctionnent
- [ ] Documentation incluse
- [ ] Version number correct
- [ ] Changelog préparé

---

## 📞 Besoin d'Aide ?

Consultez :
- `BUILD_INSTRUCTIONS.md` - Instructions détaillées
- `GUIDE_INSTALLATION_WINDOWS.md` - Guide d'installation
- `README.md` - Documentation générale

---

**Bon Build ! 🚀**

GESET Pro Team
© 2024 Tous droits réservés
