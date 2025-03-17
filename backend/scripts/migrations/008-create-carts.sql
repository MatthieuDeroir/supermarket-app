CREATE TABLE IF NOT EXISTS carts (
                                     cart_id    SERIAL    PRIMARY KEY,
                                     user_id    INT       NOT NULL,
                                     payed BOOLEAN DEFAULT FALSE,
                                     created_at TIMESTAMP,
                                     payed_at TIMESTAMP DEFAULT NULL,
                                     FOREIGN KEY (user_id) REFERENCES users (user_id)
);
