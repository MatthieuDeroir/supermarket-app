Table Addresses {
addressId        int        [pk, increment]
userId           int        [ref: > Users.userId]
addressLine1     varchar
addressLine2     varchar
addressComplement varchar
zipCode          varchar
city             varchar
country          varchar
}

Table Users {
userId        int       [pk, increment]
email         varchar
password      varchar
firstName     varchar
lastName      varchar
phoneNumber   varchar
createdAt     timestamp
updatedAt     timestamp
deletedAt     timestamp
roleId        int       [ref: > Roles.roleId]
}

Table Roles {
roleId        int       [pk, increment]
name          varchar
}

Table Invoices {
invoiceId     int       [pk, increment]
userId        int       [ref: > Users.userId]
addressId     int       [ref: > Addresses.addressId]
createdAt     timestamp
}

Table InvoiceLines {
invoiceLineId int       [pk, increment]
productId     varchar   [ref: > Products.productId]
quantity      int
price         decimal
invoiceId     int       [ref: > Invoices.invoiceId]
createdAt     timestamp
}

Table Carts {
cartId     int       [pk, increment]
userId        int       [ref: > Users.userId]
createdAt     timestamp
}

Table CartLines {
carteLineId int       [pk, increment]
productId     varchar   [ref: > Products.productId]
quantity      int
cartId     int       [ref: > Carts.cartId]
createdAt     timestamp
}

Table Products {
productId        varchar   [pk]
ean              varchar
name             varchar
brand            varchar
description      varchar
picture          varchar
nutritional_info varchar
price            decimal
stockWarehouse   int
stockShelfBottom int
minimumStock     int
minimumShelfStock int
categoryId    int       [ref: > Category.categoryId]
}

Table Promotions {
promotionId int [pk, increment]
productId varchar [ref: > Products.productId]
pourcentage int
begingDate date
endDate date
active boolean
}

Table Category {
categoryId  int       [pk, increment]
taxValue          decimal
description    varchar
}

Table Logs {
LogId   int       [pk, increment]
"date"       timestamp
userId       int       [ref: > Users.userId]
productId    varchar   [ref: > Products.productId]
quantity     int
reason       varchar
}
 