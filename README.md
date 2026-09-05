# Mini Docto+



---

#  Dépôt GitHub

https://github.com/farah699/mini-docto

---

#  Objectif

L'objectif du projet est de mettre en place une application permettant de gérer :

* Les utilisateurs
* Les rôles `user` (patient) et `pro` (professionnel)
* L'inscription et la connexion
* Les créneaux de disponibilité
* Les rendez-vous
* Le classement des professionnels par score décroissant

Le projet a été développé avec une architecture séparant clairement le backend et le frontend.

---

#  Technologies utilisées

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* dotenv
* CORS

### Pourquoi Node.js / Express.js ?

J'ai choisi Node.js avec Express.js pour :

* Sa simplicité et sa rapidité de développement
* La facilité de création d'une API REST
* La gestion simple des middlewares
* La facilité d'implémentation de l'authentification JWT
* La possibilité de faire évoluer facilement l'application

---

## Base de données

### MongoDB

MongoDB a été choisi conformément aux exigences du test technique.

Mongoose est utilisé pour :

* Définir les modèles
* Structurer les données
* Effectuer les validations
* Faciliter les interactions avec MongoDB

---

## Frontend

Le frontend est développé avec :

* React
* Vite
* React Router
* Axios

### Choix du frontend

Une interface frontend basique a été développée afin de permettre de visualiser et tester les principaux parcours de l'application.

**Le frontend ne contient volontairement pas toutes les fonctionnalités disponibles dans le backend.**

L'ensemble des fonctionnalités métier demandées et des fonctionnalités supplémentaires implémentées sont disponibles au niveau du **backend et de son API REST**.

Le backend peut donc être testé entièrement et indépendamment à l'aide de **Postman**.

---

#  Gestion des rôles

L'application possède deux rôles.

## Patient — `user`

Le patient peut :

* S'inscrire
* Se connecter
* Consulter les professionnels
* Consulter les professionnels classés par score
* Consulter les disponibilités
* Réserver un créneau
* Consulter ses rendez-vous
* Modifier ses rendez-vous
* Annuler ses rendez-vous

## Professionnel — `pro`

Le professionnel peut :

* S'inscrire
* Se connecter
* Posséder un score entre 0 et 100
* Ajouter des créneaux de disponibilité
* Consulter ses rendez-vous
* Supprimer ses créneaux de disponibilité

---

#  Classement des professionnels

Chaque professionnel possède un score compris entre 0 et 100.

Le score est stocké directement en base de données.

Aucun calcul automatique du score n'est nécessaire dans le cadre de ce test.

Lorsqu'un patient consulte la liste des professionnels, ceux-ci sont triés par score décroissant.

Exemple :

```text
Professionnel A → 95
Professionnel B → 87
Professionnel C → 75
Professionnel D → 64
```

Le professionnel avec le score le plus élevé apparaît donc en premier.

---

#  Gestion des disponibilités

Un professionnel peut créer des créneaux de disponibilité.

Exemple :

```json
{
  "date": "2026-09-10",
  "startTime": "10:00",
  "endTime": "11:00"
}
```

Chaque créneau est associé au professionnel qui l'a créé.

Lorsqu'un créneau est réservé, il devient indisponible afin d'éviter les doubles réservations.

---

#  Gestion des rendez-vous

Un patient peut réserver un créneau disponible.

Un rendez-vous contient notamment :

* Le patient
* Le professionnel
* Le créneau sélectionné
* La date
* Le statut

Les patients peuvent uniquement modifier ou annuler leurs propres rendez-vous.

Les professionnels peuvent consulter leurs propres rendez-vous.

---

#  Modèle de données

## User

```text
User
├── name
├── email
├── password
├── role
└── score
```

Le rôle peut être :

```text
user
pro
```

---

## Availability

```text
Availability
├── professionalId
├── date
├── startTime
├── endTime
└── available
```

---

## Appointment

```text
Appointment
├── patientId
├── professionalId
├── availabilityId
├── date
└── status
```

---

# Sécurité

## Hachage des mots de passe

Les mots de passe ne sont jamais stockés en clair.

Ils sont hachés avec `bcryptjs` avant d'être enregistrés dans MongoDB.

## JWT

L'authentification utilise des JSON Web Tokens.

Après connexion, le token doit être envoyé dans les requêtes protégées :

```text
Authorization: Bearer <TOKEN>
```

## Autorisation par rôle

Les routes sont protégées selon le rôle de l'utilisateur.

Un patient ne peut pas effectuer les opérations réservées aux professionnels.

