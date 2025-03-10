DO $$
    BEGIN
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'promotions'
              AND column_name = 'beging_date'
        ) THEN
            ALTER TABLE promotions RENAME COLUMN beging_date TO begin_date;
        END IF;
    END $$;
