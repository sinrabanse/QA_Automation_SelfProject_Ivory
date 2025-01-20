import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { processPayment } from "./paymentService.js";

// Создаём сервер express
const app = express();

app.use(cors());

// Используем morgan для логирования всех запросов в консоль
app.use(morgan("dev")); // Формат "dev" выводит короткие и полезные логи

// Подключение к базе SQLite
const db = new sqlite3.Database("./my_database.db");

// Настраиваем middlewares
app.use(bodyParser.json());

// Пример обработки GET-запросов через SQLite
app.get("/customers", (req, res) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get("/customers/:id", (req, res) => {
  const { id } = req.params; // Получаем параметр id из URL
  db.get("SELECT * FROM customers WHERE customer_id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(row); // Возвращаем найденного пользователя
    }
  });
});

app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM customers WHERE customer_id = ?";

  db.run(sql, [id], function (err) {
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
  db.run(
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
        db.get(
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

// Запускаем сервер
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
