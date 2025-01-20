CREATE TABLE IF NOT EXISTS addresses (
                                         address_id         SERIAL         PRIMARY KEY,
                                         user_id            INT            NOT NULL,
                                         address_line1      VARCHAR(255),
                                         address_line2      VARCHAR(255),
                                         address_complement VARCHAR(255),
                                         zip_code           VARCHAR(50),
                                         city               VARCHAR(255),
                                         country            VARCHAR(255),
                                         FOREIGN KEY (user_id) REFERENCES users (user_id)
);
