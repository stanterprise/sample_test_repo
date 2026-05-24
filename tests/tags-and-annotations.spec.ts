import { test, expect } from "@playwright/test";

test.describe(
  "Tests with Various Tags and Annotations",
  { tag: "@annotations" },
  () => {
    test("smoke test with tag", async () => {
      test.info().annotations.push({ type: "tag", description: "smoke" });
      expect(true).toBe(true);
    });

    test("regression test with tag", { tag: "@regression" }, async () => {
      test.info().annotations.push({ type: "tag", description: "regression" });
      expect(1 + 1).toBe(2);
    });

    test("critical test with priority", { tag: "@critical" }, async () => {
      test
        .info()
        .annotations.push(
          { type: "tag", description: "critical" },
          { type: "priority", description: "P0" },
        );
      expect("critical").toBeTruthy();
    });

    test("test with issue tracking", { tag: "@issue-tracking" }, async () => {
      test
        .info()
        .annotations.push(
          { type: "issue", description: "JIRA-456" },
          { type: "issue", description: "GITHUB-789" },
        );
      expect(2 + 2).toBe(4);
    });

    test("test with owner information", { tag: "@ownership" }, async () => {
      test
        .info()
        .annotations.push(
          { type: "owner", description: "john.doe@example.com" },
          { type: "team", description: "Platform Team" },
        );
      expect(true).toBe(true);
    });

    test(
      "test with multiple metadata",
      { tag: ["@api", "@integration"] },
      async () => {
        test
          .info()
          .annotations.push(
            { type: "tag", description: "api" },
            { type: "tag", description: "integration" },
            { type: "severity", description: "high" },
            { type: "component", description: "auth-service" },
            { type: "duration", description: "slow" },
          );

        await test.step("API call simulation", async () => {
          expect(1).toBe(1);
        });
      },
    );

    test("test with custom annotations", { tag: "@custom" }, async () => {
      test
        .info()
        .annotations.push(
          { type: "environment", description: "staging" },
          { type: "browser", description: "chromium" },
          { type: "viewport", description: "desktop" },
          { type: "locale", description: "en-US" },
        );
      expect("custom").toBeTruthy();
    });

    test(
      "performance test annotation",
      { tag: "@performance" },
      async ({ page }) => {
        test
          .info()
          .annotations.push(
            { type: "tag", description: "performance" },
            { type: "metric", description: "page-load-time" },
          );

        await page.goto("https://example.com");
        await expect(page).toHaveTitle(/Example Domain/);
      },
    );

    test("security test annotation", { tag: "@security" }, async () => {
      test
        .info()
        .annotations.push(
          { type: "tag", description: "security" },
          { type: "vulnerability", description: "XSS" },
          { type: "severity", description: "critical" },
        );
      expect(true).toBe(true);
    });

    test(
      "accessibility test annotation",
      { tag: "@a11y" },
      async ({ page }) => {
        test
          .info()
          .annotations.push(
            { type: "tag", description: "a11y" },
            { type: "wcag", description: "2.1-AA" },
          );

        await page.goto("https://example.com");
        const heading = page.locator("h1");
        await expect(heading).toBeVisible();
      },
    );
  },
);

test.describe("Tagged Test Groups", { tag: "@tagged-groups" }, () => {
  test.describe("Smoke Tests", () => {
    test.beforeEach(async () => {
      test.info().annotations.push({ type: "tag", description: "smoke" });
    });

    test("smoke test 1", { tag: "@smoke" }, async () => {
      expect(1).toBe(1);
    });

    test("smoke test 2", { tag: "@smoke" }, async () => {
      expect(2).toBe(2);
    });
  });

  test.describe("E2E Tests", { tag: "@e2e" }, () => {
    test.beforeEach(async () => {
      test
        .info()
        .annotations.push(
          { type: "tag", description: "e2e" },
          { type: "duration", description: "long" },
        );
    });

    test("e2e test 1", { tag: "@e2e" }, async ({ page }) => {
      await page.goto("https://example.com");
      await expect(page).toHaveTitle(/Example Domain/);
    });

    test("e2e test 2", { tag: "@e2e" }, async ({ page }) => {
      await page.goto("https://example.com");
      const content = page.locator("p");
      await expect(content.first()).toBeVisible();
    });
  });
});

test.describe("Business Critical Tests", { tag: "@business-critical" }, () => {
  test("checkout flow", { tag: "@checkout" }, async () => {
    test
      .info()
      .annotations.push(
        { type: "tag", description: "business-critical" },
        { type: "priority", description: "P0" },
        { type: "feature", description: "checkout" },
      );
    expect(true).toBe(true);
  });

  test("payment processing", { tag: "@payment" }, async () => {
    test
      .info()
      .annotations.push(
        { type: "tag", description: "business-critical" },
        { type: "priority", description: "P0" },
        { type: "feature", description: "payment" },
        { type: "compliance", description: "PCI-DSS" },
      );
    expect(true).toBe(true);
  });

  test("user authentication", { tag: "@auth" }, async () => {
    test
      .info()
      .annotations.push(
        { type: "tag", description: "business-critical" },
        { type: "priority", description: "P0" },
        { type: "feature", description: "auth" },
        { type: "security", description: "high" },
      );
    expect(true).toBe(true);
  });
});
