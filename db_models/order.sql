CREATE TABLE orders(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    productId INT,
    buyerId INT,
    CONSTRAINT fk_product
        FOREIGN KEY(productId)
            REFERENCES products(id),
    CONSTRAINT fk_buyer
        FOREIGN KEY(buyerId)
            REFERENCES userinfo(id)
);

-- ALTER TABLE Order
-- ADD CONSTRAINT 