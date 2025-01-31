import sqlite3 from "sqlite3";

export async function processPayment(amount, status, message) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./sqlite_db/my_database.db");

    db.get(
      "SELECT seq FROM sqlite_sequence WHERE name = 'transactions'",
      (err, row) => {
        if (err) {
          console.error(
            "Ошибка получения seq из sqlite_sequence:",
            err.message
          );
          db.close();
          return reject(err);
        }

        const paymentId = row ? Number(row.seq) + 1 : 1;

        const sql =
          "INSERT INTO transactions (amount, status, message) VALUES (?, ?, ?)";
        db.run(sql, [amount, status, message], function (err) {
          if (err) {
            console.error("Ошибка записи в базу данных:", err.message);
            db.close();
            return reject(err);
          }
          db.close();
          resolve(paymentId); // Возвращаем ID созданной транзакции
        });
      }
    );
  });
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

export async function deletePayment(transaction_id) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./sqlite_db/my_database.db");

    const sql =
      "DELETE FROM transactions WHERE transaction_id = ? AND amount = 1000000";

    db.run(sql, [transaction_id], function (err) {
      if (err) {
        console.error("Error deleting transaction:", err.message);
        reject(err);
      } else {
        console.log("Transaction", transaction_id, "was deleted");
        resolve({ deleted: this.changes > 0 });
      }
    });

    db.close(); // Закрываем соединение
  });
}
