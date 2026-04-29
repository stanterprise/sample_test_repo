import { test as base, expect } from "@playwright/test";

import { ObserverDemoPage } from "./page-objects/observer-demo.page";

type ObserverFixtures = {
  observerPage: ObserverDemoPage;
};

export const test = base.extend<ObserverFixtures>({
  observerPage: async ({ page }, use) => {
    await use(new ObserverDemoPage(page));
  },
});

export { expect };
