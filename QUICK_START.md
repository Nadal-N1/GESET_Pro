# 🚀 Guide de Démarrage Rapide - GESET Pro

## 📦 Créer l'Exécutable Windows (3 Étapes)

### Étape 1 : Installer les Dépendances
```bash
npm install
```
**Durée** : 2-5 minutes

### Étape 2 : Créer l'Installateur
```bash
npm run electron:build:win
```
**Durée** : 10-15 minutes (premier build)

### Étape 3 : Récupérer l'Installateur
L'installateur est créé dans :
```
release/GESET-Pro-Setup-1.0.0.exe
```

**C'est tout !** Vous pouvez maintenant distribuer ce fichier.

---

## ⚠️ Note sur l'Icône

L'application utilise l'icône par défaut d'Electron (icône bleue professionnelle).

Pour ajouter une icône personnalisée, consultez : **AJOUTER_ICONE.md**

---

## Installation en 5 Minutes

### Windows

1. **Télécharger et installer Node.js**
   - Aller sur https://nodejs.org/
   - Télécharger la version LTS
   - Installer en suivant les instructions
   - Redémarrer l'ordinateur

2. **Ouvrir le terminal**
   - Appuyer sur `Windows + R`
   - Taper `cmd` et appuyer sur Entrée
   - Naviguer vers le dossier du projet :
     ```bash
     cd C:\chemin\vers\project
     ```

3. **Exécuter le script d'installation**
   ```bash
   setup.bat
   ```

4. **Lancer l'application**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   - Aller sur http://localhost:5173
   - Se connecter avec `admin` / `admin123`

---

### Mac / Linux

1. **Ouvrir le terminal**
   - Mac : `Cmd + Espace` puis taper "Terminal"
   - Linux : `Ctrl + Alt + T`

2. **Naviguer vers le projet**
   ```bash
   cd /chemin/vers/project
   ```

3. **Exécuter le script d'installation**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

4. **Lancer l'application**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   - Aller sur http://localhost:5173
   - Se connecter avec `admin` / `admin123`

---

## Installation Manuelle (Alternative)

```bash
# 1. Vérifier Node.js
node --version
# Doit afficher v18.0.0 ou supérieur

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
npm run dev

# 4. Ouvrir http://localhost:5173
```

---

## Configuration Initiale (Première Utilisation)

### 1. Connexion
- **Username** : `admin`
- **Password** : `admin123`
- ⚠️ Changez ce mot de passe immédiatement !

### 2. Paramètres de l'École
```
Menu > Paramètres > Paramètres de l'École
```
- Renseigner le nom de l'établissement
- Ajouter l'adresse et les contacts
- Uploader le logo (optionnel)
- Choisir les couleurs
- Sauvegarder

### 3. Créer des Classes
```
Menu > Classes > + Nouvelle Classe
```
Exemples :
- **Maternelle** : Petite Section, Moyenne Section, Grande Section
- **Primaire** : CP1, CP2, CE1, CE2, CM1, CM2
- **Secondaire** : 6ème, 5ème, 4ème, 3ème, 2nde, 1ère, Terminale

### 4. Créer des Matières
```
Menu > Matières > + Nouvelle Matière
```
Exemples pour le Primaire :
- Français (coef: 3)
- Mathématiques (coef: 3)
- Sciences (coef: 2)
- Histoire-Géographie (coef: 2)
- Éducation Physique (coef: 1)

### 5. Ajouter des Enseignants
```
Menu > Enseignants > + Nouvel Enseignant
```
Remplir :
- Nom et prénom
- Téléphone
- Spécialité
- Diplôme

### 6. Inscrire des Élèves
```
Menu > Élèves > + Nouvel Élève
```
Remplir :
- Nom et prénom
- Date et lieu de naissance
- Informations du tuteur
- Classe
- Photo (optionnel)

---

## Utilisation Quotidienne

