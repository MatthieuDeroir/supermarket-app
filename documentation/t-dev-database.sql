CREATE TABLE IF NOT EXISTS roles (
                                     role_id      SERIAL       PRIMARY KEY,
                                     name         VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
                                          category_id  SERIAL       PRIMARY KEY,
                                          tax_value    DECIMAL(10,2) NOT NULL,
                                          description  VARCHAR(255)  NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
                                     user_id      SERIAL        PRIMARY KEY,
                                     email        VARCHAR(255)  NOT NULL,
                                     password     VARCHAR(255)  NOT NULL,
                                     first_name   VARCHAR(255),
                                     last_name    VARCHAR(255),
                                     phone_number VARCHAR(50),
                                     created_at   TIMESTAMP,
                                     updated_at   TIMESTAMP,
                                     deleted_at   TIMESTAMP,
                                     role_id      INT           NOT NULL,
                                     FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

CREATE TABLE IF NOT EXISTS products (
                                        product_id         SERIAL         PRIMARY KEY,
                                        ean                VARCHAR(13)    NOT NULL,
                                        name               VARCHAR(100)   NOT NULL,
                                        brand              VARCHAR(100)   NOT NULL,
                                        description        TEXT           NOT NULL,
                                        picture            VARCHAR(255)   NOT NULL,
                                        nutritional_information   TEXT           NOT NULL,
                                        price              DECIMAL(10,2)  NOT NULL,
                                        stock_warehouse    INT            NOT NULL,
                                        stock_shelf_bottom INT            NOT NULL,
                                        minimum_stock      INT            NOT NULL,
                                        minimum_shelf_stock INT           NOT NULL,
                                        category_id        INT            NOT NULL,
                                        FOREIGN KEY (category_id) REFERENCES categories (category_id)
);

CREATE TABLE IF NOT EXISTS addresses (
                                         address_id         SERIAL         PRIMARY KEY,
                                         user_id            INT            NOT NULL,
                                         address_line1      VARCHAR(255),
                                         address_line2      VARCHAR(255),
                                         address_complement VARCHAR(255),
                                         zip_code           VARCHAR(50),
                                         city               VARCHAR(255),
                                         country            VARCHAR(255),
                                         FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS invoices (
                                        invoice_id  SERIAL    PRIMARY KEY,
                                        user_id     INT       NOT NULL,
                                        address_id  INT       NOT NULL,
                                        created_at  TIMESTAMP,
                                        FOREIGN KEY (user_id) REFERENCES users (user_id),
                                        FOREIGN KEY (address_id) REFERENCES addresses (address_id)
);

CREATE TABLE IF NOT EXISTS invoice_lines (
                                             invoice_line_id  SERIAL         PRIMARY KEY,
                                             product_id       INT            NOT NULL,
                                             quantity         INT            NOT NULL,
                                             price            DECIMAL(10,2)  NOT NULL,
                                             invoice_id       INT            NOT NULL,
                                             created_at       TIMESTAMP,
                                             FOREIGN KEY (product_id) REFERENCES products (product_id),
                                             FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id)
);

CREATE TABLE IF NOT EXISTS carts (
                                     cart_id    SERIAL    PRIMARY KEY,
                                     user_id    INT       NOT NULL,
                                     payed BOOLEAN DEFAULT FALSE,
                                     created_at TIMESTAMP,
                                     payed_at TIMESTAMP DEFAULT NULL,
                                     FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS cart_lines (
                                          cart_line_id SERIAL      PRIMARY KEY,
                                          product_id   INT         NOT NULL,
                                          quantity     INT         NOT NULL,
                                          cart_id      INT         NOT NULL,
                                          created_at   TIMESTAMP,
                                          FOREIGN KEY (product_id) REFERENCES products (product_id),
                                          FOREIGN KEY (cart_id)    REFERENCES carts (cart_id)
);

CREATE TABLE IF NOT EXISTS logs (
                                    log_id     SERIAL        PRIMARY KEY,
                                    date       TIMESTAMP     NOT NULL,
                                    user_id    INT           NOT NULL,
                                    product_id INT,
                                    quantity   INT           NOT NULL,
                                    stock_warehouse_after   INT           NOT NULL,
                                    stock_shelf_bottom_after INT         NOT NULL,
                                    reason     VARCHAR(255),
                                    action     VARCHAR(255),
                                    stockType  VARCHAR(255),
                                    FOREIGN KEY (user_id)    REFERENCES users (user_id),
                                    FOREIGN KEY (product_id) REFERENCES products (product_id)
);


CREATE TABLE IF NOT EXISTS promotions (
    promotion_id  SERIAL      PRIMARY KEY,
    product_id    INT         NOT NULL,
    pourcentage   INT         NOT NULL,
    beging_date   DATE,
    end_date      DATE,
    active        BOOLEAN     DEFAULT false,
    FOREIGN KEY (product_id)  REFERENCES products (product_id)
);
