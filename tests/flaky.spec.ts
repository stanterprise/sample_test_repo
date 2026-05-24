import { test, expect } from "@playwright/test";

let flakyAttempt = 0;

test.describe("Flaky Tests Suite", { tag: "@flaky" }, () => {
  test(
    "flaky test - passes on retry",
    { tag: ["@flaky", "@retry", "@unstable"] },
    async () => {
      test.info().annotations.push({ type: "tag", description: "flaky" });

      flakyAttempt++;
      // Fails first time, passes on retry
      expect(flakyAttempt).toBeGreaterThan(1);
    },
  );

  test(
    "random failure simulation",
    { tag: ["@flaky", "@random", "@unstable"] },
    async () => {
      const shouldPass = Math.random() > 0.3; // 70% chance to pass
      expect(shouldPass, "Random failure").toBe(true);
    },
  );

  test(
    "time-based flaky test",
    { tag: ["@flaky", "@timing", "@nondeterministic"] },
    async () => {
      const timestamp = Date.now();
      // Passes only if timestamp is even
      expect(timestamp % 2).toBe(0);
    },
  );

  test("flaky with steps", async () => {
    await test.step("Step 1: Always passes", async () => {
      expect(1).toBe(1);
    });

    await test.step("Step 2: May fail", async () => {
      const random = Math.random();
      expect(random).toBeGreaterThan(0.2);
    });

    await test.step("Step 3: Sometimes reached", async () => {
      expect(true).toBe(true);
    });
  });
});

test.describe("Retry Behavior Tests", { tag: "@flaky" }, () => {
  let retryCounter = 0;

  test.beforeEach(() => {
    retryCounter++;
  });

  test("test retry counter", async () => {
    test.info().annotations.push({
      type: "retryCount",
      description: retryCounter.toString(),
    });

    // Fail first 2 attempts, pass on 3rd
    expect(retryCounter).toBeGreaterThanOrEqual(2);
  });

  test("flaky page interaction", async ({ page }) => {
    await page.goto("https://example.com");

    // Simulate flaky element detection
    const shouldFind = Math.random() > 0.3;
    if (!shouldFind) {
      await page.waitForSelector("#non-existent", { timeout: 1000 });
    }

    await expect(page).toHaveTitle(/Example Domain/);
  });
});

test.describe("Intermittent Failures", { tag: "@flaky" }, () => {
  test("network-like flaky behavior", async ({ page }) => {
    test.slow(); // Mark as slow test

    await page.goto("https://example.com");

    // Simulate intermittent network issue
    const networkStable = Math.random() > 0.4;
    if (!networkStable) {
      throw new Error("Simulated network timeout");
    }

    await expect(page.locator("h1")).toBeVisible();
  });

  test("race condition simulation", async () => {
    const delay = Math.floor(Math.random() * 100);

    await test.step("Wait for random duration", async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
    });

    await test.step("Check timing", async () => {
      // Fails if delay is too short
      expect(delay).toBeGreaterThan(30);
    });
  });
});
