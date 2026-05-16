import type { ResultCard, Severity } from "../types";

const severityRank: Record<Severity, number> = {
  red: 0,
  yellow: 1,
  green: 2,
  gray: 3
};

export function sortResults(results: ResultCard[]): ResultCard[] {
  return [...results].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
}

export function unevaluated(id: string, label: string): ResultCard {
  return {
    id,
    severity: "gray",
    title: `【未評価】${label}`,
    assessment: "未入力のため未評価です。",
    action: "入力後、該当項目を再評価してください。",
    strength: "注意"
  };
}
