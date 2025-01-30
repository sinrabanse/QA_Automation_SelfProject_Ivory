import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { processPayment, updatePayment } from "./paymentService.js";

// Создаём сервер express
const app = express();

app.use(cors());

// Используем morgan для логирования всех запросов в консоль
app.use(morgan("dev")); // Формат "dev" выводит короткие и полезные логи

// Подключение к базе SQLite
const db_main = new sqlite3.Database("./sqlite_db/my_database.db");
const db_test_tracking = new sqlite3.Database("./sqlite_db/test_tracking.db");

// Настраиваем middlewares
app.use(bodyParser.json());

// Пример обработки GET-запросов через SQLite
app.get("/customers", (req, res) => {
  db_main.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get("/customers/:id", (req, res) => {
  const { id } = req.params; // Получаем параметр id из URL
  db_main.get(
    "SELECT * FROM customers WHERE customer_id = ?",
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(row); // Возвращаем найденного пользователя
      }
    }
  );
});

app.get("/transactions/:id", (req, res) => {
  const { id } = req.params; // Получаем параметр id из URL
  db_main.get(
    "SELECT * FROM transactions WHERE transaction_id = ?",
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(row); // Возвращаем найденного пользователя
      }
    }
  );
});

app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM customers WHERE customer_id = ?";

  db_main.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: `User with id ${id} deleted successfully` });
    }
  });
});

// Пример обработки POST-запросов через SQLite
app.post("/customers", (req, res) => {
  const { name, email, phone, city, street, home_number, description } =
    req.body;
  const sql =
    "INSERT INTO customers (name, email, phone, city, street, home_number, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db_main.run(
    sql,
    [name, email, phone, city, street, home_number, description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          id: this.lastID,
          name,
          email,
          phone,
          city,
          street,
          home_number,
          description,
        });
      }
    }
  );
});

// Обработка оплаты

app.post("/api/payment", async (req, res) => {
  // Добавляем async перед функцией
  console.log("Received payment request:", req.body);
  const { amount, method, userId } = req.body;

  // Сюда можно добавить логику обработки платежа

  // Для теста имитируем успешный ответ
  if (amount && method && userId) {
    try {
      const paymentId = await new Promise((resolve, reject) => {
        db_main.get(
          "SELECT seq FROM sqlite_sequence WHERE name = 'transactions'",
          (err, row) => {
            if (err) {
              reject("Ошибка при получении seq из sqlite_sequence");
            } else {
              resolve(row ? Number(row.seq) + 1 : 1);
            }
          }
        );
      });

      const status = "success";
      const message = "Payment processed successfully";
      res.status(200).json({
        status: status,
        message: message,
        paymentId: paymentId,
      });

      processPayment(amount, status, message, paymentId);
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err,
      });
    }
  } else {
    const status = "fail";
    const message = "Missing required parameters";
    res.status(400).json({
      status: status,
      message: message,
    });

    processPayment(amount, status, message);
  }
});

// Updating transaction

app.put("/api/payment", async (req, res) => {
  // Добавляем async перед функцией
  console.log("Received payment update request:", req.body);
  const { transaction_id, status, message } = req.body;

  // Для теста имитируем успешный ответ
  if (transaction_id && status && message) {
    try {
      const new_status = status;
      const new_message = message;
      res.status(200).json({
        status: new_status,
        message: new_message,
        paymentId: transaction_id,
      });

      updatePayment(transaction_id, new_status, new_message);
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err,
      });
    }
  } else if (transaction_id && status) {
    const new_message = "Updated without message";
    res.status(400).json({
      status: status,
      message: new_message,
    });

    updatePayment(transaction_id, status, new_message);
  } else if (transaction_id && message) {
    const new_status = "Updated without status";
    res.status(400).json({
      status: new_status,
      message: message,
    });

    updatePayment(transaction_id, new_status, message);
  } else {
    res.status(400).json({
      Error: "Can't update without transaction ID",
    });
    console.log("Can't update without transaction ID");
  }
});

// Getting tests

app.get("/test_cases", (req, res) => {
  db_test_tracking.all("SELECT * FROM test_cases", (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Post new test_case

app.post("/test_cases", (req, res) => {
  const { id, title, status } = req.body;
  db_test_tracking.run(
    "INSERT INTO test_cases (id, title, status, last_run) VALUES (?, ?, ?, datetime('now'))",
    [id, title, status || "In Progress"],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

//Post new test_run
app.post("/test_runs", (req, res) => {
  const { test_case_id, status, error_message } = req.body;
  db_test_tracking.run(
    "INSERT INTO test_runs (test_case_id, status, run_time, error_message) VALUES (?, ?, datetime('now'), ?)",
    [test_case_id, status, error_message || null],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ "ID of test run:": this.lastID });
    }
  );
});

// Запускаем сервер
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// If port in use already:
// lsof -i tcp:3000
// kill -9 PID
