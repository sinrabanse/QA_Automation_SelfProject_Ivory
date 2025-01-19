
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

-- CREATE TABLE customers_new (
--     customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT,
--     email TEXT,
--     phone TEXT,
--     city TEXT,
--     street TEXT,
--     home_number TEXT
-- );

-- INSERT INTO customers_new (customer_id, name, email, phone, city, street, home_number)
-- SELECT customer_id, name, email, phone, city, street, home_number FROM customers;

-- CREATE TABLE payment_cards (
--     card_id INTEGER PRIMARY KEY AUTOINCREMENT, -- Уникальный идентификатор карты
--     customer_id INTEGER NOT NULL,             -- Внешний ключ, связанный с customers
--     card_number TEXT NOT NULL,                -- Номер карты
--     card_type TEXT NOT NULL,                  -- Тип карты (например, VISA, MasterCard)
--     exp_year TEXT NOT NULL,            -- Срок действия карты
--     exp_month TEXT NOT NULL,
--     cvv TEXT NOT NULL,                     -- Код CVV
--     FOREIGN KEY (customer_id) REFERENCES customers(customer_id) 
--       ON DELETE CASCADE                        -- Удалить карты, если клиент удалён
--       ON UPDATE CASCADE                        -- Обновить ключ, если customer_id изменится
-- );


-- INSERT INTO payment_cards (customer_id, card_number, card_type, exp_year, exp_month, cvv)
-- VALUES (10002, '5555555555554444', 'Mastercard', '30', '11', '123');