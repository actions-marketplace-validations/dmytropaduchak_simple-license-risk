export type Severity = "high" | "medium" | "low";
export type Finding = {
  ruleId: string;
  severity: Severity;
  title: string;
  detail: string;
  file: string;
  line?: number;
};

const COPYLEFT = /\b(AGPL-?3?(?:\.0)?|GPL-?3?(?:\.0)?|GPL-2\.0|LGPL-?3?(?:\.0)?|SSPL)\b/i;

export function scanLockfileLicenses(file: string, content: string): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // package-lock / npm: "license": "GPL-3.0"
    // yarn: license "GPL-3.0"
    // Cargo.lock rarely embeds license — skip unless present
    if (!/license/i.test(line)) continue;
    const m = line.match(COPYLEFT);
    if (!m) continue;
    findings.push({
      ruleId: "copyleft-license",
      severity: "high",
      title: `Copyleft license ${m[1]}`,
      detail: "Copyleft licenses can force source disclosure for commercial products. Review before merging.",
      file,
      line: i + 1,
    });
  }
  return findings;
}

export function findLockfiles(rootFiles: string[]): string[] {
  const names = new Set([
    "package-lock.json",
    "npm-shrinkwrap.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "Cargo.lock",
    "poetry.lock",
    "Pipfile.lock",
    "composer.lock",
    "Gemfile.lock",
  ]);
  return rootFiles.filter((f) => names.has(f.split(/[/\\]/).pop() || ""));
}
