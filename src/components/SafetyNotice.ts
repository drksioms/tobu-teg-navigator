export function renderSafetyNotice(compact = false): string {
  return `
    <section class="rounded-md border border-slate-300 bg-white ${compact ? "p-3 text-sm" : "p-4 text-base"} text-slate-700 shadow-sm">
      <p class="font-semibold text-slate-900">使用時の前提</p>
      <p class="mt-1">本アプリは院内医療者向けの意思決定支援ツールです。治療を自動決定するものではありません。</p>
      <p class="mt-1">TEGは補助指標です。TEGのために止血処置・輸血を遅らせないでください。</p>
      <p class="mt-1 font-semibold text-slate-900">最終判断は担当医が行ってください。</p>
    </section>`;
}
