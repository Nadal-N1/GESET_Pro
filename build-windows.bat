@echo off
echo ============================================
echo   GESET Pro - Build Installateur Windows
echo ============================================
echo.

echo [1/4] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    echo Telechargez Node.js sur https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js detecte!
echo.

echo [2/4] Installation des dependances...
call npm install
if errorlevel 1 (
    echo ERREUR: Installation des dependances echouee!
    pause
    exit /b 1
)
echo Dependances installees avec succes!
echo.

echo [3/4] Compilation de l'application...
call npm run build
if errorlevel 1 (
    echo ERREUR: Compilation echouee!
    pause
    exit /b 1
)
echo Application compilee avec succes!
echo.

echo [4/4] Creation de l'installateur Windows...
call npm run electron:build:win
if errorlevel 1 (
    echo ERREUR: Creation de l'installateur echouee!
    pause
    exit /b 1
)
echo.

echo ============================================
echo   BUILD TERMINE AVEC SUCCES!
echo ============================================
echo.
echo L'installateur a ete cree dans le dossier "release/"
echo Nom du fichier: GESET-Pro-Setup-1.0.0.exe
echo.
echo Vous pouvez maintenant distribuer cet installateur.
echo.
pause
