# QA Automation Project with Javascript+Playwright and Python+Pytest

This repository contains automated tests for an e-commerce website offering electronics (/ivory.co.il/). The project demonstrates end-to-end testing capabilities using JavaScript with Playwright for UI testing, Python with Pytest for API testing, and includes test case tracking via SQLite. Additionally, a simple bug tracking system is implemented using Flask, which retrieves data from the SQLite database and generates HTML with graphs for visualization.

---

## **Project Structure**

### **Folder Structure**

```
.
├── sqlite_db
│   ├── my_database.db
│   └── test_tracking.db
├── templates
│   ├── index.html
│   └── test_cases.html
│   └── ...
├── tests
│   ├── API_tests
│   │   ├── test_API_customers.py
│   │   └── test_API_transactions.py
│   ├── functionality_tests
│   │   ├── tc1_sanity_test.spec.js
│   │   ├── tc2_filtering_test.spec.js
│   │   └── ...
│   ├── test_suits
│   │   ├── api_test_suits.json
│   │   └── functionality_suits.json
│   └── utils
│       ├── executeTestSteps.js
│       ├── mockPaymentHandler.js
│       └── ...
├── local_server.js
├── flask_server.py
├── run_tests_script.py
├── requirements.txt
├── STD.txt
├── STP.txt
└── README.md
```

- **`sqlite_db/`**: SQLite databases.
- **`tests/`**: Contains all test files.
- **`test_suits/`**: JSON files defining test cases and suites.
- **`utils/`**: Utility scripts and data for tests.
- **`local_server.js`**: Local server on port 3000 for mocking API testing (using JavaScript Express).
- **`flask_server.py`**: Local server on port 5000 for simple bug tracking system (generates HTML with graphs for visualization).
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
- **Purpose**: Verifies backend endpoints, including CRUD operations for customers and transactions.
- **Key Files**: Located in `tests/API_tests/`.

### **3. Test Case Tracking**

- **Tool**: SQLite.
- **Purpose**: Tracks test cases and execution status.
- **Database Files**: Located in `sqlite_db/`.

### **4. Bug Tracking**

- **Tool**: Flask.
- **Purpose**: Allowing to view test case results, track bugs, and visualize data.
- **Database Files**: Located in `flask_server.py` and `templates/`.

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
  pytest
  ```

### **3. Start Flask Server for Bug Tracking Visualization**

After running the tests, you can start the Flask server to visualize test results and track bugs. By default, it runs on port 5000. You can open this in your browser to see the reports and tracking dashboard.

- **Start Flask Server**:
  ```bash
  python flask_server.py
  ```

Once the Flask server is running, open the following URL in your browser to see the bug tracking dashboard:
http://localhost:5000

### **4. With one step**

Use `run_tests_script.py` for combined test execution and result storage. In the end it opens browser with flask server on port 5000:

```bash
python run_tests_script.py
```

---

## **Contributing**

Contributions are welcome! Feel free to open issues or submit pull requests for improvements and new features.

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
