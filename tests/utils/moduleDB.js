import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function getCustomerFieldByDescription(customer_type, fields) {
  // Open the database
  const db = await open({
    filename: "./sqlite_db/my_database.db", // Path to the database file
    driver: sqlite3.Database,
  });

  try {
    // Forming a SQL query with the required fields
    const query = `SELECT ${fields.join(
      ", "
    )} FROM customers INNER JOIN payment_cards ON customers.customer_id = payment_cards.customer_id WHERE description = ?`;

    // Executing the request
    const row = await db.get(query, customer_type);

    // Checking if the client is found
    if (row) {
      return row; // Return an object with the requested fields
    } else {
      return `Client with description ${customer_type} is not found.`;
    }
  } catch (error) {
    console.error("Error executing request:", error.message);
  } finally {
    // Closing the database
    await db.close();
  }
}
