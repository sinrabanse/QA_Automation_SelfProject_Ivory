import subprocess
import time
import webbrowser

# Running the server in the background
server_process = subprocess.Popen(['node', 'local_server.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

try:
    # Running Playwright tests
    try:
        print("Running Playwright tests...")
        subprocess.run(['npx', 'playwright', 'test'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Playwright tests failed with error: {e}")
    
    # Run API tests
    try:
        print("Running API tests...")
        subprocess.run(['pytest'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"API tests failed with error: {e}")
finally:
    # Stopping the server after running tests
    print("Stopping the server...")
    server_process.terminate()  # Terminating the server process
    server_process.wait()       # Waiting for process to complete

    # Start the Flask server after tests
    print("Starting Flask server for bug tracking visualization...")
    flask_process = subprocess.Popen(['python', 'flask_server.py'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Wait a bit to ensure the Flask server has time to start
    time.sleep(5)

    # Open the default web browser to the Flask server's URL
    webbrowser.open("http://127.0.0.1:5000/")
