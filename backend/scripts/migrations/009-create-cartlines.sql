CREATE TABLE IF NOT EXISTS cart_lines (
                                          cart_line_id SERIAL      PRIMARY KEY,
                                          product_id   INT         NOT NULL,
                                          quantity     INT         NOT NULL,
                                          cart_id      INT         NOT NULL,
                                          created_at   TIMESTAMP,
                                          FOREIGN KEY (product_id) REFERENCES products (product_id),
                                          FOREIGN KEY (cart_id)    REFERENCES carts (cart_id)
);
