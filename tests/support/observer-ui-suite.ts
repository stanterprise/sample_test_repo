import {
  createObserverScenario,
  type ObserverRecord,
  type ObserverScenario,
  type ObserverStatus,
} from "./observer-demo-data";
import { test } from "./fixtures";

export type ObserverUiVariant =
  | "triage"
  | "detail-review"
  | "preferences"
  | "audit-trail";

export interface ObserverUiSpecDefinition {
  scenarioId: number;
  featureArea: string;
  persona: string;
  variant: ObserverUiVariant;
}

const statuses: ObserverStatus[] = ["healthy", "warning", "critical", "paused"];
const themes = ["light", "contrast", "ocean"] as const;

function sanitizeTagValue(value: string): string {
  return value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function buildScenario(definition: ObserverUiSpecDefinition): ObserverScenario {
  return createObserverScenario(definition.scenarioId, {
    featureArea: definition.featureArea,
    persona: definition.persona,
    searchTerm: definition.featureArea,
    filterStatus: statuses[(definition.scenarioId + 1) % statuses.length],
    preferredTheme: themes[definition.scenarioId % themes.length],
    notificationsEnabled: definition.scenarioId % 2 === 0,
  });
}

function getFilteredRecords(scenario: ObserverScenario): ObserverRecord[] {
  return scenario.records.filter(
    (record) =>
      record.name.toLowerCase().includes(scenario.searchTerm.toLowerCase()) &&
      record.status === scenario.filterStatus,
  );
}

function getSecondaryRecord(
  scenario: ObserverScenario,
  primaryRecord: ObserverRecord,
): ObserverRecord {
  return (
    scenario.records.find((record) => record.id !== primaryRecord.id) ??
    primaryRecord
  );
}

function getNextTheme(
  theme: ObserverScenario["preferredTheme"],
): ObserverScenario["preferredTheme"] {
  const currentThemeIndex = themes.indexOf(theme);
  return themes[(currentThemeIndex + 1) % themes.length];
}

export function registerObserverUiScenario(
  definition: ObserverUiSpecDefinition,
): void {
  const scenario = buildScenario(definition);
  const filteredRecords = getFilteredRecords(scenario);
  const primaryRecord = filteredRecords[0] ?? scenario.records[0];
  const secondaryRecord = getSecondaryRecord(scenario, primaryRecord);
  const tags = [
    "@observer-ui",
    "@generated-ui",
    `@feature-${sanitizeTagValue(definition.featureArea)}`,
    `@persona-${sanitizeTagValue(definition.persona)}`,
    `@variant-${sanitizeTagValue(definition.variant)}`,
  ];

  test.describe(
    `${definition.featureArea} generated observer flow`,
    { tag: tags },
    () => {
      test(`${definition.persona} ${definition.variant} scenario ${String(definition.scenarioId).padStart(4, "0")}`, async ({
        observerPage,
      }) => {
        test
          .info()
          .annotations.push(
            { type: "generator", description: "observer-ui-suite" },
            { type: "feature", description: definition.featureArea },
            { type: "persona", description: definition.persona },
            { type: "variant", description: definition.variant },
          );

        await test.step("Stage 1: bootstrap observer workspace", async () => {
          await test.step("Load the synthetic workspace shell", async () => {
            await observerPage.open(scenario);
          });

          await test.step("Confirm workspace metadata", async () => {
            await observerPage.expectReady(scenario);
          });
        });

        await test.step("Stage 2: focus the active queue", async () => {
          await test.step("Apply deterministic filters", async () => {
            await observerPage.applyFilters(
              scenario.searchTerm,
              scenario.filterStatus,
            );
            await observerPage.expectVisibleRecordCount(filteredRecords.length);
          });

          await test.step("Inspect the primary filtered record", async () => {
            await observerPage.openRecordByName(primaryRecord.name);
            await observerPage.expectRecordDetails(primaryRecord);
            await observerPage.expectLatestActivityContains("Inspected");
          });
        });

        await test.step("Stage 3: execute the variant workflow", async () => {
          if (definition.variant === "triage") {
            await test.step("Highlight critical signals", async () => {
              await observerPage.toggleCriticalHighlighting();
              await observerPage.expectCriticalHighlighting(true);
              await observerPage.expectLatestActivityContains(
                "Critical highlighting enabled",
              );
            });
          }

          if (definition.variant === "detail-review") {
            await test.step("Inspect a secondary record for comparison", async () => {
              await observerPage.openRecordByName(secondaryRecord.name);
              await observerPage.expectRecordDetails(secondaryRecord);
              await observerPage.expectLatestActivityContains(
                secondaryRecord.name,
              );
            });

            await test.step("Re-focus the primary record", async () => {
              await observerPage.openRecordByName(primaryRecord.name);
              await observerPage.expectRecordDetails(primaryRecord);
            });
          }

          if (definition.variant === "preferences") {
            await test.step("Review operator preferences", async () => {
              await observerPage.openSettings();
            });

            await test.step("Persist a theme adjustment", async () => {
              await observerPage.savePreferences({
                theme: getNextTheme(scenario.preferredTheme),
                notificationsEnabled: !scenario.notificationsEnabled,
              });
              await observerPage.expectToast(
                `Preferences saved for ${scenario.persona}.`,
              );
              await observerPage.expectLatestActivityContains("Saved");
            });
          }

          if (definition.variant === "audit-trail") {
            await test.step("Create a high-signal activity trail", async () => {
              await observerPage.toggleCriticalHighlighting();
              await observerPage.expectCriticalHighlighting(true);
              await observerPage.openSettings();
              await observerPage.savePreferences({
                theme: getNextTheme(scenario.preferredTheme),
                notificationsEnabled: !scenario.notificationsEnabled,
              });
              await observerPage.expectToast(
                `Preferences saved for ${scenario.persona}.`,
              );
            });

            await test.step("Inspect a second record after saving preferences", async () => {
              await observerPage.openRecordByName(secondaryRecord.name);
              await observerPage.expectRecordDetails(secondaryRecord);
              await observerPage.expectLatestActivityContains(
                secondaryRecord.name,
              );
            });
          }
        });

        await test.step("Stage 4: confirm observer-ready activity density", async () => {
          const expectedMinimumEntries =
            definition.variant === "audit-trail" ? 5 : 3;

          await test.step("Verify the activity feed stays populated", async () => {
            await observerPage.expectActivityCountAtLeast(
              expectedMinimumEntries,
            );
          });
        });
      });
    },
  );
}
