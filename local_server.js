import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

async function processPayment(amount, status, message) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./sqlite_db/my_database.db");

    db.get(
      "SELECT seq FROM sqlite_sequence WHERE name = 'transactions'",
      (err, row) => {
        if (err) {
          console.error("Error getting seq from sqlite_sequence:", err.message);
          db.close();
          return reject(err);
        }

        const paymentId = row ? Number(row.seq) + 1 : 1;

        const sql =
          "INSERT INTO transactions (amount, status, message) VALUES (?, ?, ?)";
        db.run(sql, [amount, status, message], function (err) {
          if (err) {
            console.error("Error writing to database:", err.message);
            db.close();
            return reject(err);
          }
          db.close();
          resolve(paymentId); // Return the ID of the created transaction
        });
      }
    );
  });
}

async function updatePayment(transaction_id, status, message) {
  const db = new sqlite3.Database("./sqlite_db/my_database.db");

  const sql =
    "UPDATE transactions SET amount = 1000000, status = ?, message = ? WHERE transaction_id = ?";
  db.run(sql, [status, message, transaction_id], (err) => {
    if (err) {
      console.error("Error writing to database:", err.message);
    } else {
      console.log("Transaction", transaction_id, "was updated");
    }
  });
}

async function deletePayment(transaction_id) {
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

    db.close();
  });
}

// Create express server
const app = express();

app.use(cors());

// Using morgan to log all requests to the console
app.use(morgan("dev")); // The "dev" format produces short and useful logs.

// Connecting to SQLite database
const db_main = new sqlite3.Database("./sqlite_db/my_database.db");
const db_test_tracking = new sqlite3.Database("./sqlite_db/test_tracking.db");

// Setting up middlewares
app.use(bodyParser.json());

// Example of processing GET requests via SQLite
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
  const { id } = req.params; // Get the id parameter from the URL
  db_main.get(
    "SELECT * FROM customers WHERE customer_id = ?",
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(row); // Returning the found user
      }
    }
  );
});

app.get("/transactions/:id", (req, res) => {
  const { id } = req.params; // Get the id parameter from the URL
  db_main.get(
    "SELECT * FROM transactions WHERE transaction_id = ?",
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(row); // Returning the found user
      }
    }
  );
});

app.delete("/customers", (req, res) => {
  const { customer_id } = req.body;
  const sql = "DELETE FROM customers WHERE customer_id = ?";

  db_main.run(sql, [customer_id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({
        customer_id: customer_id,
        message: `User with id ${customer_id} deleted successfully`,
      });
    }
  });
});
// PUT customers

app.put("/customers", async (req, res) => {
  const { customer_id, name, email } = req.body;
  const sql = "UPDATE customers SET name = ?, email = ? WHERE customer_id = ?";
  db_main.run(sql, [name, email, customer_id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        customer_id: customer_id,
        name,
        email,
      });
    }
  });
});

// POST customers
app.post("/customers", (req, res) => {
  const {
    name,
    email,
    phone,
    city,
    street,
    home_number,
    description,
    personal_id,
  } = req.body;
  const sql =
    "INSERT INTO customers (name, email, phone, city, street, home_number, description, personal_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db_main.run(
    sql,
    [name, email, phone, city, street, home_number, description, personal_id],
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
          personal_id,
        });
      }
    }
  );
});

// Payment processing

app.post("/api/payment", async (req, res) => {
  // Add async before the function
  console.log("Received payment request:", req.body);
  const { amount, method, userId } = req.body;

  // For the test, we simulate a successful response.
  if (amount && method && userId) {
    try {
      const paymentId = await new Promise((resolve, reject) => {
        db_main.get(
          "SELECT seq FROM sqlite_sequence WHERE name = 'transactions'",
          (err, row) => {
            if (err) {
              reject("Error getting seq from sqlite_sequence");
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
  // Add async before the function
  console.log("Received payment update request:", req.body);
  const { transaction_id, status, message } = req.body;

  // For the test, we simulate a successful response.
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

app.delete("/api/payment", async (req, res) => {
  console.log("Received payment update request:", req.body);
  const { transaction_id } = req.body;

  if (!transaction_id) {
    console.log("Can't delete this transaction");
    return res.status(400).json({
      error: "Can't delete this transaction",
    });
  }

  try {
    // Wait for the deletion to complete before sending a response
    await deletePayment(transaction_id);

    return res.status(200).json({
      paymentId: transaction_id,
    });
  } catch (err) {
    console.error("Error deleting payment:", err.message);
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
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

// Launching the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// If port in use already:
// lsof -i tcp:3000
// kill -9 PID
