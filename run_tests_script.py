import subprocess

# Running the server in the background
server_process = subprocess.Popen(['node', 'local_server.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

try:
    # Running Playwright tests
    try:
        subprocess.run(['npx', 'playwright', 'test'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Playwright tests failed with error: {e}")
    
    # Run API tests
    try:
        subprocess.run(['pytest'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"API tests failed with error: {e}")
finally:
    # Stopping the server after running tests
    server_process.terminate()  # Terminating the server process
    server_process.wait()       # Waiting for process to complete
