CREATE TABLE IF NOT EXISTS logs (
                                    log_id     SERIAL        PRIMARY KEY,
                                    date       TIMESTAMP     NOT NULL,
                                    user_id    INT           NOT NULL,
                                    product_id INT,
                                    quantity   INT           NOT NULL,
                                    stock_warehouse_after   INT           NOT NULL,
                                    stock_shelf_bottom_after INT         NOT NULL,
                                    reason     VARCHAR(255),
                                    action     VARCHAR(255),
                                    stockType  VARCHAR(255),
                                    FOREIGN KEY (user_id)    REFERENCES users (user_id),
                                    FOREIGN KEY (product_id) REFERENCES products (product_id)
);
