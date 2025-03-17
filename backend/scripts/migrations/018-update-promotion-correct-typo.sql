DO $$
    BEGIN
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'promotions'
              AND column_name = 'pourcentage'
        ) THEN
            ALTER TABLE promotions RENAME COLUMN pourcentage TO percentage;
        END IF;
    END $$;
