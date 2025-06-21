@echo off
REM Nom de l'image et du conteneur
set IMAGE=portfolio
set CONTAINER=portfolio

REM Port externe (modifie cette valeur si besoin)
set PORT=7777

REM Construire l’image Docker
echo Construction de l’image Docker...
docker build -t %IMAGE% .

REM Arrêter et supprimer le conteneur existant si présent
docker stop %CONTAINER% 2>NUL
docker rm %CONTAINER% 2>NUL

REM Lancer le conteneur sur le port désiré
echo Lancement du conteneur sur le port %PORT%...
docker run -d --name %CONTAINER% -p %PORT%:80 %IMAGE%

echo Déploiement terminé !
echo Le site est accessible sur http://localhost:%PORT%
pause