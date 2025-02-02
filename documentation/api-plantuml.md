@startmindmap
title Deno Hono API

* **Deno Hono API**
  ** Addresses
  *** GET /addresses
  **** Récupère toutes les adresses
  *** GET /addresses/{id}
  **** Récupère une adresse par son ID
  *** POST /addresses
  **** Crée une nouvelle adresse
  *** PUT /addresses/{id}
  **** Met à jour une adresse existante
  *** DELETE /addresses/{id}
  **** Supprime une adresse

** Carts
*** GET /carts
**** Liste tous les paniers
*** GET /carts/{id}
**** Récupère un panier par ID
*** POST /carts
**** Crée un nouveau panier
*** PUT /carts/{id}
**** Modifie un panier
*** DELETE /carts/{id}
**** Supprime un panier
*** POST /carts/lines
**** Ajoute un produit au panier
*** POST /carts/{id}/pay
**** Paie un panier

** CartLines
*** GET /cart_lines
**** Liste toutes les lignes de panier
*** GET /cart_lines/{id}
**** Récupère une ligne de panier
*** POST /lines
**** Crée une ligne de panier
*** PUT /cart_lines/{id}
**** Met à jour la quantité d’une ligne
*** DELETE /carts/{cartId}/lines/{lineId}
**** Supprime une ligne d’un panier

** Categories
*** GET /categories
**** Liste toutes les catégories
*** GET /categories/{id}
**** Récupère une catégorie par ID
*** POST /categories
**** Crée une nouvelle catégorie
*** PUT /categories/{id}
**** Met à jour une catégorie
*** DELETE /categories/{id}
**** Supprime une catégorie

** Invoices
*** GET /invoices
**** Liste toutes les factures
*** GET /invoices/{id}
**** Récupère une facture par ID
*** GET /invoices/user/{userId}
**** Liste les factures d’un utilisateur
*** POST /invoices
**** Crée une facture
*** PUT /invoices/{id}
**** Met à jour une facture
*** DELETE /invoices/{id}
**** Supprime une facture

** InvoiceLines
*** GET /invoice_lines
**** Liste toutes les lignes de facture
*** GET /invoice_lines/{id}
**** Récupère une ligne de facture par ID
*** POST /invoice_lines
**** Crée une nouvelle ligne de facture
*** PUT /invoice_lines/{id}
**** Met à jour une ligne de facture
*** DELETE /invoice_lines/{id}
**** Supprime une ligne de facture

** Logs
*** GET /logs
**** Liste tous les logs
*** GET /logs/{id}
**** Récupère un log par ID
*** POST /logs
**** Crée un log
*** PUT /logs/{id}
**** Met à jour un log
*** DELETE /logs/{id}
**** Supprime un log
*** GET /logs/product/{productId}
**** Liste les logs pour un produit
*** GET /logs/product/{productId}/daily
**** Historique journalier du stock d’un produit

** Products
*** GET /products
**** Liste tous les produits
*** GET /products/{id}
**** Récupère un produit par ID
*** POST /products
**** Crée un nouveau produit
*** PUT /products/{id}
**** Met à jour un produit
*** DELETE /products/{id}
**** Supprime un produit
*** POST /products/{id}/add-to-warehouse
**** Ajoute au stock warehouse
*** POST /products/{id}/warehouse-to-shelf
**** Transfère du warehouse vers le shelf
*** POST /products/{id}/shelf-to-warehouse
**** Transfère du shelf vers le warehouse
*** POST /products/{id}/warehouse-to-trash
**** Transfère du warehouse vers la poubelle
*** POST /products/{id}/shelf-to-trash
**** Transfère du shelf vers la poubelle

** Promotions
*** GET /promotions
**** Liste toutes les promotions
*** GET /promotions/{id}
**** Récupère une promotion par ID
*** POST /promotions
**** Crée une promotion
*** PUT /promotions/{id}
**** Met à jour une promotion
*** DELETE /promotions/{id}
**** Supprime une promotion

** Roles
*** GET /roles
**** Liste tous les rôles
*** GET /roles/{id}
**** Récupère un rôle par ID
*** POST /roles
**** Crée un rôle
*** PUT /roles/{id}
**** Met à jour un rôle
*** DELETE /roles/{id}
**** Supprime un rôle

** Users
*** GET /users
**** Liste tous les utilisateurs
*** GET /users/{id}
**** Récupère un utilisateur par ID
*** POST /users
**** Crée un utilisateur
*** PUT /users/{id}
**** Met à jour un utilisateur
*** DELETE /users/{id}
**** Supprime un utilisateur

** OpenFoodFact
*** GET /openfood?ean={code}
**** Récupère un produit par EAN et l’enregistre

** Auth
*** POST /auth/register
**** Inscrit un nouvel utilisateur
*** POST /auth/login
**** Connecte un utilisateur (JWT)

** PayPal
*** POST /paypal/create-order
**** Crée un ordre de paiement PayPal
*** GET /paypal/confirm?orderId={...}
**** Confirme le paiement PayPal
*** GET /paypal/cancel
**** Annule le paiement PayPal

@endmindmap
