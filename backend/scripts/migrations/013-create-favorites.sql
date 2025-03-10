-- 013-create-favorites.sql
CREATE TABLE IF NOT EXISTS favorites (
                                         favorite_id SERIAL PRIMARY KEY,
                                         user_id INT NOT NULL,
                                         product_id INT NOT NULL,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         FOREIGN KEY (user_id) REFERENCES users (user_id),
                                         FOREIGN KEY (product_id) REFERENCES products (product_id),
    -- Add unique constraint to prevent duplicate favorites
                                         UNIQUE (user_id, product_id)
);

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Create index for faster lookups by product_id
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);