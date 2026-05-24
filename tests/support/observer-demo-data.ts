export type ObserverStatus = "healthy" | "warning" | "critical" | "paused";

export interface ObserverRecord {
  id: string;
  name: string;
  owner: string;
  status: ObserverStatus;
  priority: "P1" | "P2" | "P3";
  signalCount: number;
  lastRun: string;
  notes: string;
}

export interface ObserverScenario {
  id: string;
  workspaceName: string;
  persona: string;
  featureArea: string;
  searchTerm: string;
  filterStatus: ObserverStatus;
  preferredTheme: "light" | "contrast" | "ocean";
  notificationsEnabled: boolean;
  records: ObserverRecord[];
}

const featureAreas = [
  "triage",
  "dashboards",
  "alerts",
  "pipelines",
  "attachments",
  "retries",
  "annotations",
  "shards",
];

const personas = ["analyst", "lead", "sre", "qa-manager"];
const owners = ["atlas", "blake", "casey", "devon", "ember", "finley"];
const statuses: ObserverStatus[] = ["healthy", "warning", "critical", "paused"];
const priorities = ["P1", "P2", "P3"] as const;
const themes = ["light", "contrast", "ocean"] as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildRecords(seed: number, workspaceName: string): ObserverRecord[] {
  return Array.from({ length: 8 }, (_, index) => {
    const owner = owners[(seed + index) % owners.length];
    const status = statuses[(seed + index) % statuses.length];
    const priority = priorities[(seed + index) % priorities.length];
    const signalCount = ((seed * 7 + index * 3) % 12) + 1;

    return {
      id: `${workspaceName}-${index + 1}`,
      name: `${workspaceName} monitor ${index + 1}`,
      owner,
      status,
      priority,
      signalCount,
      lastRun: `2026-04-${String(((seed + index) % 20) + 1).padStart(2, "0")} 0${index % 6}:15 UTC`,
      notes: `${owner} is tracking ${status} outcomes for ${workspaceName}.`,
    };
  });
}

export function createObserverScenario(
  seed: number,
  overrides: Partial<ObserverScenario> = {},
): ObserverScenario {
  const featureArea =
    overrides.featureArea ?? featureAreas[seed % featureAreas.length];
  const workspaceName =
    overrides.workspaceName ??
    `${featureArea}-${String(seed).padStart(4, "0")}`;
  const records = overrides.records ?? buildRecords(seed, workspaceName);

  return {
    id: `observer-ui-${String(seed).padStart(4, "0")}`,
    persona: personas[seed % personas.length],
    searchTerm: featureArea,
    filterStatus: statuses[(seed + 1) % statuses.length],
    preferredTheme: themes[seed % themes.length],
    notificationsEnabled: seed % 2 === 0,
    ...overrides,
    featureArea,
    workspaceName,
    records,
  };
}

function countByStatus(
  records: ObserverRecord[],
  status: ObserverStatus,
): number {
  return records.filter((record) => record.status === status).length;
}

function createRecordMarkup(record: ObserverRecord): string {
  return `
    <button
      type="button"
      class="record-row"
      data-testid="record-row"
      data-record-id="${escapeHtml(record.id)}"
      data-record-name="${escapeHtml(record.name)}"
      data-record-owner="${escapeHtml(record.owner)}"
      data-record-status="${escapeHtml(record.status)}"
      data-record-priority="${escapeHtml(record.priority)}"
      data-record-signals="${record.signalCount}"
      data-record-notes="${escapeHtml(record.notes)}"
      data-record-last-run="${escapeHtml(record.lastRun)}"
    >
      <span class="record-name">${escapeHtml(record.name)}</span>
      <span class="record-meta">${escapeHtml(record.owner)} · ${escapeHtml(record.priority)}</span>
      <span class="status-pill status-${escapeHtml(record.status)}">${escapeHtml(record.status)}</span>
    </button>
  `;
}

