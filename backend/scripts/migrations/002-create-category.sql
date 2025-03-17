CREATE TABLE IF NOT EXISTS categories (
                                          category_id  SERIAL       PRIMARY KEY,
                                          tax_value    DECIMAL(10,2) NOT NULL,
                                          description  VARCHAR(255)  NOT NULL
);
