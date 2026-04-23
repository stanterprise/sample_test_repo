import { test, expect } from "@playwright/test";

test.describe("Passing Tests Suite", { tag: "@passing" }, () => {
  test("simple passing test", { tag: ["@smoke", "@quick"] }, async () => {
    expect(1 + 1).toBe(2);
  });

  test(
    "test with multiple assertions",
    { tag: ["@assertions", "@validation", "@smoke"] },
    async () => {
      expect(true).toBeTruthy();
      expect(false).toBeFalsy();
      expect("hello").toContain("ell");
      expect([1, 2, 3]).toHaveLength(3);
    }
  );

  test(
    "test with steps",
    { tag: ["@steps", "@workflow"] },
    async ({ page }) => {
      await test.step("Step 1: Initialize", async () => {
        expect(1).toBe(1);
      });

      await test.step("Step 2: Process", async () => {
        await page.waitForTimeout(100);
        expect(2 + 2).toBe(4);
      });

      await test.step("Step 3: Finalize", async () => {
        expect(true).toBe(true);
      });
    }
  );

  test("test with nested steps", { tag: ["@nested", "@steps"] }, async () => {
    await test.step("Parent step", async () => {
      await test.step("Child step 1", async () => {
        expect(1).toBe(1);
      });

      await test.step("Child step 2", async () => {
        expect(2).toBe(2);
      });
    });
  });

  test(
    "test with annotations",
    { tag: ["@smoke", "@metadata", "@tracked"] },
    async () => {
      test
        .info()
        .annotations.push(
          { type: "issue", description: "JIRA-123" },
          { type: "tag", description: "smoke" },
          { type: "owner", description: "qa-team" }
        );

      expect("annotation test").toBeTruthy();
    }
  );

  test("quick test", async () => {
    expect(Math.max(1, 2, 3)).toBe(3);
  });

  test("test with timeout", async ({ page }) => {
    test.setTimeout(10000);
    await page.waitForTimeout(200);
    expect(true).toBe(true);
  });

  test("test with retry metadata", async () => {
    test.info().annotations.push({ type: "retries", description: "0" });
    expect("retry test").toBeTruthy();
  });

  test("array manipulation test", async () => {
    const arr = [1, 2, 3, 4, 5];
    const doubled = arr.map((x) => x * 2);
    expect(doubled).toEqual([2, 4, 6, 8, 10]);
  });

  test("string manipulation test", async () => {
    const text = "Hello, World!";
    expect(text.toLowerCase()).toBe("hello, world!");
    expect(text.split(", ")).toEqual(["Hello", "World!"]);
  });
});

test.describe(
  "Passing Tests with Page Interactions",
  { tag: "@passing" },
  () => {
    test("navigate to example.com", async ({ page }) => {
      await page.goto("https://example.com");
      await expect(page).toHaveTitle(/Example Domain/);
    });

    test("check page content", async ({ page }) => {
      await page.goto("https://example.com");
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
      await expect(heading).toContainText("Example Domain");
    });

    test("test with multiple page operations", async ({ page }) => {
      await test.step("Navigate", async () => {
        await page.goto("https://example.com");
      });

      await test.step("Verify title", async () => {
        await expect(page).toHaveTitle(/Example Domain/);
      });

      await test.step("Check paragraph", async () => {
        const para = page.locator("p").first();
        await expect(para).toBeVisible();
      });
    });
  }
);
