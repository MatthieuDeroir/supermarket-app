ALTER TABLE logs
    ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE logs DROP CONSTRAINT logs_product_id_fkey;
