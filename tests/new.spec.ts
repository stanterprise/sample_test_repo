import test from "@playwright/test";

// Helper to generate deterministic test data
function generateTestData(seed: number, count: number = 3) {
  const baseData = [
    { tag: "smoke", steps: ["open homepage", "check title", "logout"] },
    {
      tag: "regression",
      steps: ["login", "navigate dashboard", "verify widgets"],
    },
    {
      tag: "api",
      steps: ["send request", "validate response", "check error handling"],
    },
  ];

  // Repeat baseData to reach the desired count
  const testData = [];
  for (let i = 0; i < count; i++) {
    const data = baseData[i % baseData.length];
    testData.push({
      ...data,
      name: `Test ${seed}-${i + 1} [${data.tag}]`,
    });
  }
  return testData;
}

const testData = generateTestData(42, 15);
test.describe.parallel("Sample Test Suite", { tag: "@sample" }, () => {
  for (const { name, tag, steps } of testData) {
    test(`${name}`, async ({ page }) => {
      test.info().annotations.push({ type: "tag", description: tag });
      for (const step of steps) {
        await test.step(step, async () => {
          // Simulate step logic
          await page.waitForTimeout(5000); // deterministic, fast
        });
      }
    });
  }
});
