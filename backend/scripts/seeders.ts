// seeders.ts
import db from "../config/database.ts";

async function seed() {
    await db.connect();
    const client = db.getClient();

    try {
        // =====================
        // Table: roles
        // =====================
        console.log("Seeding table: roles");
        await client.queryArray`
      INSERT INTO roles (name)
      VALUES ('Admin'),('Manager') , ('User')
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: categories
        // =====================
        console.log("Seeding table: categories");
        await client.queryArray`
      INSERT INTO categories (tax_value, description)
      VALUES (5, 'Boissons'), (20, 'Snacks')
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: users
        // =====================
        // Remarque : role_id = 1 => Admin, role_id = 2 => Manager, role_id = 3 => User (selon l'ordre d'insertion ci-dessus)
        console.log("Seeding table: users");
        await client.queryArray`
      INSERT INTO users (
        email, password, first_name, last_name, phone_number,
        created_at, updated_at, role_id
      ) VALUES
      (
        'admin@example.com',
        'adminpassword',   -- À remplacer par un hash idéalement
        'AdminFirst',
        'AdminLast',
        '0101010101',
        NOW(), NOW(),
        1
      ),
      (
        'manager@example.com',
        'managerpassword',    -- À remplacer par un hash idéalement
        'UserFirst',
        'UserLast',
        '0202020202',
        NOW(), NOW(),
        3
      ),
      (
        'user@example.com',
        'userpassword',    -- À remplacer par un hash idéalement
        'UserFirst',
        'UserLast',
        '0202020202',
        NOW(), NOW(),
        3
      )
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: products
        // =====================
        // Remarque : category_id = 1 => 'Boissons', category_id = 2 => 'Snacks'
        console.log("Seeding table: products");
        await client.queryArray`
      INSERT INTO products (
        ean, name, brand, description, picture, nutritional_information,
        price, stock_warehouse, stock_shelf_bottom, minimum_stock,
        minimum_shelf_stock, category_id
      ) VALUES
      (
        '1234567890123',
        'Coca-Cola 33cl',
        'Coca-Cola',
        'Boisson rafraîchissante gazéifiée',
        'https://example.com/coca.png',
        'Calories: 140, Glucides: 39g, etc...',
        1.50, 100, 20, 10, 5, 1
      ),
      (
        '9876543210987',
        'Chips Apéritif 150g',
        'Lay s',
        'Chips salées classiques',
        'https://example.com/lays.png',
        'Calories: 200, Lipides: 12g, etc...',
        2.10, 50, 10, 5, 2, 2
      )
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: addresses
        // =====================
        // Remarque : user_id = 2 (user@example.com) pour l'exemple
        console.log("Seeding table: addresses");
        await client.queryArray`
      INSERT INTO addresses (
        user_id,
        address_line1, address_line2, city, zip_code, country
      ) VALUES
      (
        2,
        '10 Rue de la Paix', 'Bâtiment B',
        'Paris', '75002', 'France'
      )
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: carts
        // =====================
        // Remarque : user_id = 2 => l'utilisateur "user@example.com"
        console.log("Seeding table: carts");
        await client.queryArray`
      INSERT INTO carts (
        user_id, payed, created_at, payed_at
      ) VALUES
      (
        2,
        false,
        NOW(),
        NULL
      )
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: cart_lines
        // =====================
        // Pour l’exemple, on suppose le cart_id = 1 et product_id = 1
        console.log("Seeding table: cart_lines");
        await client.queryArray`
      INSERT INTO cart_lines (
        cart_id,
        product_id,
        quantity,
        created_at
      ) VALUES
      (
        1,
        1,
        2,
        NOW()
      )
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: invoices
        // =====================
        // Pour l’exemple, on suppose user_id = 2, address_id = 1, cart_id = 1
        console.log("Seeding table: invoices");
        await client.queryArray`
      INSERT INTO invoices (
        user_id,
        address_id,
        cart_id,
        created_at
      ) VALUES
      (
        2,
        1,
        1,
        NOW()
      )
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: invoice_lines
        // =====================
        // Pour l’exemple, on suppose invoice_id = 1, product_id = 1
        console.log("Seeding table: invoice_lines");
        await client.queryArray`
      INSERT INTO invoice_lines (
        invoice_id,
        product_id,
        quantity,
        price,
        created_at
      ) VALUES
      (
        1,
        1,
        2,
        1.50,
        NOW()
      )
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: logs
        // =====================
        // Ex. ajout d'un log pour décrire un mouvement de stock
        console.log("Seeding table: logs");
        await client.queryArray`
      INSERT INTO logs (
        date, user_id, product_id, quantity, reason, action,
        stock_warehouse_after, stock_shelf_bottom_after
      ) VALUES
      (
        NOW(),
        1,
        1,
        10,
        'Initial restock',
        'ADD',
        110,
        20
      )
      ON CONFLICT DO NOTHING
    `;

        // =====================
        // Table: promotions
        // =====================
        // Ex. promotion de 10% sur un produit
        console.log("Seeding table: promotions");
        await client.queryArray`
      INSERT INTO promotions (
        product_id, pourcentage, beging_date, end_date, active
      ) VALUES
      (
        1,
        10,
        '2025-01-01',
        '2025-01-31',
        true
      )
      ON CONFLICT DO NOTHING
    `;

        console.log("Seeding terminé avec succès !");
    } catch (error) {
        console.error("Erreur durant le seeding :", error);
    } finally {
        await db.close();
    }
}

if (import.meta.main) {
    seed();
}
