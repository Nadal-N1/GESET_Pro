# Instructions de Build - GESET Pro

## Créer l'Exécutable Windows

### Prérequis
- Node.js 18+ installé
- Windows 10/11 (recommandé pour build Windows)
- Toutes les dépendances installées

### Étape 1 : Installation des Dépendances
```bash
npm install
```

### Étape 2 : Build de l'Application Web
```bash
npm run build
```
Ceci crée le dossier `dist/` avec l'application compilée.

### Étape 3 : Créer l'Installateur Windows
```bash
npm run electron:build:win
```

Cette commande va :
1. Compiler l'application React/Vite
2. Empaqueter avec Electron
3. Créer un installateur NSIS pour Windows
4. Générer le fichier dans `release/`

### Fichier Généré
Le fichier d'installation sera créé dans le dossier `release/` :
- **GESET-Pro-Setup-1.0.0.exe** (installateur Windows)

## Tester en Mode Développement

Pour tester l'application Electron avant de créer l'exécutable :

```bash
npm run electron:dev
```

Cette commande :
1. Lance le serveur de développement Vite
2. Attend que le serveur soit prêt
3. Lance Electron avec l'application

## Créer l'Installateur pour d'Autres Plateformes

### macOS
```bash
npm run electron:build:mac
```
Crée un fichier `.dmg` pour macOS.

### Linux
```bash
npm run electron:build:linux
```
Crée des fichiers `.AppImage` et `.deb` pour Linux.

## Configuration de l'Installateur

L'installateur Windows (NSIS) offre les options suivantes :
- ✅ Installation personnalisée (l'utilisateur peut choisir le dossier)
- ✅ Raccourci sur le bureau
- ✅ Raccourci dans le menu Démarrer
- ✅ Support 32-bit et 64-bit
- ✅ Désinstallation propre
- ✅ Langue française (code 1036)

## Personnalisation

Pour modifier les paramètres de build, éditez la section `"build"` dans `package.json` :

```json
"build": {
  "appId": "com.gesetpro.app",
  "productName": "GESET Pro",
  "win": {
    "target": ["nsis"],
    "icon": "public/image.png"
  }
}
```

## Icône de l'Application

L'icône de l'application est définie par `public/image.png`. Pour la changer :
1. Remplacer le fichier `public/image.png`
2. Format recommandé : PNG 512x512px ou ICO pour Windows
3. Rebuild l'application

## Signature du Code (Optionnel)

Pour signer l'exécutable Windows (recommandé pour la distribution) :

1. Obtenir un certificat de signature de code
2. Ajouter dans `package.json` :

```json
"win": {
  "certificateFile": "chemin/vers/certificat.pfx",
  "certificatePassword": "mot_de_passe"
}
```

## Dépannage

### Erreur "electron-builder" non trouvé
```bash
npm install --save-dev electron-builder
```

### Erreur de permissions sur Windows
Exécutez le terminal en tant qu'administrateur.

### Build échoue
```bash
# Nettoyer et rebuilder
rm -rf node_modules dist release
npm install
npm run electron:build:win
```

### Icône ne s'affiche pas
Vérifiez que `public/image.png` existe et est au format correct.

## Distribution

Une fois l'installateur créé :
1. Le fichier `GESET-Pro-Setup-1.0.0.exe` peut être distribué
2. Les utilisateurs double-cliquent pour installer
3. L'application sera installée dans `Program Files/GESET Pro/`
4. Un raccourci sera créé sur le bureau et dans le menu Démarrer

## Taille du Fichier

L'installateur final fera environ :
- **70-100 MB** (inclut Electron + Chromium + Application)

## Notes Importantes

1. **Base de données** : L'application utilise Supabase (cloud) et localStorage (local)
2. **Mise à jour** : Pour mettre à jour, l'utilisateur doit télécharger et réinstaller
3. **Configuration** : Le fichier `.env` doit être inclus dans le build
4. **Sécurité** : Ne pas inclure de clés secrètes dans le build public

## Auto-Update (Optionnel)

Pour activer les mises à jour automatiques, ajouter dans `package.json` :

```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "votre-username",
    "repo": "votre-repo"
  }
}
```

## Support

En cas de problème lors du build :
1. Vérifier que Node.js 18+ est installé
2. Vérifier que toutes les dépendances sont installées
3. Consulter les logs d'erreur
4. Nettoyer et réinstaller si nécessaire