### Enregistrer des Notes
```
Menu > Notes > + Nouvelle Note
```
1. Sélectionner la classe
2. Sélectionner l'élève
3. Sélectionner la matière
4. Entrer la note et la note maximale
5. Choisir le trimestre
6. Sauvegarder

### Générer des Bulletins
```
Menu > Notes > Générer les Bulletins
```
1. Sélectionner la classe
2. Sélectionner le trimestre
3. Cliquer sur "Générer les Bulletins"
4. Le PDF sera téléchargé automatiquement

### Enregistrer un Paiement
```
Menu > Frais > Onglet Paiements > + Nouveau Paiement
```
1. Sélectionner l'élève
2. Sélectionner le type de frais
3. Entrer le montant
4. Choisir le mode de paiement
5. Sauvegarder
6. Un reçu sera généré automatiquement

---

## Commandes Utiles

```bash
# Lancer en mode développement
npm run dev

# Créer un build de production
npm run build

# Tester le build de production
npm run preview

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

---

## Raccourcis Clavier (Dans l'Application)

- `Échap` : Fermer les modales
- `Ctrl + S` : Sauvegarder (dans les formulaires)
- `F5` : Rafraîchir la page

---

## Accès depuis un Autre Appareil (Même Réseau)

1. **Trouver votre IP locale**
   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. **Lancer avec accès réseau**
   ```bash
   npm run dev -- --host
   ```

3. **Accéder depuis un autre appareil**
   ```
   http://VOTRE_IP:5173
   Exemple : http://192.168.1.10:5173
   ```

---

## Résolution Rapide des Problèmes

### "npm: command not found"
➜ **Solution** : Installer Node.js depuis https://nodejs.org/

### "Port 5173 is already in use"
➜ **Solution** : Utiliser un autre port
```bash
npm run dev -- --port 3000
```

### "Cannot find module"
➜ **Solution** : Réinstaller les dépendances
```bash
rm -rf node_modules
npm install
```

### Page blanche après ouverture
➜ **Solution** :
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs
3. Vérifier que le fichier `.env` existe

### Supabase ne fonctionne pas
➜ **Solution** : L'application basculera automatiquement sur le stockage local
- Pas de perte de données
- Fonctionne hors ligne

---

## Sauvegarde des Données

### Exporter les Données
Les données sont stockées dans :
- **Cloud** : Supabase (backup automatique)
- **Local** : localStorage du navigateur

### Backup Manuel
Pour sauvegarder manuellement :
1. Ouvrir la console du navigateur (F12)
2. Aller dans "Application" > "Local Storage"
3. Copier les données

---

## Support

### Documentation Complète
- `README.md` : Guide complet
- `INSTALLATION.md` : Installation détaillée
- `SUPABASE_SETUP_GUIDE.md` : Configuration Supabase
- `ERROR_PREVENTION_GUIDE.md` : Gestion des erreurs

### En Cas de Problème
1. Vérifier les logs dans la console (F12)
2. Consulter la documentation
3. Vérifier que Node.js est installé correctement

---

## Fonctionnalités Principales

✅ Gestion des élèves et enseignants
✅ Gestion des classes et matières
✅ Enregistrement des notes
✅ Génération de bulletins PDF
✅ Gestion des frais et paiements
✅ Génération de reçus
✅ Statistiques et tableaux de bord
✅ Multi-utilisateurs avec rôles
✅ Fonctionne hors ligne
✅ Synchronisation automatique
✅ Interface moderne et intuitive

---

## Prochaines Étapes

1. ✅ Se connecter
2. ✅ Configurer l'école
3. ✅ Créer les classes
4. ✅ Créer les matières
5. ✅ Ajouter les enseignants
6. ✅ Inscrire les élèves
7. ✅ Commencer à utiliser ! 🎉

---

**Besoin d'aide ?** Consultez `README.md` ou `INSTALLATION.md` pour plus de détails.

**Bon usage de GESET Pro ! 📚**
