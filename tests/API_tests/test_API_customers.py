import requests
import sqlite3
from base_test import BaseTest

class TestApiCustomers(BaseTest):
    def test_create_new_customer(self):
        test_case = self.get_test_by_id_from_file(4)
        url = "http://localhost:3000/customers"
        post_request = {
                "name": "Added through API test",
                "email": "throughAPItest@gmail.com",
                "phone": "0548112233",
                "city": "Test Town",
                "street": "Test Street",
                "home_number": "13",
                "description": "API_testing_user",
                "personal_id": "123456789"
            }
        response = requests.post(url, json=post_request)
        try:
            # Checking status
            assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

            # Transform into JSON
            response_data = response.json()

            # Checking if customer is in database
            number_customer = response_data["id"]
            url_of_customer_in_db = f"{url}/{number_customer}"
            assert number_customer == requests.get(url_of_customer_in_db).json()['customer_id'], f"There are no customers with this number"
            print(f"{test_case['expected_result']} {number_customer}")
            self.log_test_result(test_case['id'], "Passed")
        except AssertionError as e:
            self.log_test_result(test_case['id'], "Failed", str(e))
            raise
        except Exception as e:
            self.log_test_result(test_case['id'], "Failed", str(e))
            raise

    def test_change_existed_customer(self):
        test_case = self.get_test_by_id_from_file(5)
        try:
            conn = sqlite3.connect('./sqlite_db/my_database.db')
            cursor = conn.cursor()
            cursor.execute("SELECT MAX(customer_id) FROM customers WHERE description = 'API_testing_user'") # Getting last testing customer
            customer_id = cursor.fetchall()[0][0]

            url = "http://localhost:3000/customers"
            post_request = {
                "customer_id": customer_id,
                "name": "Updated name",
                "email": "UpdatedthroughAPItest@gmail.com"
            }
            response = requests.put(url, json=post_request)

            # Checking status
            assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

            # Transform into JSON
            response_data = response.json()

            # Checking if customer is updated
            assert response_data["name"] == "Updated name"
            assert response_data["email"] == "UpdatedthroughAPItest@gmail.com"
            assert response_data["customer_id"] == customer_id
            print(f"{test_case['expected_result']} {customer_id}")
            self.log_test_result(test_case['id'], "Passed")
        except Exception as e:
            self.log_test_result(test_case['id'], "Failed", str(e))
            raise

    def test_delete_existed_customer(self):
        test_case = self.get_test_by_id_from_file(6)
        try:
            conn = sqlite3.connect('./sqlite_db/my_database.db')
            cursor = conn.cursor()
            cursor.execute("SELECT MAX(customer_id) FROM customers WHERE description = 'API_testing_user'") # Getting last testing customer
            customer_id = cursor.fetchall()[0][0]

            url = "http://localhost:3000/customers"
            post_request = {
                "customer_id": customer_id
            }
            response = requests.delete(url, json=post_request)

            # Checking status
            assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

            # Transform into JSON
            response_data = response.json()

            # Checking if payment is updated
            assert response_data["customer_id"] == customer_id
            print(f"{test_case['expected_result']} {customer_id}")
            self.log_test_result(test_case['id'], "Passed")
        except Exception as e:
            self.log_test_result(test_case['id'], "Failed", str(e))
            raise