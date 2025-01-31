import requests
import sqlite3
import json

def get_test_by_id_from_file(test_id, filename="tests/test_suits/api_test_suits.json"):
    with open(filename, "r") as file:
        test_cases = json.load(file)["API_tests"]
    return next((test for test in test_cases if test["id"] == test_id), None)

def log_test_result(test_case_id, status, error_message=None):
    conn = sqlite3.connect('./sqlite_db/test_tracking.db')
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO test_runs_API (test_case_id, status, error_message)
    VALUES (?, ?, ?)
    """, (test_case_id, status, error_message))
    conn.commit()
    conn.close()

def test_create_new_transaction():
    test_case = get_test_by_id_from_file(1)
    try:
        url = "http://localhost:3000/api/payment"
        post_request = {
            "amount": 1000000, #amount to determine test API transaction
            "method": "credit_card",
            "userId": "test_user"
        }
        response = requests.post(url, json=post_request)
        
        # Checking status
        assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

        # Transform into JSON
        response_data = response.json()

        # Checking if payment is in database
        number_transaction = response_data["paymentId"]
        url_of_transaction_in_db = f"http://localhost:3000/transactions/{number_transaction}"
        assert number_transaction == requests.get(url_of_transaction_in_db).json()['transaction_id'], f"There are no transactions with this number"
        print(f"{test_case['expected_result']} {number_transaction}")
        log_test_result(test_case['id'], "Passed")
    except Exception as e:
        log_test_result(test_case['id'], "Failed", str(e))


def test_change_existed_transaction():
    test_case = get_test_by_id_from_file(2)
    try:
        conn = sqlite3.connect('./sqlite_db/my_database.db')
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(transaction_id) FROM transactions WHERE amount = 1000000") # Getting last testing transaction
        transaction_id = cursor.fetchall()[0][0]

        url = "http://localhost:3000/api/payment"
        post_request = {
            "transaction_id": transaction_id,
            "status": "Updated status",
            "message": "Updated message"
        }
        response = requests.put(url, json=post_request)

        # Checking status
        assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

        # Transform into JSON
        response_data = response.json()

        # Checking if payment is updated
        assert response_data["status"] == "Updated status"
        assert response_data["message"] == "Updated message"
        assert response_data["paymentId"] == transaction_id
        print(f"{test_case['expected_result']} {transaction_id}")
        log_test_result(test_case['id'], "Passed")
    except Exception as e:
        log_test_result(test_case['id'], "Failed", str(e))

def test_delete_existed_transaction():
    test_case = get_test_by_id_from_file(3)
    try:
        conn = sqlite3.connect('./sqlite_db/my_database.db')
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(transaction_id) FROM transactions WHERE amount = 1000000") # Getting last testing transaction
        transaction_id = cursor.fetchall()[0][0]

        url = "http://localhost:3000/api/payment"
        post_request = {
            "transaction_id": transaction_id
        }
        response = requests.delete(url, json=post_request)

        # Checking status
        assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

        # Transform into JSON
        response_data = response.json()

        # Checking if payment is updated
        assert response_data["paymentId"] == transaction_id
        print(f"{test_case['expected_result']} {transaction_id}")
        log_test_result(test_case['id'], "Passed")
    except Exception as e:
        log_test_result(test_case['id'], "Failed", str(e))


if __name__ == "__main__":
    test_create_new_transaction()
    test_change_existed_transaction()
    test_delete_existed_transaction()