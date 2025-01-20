.
├── config/
│   ├── database.ts           # Configuration de la base de données avec Drizzle
│   └── env.ts                # Gestion des variables d'environnement
├── deps.ts                   # Dépendances communes (Hono, etc.)
├── modules/
│   ├── users/                # Module utilisateur
│   │   ├── bll/              # Business Logic Layer
│   │   │   └── user.service.ts
│   │   ├── dal/              # Data Access Layer
│   │   │   └── user.repository.ts
│   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── user-create.dto.ts
│   │   │   ├── user-login.dto.ts
│   │   │   ├── user-response.dto.ts
│   │   │   └── user-update.dto.ts
│   │   ├── user.controller.ts
│   │   ├── user.model.ts     # Interface User
│   │   ├── user.routes.ts    # Routes utilisateurs
│   │   └── user.schema.ts    # Schéma  pour la table Users
│   └── roles/                # Module rôles (même structure que Users)
│       ├── bll/
│       │   └── role.service.ts
│       ├── dal/
│       │   └── role.repository.ts
│       ├── dto/
│       │   ├── role-create.dto.ts
│       │   └── role-response.dto.ts
│       ├── roles.controller.ts
│       ├── roles.model.ts
│       ├── roles.routes.ts
│       └── roles.schema.ts
│   └── addresses/            # Module adresses (même structure que Users)
│       ├── bll/
│       │   └── address.service.ts
│       ├── dal/
│       │   └── address.repository.ts
│       ├── dto/
│       │   ├── address-create.dto.ts
│       │   ├── address-update.dto.ts
│       │   └── address-response.dto.ts
│       ├── addresses.controller.ts
│       ├── addresses.model.ts
│       ├── addresses.routes.ts
│       └── addresses.schema.ts
│   └── (autres modules: invoices, products, logs, etc.)
│       └── (même structure pour chaque module)
├── server.ts                 # Entrée principale du serveur Hono
├── scripts/                  # Scripts pour init ou migrations (seeding)
│   ├── init-db.ts
│   └── seed.ts
└── tests/                    # Tests pour chaque module
    └── users.test.ts
