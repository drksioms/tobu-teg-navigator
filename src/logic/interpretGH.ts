import rules from "../data/rules-gh.json";
import type { GHValues, ResultCard } from "../types";
import { sortResults, unevaluated } from "./resultHelpers";

export function interpretGH(values: GHValues): ResultCard[] {
  const results: ResultCard[] = [];
  const n = rules.normal;

  if (values.ckR === undefined || values.ckhR === undefined) {
    results.push(unevaluated("GH-R-UN", "R時間"));
  } else {
    const ckRExtended = values.ckR > n.ckRMax;
    const ckhRExtended = values.ckhR > n.ckhRMax;
    const heparinGap = values.ckR > values.ckhR;

    if (ckRExtended && ckhRExtended && heparinGap) {
      results.push({
        id: "GH-R-COMBO",
        severity: "red",
        title: "【異常】凝固因子不足 + ヘパリン影響",
        assessment: "凝固因子不足とヘパリン影響の併存を疑います。",
        action: "FFP補充およびプロタミンを検討します。",
        rationale: `CK-R ${values.ckR} min、CKH-R ${values.ckhR} min`,
        strength: "検討"
      });
    } else if (ckRExtended && !ckhRExtended && heparinGap) {
      results.push({
        id: "GH-R-04",
        severity: "red",
        title: "【異常】ヘパリン影響",
        assessment: "自己凝固能は保たれ、ヘパリン影響が主体の可能性があります。",
        action: "プロタミンを検討します。",
        rationale: `CK-R ${values.ckR} min、CKH-R ${values.ckhR} min`,
        strength: "検討"
      });
    } else if (ckRExtended && ckhRExtended) {
      results.push({
        id: "GH-R-05",
        severity: "red",
        title: "【異常】凝固因子不足",
        assessment: "ヘパリンより凝固因子不足が主体の可能性があります。",
        action: "FFP補充を検討します。",
        rationale: `CK-R ${values.ckR} min、CKH-R ${values.ckhR} min`,
        strength: "検討"
      });
    } else if (!ckRExtended && !ckhRExtended) {
      results.push({
        id: "GH-R-06",
        severity: "green",
        title: "【範囲内】R時間",
        assessment: "R時間上は明らかな凝固因子不足・ヘパリン影響は目立ちません。",
        action: "他の項目と臨床所見を確認してください。",
        rationale: `CK-R ${values.ckR} min、CKH-R ${values.ckhR} min`,
        strength: "参考"
      });
    }
  }

  if (values.crtMa === undefined || values.cffMa === undefined) {
    results.push(unevaluated("GH-MA-UN", "血餅強度"));
  } else {
    const crtLow = values.crtMa < n.crtMaMin;
    const cffLow = values.cffMa < n.cffMaMin;
    if (crtLow && cffLow) {
      results.push({
        id: "GH-MA-COMBO",
        severity: "red",
        title: "【異常】血小板 + フィブリノゲン低下",
        assessment: "血小板側とフィブリノゲン側の両者低下を疑います。",
        action: "血小板輸血およびFib製剤/クリオ/FFPを検討します。",
        rationale: `CRT-MA ${values.crtMa} mm、CFF-MA ${values.cffMa} mm`,
        strength: "検討"
      });
    } else if (crtLow && !cffLow) {
      results.push({
        id: "GH-MA-01",
        severity: "red",
        title: "【異常】血小板側の問題",
        assessment: "血小板側の問題を疑います。",
        action: "血小板輸血を検討します。",
        rationale: `CRT-MA ${values.crtMa} mm、CFF-MA ${values.cffMa} mm`,
        strength: "検討"
      });
    } else if (cffLow) {
      results.push({
        id: "GH-MA-02",
        severity: "red",
        title: "【異常】フィブリノゲン低下",
        assessment: "フィブリノゲン不足または凝集能低下を疑います。",
        action: "Fib製剤/クリオ/FFPを検討します。",
        rationale: `CFF-MA ${values.cffMa} mm`,
        strength: "検討"
      });
    } else {
      results.push({
        id: "GH-MA-04",
        severity: "green",
        title: "【範囲内】血餅強度",
        assessment: "血餅強度は概ね保たれています。",
        action: "臨床的出血が続く場合は、外科的出血・希釈・薬剤影響・再検を検討します。",
        rationale: `CRT-MA ${values.crtMa} mm、CFF-MA ${values.cffMa} mm`,
        strength: "参考"
      });
    }
  }

  if (values.ly30 === undefined) {
    results.push(unevaluated("GH-LY-UN", "LY30"));
  } else if (values.ly30 > n.ly30Max) {
    results.push({
      id: "GH-LY-01",
      severity: "red",
      title: "【異常】線溶亢進",
      assessment: "線溶亢進を疑います。",
      action: "TXA投与を検討します。",
      rationale: `LY30 ${values.ly30}%`,
      strength: "検討"
    });
  } else {
    results.push({
      id: "GH-LY-02",
      severity: "green",
      title: "【範囲内】LY30",
      assessment: "LY30上は明らかな線溶亢進は目立ちません。",
      action: "臨床所見と合わせて判断してください。",
      rationale: `LY30 ${values.ly30}%`,
      strength: "参考"
    });
  }

  return sortResults(results);
}
