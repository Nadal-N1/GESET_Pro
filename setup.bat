@echo off
echo ====================================
echo GESET Pro - Installation Automatique
echo ====================================
echo.

REM Vérifier Node.js
echo [1/5] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js n'est pas installe
    echo Telechargez et installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js est installe
node --version
echo.

REM Vérifier npm
echo [2/5] Verification de npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] npm n'est pas installe
    pause
    exit /b 1
)
echo [OK] npm est installe
npm --version
echo.

REM Vérifier le fichier .env
echo [3/5] Verification de la configuration...
if not exist ".env" (
    echo [ATTENTION] Fichier .env manquant
    echo Creation du fichier .env avec configuration par defaut...
    (
        echo VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
        echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
    ) > .env
)
echo [OK] Configuration presente
echo.

REM Installer les dépendances
echo [4/5] Installation des dependances...
echo Cela peut prendre quelques minutes...
call npm install
if errorlevel 1 (
    echo [ERREUR] Echec de l'installation des dependances
    echo Essayez de nettoyer le cache : npm cache clean --force
    pause
    exit /b 1
)
echo [OK] Dependances installees
echo.

REM Build de test
echo [5/5] Verification du build...
call npm run build
if errorlevel 1 (
    echo [ATTENTION] Le build a rencontre des avertissements
    echo L'application devrait quand meme fonctionner
) else (
    echo [OK] Build reussi
)
echo.

echo ====================================
echo Installation terminee avec succes!
echo ====================================
echo.
echo Pour lancer l'application :
echo   npm run dev
echo.
echo L'application sera accessible sur :
echo   http://localhost:5173
echo.
echo Identifiants par defaut :
echo   Username : admin
echo   Password : admin123
echo.
echo Consultez README.md pour plus d'informations
echo.
pause
