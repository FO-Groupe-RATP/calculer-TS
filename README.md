## Getting Started

Pour démarrer le projet, il faut d'abord installer les dépendances avec la commande suivante :

```bash
npm install
```

Ensuite, on peut démarrer le serveur de développement avec la commande suivante :

```bash
npm run dev
```

En cas de modification des grilles, il faut modifier le fichier **grilles.json** dans le dossier **src**.

Utiliser la commande

```bash
npx eslint "src/**/*.{js,ts,tsx}" --fix
```

pour s'assurer que tout est formaté correctement avant de push sur le repo, sinon le site ne pourra pas se déployer.
