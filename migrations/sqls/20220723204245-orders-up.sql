CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    status VARCHAR(25),
    user_id  INTEGER REFERENCES users(id) ON DELETE CASCADE
);