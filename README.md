# QA Automation Project with Playwright

This repository contains automated tests for an e-commerce website offering electronics (/ivory.co.il/). The project showcases end-to-end testing capabilities using JavaScript with Playwright for UI testing, Python for API testing, along with integration of test case tracking via SQLite.

---

## **Project Structure**

### **Folder Structure**

```
.
├── sqlite_db
│   ├── my_database.db
│   └── test_tracking.db
├── tests
│   ├── API_tests
│   │   ├── test_API_BD.py
│   │   ├── test_API_server.py
│   │   └── ...
│   ├── functionality_tests
│   │   ├── sanity.spec.js
│   │   ├── filtering.spec.js
│   │   └── ...
│   ├── test_suits
│   │   ├── functionality_suits.json
│   │   └── ...
│   └── utils
│       ├── testCustomers.js
│       ├── testLocators.js
│       └── ...
├── local_server.js
├── run_tests_script.py
├── requirements.txt
├── STD.txt
├── STP.txt
└── README.md
```

- **`sqlite_db/`**: SQLite databases.
- **`tests/`**: Contains all test files categorized into functional areas.
- **`test_suits/`**: JSON files defining test cases and suites.
- **`utils/`**: Utility scripts and data for tests.
- **`local_server.js`**: Local server on port 3000 for mocking API testing (using JavaScript Express).
- **`run_tests_script.py`**: Python script for running all tests.
- **`STD.txt`**: Software Testing Description file.
- **`STP.txt`**: Software Testing Plan file.

---

## **Features**

### **1. UI Testing**

- **Tool**: Playwright (JavaScript).
- **Purpose**: Automates UI flows like product search, filtering, adding/removing products to/from the cart, and order placement.
- **Key Files**: Located in `tests/functionality_tests/`.

### **2. API Testing**

- **Tool**: Python with Pytest.
- **Purpose**: Verifies backend endpoints, including CRUD operations for customers, orders, and transactions.
- **Key Files**: Located in `tests/API_tests/`.

### **3. Test Case Tracking**

- **Tool**: SQLite.
- **Purpose**: Tracks test cases and execution status.
- **Database Files**: Located in `sqlite_db/`.

---

## **Setup**

### **Prerequisites**

- Node.js (v23.2.0 or later).
- Python 3.9 or later.
- SQLite.

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/QA_Automation_Project.git
   cd QA_Automation_Project
   ```
2. Install dependencies:
   - **JavaScript**:
     ```bash
     npm install
     ```
   - **Python**:
     ```bash
     pip install -r requirements.txt
     ```

---

## **Usage**

### **1. Run Local Server**

Start the mock server for API testing:

```bash
node local_server.js
```

### **2. Execute Tests**

- **Playwright Tests**:
  ```bash
  npx playwright test
  ```
- **Python API Tests**:
  ```bash
  pytest tests/API_tests/
  ```

### **3. Track Test Results**

Results are automatically logged into the SQLite database. Use `run_tests_script.py` for combined test execution and result storage:

```bash
python run_tests_script.py
```

---

## **Contributing**

Contributions are welcome! Feel free to open issues or submit pull requests for improvements and new features.

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
