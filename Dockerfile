# Utilise une image Nginx officielle légère
FROM nginx:alpine

# Copie tous les fichiers du dossier courant dans le dossier de Nginx
COPY . /usr/share/nginx/html

# Expose le port 80 (optionnel, utile pour la documentation)
EXPOSE 80

# Nginx démarre automatiquement, aucune commande CMD supplémentaire n'est nécessaire