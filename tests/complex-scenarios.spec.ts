import { test, expect } from "@playwright/test";

test.describe("Complex Multi-Step Scenarios", { tag: "@complex" }, () => {
  test(
    "complex user journey",
    { tag: ["@e2e", "@critical", "@smoke"] },
    async ({ page }) => {
      test
        .info()
        .annotations.push(
          { type: "tag", description: "e2e" },
          { type: "scenario", description: "user-journey" },
          { type: "priority", description: "P1" }
        );

      await test.step("Navigate to homepage", async () => {
        await page.goto("https://example.com");
        await expect(page).toHaveTitle(/Example Domain/);
      });

      await test.step("Verify page structure", async () => {
        await test.step("Check heading", async () => {
          const heading = page.locator("h1");
          await expect(heading).toBeVisible();
          await expect(heading).toContainText("Example Domain");
        });

        await test.step("Check paragraph", async () => {
          const paragraph = page.locator("p").first();
          await expect(paragraph).toBeVisible();
        });
      });

      await test.step("Verify links", async () => {
        const link = page.locator("a").first();
        await expect(link).toBeVisible();
      });

      await test.step("Complete journey", async () => {
        expect(true).toBe(true);
      });
    }
  );

  test(
    "deeply nested steps scenario",
    { tag: ["@complex", "@nested"] },
    async ({ page }) => {
      test.info().annotations.push({ type: "tag", description: "complex" });

      await test.step("Level 1: Initialize", async () => {
        await test.step("Level 2: Setup page", async () => {
          await test.step("Level 3: Navigate", async () => {
            await page.goto("https://example.com");

            await test.step("Level 4: Wait for load", async () => {
              await page.waitForLoadState("domcontentloaded");

              await test.step("Level 5: Final verification", async () => {
                await expect(page).toHaveTitle(/Example Domain/);
              });
            });
          });
        });
      });
    }
  );

  test(
    "multiple assertion groups",
    { tag: ["@assertions", "@validation"] },
    async ({ page }) => {
      await page.goto("https://example.com");

      await test.step("Page title assertions", async () => {
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title).toContain("Example");
        expect(title.length).toBeGreaterThan(0);
      });

      await test.step("Page content assertions", async () => {
        const heading = page.locator("h1");
        await expect(heading).toBeVisible();
        await expect(heading).toHaveText(/Example/);
        await expect(heading).toHaveCount(1);
      });

      await test.step("Page structure assertions", async () => {
        const body = page.locator("body");
        await expect(body).toBeVisible();

        const divs = page.locator("div");
        const count = await divs.count();
        expect(count).toBeGreaterThanOrEqual(0);
      });
    }
  );

  test(
    "error recovery scenario",
    { tag: ["@resilience", "@error-handling", "@regression"] },
    async ({ page }) => {
      test
        .info()
        .annotations.push(
          { type: "tag", description: "resilience" },
          { type: "pattern", description: "error-recovery" }
        );

      await test.step("Initial attempt", async () => {
        try {
          await page.goto("https://example.com");
          await expect(page).toHaveTitle(/Example Domain/);
        } catch (error) {
          test.info().annotations.push({
            type: "recovery",
            description: "initial-failed",
          });
        }
      });

      await test.step("Verification after recovery", async () => {
        await expect(page.locator("h1")).toBeVisible();
      });
    }
  );

  test(
    "data-driven test scenario",
    { tag: ["@data-driven", "@parameterized"] },
    async () => {
      test.info().annotations.push({ type: "tag", description: "data-driven" });

      const testData = [
        { input: "hello", expected: "HELLO" },
        { input: "world", expected: "WORLD" },
        { input: "test", expected: "TEST" },
      ];

      for (const { input, expected } of testData) {
        await test.step(`Process: ${input}`, async () => {
          const result = input.toUpperCase();
          expect(result).toBe(expected);
        });
      }
    }
  );
});

test.describe("Parallel Execution Scenarios", { tag: "@parallel" }, () => {
  test("parallel test 1", async ({ page }) => {
    test
      .info()
      .annotations.push({ type: "execution", description: "parallel" });

    await page.goto("https://example.com");
    await page.waitForTimeout(500);
    await expect(page).toHaveTitle(/Example Domain/);
  });

  test("parallel test 2", async ({ page }) => {
    test
      .info()
      .annotations.push({ type: "execution", description: "parallel" });

    await page.goto("https://example.com");
    await page.waitForTimeout(300);
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("parallel test 3", async ({ page }) => {
    test
      .info()
      .annotations.push({ type: "execution", description: "parallel" });

    await page.goto("https://example.com");
    await page.waitForTimeout(400);
    const links = page.locator("a");
    expect(await links.count()).toBeGreaterThanOrEqual(0);
  });

  test("parallel test 4", async () => {
    test
      .info()
      .annotations.push({ type: "execution", description: "parallel" });

    const data = [1, 2, 3, 4, 5];
    const sum = data.reduce((a, b) => a + b, 0);
    expect(sum).toBe(15);
  });

  test("parallel test 5", async () => {
    test
      .info()
      .annotations.push({ type: "execution", description: "parallel" });

    const text = "parallel execution test";
    expect(text.split(" ")).toHaveLength(3);
  });
});

test.describe("Mixed Results Scenario", { tag: "@mixed" }, () => {
  test("passing test in mixed suite", async () => {
    test.info().annotations.push({ type: "expected", description: "pass" });
    expect(2 + 2).toBe(4);
  });

  test("failing test in mixed suite", async () => {
    test.info().annotations.push({ type: "expected", description: "fail" });
    expect(1).toBe(2); // Will fail
  });

  test("another passing test", async ({ page }) => {
    test.info().annotations.push({ type: "expected", description: "pass" });
    await page.goto("https://example.com");
    await expect(page).toHaveTitle(/Example Domain/);
  });

  test.skip("skipped test in mixed suite", async () => {
    test.info().annotations.push({ type: "expected", description: "skip" });
    expect(true).toBe(true);
  });

  test("passing with multiple steps", async () => {
    test.info().annotations.push({ type: "expected", description: "pass" });

    await test.step("Step 1", async () => {
      expect(1).toBe(1);
    });

    await test.step("Step 2", async () => {
      expect(2).toBe(2);
    });
  });
});

test.describe(
  "Comprehensive Coverage Scenario",
  { tag: "@comprehensive" },
  () => {
    test.beforeAll(async () => {
      console.log("Suite setup started");
    });

    test.afterAll(async () => {
      console.log("Suite cleanup completed");
    });

    test.beforeEach(async () => {
      console.log("Test setup");
    });

    test.afterEach(async () => {
      console.log("Test cleanup");
    });

    test("test with all hooks", async ({ page }) => {
      test
        .info()
        .annotations.push(
          { type: "tag", description: "comprehensive" },
          { type: "hooks", description: "all" }
        );

      await page.goto("https://example.com");
      await expect(page).toHaveTitle(/Example Domain/);
    });

    test("test with metadata and steps", async ({ page }) => {
      test
        .info()
        .annotations.push(
          { type: "tag", description: "metadata" },
          { type: "category", description: "integration" },
          { type: "owner", description: "qa-team" }
        );

      await test.step("Setup", async () => {
        await page.goto("https://example.com");
      });

      await test.step("Execute", async () => {
        const heading = page.locator("h1");
        await expect(heading).toBeVisible();
      });

      await test.step("Verify", async () => {
        await expect(page).toHaveTitle(/Example Domain/);
      });
    });
  }
);
