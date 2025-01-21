CREATE TABLE IF NOT EXISTS invoice_lines (
                                             invoice_line_id  SERIAL         PRIMARY KEY,
                                             product_id       INT            NOT NULL,
                                             quantity         INT            NOT NULL,
                                             price            DECIMAL(10,2)  NOT NULL,
                                             invoice_id       INT            NOT NULL,
                                             created_at       TIMESTAMP,
                                             FOREIGN KEY (product_id) REFERENCES products (product_id),
                                             FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id)
);
