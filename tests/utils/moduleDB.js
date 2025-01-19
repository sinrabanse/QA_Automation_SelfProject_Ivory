import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function getCustomerFieldByDescription(customer_type, fields) {
  // Открываем базу данных
  const db = await open({
    filename: "./my_database.db", // Путь к файлу базы данных
    driver: sqlite3.Database,
  });

  try {
    // Формируем SQL-запрос с нужными полями
    const query = `SELECT ${fields.join(
      ", "
    )} FROM customers INNER JOIN payment_cards ON customers.customer_id = payment_cards.customer_id WHERE description = ?`;

    // Выполняем запрос
    const row = await db.get(query, customer_type);

    // Проверяем, найден ли клиент
    if (row) {
      return row; // Возвращаем объект с запрошенными полями
    } else {
      return `Клиент с description ${customer_type} не найден.`;
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error.message);
  } finally {
    // Закрываем базу данных
    await db.close();
  }
}
