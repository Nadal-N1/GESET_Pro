# 🚀 Guide de Déploiement - GESET Pro

## Vue d'Ensemble

Ce guide explique comment déployer GESET Pro en production sur différentes plateformes.

## Préparation du Déploiement

### 1. Vérifier le Build Local

```bash
# Nettoyer les fichiers précédents
rm -rf dist

# Créer un nouveau build
npm run build

# Vérifier qu'il n'y a pas d'erreurs
# Le dossier dist/ doit être créé

# Tester le build localement
npm run preview
# Ouvrir http://localhost:4173
```

### 2. Vérifier les Variables d'Environnement

Le fichier `.env` doit contenir :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

## Option 1 : Netlify (Recommandé) 🌟

### Pourquoi Netlify ?
- ✅ Gratuit pour les petits projets
- ✅ HTTPS automatique
- ✅ Déploiement en 1 clic
- ✅ CDN mondial
- ✅ Interface simple

### Méthode A : Glisser-Déposer (La Plus Simple)

1. **Créer le build**
   ```bash
   npm run build
   ```

2. **Aller sur [Netlify](https://www.netlify.com)**
   - Créer un compte gratuit
   - Cliquer sur "Add new site"
   - Choisir "Deploy manually"

3. **Déposer le dossier**
   - Glisser le dossier `dist/` dans la zone de dépôt
   - Attendre la fin du déploiement (1-2 minutes)

4. **Configurer les variables d'environnement**
   - Aller dans "Site settings" > "Environment variables"
   - Ajouter :
     - `VITE_SUPABASE_URL` : votre URL Supabase
     - `VITE_SUPABASE_ANON_KEY` : votre clé ANON

5. **Redéployer**
   - Aller dans "Deploys"
   - Cliquer sur "Trigger deploy" > "Clear cache and deploy site"

6. **Accéder à votre site**
   - L'URL sera du type : `https://nom-aleatoire.netlify.app`
   - Vous pouvez personnaliser ce nom dans les paramètres

### Méthode B : Avec Git

1. **Pousser votre code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-username/votre-repo.git
   git push -u origin main
   ```

2. **Connecter à Netlify**
   - Aller sur [Netlify](https://www.netlify.com)
   - "Add new site" > "Import an existing project"
   - Choisir GitHub
   - Sélectionner votre dépôt

3. **Configurer le build**
   - Build command : `npm run build`
   - Publish directory : `dist`

4. **Ajouter les variables d'environnement**
   - Même procédure que la Méthode A

5. **Déployer**
   - Chaque push sur `main` déclenchera un nouveau déploiement

---

## Option 2 : Vercel

### Avantages
- ✅ Gratuit pour projets personnels
- ✅ Très rapide
- ✅ Intégration Git automatique

### Déploiement

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel deploy --prod
   ```

4. **Configurer les variables d'environnement**
   ```bash
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SUPABASE_ANON_KEY production
   ```

5. **Redéployer avec les variables**
   ```bash
   vercel deploy --prod
   ```

---

## Option 3 : Serveur VPS (Ubuntu)

### Pour les Utilisateurs Avancés

#### Prérequis
- Serveur Ubuntu 20.04 ou supérieur
- Accès root ou sudo
- Nom de domaine (optionnel)

#### Installation

1. **Connexion au serveur**
   ```bash
   ssh root@votre-ip
   ```

2. **Installer Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Installer Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

4. **Transférer les fichiers**
   ```bash
   # Sur votre ordinateur local
   npm run build
   scp -r dist/* root@votre-ip:/var/www/geset/
   ```

5. **Configurer Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/geset
   ```

   Contenu :
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;

       root /var/www/geset;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache des assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

6. **Activer le site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/geset /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Configurer SSL avec Let's Encrypt (Optionnel mais Recommandé)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d votre-domaine.com
   ```

---

## Option 4 : Serveur Windows (IIS)

### Prérequis
- Windows Server avec IIS installé
- Node.js installé

### Installation

1. **Créer le build**
   ```bash
   npm run build
   ```

2. **Installer IIS**
   - Panneau de configuration > Programmes > Activer/Désactiver des fonctionnalités Windows
   - Cocher "Internet Information Services"

3. **Configurer le site**
   - Ouvrir IIS Manager
   - Clic droit sur "Sites" > "Add Website"
   - Site name : GESET
   - Physical path : `C:\inetpub\wwwroot\geset`
   - Port : 80

4. **Copier les fichiers**
   - Copier le contenu de `dist/` vers `C:\inetpub\wwwroot\geset\`

5. **Configurer URL Rewrite**
   - Installer URL Rewrite Module pour IIS
   - Créer un fichier `web.config` dans le dossier geset :
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="React Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="/" />
           </rule>
         </rules>
       </rewrite>
     </system.webServer>
   </configuration>
   ```

---

## Configuration du Domaine

### Netlify/Vercel
1. Aller dans les paramètres du site
2. Section "Domain management"
3. Ajouter votre domaine personnalisé
4. Suivre les instructions pour configurer les DNS

### Serveur VPS
1. Pointer votre domaine vers l'IP du serveur (enregistrement A)
2. Attendre la propagation DNS (quelques heures)
3. Configurer SSL avec Certbot

---

## Optimisations de Performance

### 1. Compression Gzip
Déjà configuré dans Vite, vérifié par :
```bash
# Dans dist/
ls -lh assets/
# Les fichiers .js et .css doivent être compressés
```

### 2. Cache des Assets
Les plateformes comme Netlify/Vercel gèrent automatiquement le cache.

Pour un serveur personnel, voir la configuration Nginx ci-dessus.

### 3. CDN
- Netlify et Vercel incluent un CDN global
- Pour un VPS, considérer Cloudflare (gratuit)

---

## Monitoring et Maintenance

### 1. Vérifier l'Application
```bash
# Tester l'URL de production
curl https://votre-site.com

# Vérifier les certificats SSL
curl -I https://votre-site.com
```

### 2. Logs
- **Netlify** : Dashboard > Logs
- **Vercel** : Dashboard > Logs
- **VPS** : `sudo tail -f /var/log/nginx/error.log`

### 3. Mises à Jour
```bash
# Sur votre machine locale
git pull
npm install
npm run build

# Redéployer selon la méthode choisie
```

---

## Sécurité en Production

### 1. HTTPS Obligatoire
- ✅ Automatique avec Netlify/Vercel
- ✅ Utiliser Certbot sur VPS

### 2. Variables d'Environnement
- ❌ Ne jamais commit le fichier `.env`
- ✅ Utiliser les variables d'environnement de la plateforme

### 3. Supabase RLS
- ✅ Déjà configuré dans la migration
- ✅ Vérifier les politiques régulièrement

### 4. Rate Limiting
Considérer l'ajout de Cloudflare pour :
- Protection DDoS
- Rate limiting
- Cache supplémentaire

---

## Checklist de Déploiement

### Avant le Déploiement
- [ ] Tests locaux passent
- [ ] Build sans erreurs
- [ ] Variables d'environnement configurées
- [ ] Base de données Supabase créée
- [ ] Migration SQL exécutée
- [ ] Données de test créées (optionnel)

### Après le Déploiement
- [ ] Site accessible
- [ ] HTTPS fonctionne
- [ ] Connexion avec admin/admin123
- [ ] Changement du mot de passe admin
- [ ] Configuration de l'école
- [ ] Test des fonctionnalités principales
- [ ] Vérification sur mobile
- [ ] Vérification de la performance

---

## Rollback (Retour en Arrière)

### Netlify/Vercel
1. Aller dans "Deploys"
2. Trouver le déploiement précédent
3. Cliquer sur "Publish deploy"

### Serveur VPS
```bash
# Garder une copie de l'ancien build
sudo cp -r /var/www/geset /var/www/geset.backup
# En cas de problème :
sudo rm -rf /var/www/geset
sudo mv /var/www/geset.backup /var/www/geset
sudo systemctl restart nginx
```

---

## Support et Dépannage

### Site Inaccessible
1. Vérifier les logs de la plateforme
2. Vérifier la configuration DNS
3. Vérifier le certificat SSL

### Erreurs 404
- Vérifier la configuration de réécriture d'URL
- S'assurer que tous les assets sont présents

### Problèmes de Performance
- Vérifier la taille des assets
- Activer la compression
- Utiliser un CDN

### Base de Données Inaccessible
- Vérifier les variables d'environnement
- Vérifier le statut de Supabase
- L'application basculera sur localStorage

---

## Coûts Estimés

| Plateforme | Gratuit | Payant |
|------------|---------|--------|
| Netlify | ✅ Jusqu'à 100 GB/mois | À partir de $19/mois |
| Vercel | ✅ Projets personnels | À partir de $20/mois |
| VPS | ❌ | $5-20/mois |
| Domaine | ❌ | $10-15/an |

**Recommandation** : Commencer avec Netlify gratuit, puis migrer si nécessaire.

---

## Conclusion

Pour la plupart des établissements scolaires, **Netlify avec la méthode Glisser-Déposer** est la solution idéale :
- Simple et rapide
- Gratuit
- Fiable
- Sécurisé

Bonne chance avec votre déploiement ! 🚀
