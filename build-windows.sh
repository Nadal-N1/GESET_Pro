#!/bin/bash

echo "============================================"
echo "  GESET Pro - Build Installateur Windows"
echo "============================================"
echo ""

echo "[1/4] Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js n'est pas installé!"
    echo "Téléchargez Node.js sur https://nodejs.org/"
    exit 1
fi
echo "Node.js détecté: $(node --version)"
echo ""

echo "[2/4] Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "ERREUR: Installation des dépendances échouée!"
    exit 1
fi
echo "Dépendances installées avec succès!"
echo ""

echo "[3/4] Compilation de l'application..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERREUR: Compilation échouée!"
    exit 1
fi
echo "Application compilée avec succès!"
echo ""

echo "[4/4] Création de l'installateur Windows..."
npm run electron:build:win
if [ $? -ne 0 ]; then
    echo "ERREUR: Création de l'installateur échouée!"
    exit 1
fi
echo ""

echo "============================================"
echo "  BUILD TERMINÉ AVEC SUCCÈS!"
echo "============================================"
echo ""
echo "L'installateur a été créé dans le dossier 'release/'"
echo "Nom du fichier: GESET-Pro-Setup-1.0.0.exe"
echo ""
echo "Vous pouvez maintenant distribuer cet installateur."
echo ""
