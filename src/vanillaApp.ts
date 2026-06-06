import type { ClinicalContext, GHValues, Mode, PMValues, ResultCard } from "./types";
import { cartridgeOptions, decideCartridge } from "./logic/decideCartridge";
import { interpretECMO } from "./logic/interpretECMO";
import { interpretGH } from "./logic/interpretGH";
import { interpretPM } from "./logic/interpretPM";
import { sanitizeNumberInput, toOptionalNumber, validateCommon, validateGHOutliers, validatePMOutliers } from "./logic/validateValues";
import { renderSafetyNotice } from "./components/SafetyNotice";
import { renderSpecimenTubeCard } from "./components/SpecimenTubeCard";

type Screen = "home" | "advisor" | "gh" | "pm" | "result";
type ResultState = { title: string; results: ResultCard[]; warnings: string[]; previous: "gh" | "pm" };

let root: HTMLElement;
let screen: Screen = "home";
let advisorChoice = "trauma";
let context: ClinicalContext = "general";
let resultState: ResultState | null = null;

export function createApp(element: HTMLElement) {
  root = element;
  render();
}

function setScreen(next: Screen) {
  screen = next;
  render();
  window.scrollTo({ top: 0 });
}

function startMode(mode: Mode, nextContext: ClinicalContext = "general") {
  context = nextContext;
  setScreen(mode === "GH" ? "gh" : "pm");
}

function render() {
  if (screen === "advisor") return renderAdvisor();
  if (screen === "gh") return renderGhForm();
  if (screen === "pm") return renderPmForm();
  if (screen === "result" && resultState) return renderResult();
  renderHome();
}

function layout(inner: string) {
  root.innerHTML = inner;
}

function safetyNotice(compact = false) {
  return renderSafetyNotice(compact);
}

function footer() {
  return `<footer class="py-6 text-center text-xs text-slate-500">Created by Kosei Omasa</footer>`;
}

function tubeCard(mode: Mode) {
  return renderSpecimenTubeCard(mode);
}

function renderHome() {
  layout(`
    <main class="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6">
      <header class="pt-4">
        <p class="text-sm font-semibold text-slate-500">院内医療者向け</p>
        <h1 class="mt-2 text-4xl font-bold leading-tight text-slate-950">Tobu TEG Navigator</h1>
        <p class="mt-3 text-base text-slate-700">患者情報は入力しないでください。本アプリは院内医療者向けの意思決定支援ツールです。</p>
      </header>
      <section class="mt-5 rounded-md border border-slate-300 bg-white p-4 text-slate-950 shadow-sm">
        <p class="text-base font-bold">TEG manager</p>
        <p class="mt-2 text-base font-semibold">ログイン情報は管理者に確認してください。</p>
      </section>
      <div class="mt-5 grid gap-4">
        <button id="go-gh" class="min-h-20 rounded-md bg-sky-700 px-5 py-4 text-left text-xl font-bold text-white shadow-sm active:bg-sky-800">TEG GHを解釈する</button>
        <button id="go-pm" class="min-h-20 rounded-md bg-emerald-700 px-5 py-4 text-left text-xl font-bold text-white shadow-sm active:bg-emerald-800">TEG PMを解釈する</button>
        <button id="go-advisor" class="min-h-20 rounded-md bg-slate-800 px-5 py-4 text-left text-xl font-bold text-white shadow-sm active:bg-slate-950">GH / PMどちらを使うか相談する</button>
      </div>
      <div class="mt-8">${safetyNotice(true)}</div>
      ${footer()}
    </main>`);
  byId("go-gh").onclick = () => startMode("GH", "general");
  byId("go-pm").onclick = () => startMode("PM", "trauma");
  byId("go-advisor").onclick = () => setScreen("advisor");
}

