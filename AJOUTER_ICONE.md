# Comment Ajouter une Icône Personnalisée

## Problème Actuel

L'application utilise l'icône par défaut d'Electron car le fichier `public/image.png` n'est pas au format ICO requis par Windows.

## Solution : Convertir PNG en ICO

### Méthode 1 : En ligne (Facile)

1. **Aller sur un convertisseur en ligne** :
   - https://convertio.co/fr/png-ico/
   - https://www.icoconverter.com/
   - https://image.online-convert.com/fr/convertir-en-ico

2. **Uploader votre logo** (`public/image.png`)

3. **Sélectionner les tailles** :
   - ✅ 16x16
   - ✅ 32x32
   - ✅ 48x48
   - ✅ 64x64
   - ✅ 128x128
   - ✅ 256x256

4. **Télécharger le fichier ICO**

5. **Renommer** le fichier en `icon.ico`

6. **Placer** dans `public/icon.ico`

### Méthode 2 : Avec ImageMagick (Avancé)

```bash
# Installer ImageMagick
# Windows : https://imagemagick.org/script/download.php

# Convertir
magick convert public/image.png -define icon:auto-resize=256,128,64,48,32,16 public/icon.ico
```

### Méthode 3 : Avec GIMP (Gratuit)

1. Ouvrir `public/image.png` dans GIMP
2. Image > Échelle et taille d'image > 256x256 pixels
3. Fichier > Exporter sous
4. Nom : `icon.ico`
5. Format : Microsoft Windows icon (*.ico)
6. Cocher toutes les tailles disponibles

## Étape 2 : Modifier la Configuration

Une fois que vous avez créé `public/icon.ico`, modifiez `package.json` :

```json
{
  "build": {
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        }
      ],
      "icon": "public/icon.ico",
      "artifactName": "GESET-Pro-Setup-${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "GESET Pro",
      "installerIcon": "public/icon.ico",
      "uninstallerIcon": "public/icon.ico",
      "license": "LICENSE.txt",
      "language": "1036"
    }
  }
}
```

Et dans `electron/main.js` :

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, '../public/icon.ico'), // Ajouter cette ligne
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    autoHideMenuBar: false,
    title: 'GESET Pro - Système de Gestion Scolaire'
  });
```

## Étape 3 : Rebuild

```bash
npm run electron:build:win
```

## Format ICO : Spécifications

Un fichier ICO valide pour Windows doit :
- ✅ Contenir plusieurs résolutions (16x16 à 256x256)
- ✅ Être au format ICO (pas PNG renommé)
- ✅ Avoir un fond transparent (recommandé)
- ✅ Utiliser une palette de couleurs Windows

## Tailles Recommandées

Pour une icône professionnelle, incluez :
- 16×16 - Menu système, barre des tâches (petite)
- 32×32 - Barre des tâches, raccourcis
- 48×48 - Vue liste large
- 64×64 - Vue liste extra large
- 128×128 - Grandes vignettes
- 256×256 - Vignettes extra larges

## Alternative : Utiliser l'Icône par Défaut

Si vous préférez utiliser l'icône Electron par défaut temporairement :

1. Ne spécifiez pas d'icône dans `package.json`
2. Ne spécifiez pas d'icône dans `electron/main.js`
3. L'application utilisera l'icône Electron bleue standard

## Vérification

Pour vérifier que votre ICO est valide :

1. **Sur Windows** : Double-clic sur `icon.ico`
   - Windows doit pouvoir l'afficher
   - Vous devez voir plusieurs tailles disponibles

2. **Propriétés** : Clic droit > Propriétés
   - Doit indiquer "Icône Windows"
   - Taille : plusieurs Ko (pas juste quelques octets)

## Erreurs Courantes

### "Invalid icon file"
- Le fichier n'est pas un vrai ICO
- Solution : Reconvertir avec un outil dédié

### "Icon not found"
- Le chemin est incorrect
- Solution : Vérifier que le fichier existe à `public/icon.ico`

### Icône floue
- Résolutions insuffisantes
- Solution : Créer un ICO multi-résolution

### Icône avec fond blanc
- Pas de transparence
- Solution : Utiliser une source PNG avec fond transparent

## Conseil Pro

Pour un résultat professionnel :
1. Commencez avec une image PNG haute résolution (512x512 ou plus)
2. Simplifiez les détails pour les petites tailles
3. Testez l'icône à toutes les résolutions
4. Assurez-vous que l'icône est reconnaissable même à 16x16

## Ressources

- [Electron Icon Guide](https://www.electronjs.org/docs/latest/tutorial/icons)
- [Windows Icon Guidelines](https://docs.microsoft.com/en-us/windows/win32/uxguide/vis-icons)
- [Convertisseur en ligne](https://convertio.co/fr/png-ico/)

## Note Importante

L'icône par défaut d'Electron fonctionne parfaitement pour commencer. Vous pouvez toujours ajouter une icône personnalisée plus tard quand vous aurez un fichier ICO valide.
