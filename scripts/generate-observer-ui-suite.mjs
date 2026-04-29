import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "tests", "generated", "observer-ui");

const features = [
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
const variants = ["triage", "detail-review", "preferences", "audit-trail"];
const totalScripts = 2048;

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (let scenarioId = 1; scenarioId <= totalScripts; scenarioId += 1) {
  const featureArea = features[(scenarioId - 1) % features.length];
  const persona = personas[Math.floor((scenarioId - 1) / features.length) % personas.length];
  const variant = variants[
    Math.floor((scenarioId - 1) / (features.length * personas.length)) % variants.length
  ];
  const fileName = [
    `observer-ui-${String(scenarioId).padStart(4, "0")}`,
    featureArea,
    persona,
    variant,
  ].join("-") + ".spec.ts";
  const fileContent = `import { registerObserverUiScenario } from "../../support/observer-ui-suite";

registerObserverUiScenario({
  scenarioId: ${scenarioId},
  featureArea: ${JSON.stringify(featureArea)},
  persona: ${JSON.stringify(persona)},
  variant: ${JSON.stringify(variant)},
});
`;

  fs.writeFileSync(path.join(outputDir, fileName), fileContent, "utf8");
}

fs.writeFileSync(
  path.join(outputDir, "manifest.json"),
  JSON.stringify(
    {
      totalScripts,
      features,
      personas,
      variants,
      generatedAt: new Date().toISOString(),
    },
    null,
    2
  ) + "\n",
  "utf8"
);

console.log(`Generated ${totalScripts} observer UI spec files in ${outputDir}`);