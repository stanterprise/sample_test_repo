import { test, expect } from "@playwright/test";

test.describe("Failing Tests Suite", { tag: "@failing" }, () => {
  test(
    "simple failing assertion",
    { tag: ["@failing", "@regression"] },
    async () => {
      expect(1 + 1).toBe(3); // This will fail
    }
  );

  test("failing with custom error message", async () => {
    expect(true, "Expected value to be false").toBe(false);
  });

  test("failing test with steps", async () => {
    await test.step("Step 1: Passes", async () => {
      expect(1).toBe(1);
    });

    await test.step("Step 2: Fails", async () => {
      expect(2 + 2).toBe(5); // This will fail
    });

    await test.step("Step 3: Never reached", async () => {
      expect(true).toBe(true);
    });
  });

  test("failing nested step", async () => {
    await test.step("Parent step", async () => {
      await test.step("Passing child step", async () => {
        expect(1).toBe(1);
      });

      await test.step("Failing child step", async () => {
        expect("actual").toBe("expected"); // This will fail
      });
    });
  });

  test("array comparison failure", async () => {
    const actual = [1, 2, 3];
    const expected = [1, 2, 4];
    expect(actual).toEqual(expected);
  });

  test("object comparison failure", async () => {
    const actual = { name: "John", age: 30 };
    const expected = { name: "Jane", age: 30 };
    expect(actual).toEqual(expected);
  });

  test(
    "page interaction failure",
    { tag: ["@failing", "@page", "@e2e"] },
    async ({ page }) => {
      await page.goto("https://example.com");
      await expect(page).toHaveTitle("This Title Does Not Exist");
    }
  );

  test(
    "timeout failure",
    { tag: ["@failing", "@timeout", "@slow"] },
    async ({ page }) => {
      test.setTimeout(2000);
      await page.goto("https://example.com");
      // This will timeout
      await page.waitForSelector("#non-existent-element", { timeout: 5000 });
    }
  );

  test("multiple failures", async () => {
    test.info().annotations.push({ type: "tag", description: "unstable" });

    await test.step("First failing step", async () => {
      expect(1).toBe(2);
    });
  });

  test("string match failure", async () => {
    const text = "Hello, World!";
    expect(text).toMatch(/goodbye/i);
  });
});

test.describe("Edge Case Failures", { tag: "@failing" }, () => {
  test("null vs undefined", async () => {
    const value = null;
    expect(value).toBe(undefined);
  });

  test("type mismatch", async () => {
    expect("123").toBe(123);
  });

  test("failing visibility check", async ({ page }) => {
    await page.goto("https://example.com");
    await expect(page.locator("#invisible-element")).toBeVisible();
  });

  test("incorrect text content", async ({ page }) => {
    await page.goto("https://example.com");
    await expect(page.locator("h1")).toContainText("Wrong Text");
  });
});
