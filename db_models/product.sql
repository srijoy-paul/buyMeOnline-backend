CREATE TABLE products(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(200),
    price FLOAT,
    content VARCHAR(300)
);