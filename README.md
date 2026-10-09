# Impact Afriq

Site vitrine professionnel en français pour Impact Afriq, avec une identité visuelle africaine contemporaine (vert profond, or et blanc), un design responsive et une navigation par sections.

## Aperçu

Le site est actuellement construit dans `index.html` (HTML, CSS et JavaScript natifs), pour permettre un premier déploiement simple sur GitHub Pages, Cloudflare Pages ou tout hébergement statique.

## Sections incluses

- Accueil et présentation de marque
- À propos
- Services
- Projets illustratifs
- Ambition et méthode d'impact
- Actualités éditoriales de démonstration
- Appel à l'action et formulaire de contact
- Pied de page et navigation mobile

## À configurer avant publication officielle

1. Remplacer les textes de démonstration et valider les services réellement proposés.
2. Ajouter le logo officiel, les coordonnées professionnelles, les comptes sociaux et les informations de localisation.
3. Remplacer les images de démonstration par des photos autorisées et propres à Impact Afriq.
4. Ajouter l'URL officielle dans les métadonnées Open Graph et compléter les métadonnées SEO.
5. Configurer un véritable service d'envoi de formulaires si les messages doivent être reçus et enregistrés. Le formulaire actuel prépare un brouillon dans l'application e-mail et ne transmet rien à un serveur.

## Tableau de bord administrateur

L'interface publique actuelle ne prétend pas inclure un tableau de bord sécurisé. Une zone d'administration exige un backend et une authentification côté serveur (par exemple Supabase Auth avec Row Level Security correctement configurée, ou une API sécurisée). Ne pas protéger une page uniquement par un mot de passe en JavaScript ou par un simple masquage de l'interface. Cette fonctionnalité doit être mise en place et testée séparément avant de gérer du contenu réel.

## Déploiement simple

Pour GitHub Pages : ouvrir **Settings → Pages**, sélectionner la branche `main` et la racine `/`, puis enregistrer. Après publication, vérifier l'URL fournie par GitHub Pages. Pour un déploiement de production avec formulaire fonctionnel et administration, configurer d'abord le backend, les secrets dans les paramètres de l'hébergeur et les règles d'accès.
