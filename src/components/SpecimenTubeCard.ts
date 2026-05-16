import type { Mode } from "../types";

export function renderSpecimenTubeCard(mode: Mode): string {
  const gh = mode === "GH";
  const data = gh
    ? {
        bg: "bg-sky-50",
        border: "border-sky-300",
        cap: "#1976d2",
        label: "text-sky-950",
        chip: "bg-sky-100 text-sky-900",
        mode: "TEG GH",
        formal: "3.2%クエン酸ナトリウム加採血管",
        common: "青スピッツ",
        note: "凝固検査用スピッツ",
        sentence: "TEG GHでは、3.2%クエン酸ナトリウム加採血管（青スピッツ）を使用してください。"
      }
    : {
        bg: "bg-emerald-50",
        border: "border-emerald-300",
        cap: "#16a34a",
        label: "text-emerald-950",
        chip: "bg-emerald-100 text-emerald-900",
        mode: "TEG PM",
        formal: "ヘパリン加採血管",
        common: "緑スピッツ",
        note: "Platelet Mapping用スピッツ",
        sentence: "TEG PMでは、ヘパリン加採血管（緑スピッツ）を使用してください。"
      };

  return `
    <section class="rounded-md border-2 ${data.border} ${data.bg} p-4 shadow-sm">
      <div class="flex items-center gap-4">
        <svg class="h-24 w-16 shrink-0" viewBox="0 0 64 104" role="img" aria-label="${data.common}の採血管イラスト">
          <rect x="18" y="7" width="28" height="14" rx="4" fill="${data.cap}"></rect>
          <rect x="21" y="20" width="22" height="8" rx="2" fill="${data.cap}" opacity="0.85"></rect>
          <path d="M23 28h18v48c0 8-4 16-9 20-5-4-9-12-9-20V28z" fill="#ffffff" stroke="#8aa0b5" stroke-width="2"></path>
          <path d="M25 56h14v20c0 5-3 10-7 14-4-4-7-9-7-14V56z" fill="${data.cap}" opacity="0.18"></path>
          <line x1="26" y1="40" x2="38" y2="40" stroke="#c7d2de" stroke-width="2"></line>
          <line x1="26" y1="48" x2="38" y2="48" stroke="#c7d2de" stroke-width="2"></line>
        </svg>
        <div class="min-w-0">
          <p class="text-2xl font-bold ${data.label}">${data.mode}</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">${data.formal}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="rounded px-2 py-1 text-sm font-semibold ${data.chip}">${data.common}</span>
            <span class="rounded bg-white px-2 py-1 text-sm font-semibold text-slate-700">${data.note}</span>
          </div>
        </div>
      </div>
      <p class="mt-3 text-base font-semibold text-slate-900">${data.sentence}</p>
    </section>`;
}
