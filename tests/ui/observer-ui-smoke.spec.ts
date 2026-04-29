import { createObserverScenario } from "../support/observer-demo-data";
import { test } from "../support/fixtures";

test.describe(
  "Observer UI Page Object Smoke",
  { tag: ["@observer", "@ui", "@observer-ui"] },
  () => {
    test(
      "drives a nested analyst workflow through the page object",
      { tag: ["@smoke", "@nested", "@page-object"] },
      async ({ observerPage }) => {
        const scenario = createObserverScenario(7);
        const filteredRecords = scenario.records.filter(
          (record) =>
            record.name
              .toLowerCase()
              .includes(scenario.searchTerm.toLowerCase()) &&
            record.status === scenario.filterStatus,
        );
        const selectedRecord = filteredRecords[0] ?? scenario.records[0];

        await test.step("Load observer workspace", async () => {
          await test.step("Bootstrap the synthetic demo shell", async () => {
            await observerPage.open(scenario);
          });

          await test.step("Confirm workspace metadata", async () => {
            await observerPage.expectReady(scenario);
          });
        });

        await test.step("Triage filtered records", async () => {
          await test.step("Apply deterministic queue filters", async () => {
            await observerPage.applyFilters(
              scenario.searchTerm,
              scenario.filterStatus,
            );
            await observerPage.expectVisibleRecordCount(filteredRecords.length);
          });

          await test.step("Inspect the leading filtered record", async () => {
            await observerPage.openRecordByName(selectedRecord.name);
            await observerPage.expectRecordDetails(selectedRecord);
          });
        });

        await test.step("Persist analyst preferences", async () => {
          await test.step("Enable critical highlighting", async () => {
            await observerPage.toggleCriticalHighlighting();
            await observerPage.expectCriticalHighlighting(true);
          });

          await test.step("Review and save preferences", async () => {
            await observerPage.openSettings();
            await observerPage.savePreferences({
              theme: scenario.preferredTheme,
              notificationsEnabled: !scenario.notificationsEnabled,
            });
            await observerPage.expectToast(
              `Preferences saved for ${scenario.persona}.`,
            );
            await observerPage.expectLatestActivityContains("Saved");
          });
        });
      },
    );
  },
);
