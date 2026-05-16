import rules from "../data/rules-ecmo.json";
import type { GHValues, ResultCard } from "../types";
import { sortResults, unevaluated } from "./resultHelpers";

export function interpretECMO(values: GHValues): ResultCard[] {
  const results: ResultCard[] = [];
  const t = rules.targets;

  if (values.ckR === undefined) {
    results.push(unevaluated("ECMO-CKR-UN", "CK-R目標域"));
  } else if (values.ckR >= t.ckRMin && values.ckR <= t.ckRMax) {
    results.push({
      id: "ECMO-09",
      severity: "green",
      title: "【範囲内】CK-R目標域",
      assessment: "ヘパリン管理の参考レンジ内です。",
      action: "APTT、ACT、出血所見、回路所見と合わせて継続評価してください。",
      rationale: `CK-R ${values.ckR} min`,
      strength: "参考"
    });
  } else {
    results.push({
      id: values.ckR > t.ckRMax ? "ECMO-CKR-HIGH" : "ECMO-CKR-LOW",
      severity: "red",
      title: values.ckR > t.ckRMax ? "【異常】抗凝固過多" : "【異常】抗凝固不足",
      assessment: values.ckR > t.ckRMax ? "抗凝固過多の可能性があります。" : "抗凝固不足の可能性があります。",
      action: values.ckR > t.ckRMax ? "ヘパリン減量を検討します。" : "ヘパリン増量を検討します。",
      rationale: `CK-R ${values.ckR} min`,
      strength: "検討"
    });
  }

  if (values.ckhR === undefined) {
    results.push(unevaluated("ECMO-CKHR-UN", "CKH-R"));
  } else if (values.ckhR > t.ckhRYellowMax) {
    results.push({
      id: "ECMO-11-RED",
      severity: "red",
      title: "【異常】凝固因子不足",
      assessment: "凝固因子不足を疑います。",
      action: "出血所見、凝固検査、フィブリノゲン値と合わせてFFP補充を検討します。",
      rationale: `CKH-R ${values.ckhR} min`,
      strength: "検討"
    });
  } else if (values.ckhR > t.ckhRGeneralMax) {
    results.push({
      id: "ECMO-11-YELLOW",
      severity: "yellow",
      title: "【要判断】CKH-R軽度延長",
      assessment: "軽度〜中等度の凝固因子低下の可能性があります。",
      action: "出血傾向がなければ補正なしも検討します。出血時はFFP補正を検討します。",
      rationale: `CKH-R ${values.ckhR} min`,
      strength: "Expert opinion / 参考"
    });
  }

  if (values.ckR !== undefined && values.ckhR !== undefined && values.ckhR > 0) {
    const ratio = values.ckR / values.ckhR;
    if (ratio > t.ratioHigh) {
      results.push({
        id: "ECMO-RATIO-HIGH",
        severity: "red",
        title: "【異常】ヘパリン影響",
        assessment: "ヘパリン影響が強い可能性があります。",
        action: "APTT、ACT、出血・回路所見と合わせてヘパリン調整を検討します。",
        rationale: `CK-R / CKH-R ${ratio.toFixed(2)}`,
        strength: "検討"
      });
    }
  }

  const highMa = (values.crtMa !== undefined && values.crtMa >= t.crtMaHigh) || (values.cffMa !== undefined && values.cffMa >= t.cffMaHigh);
  if (highMa) {
    results.push({
      id: "ECMO-08",
      severity: "yellow",
      title: "【要判断】MA高値",
      assessment: "過凝固・炎症・感染兆候の可能性があります。",
      action: "感染、炎症、血栓リスク、回路所見を確認してください。",
      rationale: `CRT-MA ${values.crtMa ?? "未入力"} mm、CFF-MA ${values.cffMa ?? "未入力"} mm`,
      strength: "Expert opinion / 参考"
    });
  } else if (values.crtMa === undefined && values.cffMa === undefined) {
    results.push(unevaluated("ECMO-MA-UN", "MA高値"));
  }

  return sortResults(results);
}
