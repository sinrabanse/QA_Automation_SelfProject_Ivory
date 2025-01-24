import requests

def test_create_new_transaction():
    url = "http://localhost:3000/api/payment"
    post_request = {
        "amount": 1000,
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


if __name__ == "__main__":
    test_create_new_transaction()