Un professionnel ne peut pas effectuer les opérations réservées aux patients.

## Protection des ressources

Les utilisateurs ne peuvent accéder qu'aux ressources qui leur appartiennent.

Par exemple, un patient ne peut modifier ou annuler que ses propres rendez-vous.

## Variables d'environnement

Les informations sensibles sont stockées dans `.env`.

Le fichier `.env` n'est pas envoyé sur GitHub.

Un fichier `.env.example` est fourni.

---

#  Performance

L'application utilise une architecture REST légère avec Node.js, Express.js et MongoDB.

Le backend est stateless grâce à JWT, ce qui facilite une éventuelle montée en charge.

Le classement des professionnels est effectué directement au niveau de la requête avec un tri décroissant sur le score.

Pour une version de production, des optimisations supplémentaires pourraient être ajoutées :

* Index MongoDB
* Pagination
* Cache
* Rate limiting
* Validation avancée
* Monitoring
* Logs centralisés
* Load balancing

---

#  Structure du projet

```text
mini-docto/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

#  Installation

## Prérequis

* Node.js
* npm
* MongoDB

---

#  Installation Backend

Depuis la racine du projet :

```bash
cd backend
```

Installer les dépendances :

```bash
npm install
```

Créer un fichier `.env` à partir de `.env.example`.

Exemple :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mini-docto
JWT_SECRET=mini-docto-secret
```

Lancer le backend :

```bash
npm run dev
```

Le backend sera disponible sur :

```text
http://localhost:3000
```

---

# Installation Frontend

Dans un deuxième terminal :

```bash
cd frontend
```

Installer les dépendances :

```bash
npm install
```

Lancer le frontend :

```bash
npm run dev
```

Le frontend sera disponible sur :

```text
http://localhost:5173
```

---

#  Tests Postman — API complète

Toutes les fonctionnalités du backend peuvent être testées avec Postman.

Pour les routes protégées, il faut ajouter :

```text
Authorization: Bearer <TOKEN>
```

---

## 1. Authentification

### 1.1 Inscription Patient

```http
POST http://localhost:3000/api/auth/register
```

Body :

```json
{
  "name": "Farah",
  "email": "farah@test.com",
  "password": "123456",
  "role": "user"
}
```

---

### 1.2 Inscription Professionnel

```http
POST http://localhost:3000/api/auth/register
```

Body :

```json
{
  "name": "Dr Ahmed",
  "email": "ahmed@test.com",
  "password": "123456",
  "role": "pro"
}
```

---

### 1.3 Connexion

```http
POST http://localhost:3000/api/auth/login
```

Body :

```json
{
  "email": "farah@test.com",
  "password": "123456"
}
```

La réponse contient le token JWT.

Ce token doit être utilisé pour les requêtes protégées.

---

### 1.4 Obtenir l'utilisateur connecté

```http
GET /api/auth/me
```

Header :

```text
Authorization: Bearer <TOKEN>
```

---

# 2. Professionnels

### 2.1 Liste des professionnels

```http
GET /api/professionals
```

Header :

```text
Authorization: Bearer <PATIENT_TOKEN>
```

Cette requête retourne les professionnels disponibles triés par score décroissant.

Exemple :

```text
Dr Ahmed → 95
Dr Mohamed → 88
Dr Ali → 76
```

---

# 3. Disponibilités

### 3.1 Ajouter un créneau

Accessible uniquement au professionnel.

```http
POST /api/availability
```

Header :

```text
Authorization: Bearer <PRO_TOKEN>
```

Body :

```json
{
  "date": "2026-09-10",
  "startTime": "10:00",
  "endTime": "11:00"
}
```

---

### 3.2 Consulter les disponibilités d'un professionnel

```http
GET /api/availability/professional/:professionalId
```

Exemple :

```text
GET /api/availability/professional/64f123456789
```

---

### 3.3 Supprimer un créneau

Accessible uniquement au professionnel propriétaire du créneau.

```http
DELETE /api/availability/:id
```

Header :

```text
Authorization: Bearer <PRO_TOKEN>
```

Exemple :

```text
DELETE /api/availability/64f123456789
```

---

# 4. Rendez-vous

### 4.1 Réserver un créneau

Accessible uniquement au patient.

```http
POST /api/appointments
```

Header :

```text
Authorization: Bearer <PATIENT_TOKEN>
```

Body :

```json
{
  "availabilityId": "64f123456789"
}
```

Après la réservation, le créneau devient indisponible.

---

### 4.2 Consulter les rendez-vous du patient

```http
GET /api/appointments/my
```

Header :

