CREATE TABLE IF NOT EXISTS users (
                                     user_id      SERIAL        PRIMARY KEY,
                                     email        VARCHAR(255)  NOT NULL,
                                     password     VARCHAR(255)  NOT NULL,
                                     first_name   VARCHAR(255),
                                     last_name    VARCHAR(255),
                                     phone_number VARCHAR(50),
                                     created_at   TIMESTAMP,
                                     updated_at   TIMESTAMP,
                                     deleted_at   TIMESTAMP,
                                     role_id      INT           NOT NULL,
                                     FOREIGN KEY (role_id) REFERENCES roles (role_id)
);
