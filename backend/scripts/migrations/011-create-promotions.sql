CREATE TABLE IF NOT EXISTS promotions (
                                          promotion_id  SERIAL      PRIMARY KEY,
                                          product_id    INT         NOT NULL,
                                          pourcentage   INT         NOT NULL,
                                          beging_date   DATE,
                                          end_date      DATE,
                                          active        BOOLEAN     DEFAULT false,
                                          FOREIGN KEY (product_id)  REFERENCES products (product_id)
);
