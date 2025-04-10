from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__, template_folder="templates")

# Route to display test results
@app.route('/')
def index():
    conn = sqlite3.connect('./sqlite_db/test_tracking.db')  # Подключение к SQLite базе данных
    cursor = conn.cursor()

    # Получение всех тестов для отображения в таблице
    cursor.execute("SELECT * FROM test_runs ORDER BY id DESC")
    results = cursor.fetchall()

    # Получение количества Passed и Failed для отображения общей статистики
    cursor.execute("SELECT status, COUNT(*) FROM test_runs GROUP BY status")
    status_counts = cursor.fetchall()
    test_counts = {"passed": 0, "failed": 0}
    for status, count in status_counts:
        if status == 'Passed':
            test_counts["passed"] = count
        elif status == 'Failed':
            test_counts["failed"] = count

    # Запрос данных для графика (по дням)
    cursor.execute("""
        WITH LastTestStatus AS (
            SELECT 
                test_case_id,
                status,
                DATE(run_time) AS test_date,
                ROW_NUMBER() OVER (PARTITION BY test_case_id, DATE(run_time) ORDER BY run_time DESC) AS rn
            FROM test_runs
        )
        SELECT 
            test_date,
            COUNT(DISTINCT CASE WHEN status = 'Passed' THEN test_case_id END) AS passed_count,
            COUNT(DISTINCT CASE WHEN status = 'Failed' THEN test_case_id END) AS failed_count
        FROM LastTestStatus
        WHERE rn = 1
        GROUP BY test_date
        ORDER BY test_date
    """)
    results_for_chart = cursor.fetchall()

    conn.close()

    # Подготовка данных для передачи в шаблон
    chart_data = {
        "labels": [row[0] for row in results_for_chart],  # Даты
        "passed": [row[1] for row in results_for_chart],  # Количество Passed
        "failed": [row[2] for row in results_for_chart],  # Количество Failed
    }

    return render_template(
        'index.html',
        results=results,
        test_counts=test_counts,
        chart_data=chart_data,
        current_path=request.path
    )

@app.route('/test_cases')
def test_cases():
    conn = sqlite3.connect('./sqlite_db/test_tracking.db')  # Подключение к базе данных
    cursor = conn.cursor()

    # Запрос всех тест-кейсов
    cursor.execute("SELECT * FROM test_cases")
    cases = cursor.fetchall()
    conn.close()

    return render_template('test_cases.html', cases=cases, current_path=request.path)

@app.route('/test_runs_api')
def api_test_runs():
    conn = sqlite3.connect('./sqlite_db/test_tracking.db')  # Подключение к SQLite базе данных
    cursor = conn.cursor()

    # Получение всех тестов для отображения в таблице
    cursor.execute("SELECT * FROM test_runs_API ORDER BY id DESC")
    results = cursor.fetchall()

    # Получение количества Passed и Failed для отображения общей статистики
    cursor.execute("SELECT status, COUNT(*) FROM test_runs_API GROUP BY status")
    status_counts = cursor.fetchall()
    test_counts = {"passed": 0, "failed": 0}
    for status, count in status_counts:
        if status == 'Passed':
            test_counts["passed"] = count
        elif status == 'Failed':
            test_counts["failed"] = count

    # Запрос данных для графика (по дням)
    cursor.execute("""
        WITH LastTestStatus AS (
            SELECT 
                test_case_id,
                status,
                DATE(run_time) AS test_date,
                ROW_NUMBER() OVER (PARTITION BY test_case_id, DATE(run_time) ORDER BY run_time DESC) AS rn
            FROM test_runs_API
        )
        SELECT 
            test_date,
            COUNT(DISTINCT CASE WHEN status = 'Passed' THEN test_case_id END) AS passed_count,
            COUNT(DISTINCT CASE WHEN status = 'Failed' THEN test_case_id END) AS failed_count
        FROM LastTestStatus
        WHERE rn = 1
        GROUP BY test_date
        ORDER BY test_date
    """)
    results_for_chart = cursor.fetchall()

    conn.close()

    # Подготовка данных для передачи в шаблон
    chart_data = {
        "labels": [row[0] for row in results_for_chart],  # Даты
        "passed": [row[1] for row in results_for_chart],  # Количество Passed
        "failed": [row[2] for row in results_for_chart],  # Количество Failed
    }

    return render_template(
        'test_runs_api.html',
        results=results,
        test_counts=test_counts,
        chart_data=chart_data,
        current_path=request.path
    )

@app.route('/test_cases_api')
def test_cases_api():
    conn = sqlite3.connect('./sqlite_db/test_tracking.db')  # Подключение к базе данных
    cursor = conn.cursor()

    # Запрос всех тест-кейсов
    cursor.execute("SELECT * FROM test_cases_API")
    cases = cursor.fetchall()
    conn.close()

    return render_template('test_cases_api.html', cases=cases, current_path=request.path)

if __name__ == "__main__":
    app.run(port=5003, debug=True)
