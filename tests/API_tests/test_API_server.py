import requests

def test_get_list_of_customers():
    url = "http://localhost:3000/customers"
    response = requests.get(url)

    # Checking status
    assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

    # Transform into JSON
    response_data = response.json()

    # Checking data
    assert isinstance(response_data, list) == True, "Not a list"
    assert 'name' in response_data[0], "User name not found in response"
    assert 'email' in response_data[0], "User email not found in response"
    assert 'phone' in response_data[0], "User phone not found in response"

    print(f'Count of customers: {len(response_data)}')
    print("GET request for list of customers passed successfully")

def test_get_info_about_customer():
    url = "http://localhost:3000/customers/10001"
    response = requests.get(url)

    # Checking status
    assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"

    # Transform into JSON
    response_data = response.json()

    # Checking data
    assert isinstance(response_data, dict) == True, "Not a dict"
    assert 'name' in response_data, "User name not found in response"
    assert 'email' in response_data, "User email not found in response"
    assert 'phone' in response_data, "User phone not found in response"
    assert 'city' in response_data, "User city not found in response"
    assert 'street' in response_data, "User street not found in response"
    assert 'home_number' in response_data, "User hone_number not found in response"

    print(f'Customer checked: {response_data["customer_id"]}')
    print("GET request for specific customer passed successfully")

# POST new customer
# DELETE customer by id (sequence don't forget)

if __name__ == "__main__":
    test_get_list_of_customers()
    test_get_info_about_customer()