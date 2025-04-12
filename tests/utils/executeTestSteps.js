import { testReporting } from "../utils/testReporting.js";

export async function executeTestSteps(tc, page, stepActions) {
  console.log(`Executing test: ${tc.title}`);
  let currentStep = null;
  try {
    for (const step of tc.steps) {
      currentStep = step;
      console.log(`Executing step: ${step}`);
      if (stepActions[step]) {
        await stepActions[step](page);
      } else {
        const errorMessage = `No implementation found for step: ${step}`;
        console.error(errorMessage);
        await testReporting(tc.id, "Failed", step, errorMessage);
        throw new Error(errorMessage); // Throw an exception if the step is not implemented
      }
    }
    await testReporting(tc.id, "Passed");
    console.log("Test passed successfully.");
  } catch (error) {
    console.error(`Test failed at step "${currentStep}": ${error.message}`);
    await testReporting(tc.id, "Failed", currentStep, error.message);
    throw error;
  }
}
