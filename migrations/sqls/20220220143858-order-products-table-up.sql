CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    order_id INTEGER REFERENCES orders(id),
    quantity INTEGER NOT NULL
);