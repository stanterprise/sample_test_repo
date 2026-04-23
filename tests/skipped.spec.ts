import { test, expect } from "@playwright/test";

test.describe("Skipped Tests Suite", { tag: "@skipped" }, () => {
  test.skip("skipped test with skip()", async () => {
    // This test is skipped
    expect(1).toBe(1);
  });

  test("conditionally skipped test", async () => {
    test.skip(process.platform === "darwin", "Skipped on macOS");
    expect(1 + 1).toBe(2);
  });

  test("skipped in beforeEach", async () => {
    test.skip();
    expect(true).toBe(true);
  });

  test.fixme("fixme test - known issue", async () => {
    // This test is marked as fixme
    expect(1).toBe(2);
  });

  test("test with skip annotation", async () => {
    test.skip(true, "Feature not implemented yet");
    expect("skip").toBeTruthy();
  });
});

test.describe("Conditionally Skipped Suite", { tag: "@skipped" }, () => {
  test.skip(({ browserName }) => browserName === "firefox", "Firefox only");

  test("runs on chromium", async () => {
    expect(true).toBe(true);
  });

  test("also runs on chromium", async () => {
    expect(1 + 1).toBe(2);
  });
});

test.describe.skip("Entire suite skipped", { tag: "@skipped" }, () => {
  test("first skipped test", async () => {
    expect(1).toBe(1);
  });

  test("second skipped test", async () => {
    expect(2).toBe(2);
  });

  test("third skipped test", async () => {
    expect(3).toBe(3);
  });
});

test.describe("Mixed Skip Scenarios", { tag: "@skipped" }, () => {
  test("passing test", async () => {
    expect(true).toBe(true);
  });

  test.skip("skipped test in mixed suite", async () => {
    expect(1).toBe(1);
  });

  test("another passing test", async () => {
    expect(2 + 2).toBe(4);
  });

  test.fixme("fixme in mixed suite", async () => {
    expect("fixme").toBeTruthy();
  });
});
