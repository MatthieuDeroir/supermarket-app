# Documentation de l'API Deno Hono

## Introduction

Cette documentation décrit les endpoints de l'API RESTful développée avec Deno Hono. Les conventions de l'API suivent le style snake\_case.

## Base URL

```
{{API_URL}} = http://localhost:4000
```

## Endpoints

### Addresses

#### Récupérer toutes les adresses

**GET** `/addresses`

Réponse :

```json
[
    {
        "address_id": 1,
        "user_id": 1,
        "address_line1": "123 Postman St",
        "city": "Paris",
        "country": "France"
    }
]
```

#### Récupérer une adresse par ID

**GET** `/addresses/{address_id}`

Réponse :

```json
{
    "address_id": 1,
    "user_id": 1,
    "address_line1": "123 Postman St",
    "city": "Paris",
    "country": "France"
}
```

#### Créer une adresse

**POST** `/addresses`

Corps de la requête :

```json
{
    "user_id": 1,
    "address_line1": "123 Postman St",
    "city": "Paris",
    "country": "France"
}
```

Réponse :

```json
{
    "message": "Address created"
}
```

#### Mettre à jour une adresse

**PUT** `/addresses/{address_id}`

Corps de la requête :

```json
{
    "city": "Lyon",
    "zip_code": "69000"
}
```

Réponse :

```json
{
    "message": "Address updated"
}
```

#### Supprimer une adresse

**DELETE** `/addresses/{address_id}`

Réponse :

```json
{
    "message": "Address deleted"
}
```

---

### Carts

#### Récupérer tous les paniers

**GET** `/carts`

Réponse :

```json
[
    {
        "cart_id": 1,
        "user_id": 1,
        "created_at": "2025-01-20T10:00:00Z",
        "payed": false
    }
]
```

#### Récupérer un panier par ID

**GET** `/carts/{cart_id}`

Réponse :

```json
{
    "cart_id": 1,
    "user_id": 1,
    "created_at": "2025-01-20T10:00:00Z",
    "payed": false
}
```

#### Créer un panier

**POST** `/carts`

Corps de la requête :

```json
{
    "user_id": 1,
    "created_at": "2025-01-20T10:00:00Z"
}
```

Réponse :

```json
{
    "message": "Cart created"
}
```

#### Mettre à jour un panier

**PUT** `/carts/{cart_id}`

Corps de la requête :

```json
{
    "created_at": "2025-01-20T12:00:00Z"
}
```

Réponse :

```json
{
    "message": "Cart updated"
}
```

#### Supprimer un panier

**DELETE** `/carts/{cart_id}`

Réponse :

```json
{
    "message": "Cart deleted"
}
```

#### Ajouter un produit au panier

**POST** `/carts/lines`

Corps de la requête :

```json
{
    "product_id": 15,
    "quantity": 1200
}
```

Réponse :

```json
{
    "message": "Product added to cart"
}
```

#### Payer un panier

**POST** `/carts/{cart_id}/pay`

Réponse :

```json
{
    "message": "Cart paid successfully"
}
```

---

### Products

#### Récupérer tous les produits

**GET** `/products`

Réponse :

```json
[
    {
        "product_id": 15,
        "ean": "3029330003533",
        "name": "Example Product",
        "price": 12.99
    }
]
```

#### Récupérer un produit par ID

**GET** `/products/{product_id}`

Réponse :

```json
{
    "product_id": 15,
    "ean": "3029330003533",
    "name": "Example Product",
    "price": 12.99
}
```

#### Créer un produit

**POST** `/products`

Corps de la requête :

```json
{
    "price": 12.99,
    "stock_warehouse": 100,
    "stock_shelf_bottom": 20,
    "minimum_stock": 10,
    "minimum_shelf_stock": 5,
    "category_id": 1
}
```

Réponse :

```json
{
    "message": "Product created"
}
```

#### Mettre à jour un produit

**PUT** `/products/{product_id}`

Corps de la requête :

```json
{
    "price": 15.99,
    "stock_warehouse": 80
}
```

Réponse :

```json
{
    "message": "Product updated"
}
```

#### Supprimer un produit

**DELETE** `/products/{product_id}`

Réponse :

```json
{
    "message": "Product deleted"
}
```

---

### Promotions

#### Récupérer toutes les promotions

**GET** `/promotions`

Réponse :

```json
[
    {
        "promotion_id": 1,
        "product_id": 15,
        "pourcentage": 25,
        "beging_date": "2025-02-01",
        "end_date": "2025-02-15",
        "active": true
    }
]
```

#### Créer une promotion

**POST** `/promotions`

Corps de la requête :

```json
{
    "product_id": 15,
    "pourcentage": 25,
    "beging_date": "2025-02-01",
    "end_date": "2025-02-15",
    "active": true
}
```

Réponse :

```json
{
    "message": "Promotion created"
}
```

---

### Authentification

#### Inscription

**POST** `/auth/register`

Corps de la requête :

```json
{
    "email": "test@test.com",
    "password": "test"
}
```

Réponse :

```json
{
    "message": "User registered"
}
```

#### Connexion

**POST** `/auth/login`

Corps de la requête :

```json
{
    "email": "test@test.com",
    "password": "test"
}
```

Réponse :

```json
{
    "token": "eyJhbGciOi..."
}
```

