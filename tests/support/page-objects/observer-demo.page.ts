import { expect, type Page } from "@playwright/test";

import {
  buildObserverDemoHtml,
  type ObserverRecord,
  type ObserverScenario,
  type ObserverStatus,
} from "../observer-demo-data";

export class ObserverDemoPage {
  constructor(private readonly page: Page) {}

  private get shell() {
    return this.page.getByTestId("observer-shell");
  }

  private get visibleRecords() {
    return this.page.locator('[data-testid="record-row"]:not([hidden])');
  }

  async open(scenario: ObserverScenario): Promise<void> {
    await this.page.setContent(buildObserverDemoHtml(scenario), {
      waitUntil: "domcontentloaded",
    });
  }

  async expectReady(scenario: ObserverScenario): Promise<void> {
    await expect(this.shell).toBeVisible();
    await expect(this.page).toHaveTitle(
      new RegExp(`Observer Demo ${scenario.workspaceName}`),
    );
    await expect(
      this.page.getByRole("heading", { name: scenario.workspaceName }),
    ).toBeVisible();
    await expect(this.page.getByTestId("scenario-summary")).toContainText(
      scenario.persona,
    );
  }

  async applyFilters(
    searchTerm: string,
    status: ObserverStatus,
  ): Promise<void> {
    await this.page.getByTestId("search-input").fill(searchTerm);
    await this.page.getByTestId("status-filter").selectOption(status);
    await this.page.getByTestId("apply-filters").click();
  }

  async expectVisibleRecordCount(expectedCount: number): Promise<void> {
    await expect(this.visibleRecords).toHaveCount(expectedCount);
    await expect(this.page.getByTestId("filter-summary")).toContainText(
      `Showing ${expectedCount} records`,
    );
  }

  async openRecordByName(recordName: string): Promise<void> {
    await this.page
      .locator('[data-testid="record-row"]', { hasText: recordName })
      .first()
      .click();
  }

  async expectRecordDetails(record: ObserverRecord): Promise<void> {
    await expect(this.page.getByTestId("detail-name")).toHaveText(record.name);
    await expect(this.page.getByTestId("detail-owner")).toContainText(
      record.owner,
    );
    await expect(this.page.getByTestId("detail-status")).toContainText(
      record.status,
    );
    await expect(this.page.getByTestId("detail-notes")).toContainText(
      record.notes,
    );
  }

  async toggleCriticalHighlighting(): Promise<void> {
    await this.page.getByTestId("highlight-toggle").click();
  }

  async expectCriticalHighlighting(enabled: boolean): Promise<void> {
    await expect(this.page.locator("body")).toHaveAttribute(
      "data-highlight-critical",
      enabled ? "true" : "false",
    );
  }

  async openSettings(): Promise<void> {
    await this.page.getByTestId("open-settings").click();
    await expect(this.page.getByTestId("settings-panel")).toBeVisible();
  }

  async savePreferences(options: {
    theme: ObserverScenario["preferredTheme"];
    notificationsEnabled: boolean;
  }): Promise<void> {
    await this.page.getByTestId("theme-select").selectOption(options.theme);
    const notificationsToggle = this.page.getByTestId("notifications-toggle");

    if (
      (await notificationsToggle.isChecked()) !== options.notificationsEnabled
    ) {
      await notificationsToggle.click();
    }

    await this.page.getByTestId("save-settings").click();
  }

  async expectToast(message: string): Promise<void> {
    await expect(this.page.getByTestId("toast")).toBeVisible();
    await expect(this.page.getByTestId("toast")).toHaveText(message);
  }

  async expectLatestActivityContains(text: string): Promise<void> {
    await expect(
      this.page.getByTestId("activity-feed").locator("li").first(),
    ).toContainText(text);
  }

  async expectActivityCountAtLeast(minimumCount: number): Promise<void> {
    const activityCount = await this.page
      .getByTestId("activity-feed")
      .locator("li")
      .count();
    expect(activityCount).toBeGreaterThanOrEqual(minimumCount);
  }
}
