import {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";

export default class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
    console.log("metadata", config.metadata);
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    console.log(`Starting step: ${step.title}`);
    // console.log(step);
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    console.log(
      `Finished step: ${step.title} - ${step.error ? "FAILED" : "PASSED"}`
    );
    if (step.error) {
      console.log(`Error: ${step.error.message}`);
    }
  }
  // onTestBegin(test: TestCase, result: TestResult): void {
  //   console.log(`Starting test: ${test.title}`);
  //   console.log("result retry data", result.retry);
  //   console.log("test retries data", test.retries);
  // }
  // onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
  //   console.log(`Starting step: ${step.title}`);
  //   console.log(step);
  // }

  onEnd(result: FullResult) {
    console.log("result", result);
  }
}
