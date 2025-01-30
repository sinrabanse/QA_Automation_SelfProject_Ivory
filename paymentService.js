import sqlite3 from "sqlite3";

export async function processPayment(amount, status, message) {
  const db = new sqlite3.Database("./sqlite_db/my_database.db");

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

export async function updatePayment(transaction_id, status, message) {
  const db = new sqlite3.Database("./sqlite_db/my_database.db");

  const sql =
    "UPDATE transactions SET amount = 1000000, status = ?, message = ? WHERE transaction_id = ?";
  db.run(sql, [status, message, transaction_id], (err) => {
    if (err) {
      console.error("Ошибка записи в базу данных:", err.message);
    } else {
      console.log("Transaction", transaction_id, "was updated");
    }
  });
}
