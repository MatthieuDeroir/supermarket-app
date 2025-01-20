CREATE TABLE IF NOT EXISTS invoices (
                                        invoice_id  SERIAL    PRIMARY KEY,
                                        user_id     INT       NOT NULL,
                                        address_id  INT       NOT NULL,
                                        created_at  TIMESTAMP,
                                        FOREIGN KEY (user_id) REFERENCES users (user_id),
                                        FOREIGN KEY (address_id) REFERENCES addresses (address_id)
);
