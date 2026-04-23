import { test, expect } from "@playwright/test";

test.describe("Attachment Tests", { tag: "@attachments" }, () => {
  test("attach plain text and JSON", async () => {
    test.info().attachments.push({
      name: "readme",
      contentType: "text/plain",
      body: Buffer.from("Attachment text payload"),
    });

    const payload = { id: 1, status: "ok", items: ["a", "b", "c"] };
    test.info().attachments.push({
      name: "payload",
      contentType: "application/json",
      body: Buffer.from(JSON.stringify(payload, null, 2)),
    });

    expect(true).toBe(true);
  });

  test("attach from test.step", async () => {
    await test.step("generate and attach data", async () => {
      const csv = "id,value\n1,alpha\n2,beta\n3,gamma\n";
      test.info().attachments.push({
        name: "sample-data",
        contentType: "text/csv",
        body: Buffer.from(csv),
      });
    });

    expect(2 + 2).toBe(4);
  });

  test("attach page screenshot", async ({ page }) => {
    await page.goto("https://example.com");
    const screenshot = await page.screenshot({ fullPage: true });

    test.info().attachments.push({
      name: "example-homepage",
      contentType: "image/png",
      body: screenshot,
    });

    await expect(page).toHaveTitle(/Example Domain/);
  });
});
