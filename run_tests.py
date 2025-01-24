import subprocess

# Running the server in the background
server_process = subprocess.Popen(['node', 'local_server.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

try:
    # Running Playwright tests
    subprocess.run(['npx', 'playwright', 'test'], check=True)
    # Run API tests
    subprocess.run('pytest')
finally:
    # Stopping the server after running tests
    server_process.terminate()  # Terminating the server process
    server_process.wait()       # Waiting for process to complete
