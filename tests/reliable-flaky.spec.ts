import { test, expect } from "@playwright/test";

test.describe("Reliable Flaky Tests Suite", { tag: "@flaky" }, () => {
  test(
    "fails once, passes on second attempt",
    { tag: ["@flaky", "@deterministic", "@retry"] },
    async () => {
      const retry = test.info().retry;
      test.info().annotations.push({
        type: "expectedPassAttempt",
        description: "2",
      });

      // retry=0 is the first execution, retry=1 is the second execution.
      expect(retry).toBeGreaterThanOrEqual(1);
    },
  );

  test(
    "fails twice, passes on third attempt",
    { tag: ["@flaky", "@deterministic", "@retry"] },
    async () => {
      const retry = test.info().retry;
      test.info().annotations.push({
        type: "expectedPassAttempt",
        description: "3",
      });

      // Requires two failed runs before passing on the third execution.
      expect(retry).toBeGreaterThanOrEqual(2);
    },
  );

  test(
    "flaky flow with steps, passes on second attempt",
    { tag: ["@flaky", "@steps", "@deterministic"] },
    async () => {
      const retry = test.info().retry;

      await test.step("Collect retry metadata", async () => {
        test.info().annotations.push({
          type: "retryCount",
          description: retry.toString(),
        });
        expect(retry).toBeGreaterThanOrEqual(0);
      });

      await test.step("Intentionally fail first execution only", async () => {
        expect(retry).toBeGreaterThanOrEqual(1);
      });

      await test.step("Final assertion after retry", async () => {
        expect(true).toBe(true);
      });
    },
  );
});
