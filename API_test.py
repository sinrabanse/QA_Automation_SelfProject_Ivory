import requests
import pytest

# Тест для GET запроса
def test_get_user():
    url = "http://localhost:3000/customers/10001"  # Примерный URL API
    response = requests.get(url)
    
    # Проверка статус-кода
    assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
    
    # Преобразуем ответ в JSON
    response_data = response.json()
    
    # Проверяем, что в ответе есть ожидаемые данные
    assert response_data['customer_id'] == 10001, f"Expected user ID 10001, but got {response_data['customer_id']}"
    assert 'name' in response_data, "User name not found in response"
    assert 'email' in response_data, "User email not found in response"
    
    print("GET request passed successfully")

# Тест для POST запроса
@pytest.mark.skip(reason="Temporarily skipping this test")
def test_create_user():
    url = "http://localhost:3000/customers/"
    new_user = {
        "name": "נוא לווי",
        "email": "testing234test@gmail.com",
        "phone": 548778899,
        "city": "חיפה",
        "street": "הצלפים",
        "home_number": 16,
        "description": "error_user"
    }
    
    response = requests.post(url, json=new_user)
    
    # Проверка статус-кода
    assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
    
    # Преобразуем ответ в JSON
    response_data = response.json()
    
    # Проверяем, что данные пользователя созданы корректно
    assert 'id' in response_data, "ID not found in response"
    assert response_data['name'] == new_user['name'], f"Expected name {new_user['name']}, but got {response_data['name']}"
    
    print("POST request passed successfully")

if __name__ == "__main__":
    test_get_user()
    # test_create_user()
