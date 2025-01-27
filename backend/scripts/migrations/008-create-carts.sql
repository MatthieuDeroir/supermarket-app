CREATE TABLE IF NOT EXISTS carts (
                                     cart_id    SERIAL    PRIMARY KEY,
                                     user_id    INT       NOT NULL,
                                     created_at TIMESTAMP,
                                     FOREIGN KEY (user_id) REFERENCES users (user_id)
);
