
-- Creating table customers:

-- CREATE TABLE customers (
--     customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT,
--     email TEXT,
--     phone INTEGER,
--     city TEXT,
--     street TEXT,
--     home_number INTEGER
-- );
-- INSERT INTO sqlite_sequence (name, seq)
-- VALUES ('customers', 10000);

-- Adding standard customer

-- INSERT INTO customers
-- VALUES (NULL,
--         'אלכס כהן',
--         'testingtest@gmail.com',
--         0548998877,
--         'חולון',
--         'בן יהודה',
--         123)

UPDATE sqlite_sequence
SET seq == 10002
