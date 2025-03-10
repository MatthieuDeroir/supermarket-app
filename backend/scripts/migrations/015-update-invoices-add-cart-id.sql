ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS cart_id INTEGER REFERENCES carts(cart_id);

