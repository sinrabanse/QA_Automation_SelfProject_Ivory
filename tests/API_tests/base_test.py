import pytest
import json
import sqlite3

@pytest.mark.usefixtures("testing_process")
class BaseTest:
    def get_test_by_id_from_file(self, test_id, filename="tests/test_suits/api_test_suits.json"):
        with open(filename, "r") as file:
            test_cases = json.load(file)["API_tests"]
        return next((test for test in test_cases if test["id"] == test_id), None)
    
    def log_test_result(self, test_case_id, status, error_message=None):
        conn = sqlite3.connect('./sqlite_db/test_tracking.db')
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO test_runs_API (test_case_id, status, error_message)
        VALUES (?, ?, ?)
        """, (test_case_id, status, error_message))
        conn.commit()
        conn.close()