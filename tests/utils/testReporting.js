import axios from "axios";

export async function testReportingPassed(test_case_id) {
  await axios
    .post("http://localhost:3000/test_runs", {
      test_case_id: test_case_id,
      status: "Passed",
    })
    .then(() => {
      console.log("Recorded into testing report database");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function testReportingFailed(test_case_id) {
  await axios
    .post("http://localhost:3000/test_runs", {
      test_case_id: test_case_id,
      status: "Passed",
    })
    .then(() => {
      console.log("Recorded into testing report database");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function testReporting1(
  test_case_id,
  status,
  failedStep = null,
  errorMessage = null
) {
  await axios
    .post("http://localhost:3000/test_runs", {
      test_case_id: test_case_id,
      status: status,
      error_message: failedStep
        ? `Step "${failedStep}" failed with error: ${errorMessage}`
        : null,
    })
    .then(() => {
      console.log("Recorded into testing report database");
    })
    .catch((error) => {
      console.error("Error reporting test result:", error);
    });
}
