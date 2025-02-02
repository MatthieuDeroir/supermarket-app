// DBML Script for Database Diagram

Table roles {
    role_id int [pk, increment] // Primary Key
    name varchar
}

Table categories {
    category_id int [pk, increment] // Primary Key
    tax_value int
    description varchar
}

Table users {
    user_id int [pk, increment] // Primary Key
    email varchar
    password varchar
    first_name varchar
    last_name varchar
    phone_number varchar
    created_at timestamp
    updated_at timestamp
    role_id int [ref: > roles.role_id] // Foreign Key
}

Table products {
    product_id int [pk, increment] // Primary Key
    ean varchar
    name varchar
    brand varchar
    description text
    picture varchar
    nutritional_information text
    price numeric
    stock_warehouse int
    stock_shelf_bottom int
    minimum_stock int
    minimum_shelf_stock int
    category_id int [ref: > categories.category_id] // Foreign Key
}

Table addresses {
    address_id int [pk, increment] // Primary Key
    user_id int [ref: > users.user_id] // Foreign Key
    address_line1 varchar
    address_line2 varchar
    city varchar
    zip_code varchar
    country varchar
}

Table invoices {
    invoice_id int [pk, increment] // Primary Key
    user_id int [ref: > users.user_id] // Foreign Key
    address_id int [ref: > addresses.address_id] // Foreign Key
    cart_id int [ref: > carts.cart_id] // Foreign Key
    created_at timestamp
}

Table invoice_lines {
    invoice_line_id int [pk, increment] // Primary Key
    invoice_id int [ref: > invoices.invoice_id] // Foreign Key
    product_id int [ref: > products.product_id] // Foreign Key
    quantity int
    price numeric
    created_at timestamp
}

Table carts {
    cart_id int [pk, increment] // Primary Key
    user_id int [ref: > users.user_id] // Foreign Key
    payed boolean
    created_at timestamp
    payed_at timestamp
}

Table cart_lines {
    cart_line_id int [pk, increment] // Primary Key
    cart_id int [ref: > carts.cart_id] // Foreign Key
    product_id int [ref: > products.product_id] // Foreign Key
    quantity int
    created_at timestamp
}

Table logs {
    log_id int [pk, increment] // Primary Key
    date timestamp
    user_id int [ref: > users.user_id] // Foreign Key
    product_id int [ref: > products.product_id] // Foreign Key
    quantity int
    reason varchar
    action varchar
    stock_warehouse_after int
    stock_shelf_bottom_after int
}

Table promotions {
    promotion_id int [pk, increment] // Primary Key
    product_id int [ref: > products.product_id] // Foreign Key
    pourcentage int
    beging_date date
    end_date date
    active boolean
}
