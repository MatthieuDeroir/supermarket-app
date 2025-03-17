-- For each user, ensure only one address is active
CREATE OR REPLACE FUNCTION ensure_one_active_address()
    RETURNS VOID AS $$
DECLARE
    user_record RECORD;
    first_address INTEGER;
BEGIN
    -- Iterate through all users with more than one active address
    FOR user_record IN
        SELECT user_id
        FROM addresses
        WHERE active = TRUE
        GROUP BY user_id
        HAVING COUNT(*) > 1
        LOOP
            -- Get the first address for this user
            SELECT MIN(address_id) INTO first_address
            FROM addresses
            WHERE user_id = user_record.user_id;

            -- Deactivate all addresses except the first one
            UPDATE addresses
            SET active = FALSE
            WHERE user_id = user_record.user_id
              AND address_id != first_address;
        END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT ensure_one_active_address();

-- Drop the function as it's no longer needed
DROP FUNCTION ensure_one_active_address();