```text
Authorization: Bearer <PATIENT_TOKEN>
```

Cette requête retourne uniquement les rendez-vous du patient connecté.

---

### 4.3 Modifier un rendez-vous

```http
PUT /api/appointments/:id
```

Header :

```text
Authorization: Bearer <PATIENT_TOKEN>
```

Le patient ne peut modifier que ses propres rendez-vous.

---

### 4.4 Annuler un rendez-vous

```http
PATCH /api/appointments/:id/cancel
```

Header :

```text
Authorization: Bearer <PATIENT_TOKEN>
```

Le patient ne peut annuler que ses propres rendez-vous.

Après l'annulation, le créneau peut redevenir disponible.

---

### 4.5 Consulter les rendez-vous du professionnel

Accessible uniquement au professionnel.

```http
GET /api/appointments/pro
```

Header :

```text
Authorization: Bearer <PRO_TOKEN>
```

Cette requête retourne les rendez-vous associés au professionnel connecté.

---

#  Parcours de test recommandé

Pour tester complètement l'application avec Postman :

### Étape 1 — Créer un professionnel

```text
POST http://localhost:3000/api/auth/register
```

### Étape 2 — Connecter le professionnel

```text
POST http://localhost:3000/api/auth/login
```

Récupérer le `PRO_TOKEN`.

### Étape 3 — Ajouter un créneau

```text
POST http://localhost:3000/api/availability
```

### Étape 4 — Créer un patient

```text
POST http://localhost:3000/api/auth/register
```

### Étape 5 — Connecter le patient

```text
POST http://localhost:3000/api/auth/login
```

Récupérer le `PATIENT_TOKEN`.

### Étape 6 — Consulter les professionnels

```text
GET http://localhost:3000/api/professionals
```

Vérifier que les professionnels sont triés par score décroissant.

### Étape 7 — Consulter les disponibilités

```text
GET http://localhost:3000/api/availability/professional/:professionalId
```

### Étape 8 — Réserver un créneau

```text
POST http://localhost:3000/api/appointments
```

### Étape 9 — Vérifier les rendez-vous du patient

```text
GET http://localhost:3000/api/appointments/my
```

### Étape 10 — Modifier le rendez-vous

```text
PUT http://localhost:3000/api/appointments/:id
```

### Étape 11 — Annuler le rendez-vous

```text
PATCH http://localhost:3000/api/appointments/:id/cancel
```

### Étape 12 — Vérifier les rendez-vous du professionnel

```text
GET http://localhost:3000/api/appointments/pro
```

### Étape 13 — Supprimer un créneau

```text
DELETE /api/availability/:id
```

---

# 🖥️ À propos du Frontend

Le frontend React contient des **interfaces basiques** permettant de présenter les principaux parcours de l'application.

Cependant, **toutes les fonctionnalités du backend ne sont pas représentées dans l'interface frontend**.

Ce choix a été fait afin de rester concentré sur le périmètre fonctionnel et technique du test.

Le **backend contient l'ensemble de la logique métier et des fonctionnalités de l'application**, et toutes les fonctionnalités peuvent être testées directement via les endpoints REST avec Postman.

Ainsi :

```text
Frontend
   │
   ├── Interfaces principales
   └── Parcours utilisateur de base
       
Backend
   │
   ├── Authentification
   ├── Autorisation
   ├── Utilisateurs
   ├── Professionnels
   ├── Disponibilités
   ├── Rendez-vous
   └── Logique métier complète
```

---

# 📌 Périmètre du développement

Le développement a été réalisé en tenant compte de la durée indiquée dans le test technique, soit environ **1 à 2 heures**.

La priorité a été donnée aux fonctionnalités métier et à la qualité de l'API backend.

Le frontend a été volontairement maintenu simple afin de consacrer davantage de temps à :

* La modélisation des données
* L'authentification
* La gestion des rôles
* La sécurité
* La gestion des disponibilités
* Le classement par score
* La réservation
* La gestion des rendez-vous

---

# 🔮 Évolutions possibles

Pour une version production, plusieurs améliorations pourraient être ajoutées :

* Interface frontend complète
* Design responsive plus avancé
* Notifications par email
* Réinitialisation du mot de passe
* Vérification de l'adresse email
* Système de notation des professionnels
* Recherche et filtres avancés
* Pagination
* Documentation Swagger/OpenAPI
* Tests unitaires et d'intégration
* Application mobile Flutter
* Analytics
* Monitoring et logs

---

# 👩‍💻 Auteur

**Farah Hmida**


GitHub :

https://github.com/farah699/mini-docto