export function buildObserverDemoHtml(scenario: ObserverScenario): string {
  const records = JSON.stringify(scenario.records);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Observer Demo ${escapeHtml(scenario.workspaceName)}</title>
        <style>
          :root {
            color-scheme: light;
            --ink: #112433;
            --panel: #ffffff;
            --panel-soft: #eef4f7;
            --line: #c8d5dc;
            --accent: #14709b;
            --accent-soft: #d7ecf6;
            --healthy: #1d7f5f;
            --warning: #a76b00;
            --critical: #b1362c;
            --paused: #5d5e72;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: "Avenir Next", "Segoe UI", sans-serif;
            color: var(--ink);
            background:
              radial-gradient(circle at top left, rgba(20, 112, 155, 0.16), transparent 32%),
              linear-gradient(180deg, #f7fbfd 0%, #edf4f8 100%);
          }

          body[data-highlight-critical="true"] .status-critical {
            box-shadow: 0 0 0 3px rgba(177, 54, 44, 0.22);
          }

          main {
            max-width: 1240px;
            margin: 0 auto;
            padding: 32px;
          }

          .hero {
            display: grid;
            gap: 20px;
            grid-template-columns: 2fr 1fr;
            align-items: start;
          }

          .hero-card,
          .controls,
          .list-panel,
          .details-panel,
          .settings-panel,
          .activity-panel {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(200, 213, 220, 0.8);
            border-radius: 20px;
            backdrop-filter: blur(8px);
          }

          .hero-card,
          .controls,
          .list-panel,
          .details-panel,
          .settings-panel,
          .activity-panel {
            padding: 20px;
          }

          .hero-card h1 {
            margin: 0;
            font-size: 2.2rem;
          }

          .hero-card p,
          .metric-label,
          .muted,
          .record-meta,
          #filter-summary,
          .activity-item {
            color: #4d6878;
          }

          .metric-grid {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .metric-card {
            background: var(--panel-soft);
            border-radius: 16px;
            padding: 14px;
          }

          .metric-value {
            display: block;
            font-size: 1.7rem;
            font-weight: 700;
            margin-top: 6px;
          }

          .controls {
            display: grid;
            gap: 14px;
            margin-top: 20px;
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          label {
            display: grid;
            gap: 8px;
            font-size: 0.92rem;
          }

          input,
          select,
          button {
            font: inherit;
          }

          input,
          select {
            width: 100%;
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 10px 12px;
            background: #fff;
          }

          button {
            border: 0;
            border-radius: 14px;
            padding: 10px 14px;
            cursor: pointer;
          }

          .primary-button {
            background: var(--accent);
            color: #fff;
          }

          .secondary-button {
            background: #dce9ef;
            color: var(--ink);
          }

          .content-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: 1.4fr 1fr;
            margin-top: 20px;
          }

          .record-list {
            display: grid;
            gap: 10px;
            margin-top: 16px;
          }

          .record-row {
            display: grid;
            gap: 6px;
            justify-items: start;
            text-align: left;
            width: 100%;
            background: #fff;
            border: 1px solid #d7e1e7;
            padding: 14px;
          }

          .record-name {
            font-weight: 700;
          }

          .status-pill {
            text-transform: capitalize;
            border-radius: 999px;
            padding: 6px 10px;
            font-size: 0.82rem;
          }

          .status-healthy {
            background: rgba(29, 127, 95, 0.16);
            color: var(--healthy);
          }

          .status-warning {
            background: rgba(167, 107, 0, 0.16);
            color: var(--warning);
          }

          .status-critical {
            background: rgba(177, 54, 44, 0.16);
            color: var(--critical);
          }

          .status-paused {
            background: rgba(93, 94, 114, 0.16);
            color: var(--paused);
          }

          .detail-card {
            display: grid;
            gap: 10px;
            background: var(--panel-soft);
            border-radius: 16px;
            padding: 16px;
            margin-top: 14px;
          }

          .settings-panel[hidden] {
            display: none;
          }

          .settings-panel {
            margin-top: 20px;
          }

          .settings-grid {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-items: end;
          }

          .toggle-row {
            display: flex;
            gap: 10px;
            align-items: center;
          }

          .activity-panel {
            margin-top: 20px;
          }

          .activity-feed {
            display: grid;
            gap: 10px;
            margin: 14px 0 0;
            padding: 0;
            list-style: none;
          }

          .activity-item {
            background: #fff;
            border: 1px solid #d7e1e7;
            border-radius: 12px;
            padding: 12px;
          }

          .toast {
            margin-top: 12px;
            background: var(--accent-soft);
            color: var(--accent);
            border-radius: 12px;
            padding: 12px;
          }

          @media (max-width: 900px) {
            .hero,
            .content-grid,
            .controls,
            .settings-grid,
            .metric-grid {
              grid-template-columns: 1fr;
            }

            main {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <main data-testid="observer-shell">
          <section class="hero">
            <article class="hero-card">
              <p class="muted">Stanterprise Observer demo workspace</p>
              <h1>${escapeHtml(scenario.workspaceName)}</h1>
              <p data-testid="scenario-summary">
                ${escapeHtml(scenario.persona)} workflow · ${escapeHtml(scenario.featureArea)} coverage
              </p>
            </article>
            <aside class="hero-card">
              <p class="muted">Run profile</p>
              <strong data-testid="run-profile">${escapeHtml(scenario.id)}</strong>
              <p class="muted">Nested-step UI telemetry seed ${escapeHtml(String(scenario.records.length))}</p>
            </aside>
          </section>

          <section class="metric-grid" aria-label="Scenario metrics">
            <article class="metric-card">
              <span class="metric-label">Healthy</span>
              <strong class="metric-value" data-testid="metric-healthy">${countByStatus(scenario.records, "healthy")}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Warning</span>
              <strong class="metric-value" data-testid="metric-warning">${countByStatus(scenario.records, "warning")}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Critical</span>
              <strong class="metric-value" data-testid="metric-critical">${countByStatus(scenario.records, "critical")}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Paused</span>
              <strong class="metric-value" data-testid="metric-paused">${countByStatus(scenario.records, "paused")}</strong>
            </article>
          </section>

          <section class="controls">
            <label>
              Search workspace
              <input data-testid="search-input" placeholder="Search records" value="${escapeHtml(scenario.searchTerm)}" />
            </label>
            <label>
              Status filter
              <select data-testid="status-filter">
                <option value="all">all</option>
                <option value="healthy">healthy</option>
                <option value="warning">warning</option>
                <option value="critical">critical</option>
                <option value="paused">paused</option>
              </select>
            </label>
            <button type="button" class="primary-button" data-testid="apply-filters">Apply filters</button>
            <button type="button" class="secondary-button" data-testid="open-settings">Review preferences</button>
          </section>

          <section class="content-grid">
            <article class="list-panel">
              <h2>Work queue</h2>
              <p id="filter-summary" data-testid="filter-summary">Showing ${scenario.records.length} records</p>
              <div class="record-list" data-testid="record-list">
                ${scenario.records.map((record) => createRecordMarkup(record)).join("")}
              </div>
            </article>

            <aside class="details-panel" data-testid="detail-panel">
              <h2>Inspection</h2>
              <div class="detail-card">
                <strong data-testid="detail-name">No record selected</strong>
                <span data-testid="detail-owner">Select a record to inspect.</span>
                <span data-testid="detail-status">Status: not selected</span>
                <span data-testid="detail-notes">Notes will appear here.</span>
              </div>
              <label class="toggle-row">
                <input type="checkbox" data-testid="highlight-toggle" />
                Highlight critical signals
              </label>
              <div hidden class="toast" data-testid="toast"></div>
            </aside>
          </section>

          <section class="settings-panel" data-testid="settings-panel" hidden>
            <h2>Analyst preferences</h2>
            <div class="settings-grid">
              <label>
                Theme
                <select data-testid="theme-select">
                  <option value="light">light</option>
                  <option value="contrast">contrast</option>
                  <option value="ocean">ocean</option>
                </select>
              </label>
              <label class="toggle-row">
                <input type="checkbox" data-testid="notifications-toggle" ${scenario.notificationsEnabled ? "checked" : ""} />
                Enable workflow notifications
              </label>
            </div>
            <button type="button" class="primary-button" data-testid="save-settings">Save preferences</button>
          </section>

          <section class="activity-panel">
            <h2>Activity feed</h2>
            <ul class="activity-feed" data-testid="activity-feed">
              <li class="activity-item">Workspace ${escapeHtml(scenario.workspaceName)} primed for ${escapeHtml(scenario.persona)} review.</li>
            </ul>
          </section>
        </main>

        <script>
          const scenario = ${JSON.stringify({
            id: scenario.id,
            workspaceName: scenario.workspaceName,
            persona: scenario.persona,
            featureArea: scenario.featureArea,
          })};
          const records = ${records};
          const searchInput = document.querySelector('[data-testid="search-input"]');
          const statusFilter = document.querySelector('[data-testid="status-filter"]');
          const applyFiltersButton = document.querySelector('[data-testid="apply-filters"]');
          const settingsButton = document.querySelector('[data-testid="open-settings"]');
          const settingsPanel = document.querySelector('[data-testid="settings-panel"]');
          const themeSelect = document.querySelector('[data-testid="theme-select"]');
          const notificationsToggle = document.querySelector('[data-testid="notifications-toggle"]');
          const saveSettingsButton = document.querySelector('[data-testid="save-settings"]');
          const highlightToggle = document.querySelector('[data-testid="highlight-toggle"]');
          const toast = document.querySelector('[data-testid="toast"]');
          const activityFeed = document.querySelector('[data-testid="activity-feed"]');
          const filterSummary = document.querySelector('[data-testid="filter-summary"]');
          const detailName = document.querySelector('[data-testid="detail-name"]');
          const detailOwner = document.querySelector('[data-testid="detail-owner"]');
          const detailStatus = document.querySelector('[data-testid="detail-status"]');
          const detailNotes = document.querySelector('[data-testid="detail-notes"]');
          const recordButtons = Array.from(document.querySelectorAll('[data-record-id]'));

          function addActivityEntry(message) {
            const item = document.createElement('li');
            item.className = 'activity-item';
            item.textContent = message;
            activityFeed.prepend(item);
          }

          function showToast(message) {
            toast.hidden = false;
            toast.textContent = message;
          }

          function visibleRecords() {
            return recordButtons.filter((button) => !button.hidden).length;
          }

          function applyFilters() {
            const query = searchInput.value.trim().toLowerCase();
            const status = statusFilter.value;

            for (const button of recordButtons) {
              const matchesQuery = button.dataset.recordName.toLowerCase().includes(query);
              const matchesStatus = status === 'all' || button.dataset.recordStatus === status;
              button.hidden = !(matchesQuery && matchesStatus);
            }

            filterSummary.textContent = 'Showing ' + visibleRecords() + ' records';
            addActivityEntry('Applied ' + status + ' filter for ' + (query || 'all records') + '.');
          }

          function inspectRecord(button) {
            detailName.textContent = button.dataset.recordName;
            detailOwner.textContent = 'Owner: ' + button.dataset.recordOwner;
            detailStatus.textContent = 'Status: ' + button.dataset.recordStatus + ' · ' + button.dataset.recordPriority;
            detailNotes.textContent = button.dataset.recordNotes + ' Last run ' + button.dataset.recordLastRun + '. Signals ' + button.dataset.recordSignals + '.';
            addActivityEntry('Inspected ' + button.dataset.recordName + '.');
          }

          settingsButton.addEventListener('click', () => {
            settingsPanel.hidden = !settingsPanel.hidden;
            addActivityEntry('Preferences ' + (settingsPanel.hidden ? 'collapsed' : 'opened') + ' for ' + scenario.persona + '.');
          });

          saveSettingsButton.addEventListener('click', () => {
            const notificationState = notificationsToggle.checked ? 'enabled' : 'disabled';
            showToast('Preferences saved for ' + scenario.persona + '.');
            addActivityEntry('Saved ' + themeSelect.value + ' theme with notifications ' + notificationState + '.');
            settingsPanel.hidden = true;
          });

          highlightToggle.addEventListener('change', () => {
            document.body.dataset.highlightCritical = String(highlightToggle.checked);
            addActivityEntry('Critical highlighting ' + (highlightToggle.checked ? 'enabled' : 'disabled') + '.');
          });

          applyFiltersButton.addEventListener('click', applyFilters);
          themeSelect.value = ${JSON.stringify(scenario.preferredTheme)};
          statusFilter.value = ${JSON.stringify(scenario.filterStatus)};

          for (const button of recordButtons) {
            button.addEventListener('click', () => inspectRecord(button));
          }
        </script>
      </body>
    </html>
  `;
}
