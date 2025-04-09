
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
--     card_id INTEGER PRIMARY KEY AUTOINCREMENT, 
--     customer_id INTEGER NOT NULL,             
--     card_number TEXT NOT NULL,               
--     card_type TEXT NOT NULL,             
--     exp_year TEXT NOT NULL,
--     exp_month TEXT NOT NULL,
--     cvv TEXT NOT NULL, 
--     FOREIGN KEY (customer_id) REFERENCES customers(customer_id) 
--       ON DELETE CASCADE 
--       ON UPDATE CASCADE 
-- );


-- INSERT INTO payment_cards (customer_id, card_number, card_type, exp_year, exp_month, cvv)
-- VALUES (10002, '5555555555554444', 'Mastercard', '30', '11', '123');

-- CREATE TABLE transactions (
--     transaction_id INTEGER PRIMARY KEY AUTOINCREMENT, 
--     amount TEXT NOT NULL,
--     status TEXT NOT NULL, 
--     message TEXT NOT NULL,   
--     paymentId TEXT NOT NULL 
-- );

-- UPDATE sqlite_sequence
-- SET seq = "100001"
-- WHERE name == "transactions"

-- To create TRIGGER:

-- CREATE TRIGGER update_last_run
-- AFTER INSERT ON test_runs
-- BEGIN
--     UPDATE test_cases
--     SET last_run = NEW.run_time
--     WHERE id = NEW.test_case_id;
-- END;

--------implementing on MAC (command+option+Q)----------

-- CREATE TRIGGER update_last_error_message_API
-- AFTER INSERT ON test_runs_API
-- BEGIN
--     UPDATE test_cases_API
--     SET error_message = NEW.error_message
--     WHERE id = NEW.test_case_id;
-- END;