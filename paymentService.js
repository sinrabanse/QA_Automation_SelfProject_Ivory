import sqlite3 from "sqlite3";

// const db = new sqlite3.Database("./my_database.db");

// export async function processPayment(amount, status, message, paymentId) {
//   const sql =
//     "INSERT INTO transactions (amount, status, message, paymentId) VALUES (?, ?, ?, ?)";
//   db.run(sql, [amount, status, message, paymentId]);
// }

export async function processPayment(amount, status, message) {
  const db = new sqlite3.Database("./my_database.db");

  db.get(
    "SELECT seq FROM sqlite_sequence WHERE name = 'transactions'",
    (err, row) => {
      if (err) {
        console.error("Ошибка получения seq из sqlite_sequence:", err.message);
        return;
      }

      const paymentId = row ? Number(row.seq) + 1 : 1; // Если таблица еще пуста, используем 1.

      const sql =
        "INSERT INTO transactions (amount, status, message) VALUES (?, ?, ?)";
      db.run(sql, [amount, status, message], (err) => {
        if (err) {
          console.error("Ошибка записи в базу данных:", err.message);
        } else {
          console.log("Транзакция успешно сохранена с paymentId:", paymentId);
        }
      });
    }
  );
}
