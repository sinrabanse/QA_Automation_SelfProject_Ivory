import axios from "axios";

export async function testReporting(
  test_case_id,
  status,
  failedStep = null,
  errorMessage = null
) {
  try {
    // Trying to send request to server
    await axios.post("http://localhost:3000/test_runs", {
      test_case_id: test_case_id,
      status: status,
      error_message: failedStep
        ? `Step "${failedStep}" failed with error: ${errorMessage}`
        : null,
    });

    console.log("Recorded into testing report database");
  } catch (error) {
    // Error if server does not respond, record wasn't recorded in DB
    if (error.response) {
      console.error("Error reporting test result:", error.response.data);
    } else if (error.request) {
      console.error("No response from server. Could not record result.");
    } else {
      console.error("Error:", error.message);
    }

    console.log(
      `Test ${test_case_id} ${status}. But the result was not recorded in the database.`
    );
  }
}