function renderAdvisor() {
  const decision = decideCartridge(advisorChoice);
  const isAntiplatelet = advisorChoice === "antiplatelet";
  const recommendation = decision.unavailable
    ? "TEGでは測定不能"
    : decision.secondaryMode
      ? `${decision.mode} / ${decision.secondaryMode}`
      : `TEG ${decision.mode}`;
  layout(`
    <main class="mx-auto min-h-screen w-full max-w-md px-4 py-5">
      <button id="back" class="mb-4 min-h-11 rounded-md px-3 text-base font-semibold text-slate-700 active:bg-slate-200">戻る</button>
      <h1 class="text-2xl font-bold text-slate-950">GH / PM選択支援</h1>
      <p class="mt-2 text-sm text-slate-600">使用場面を選択してください。</p>
      <div class="mt-5 grid gap-3">
        ${cartridgeOptions
          .map((option) => `<button data-choice="${option.id}" class="min-h-14 rounded-md border px-4 py-3 text-left text-base font-semibold shadow-sm ${advisorChoice === option.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-900 active:bg-slate-100"}">${option.label}</button>`)
          .join("")}
      </div>
      <section class="mt-5 rounded-md border ${isAntiplatelet ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-300 bg-white text-slate-950"} p-4 shadow-sm">
        <p class="text-sm font-semibold text-slate-500">${decision.unavailable ? "参考" : "推奨"}</p>
        <p class="mt-1 text-2xl font-bold">${recommendation}</p>
        <p class="mt-2 text-base font-semibold">${decision.message}</p>
        ${decision.strength ? `<p class="mt-3 text-sm font-semibold text-slate-600">${decision.strength}</p>` : ""}
      </section>
      ${decision.mode ? `<div class="mt-4 grid gap-4">
        ${tubeCard(decision.mode)}
        ${decision.secondaryMode ? tubeCard(decision.secondaryMode) : ""}
      </div>` : ""}
      ${decision.mode ? `<div class="mt-5 grid gap-3">
        <button id="start-primary" class="min-h-14 rounded-md bg-slate-900 px-4 py-3 text-lg font-bold text-white">TEG ${decision.mode}入力へ</button>
        ${decision.secondaryMode ? `<button id="start-secondary" class="min-h-14 rounded-md border border-slate-400 bg-white px-4 py-3 text-lg font-bold text-slate-900">TEG ${decision.secondaryMode}入力へ</button>` : ""}
      </div>` : ""}
      <div class="mt-5">${safetyNotice(true)}</div>
      ${footer()}
    </main>`);
  byId("back").onclick = () => setScreen("home");
  document.querySelectorAll<HTMLButtonElement>("[data-choice]").forEach((button) => {
    button.onclick = () => {
      advisorChoice = button.dataset.choice ?? "trauma";
      renderAdvisor();
    };
  });
  const primary = document.getElementById("start-primary");
  if (primary && decision.mode) primary.onclick = () => startMode(decision.mode!, decision.context);
  const secondary = document.getElementById("start-secondary");
  if (secondary && decision.secondaryMode) secondary.onclick = () => startMode(decision.secondaryMode!, decision.context);
}

function field(id: string, label: string, unit: string, optional = false) {
  return `
    <label class="block rounded-md border border-slate-300 bg-white p-4 shadow-sm">
      <span class="flex items-center justify-between gap-3 text-lg font-bold text-slate-950">
        <span>${label}</span>${optional ? `<span class="text-sm font-semibold text-slate-500">任意</span>` : ""}
      </span>
      <div class="mt-3 flex items-center gap-3">
        <input id="${id}" class="min-h-14 min-w-0 flex-1 rounded-md border border-slate-300 bg-slate-50 px-3 text-2xl font-bold text-slate-950 outline-none focus:border-slate-900 focus:bg-white" inputmode="decimal" pattern="[0-9]*[.]?[0-9]*" aria-label="${label}" />
        <span class="w-12 shrink-0 text-lg font-bold text-slate-700">${unit}</span>
      </div>
    </label>`;
}

function bindNumericInputs() {
  document.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
    input.addEventListener("input", () => {
      const sanitized = sanitizeNumberInput(input.value);
      if (sanitized !== input.value) input.value = sanitized;
    });
  });
}

function renderGhForm() {
  let ghContext: ClinicalContext = context === "ecmo" ? "ecmo" : "general";
  const draw = () => {
    layout(`
      <main class="mx-auto min-h-screen w-full max-w-md px-4 py-5">
        <button id="back" class="mb-4 min-h-11 rounded-md px-3 text-base font-semibold text-slate-700 active:bg-slate-200">戻る</button>
        <h1 class="text-2xl font-bold text-slate-950">TEG GH入力</h1>
        <div class="mt-4">${tubeCard("GH")}</div>
        <div class="mt-4 grid grid-cols-2 gap-2 rounded-md bg-slate-200 p-1">
          <button id="ctx-general" class="min-h-12 rounded px-3 font-bold ${ghContext === "general" ? "bg-white text-slate-950 shadow-sm" : "text-slate-700"}">一般</button>
          <button id="ctx-ecmo" class="min-h-12 rounded px-3 font-bold ${ghContext === "ecmo" ? "bg-white text-slate-950 shadow-sm" : "text-slate-700"}">ECMO</button>
        </div>
        <div class="mt-4 grid gap-3">
          ${field("ckR", "CK-R", "min")}
          ${field("ckhR", "CKH-R", "min")}
          ${field("crtMa", "CRT-MA", "mm")}
          ${field("cffMa", "CFF-MA", "mm")}
          ${field("ly30", "LY30", "%")}
        </div>
        <div id="warnings" class="mt-4"></div>
        <button id="submit" class="mt-5 min-h-16 w-full rounded-md bg-slate-900 px-4 py-3 text-xl font-bold text-white active:bg-black">解釈する</button>
        <div class="mt-5">${safetyNotice(true)}</div>
        ${footer()}
      </main>`);
    byId("back").onclick = () => setScreen("home");
    byId("ctx-general").onclick = () => {
      ghContext = "general";
      draw();
    };
    byId("ctx-ecmo").onclick = () => {
      ghContext = "ecmo";
      draw();
    };
    bindNumericInputs();
    byId("submit").onclick = () => {
      const values: GHValues = {
        ckR: valueOf("ckR"),
        ckhR: valueOf("ckhR"),
        crtMa: valueOf("crtMa"),
        cffMa: valueOf("cffMa"),
        ly30: valueOf("ly30")
      };
      const warnings = [...validateCommon(values as Record<string, number | undefined>), ...validateGHOutliers(values)].map((w) => `${w.field}: ${w.message}`);
      resultState = { title: ghContext === "ecmo" ? "TEG GH ECMO解釈" : "TEG GH解釈", results: ghContext === "ecmo" ? interpretECMO(values) : interpretGH(values), warnings, previous: "gh" };
      setScreen("result");
    };
  };
  draw();
}

function renderPmForm() {
  let pmContext: ClinicalContext = context === "antiplatelet" ? context : "trauma";
  const draw = () => {
    const showAaFields = pmContext === "antiplatelet";
    const antiplateletNotice = showAaFields
      ? `<section class="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-base font-semibold text-amber-950 shadow-sm">抗血小板薬の効果判定にはTEG PMを検討します。アスピリンの効果を見る場合は、採血後30分静置してから測定した値か確認してください。</section>`
      : "";
    layout(`
      <main class="mx-auto min-h-screen w-full max-w-md px-4 py-5">
        <button id="back" class="mb-4 min-h-11 rounded-md px-3 text-base font-semibold text-slate-700 active:bg-slate-200">戻る</button>
        <h1 class="text-2xl font-bold text-slate-950">TEG PM入力</h1>
        <div class="mt-4">${tubeCard("PM")}</div>
        <div class="mt-4 grid grid-cols-2 gap-1 rounded-md bg-slate-200 p-1">
          ${contextButton("trauma", "外傷", pmContext)}
          ${contextButton("antiplatelet", "抗血小板", pmContext)}
        </div>
        ${antiplateletNotice}
        <div class="mt-4 grid gap-3">
          ${field("hkhR", "HKH-R", "min")}
          ${field("hkhMa", "HKH-MA", "mm")}
          ${field("actfMa", "ActF-MA", "mm")}
          ${field("adpInhibition", "ADP inhibition", "%")}
          ${field("adpMa", "ADP-MA", "mm", true)}
          ${showAaFields ? field("aaInhibition", "AA inhibition", "%") : ""}
          ${showAaFields ? field("aaMa", "AA-MA", "mm", true) : ""}
        </div>
        <button id="submit" class="mt-5 min-h-16 w-full rounded-md bg-slate-900 px-4 py-3 text-xl font-bold text-white active:bg-black">解釈する</button>
        <div class="mt-5">${safetyNotice(true)}</div>
        ${footer()}
      </main>`);
    byId("back").onclick = () => setScreen("home");
    document.querySelectorAll<HTMLButtonElement>("[data-pm-context]").forEach((button) => {
      button.onclick = () => {
        pmContext = button.dataset.pmContext as ClinicalContext;
        draw();
      };
    });
    bindNumericInputs();
    byId("submit").onclick = () => {
      const values: PMValues = {
        hkhR: valueOf("hkhR"),
        hkhMa: valueOf("hkhMa"),
        actfMa: valueOf("actfMa"),
        adpInhibition: valueOf("adpInhibition"),
        adpMa: valueOf("adpMa"),
        aaInhibition: showAaFields ? valueOf("aaInhibition") : undefined,
        aaMa: showAaFields ? valueOf("aaMa") : undefined
      };
      const warnings = [...validateCommon(values as Record<string, number | undefined>), ...validatePMOutliers(values)].map((w) => `${w.field}: ${w.message}`);
      const label = pmContext === "antiplatelet" ? "抗血小板薬" : "外傷TTP";
      resultState = { title: `TEG PM ${label}解釈`, results: interpretPM(values, pmContext), warnings, previous: "pm" };
      setScreen("result");
    };
  };
  draw();
}

function contextButton(id: ClinicalContext, label: string, current: ClinicalContext) {
  return `<button data-pm-context="${id}" class="min-h-12 rounded px-2 text-sm font-bold ${current === id ? "bg-white text-slate-950 shadow-sm" : "text-slate-700"}">${label}</button>`;
}

function renderResult() {
  if (!resultState) return;
  const isTraumaPm = resultState.title === "TEG PM 外傷TTP解釈";
  const isEcmoGh = resultState.title === "TEG GH ECMO解釈";
  const severityOrder: Record<ResultCard["severity"], number> = { red: 0, yellow: 1, green: 2, gray: 3 };
  const orderedResults = [...resultState.results].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  const styles = {
    red: "border-red-300 bg-red-50 text-red-950",
    yellow: "border-amber-300 bg-amber-50 text-amber-950",
    green: "border-emerald-300 bg-emerald-50 text-emerald-950",
    gray: "border-slate-300 bg-slate-100 text-slate-800"
  };
  const resultCard = (r: ResultCard) => {
    const cardStyle =
      isTraumaPm && r.severity === "red"
        ? "border-2 border-red-600 bg-red-100 text-red-950 shadow-md ring-2 ring-red-300"
        : styles[r.severity];
    return `
          <article class="rounded-md border p-4 shadow-sm ${cardStyle}">
            <h2 class="text-lg font-bold">${r.title}</h2>
            <dl class="mt-3 grid gap-2 text-base">
              <div><dt class="text-sm font-bold opacity-75">判定</dt><dd class="mt-1">${r.assessment}</dd></div>
              ${r.rationale || r.referenceRange ? `<div><dt class="text-sm font-bold opacity-75">根拠</dt><dd class="mt-1">${[r.referenceRange, r.rationale].filter(Boolean).join("<br>")}</dd></div>` : ""}
              <div><dt class="text-sm font-bold opacity-75">次に検討</dt><dd class="mt-1 font-semibold">${r.action}</dd></div>
              <div><dt class="text-sm font-bold opacity-75">文言強度</dt><dd class="mt-1">${r.strength}</dd></div>
            </dl>
          </article>`;
  };
  const redResults = orderedResults.filter((r) => r.severity === "red").map(resultCard).join("");
  const nonRedResults = orderedResults.filter((r) => r.severity !== "red").map(resultCard).join("");
  const warningCard =
    resultState.warnings.length > 0
      ? `<section class="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900">${resultState.warnings.map((w) => `<p>${w}</p>`).join("")}</section>`
      : "";
  layout(`
    <main class="mx-auto min-h-screen w-full max-w-md px-4 py-5">
      <div class="flex gap-2">
        <button id="back" class="min-h-11 rounded-md px-3 text-base font-semibold text-slate-700 active:bg-slate-200">入力へ戻る</button>
        <button id="home" class="min-h-11 rounded-md px-3 text-base font-semibold text-slate-700 active:bg-slate-200">トップ</button>
      </div>
      <h1 class="mt-4 text-2xl font-bold text-slate-950">${resultState.title}</h1>
      <section class="mt-4 grid gap-3">
        ${redResults}
        ${warningCard}
        ${nonRedResults}
      </section>
      ${
        isEcmoGh
          ? `<section class="mt-5 rounded-md border border-slate-300 bg-white p-4 text-slate-800 shadow-sm">
              <h2 class="text-base font-bold text-slate-950">ECMO中TEG GHの注意</h2>
              <p class="mt-2 text-sm leading-relaxed">TEG GHはAPTT/ACTの代替ではなく補助指標です。回路所見、出血所見、血栓所見、通常凝固検査と合わせて判断してください。</p>
            </section>`
          : ""
      }
      <div class="mt-5">${safetyNotice()}</div>
      ${footer()}
    </main>`);
  byId("back").onclick = () => setScreen(resultState!.previous);
  byId("home").onclick = () => setScreen("home");
}

function valueOf(id: string): number | undefined {
  return toOptionalNumber((document.getElementById(id) as HTMLInputElement).value);
}

function byId(id: string): HTMLElement {
  return document.getElementById(id) as HTMLElement;
}
