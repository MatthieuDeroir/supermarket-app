CREATE TABLE IF NOT EXISTS products (
                                        product_id         SERIAL         PRIMARY KEY,
                                        price              DECIMAL(10,2)  NOT NULL,
                                        stock_warehouse    INT            NOT NULL,
                                        stock_shelf_bottom INT            NOT NULL,
                                        minimum_stock      INT            NOT NULL,
                                        minimum_shelf_stock INT           NOT NULL,
                                        category_id        INT            NOT NULL,
                                        FOREIGN KEY (category_id) REFERENCES categories (category_id)
);
