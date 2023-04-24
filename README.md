Ce petit site récupère les données ouvertes des compteurs de passages à vélo de la ville de Strasbourg pour en faire une présentation synthétique.
Il est le clone mis à jour de https://github.com/Tristramg/velos-paris

En particulier on peut :

- Comparer les principaux compteurs
- Pour un compteur donné, voir les chiffre par heure de la veille, par jour du dernier mois, ou par semaine sur l’année en cours
- Voir les répartitions des passages des vélos selon le jour et l'heure de la semaine
- Voir le sens de passage des vélos selon le jour et l'heure de la semaine

## Obtenir les données

Des capteur (« boucles ») sont installées au sein du goudron un peu partout dans Strasbourg. Cette boucle détecte le passage d’un vélo et remonte la donnée qui est exposée sur le portail OpenData de la Ville.

Elles sont mise à jour toutes les trois minutes et à chercher ici :

Le premier qui contient les données de comptage à proprement parler (une mesure par heure et par compteur) :
 "https://data.strasbourg.eu/api/v2/catalog/datasets/sirac_flux_trafic/records?select=ident%2Cdebit&where=name%20like%20%22Cyclistes%22%20or%20%22Cycl%22&limit=100&offset=0&timezone=UTC" 

S'en suit un stockage de ces données et une restitution sous la forme d'un fichier csv pour être exploitable par le site.

Les informations supplémentaire sur chaque compteur viennent de là :
"https://data.strasbourg.eu/api/v2/catalog/datasets/sirac_flux_trafic/records?where=name%20like%20%22Cyclistes%22%20or%20%22Cycl%22&limit=100&offset=0&timezone=UTC"

Je n'ai pas fourni les scripts qui enregistrent ces données, car il faudrait sans doute faire mieux que ce que j'ai fait, mais contactez-moi pour les voir.

## Lancer le projet

C’est un projet [Next.js](https://nextjs.org/) et [Vega-Lite](https://vega.github.io/) pour dessiner les graphes.

La carte utilise [Mapbox](https://mapbox.com) et un _token_ est nécessaire.
Obtenez-en un et modifiez `.env.local.example` en le sauvegardant sous `.env.local`.

J'ai ajouté les pistes cyclables de Strasbourg, disponibles aussi sur le site de la ville à cette adresse : https://data.strasbourg.eu/explore/dataset/amg_cycl_bnac/table/
Elles sont intégr&es aux cartes via Mapbox par https://studio.mapbox.com/styles/environ314/clgr0cb63000801r03lj9423u (je pense qu'il faut vous créer un compte pour y accéder)

Vous aurez besoin d’une installation de [Node.js](https://nodejs.org/)

```bash
yarn install
```

Afin de ne pas dépendre d’une base de données, les données sont préparées et intégrées statique à chaque page.

Pour préparer les données (une fois le travail de collecte et d'export réalisé) :

```bash
yarn prep
```

Et enfin pour lancer le projet :

```bash
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## Déployer le projet

Afin de maintenir le site à jour, il faut reconstruire le site chaque heure?

Téléchargez les données

Exécutez :

```bash
yarn prep
yarn build
yarn export
```

Le repertoire `out` contiendra les fichier statiques à transférer sur le serveur web (celui-ci doit juste servir les fichiers. Il n’y a pas besoin d’avoir la moindre installation locale).
