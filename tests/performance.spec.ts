import { test, expect } from "@playwright/test";

test.describe("Performance Tests", { tag: "@performance" }, () => {
  test(
    "measure page load time",
    { tag: ["@performance", "@metrics", "@timing"] },
    async ({ page }) => {
      test
        .info()
        .annotations.push(
          { type: "tag", description: "performance" },
          { type: "metric", description: "load-time" },
        );

      const startTime = Date.now();
      await page.goto("https://example.com");
      const loadTime = Date.now() - startTime;

      test.info().annotations.push({
        type: "load-time-ms",
        description: loadTime.toString(),
      });

      expect(loadTime).toBeLessThan(5000);
    },
  );

  test("measure multiple navigation performance", async ({ page }) => {
    test.info().annotations.push({ type: "tag", description: "performance" });

    const timings: number[] = [];

    for (let i = 0; i < 3; i++) {
      await test.step(`Navigation ${i + 1}`, async () => {
        const start = Date.now();
        await page.goto("https://example.com");
        const duration = Date.now() - start;
        timings.push(duration);
      });
    }

    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    test.info().annotations.push({
      type: "avg-load-time",
      description: `${avgTime.toFixed(2)}ms`,
    });

    expect(avgTime).toBeLessThan(3000);
  });

  test(
    "slow test with extended timeout",
    { tag: ["@performance", "@slow", "@timeout"] },
    async ({ page }) => {
      test.slow();
      test
        .info()
        .annotations.push(
          { type: "tag", description: "slow" },
          { type: "expected-duration", description: "long" },
        );

      await page.goto("https://example.com");
      await page.waitForTimeout(2000);
      await expect(page).toHaveTitle(/Example Domain/);
    },
  );

  test("parallel operations performance", async ({ page }) => {
    test.info().annotations.push({ type: "tag", description: "performance" });

    await page.goto("https://example.com");

    const startTime = Date.now();
    await Promise.all([
      page.locator("h1").textContent(),
      page.locator("p").first().textContent(),
      page.title(),
    ]);
    const parallelTime = Date.now() - startTime;

    test.info().annotations.push({
      type: "parallel-ops-time",
      description: `${parallelTime}ms`,
    });

    expect(parallelTime).toBeLessThan(2000);
  });

  test("resource loading performance", async ({ page }) => {
    test
      .info()
      .annotations.push(
        { type: "tag", description: "performance" },
        { type: "metric", description: "resource-load" },
      );

    const metrics: any[] = [];

    page.on("response", (response) => {
      metrics.push({
        url: response.url(),
        status: response.status(),
      });
    });

    await page.goto("https://example.com");
    await page.waitForLoadState("networkidle");

    test.info().annotations.push({
      type: "resources-loaded",
      description: metrics.length.toString(),
    });

    expect(metrics.length).toBeGreaterThan(0);
  });
});

test.describe("Stress Tests", { tag: ["@performance", "@stress"] }, () => {
  test("repeated action stress test", async ({ page }) => {
    test
      .info()
      .annotations.push(
        { type: "tag", description: "stress" },
        { type: "iterations", description: "50" },
      );

    await page.goto("https://example.com");

    for (let i = 0; i < 50; i++) {
      await test.step(`Iteration ${i + 1}`, async () => {
        const heading = page.locator("h1");
        await expect(heading).toBeVisible();
      });
    }
  });

  test("memory stress simulation", async () => {
    test
      .info()
      .annotations.push(
        { type: "tag", description: "stress" },
        { type: "type", description: "memory" },
      );

    const largeArray: number[] = [];
    for (let i = 0; i < 10000; i++) {
      largeArray.push(i);
    }

    expect(largeArray.length).toBe(10000);
    expect(largeArray[9999]).toBe(9999);
  });

  test("computational stress test", async () => {
    test
      .info()
      .annotations.push(
        { type: "tag", description: "stress" },
        { type: "type", description: "cpu" },
      );

    await test.step("Heavy computation", async () => {
      let result = 0;
      for (let i = 0; i < 100000; i++) {
        result += Math.sqrt(i);
      }
      expect(result).toBeGreaterThan(0);
    });
  });
});

test.describe("Timeout Tests", { tag: "@performance" }, () => {
  test("test with custom timeout", async ({ page }) => {
    test.setTimeout(15000);
    test.info().annotations.push({ type: "timeout", description: "15000ms" });

    await page.goto("https://example.com");
    await page.waitForTimeout(1000);
    await expect(page).toHaveTitle(/Example Domain/);
  });

  test("quick timeout test", async () => {
    test.setTimeout(2000);
    test.info().annotations.push({ type: "timeout", description: "2000ms" });
    expect(1 + 1).toBe(2);
  });

  test("step-level timing", async ({ page }) => {
    await test.step("Fast step", async () => {
      expect(1).toBe(1);
    });

    await test.step("Medium step", async () => {
      await page.goto("https://example.com");
    });

    await test.step("Slow step", async () => {
      await page.waitForTimeout(500);
      await expect(page).toHaveTitle(/Example Domain/);
    });
  });
});
