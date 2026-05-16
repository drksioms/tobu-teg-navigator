import rules from "../data/rules-pm.json";
import type { ClinicalContext, PMValues, ResultCard } from "../types";
import { sortResults, unevaluated } from "./resultHelpers";

export function interpretPM(values: PMValues, context: ClinicalContext): ResultCard[] {
  const results: ResultCard[] = [];
  const n = rules.normal;

  if (context === "trauma") {
    results.push({
      id: "PM-TBI-01",
      severity: "yellow",
      title: "【要判断】頭部外傷と血小板機能",
      assessment:
        '<span class="rounded bg-amber-200 px-1 font-bold">特に頭部外傷では抗血小板薬内服なしでも血小板機能抑制を来すことがあります。</span>',
      action: "血小板数に関わらず、血小板機能抑制があれば血小板輸血を検討してください。",
      strength: "Expert opinion / 参考"
    });
  }

  if (values.actfMa === undefined) {
    results.push(unevaluated("PM-ACTF-UN", "ActF-MA"));
  } else if (values.actfMa < n.actfMaCritical) {
    results.push({
      id: "PM-TTP-02",
      severity: "red",
      title: "【異常】フィブリノゲン低下",
      assessment: "フィブリノゲン不足または凝集能低下を疑います。",
      action: "Fib 3g投与を検討します。",
      rationale: `入力値 ActF-MA ${values.actfMa} mm`,
      referenceRange: `基準値 ActF-MA ${n.actfMaCritical} mm以上 / Fib近似 ${n.actfMaFib150} mm≒150mg/dL、${n.actfMaFib200} mm≒200mg/dL`,
      strength: "検討"
    });
  } else {
    results.push({
      id: "PM-ACTF-GREEN",
      severity: "green",
      title: "【範囲内】ActF-MA",
      assessment: values.actfMa >= n.actfMaFib200 ? "Fib 200mg/dL相当以上の目安です。" : "Fib 150mg/dL相当以上の目安です。",
      action: "実測フィブリノゲン値、出血所見と合わせて判断してください。",
      rationale: `入力値 ActF-MA ${values.actfMa} mm`,
      referenceRange: `基準値 ActF-MA ${n.actfMaCritical} mm以上 / Fib近似 ${n.actfMaFib150} mm≒150mg/dL、${n.actfMaFib200} mm≒200mg/dL`,
      strength: "参考"
    });
  }

  if (values.hkhMa === undefined) {
    results.push(unevaluated("PM-HKHMA-UN", "HKH-MA"));
  } else if (values.hkhMa < n.hkhMaMin) {
    results.push({
      id: "PM-TTP-03",
      severity: "red",
      title: "【異常】血餅強度低下",
      assessment: "全体の血餅強度低下を疑います。",
      action: "血小板輸血を検討します。",
      rationale: `入力値 HKH-MA ${values.hkhMa} mm`,
      referenceRange: `基準値 HKH-MA ${n.hkhMaMin} mm以上`,
      strength: "検討"
    });
  } else {
    results.push({
      id: "PM-HKHMA-GREEN",
      severity: "green",
      title: "【範囲内】HKH-MA",
      assessment: "全体の血餅強度は目標範囲内の目安です。",
      action: "臨床所見と合わせて判断してください。",
      rationale: `入力値 HKH-MA ${values.hkhMa} mm`,
      referenceRange: `基準値 HKH-MA ${n.hkhMaMin} mm以上`,
      strength: "参考"
    });
  }

  if (values.adpInhibition === undefined) {
    results.push(unevaluated("PM-ADP-INH-UN", "ADP inhibition"));
  } else if (values.adpInhibition > n.adpInhibitionHigh) {
    results.push({
      id: "PM-TTP-04",
      severity: "red",
      title: "【異常】ADP系血小板機能抑制",
      assessment: "ADP系血小板機能抑制を疑います。",
      action: "血小板輸血を検討します。",
      rationale: `入力値 ADP inhibition ${values.adpInhibition}%`,
      referenceRange: `基準値 ADP inhibition ${n.adpInhibitionHigh}%以下`,
      strength: "検討"
    });
  } else {
    results.push({
      id: "PM-ADP-INH-GREEN",
      severity: "green",
      title: "【範囲内】ADP inhibition",
      assessment: "外傷TTPの重要閾値は超えていません。",
      action: "ADP-MA、血小板数、出血所見と合わせて判断してください。",
      rationale: `入力値 ADP inhibition ${values.adpInhibition}%`,
      referenceRange: `基準値 ADP inhibition ${n.adpInhibitionHigh}%以下`,
      strength: "参考"
    });
  }

  if (values.hkhR === undefined) {
    results.push(unevaluated("PM-HKHR-UN", "HKH-R"));
  } else if (values.hkhR > n.hkhRMax) {
    results.push({
      id: "PM-TTP-05",
      severity: "yellow",
      title: "【要判断】HKH-R延長",
      assessment: "凝固因子不足の可能性を参考所見として表示します。",
      action: "出血量、重症度、通常凝固検査、術野所見と合わせてFFPを検討します。HKH-R単独でFFP判断を強く推奨しません。",
      rationale: `入力値 HKH-R ${values.hkhR} min`,
      referenceRange: `参考基準 HKH-R ${n.hkhRMax} min以下`,
      strength: "Expert opinion / 参考"
    });
  } else {
    results.push({
      id: "PM-HKHR-GREEN",
      severity: "green",
      title: "【範囲内】HKH-R",
      assessment: "HKH-Rは10分以内です。ただしPMのR時間は確立閾値ではありません。",
      action: "他の項目と臨床所見を確認してください。",
      rationale: `入力値 HKH-R ${values.hkhR} min`,
      referenceRange: `参考基準 HKH-R ${n.hkhRMax} min以下`,
      strength: "参考"
    });
  }

  if (values.adpMa === undefined) {
    results.push(unevaluated("PM-ADPMA-UN", "ADP-MA"));
  } else if (values.adpMa <= n.adpMaVeryLow) {
    results.push({
      id: "PM-ADPMA-02",
      severity: "yellow",
      title: "【要判断】ADP-MA著明低値",
      assessment: "ADP系血小板機能低下が強い可能性があります。",
      action: "血小板輸血を検討します。",
      rationale: `入力値 ADP-MA ${values.adpMa} mm`,
      referenceRange: `参考基準 ADP-MA ${n.adpMaVeryLow} mm超`,
      strength: "Expert opinion / 検討"
    });
  } else if (values.adpMa <= n.adpMaLow) {
    results.push({
      id: "PM-ADPMA-01",
      severity: "yellow",
      title: "【要判断】ADP-MA低値",
      assessment: "ADP系血小板機能低下の可能性があります。",
      action: "血小板機能低下を疑い、血小板輸血を検討します。",
      rationale: `入力値 ADP-MA ${values.adpMa} mm`,
      referenceRange: `参考基準 ADP-MA ${n.adpMaLow} mm超`,
      strength: "Expert opinion / 参考"
    });
  }

  if (context === "antiplatelet") {
    addAntiplateletResults(results, values);
  }

  const canAssessMtp = values.hkhR !== undefined && values.hkhMa !== undefined && values.adpInhibition !== undefined && values.actfMa !== undefined;
  if (canAssessMtp && values.hkhR! < 10 && values.hkhMa! >= 45 && values.adpInhibition! < 60 && values.actfMa! >= 5) {
    results.push({
      id: "PM-TTP-MTP-DEESC",
      severity: "yellow",
      title: "【要判断】MTP de-escalation候補",
      assessment: "TEG上は凝固・血小板機能の立ち上がりがあります。",
      action: "出血所見・バイタル・止血状況と合わせてMTP減量/終了を検討します。自動終了してよいという意味ではありません。",
      strength: "Expert opinion / 検討"
    });
  }

  return sortResults(results);
}

function addAntiplateletResults(results: ResultCard[], values: PMValues) {
  if (values.adpInhibition !== undefined) {
    if (values.adpInhibition > 30) {
      results.push({
        id: "PM-AP-01",
        severity: "yellow",
        title: "【要判断】P2Y12阻害薬効果",
        assessment: "P2Y12阻害薬効果の可能性があります。",
        action: "クロピドグレル、プラスグレル、チカグレロルなどの影響を検討します。",
        rationale: `入力値 ADP inhibition ${values.adpInhibition}%`,
        referenceRange: "参考基準 ADP inhibition 30%以下",
        strength: "参考"
      });
    }
  }
  if (values.aaInhibition !== undefined) {
    if (values.aaInhibition > 30) {
      results.push({
        id: "PM-AP-02",
        severity: "yellow",
        title: "【要判断】アスピリン効果",
        assessment: "アスピリン効果の可能性があります。",
        action: "処置延期、方法変更、血小板輸血を臨床状況に応じて検討します。",
        rationale: `入力値 AA inhibition ${values.aaInhibition}%`,
        referenceRange: "参考基準 AA inhibition 30%以下",
        strength: "参考"
      });
    }
  }
}
