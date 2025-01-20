import subprocess

# Запуск сервера в фоне
server_process = subprocess.Popen(['node', 'server.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

try:
    # Запуск тестов Playwright
    subprocess.run(['npx', 'playwright', 'test'], check=True)
    # Run API tests
    subprocess.run('pytest')
finally:
    # Остановка сервера после выполнения тестов
    server_process.terminate()  # Завершение процесса сервера
    server_process.wait()       # Ожидание завершения процесса
