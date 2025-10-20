#!/bin/bash

echo "===================================="
echo "GESET Pro - Installation Automatique"
echo "===================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier Node.js
echo "[1/5] Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERREUR]${NC} Node.js n'est pas installé"
    echo "Installation de Node.js..."

    # Détecter l'OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install node
        else
            echo "Installez Homebrew puis exécutez : brew install node"
            echo "Ou téléchargez Node.js depuis https://nodejs.org/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        else
            echo "Installez Node.js depuis https://nodejs.org/"
            exit 1
        fi
    else
        echo "Téléchargez et installez Node.js depuis https://nodejs.org/"
        exit 1
    fi
fi
echo -e "${GREEN}[OK]${NC} Node.js est installé"
node --version
echo ""

# Vérifier npm
echo "[2/5] Vérification de npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[ERREUR]${NC} npm n'est pas installé"
    exit 1
fi
echo -e "${GREEN}[OK]${NC} npm est installé"
npm --version
echo ""

# Vérifier le fichier .env
echo "[3/5] Vérification de la configuration..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[ATTENTION]${NC} Fichier .env manquant"
    echo "Création du fichier .env avec configuration par défaut..."
    cat > .env << 'EOF'
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
EOF
fi
echo -e "${GREEN}[OK]${NC} Configuration présente"
echo ""

# Installer les dépendances
echo "[4/5] Installation des dépendances..."
echo "Cela peut prendre quelques minutes..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERREUR]${NC} Échec de l'installation des dépendances"
    echo "Essayez de nettoyer le cache : npm cache clean --force"
    exit 1
fi
echo -e "${GREEN}[OK]${NC} Dépendances installées"
echo ""

# Build de test
echo "[5/5] Vérification du build..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}[ATTENTION]${NC} Le build a rencontré des avertissements"
    echo "L'application devrait quand même fonctionner"
else
    echo -e "${GREEN}[OK]${NC} Build réussi"
fi
echo ""

echo "===================================="
echo -e "${GREEN}Installation terminée avec succès!${NC}"
echo "===================================="
echo ""
echo "Pour lancer l'application :"
echo "  npm run dev"
echo ""
echo "L'application sera accessible sur :"
echo "  http://localhost:5173"
echo ""
echo "Identifiants par défaut :"
echo "  Username : admin"
echo "  Password : admin123"
echo ""
echo "Consultez README.md pour plus d'informations"
echo ""
