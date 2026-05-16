export type FieldWarning = {
  field: string;
  message: string;
};

const numberPattern = /^\d*\.?\d*$/;

export function sanitizeNumberInput(value: string): string {
  if (value === "") return "";
  const normalized = value.replace(/[０-９．]/g, (char) =>
    char === "．" ? "." : String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  );
  if (!numberPattern.test(normalized)) return "";
  return normalized;
}

export function toOptionalNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function validateCommon(values: Record<string, number | undefined>): FieldWarning[] {
  return Object.entries(values).flatMap(([field, value]) => {
    if (value === undefined) return [];
    if (value < 0) return [{ field, message: "負の値があります。入力値を確認してください。" }];
    return [];
  });
}

export function validateInhibition(field: string, value?: number): FieldWarning[] {
  if (value === undefined) return [];
  if (value < 0 || value > 100) {
    return [{ field, message: "Inhibitionは0〜100%で入力してください。" }];
  }
  return [];
}

export function validateGHOutliers(values: {
  ckR?: number;
  ckhR?: number;
  crtMa?: number;
  cffMa?: number;
  ly30?: number;
}): FieldWarning[] {
  const warnings: FieldWarning[] = [];
  if ((values.ckR ?? 0) > 70) warnings.push({ field: "CK-R", message: "flat line相当の可能性があります。TEG画面を確認してください。" });
  if ((values.ckhR ?? 0) > 70) warnings.push({ field: "CKH-R", message: "flat line相当の可能性があります。TEG画面を確認してください。" });
  if ((values.crtMa ?? 0) > 90) warnings.push({ field: "CRT-MA", message: "明らかに高い値です。入力値を確認してください。" });
  if ((values.cffMa ?? 0) > 60) warnings.push({ field: "CFF-MA", message: "明らかに高い値です。入力値を確認してください。" });
  if ((values.ly30 ?? 0) > 100) warnings.push({ field: "LY30", message: "LY30は%表示です。入力値を確認してください。" });
  return warnings;
}

export function validatePMOutliers(values: {
  hkhR?: number;
  hkhMa?: number;
  actfMa?: number;
  adpInhibition?: number;
  aaInhibition?: number;
  adpMa?: number;
  aaMa?: number;
}): FieldWarning[] {
  const warnings: FieldWarning[] = [
    ...validateInhibition("ADP inhibition", values.adpInhibition),
    ...validateInhibition("AA inhibition", values.aaInhibition)
  ];
  if ((values.hkhR ?? 0) > 70) warnings.push({ field: "HKH-R", message: "flat line相当の可能性があります。TEG画面を確認してください。" });
  if ((values.hkhMa ?? 0) > 90) warnings.push({ field: "HKH-MA", message: "明らかに高い値です。入力値を確認してください。" });
  if ((values.actfMa ?? 0) > 60) warnings.push({ field: "ActF-MA", message: "明らかに高い値です。入力値を確認してください。" });
  if ((values.adpMa ?? 0) > 90) warnings.push({ field: "ADP-MA", message: "明らかに高い値です。入力値を確認してください。" });
  if ((values.aaMa ?? 0) > 90) warnings.push({ field: "AA-MA", message: "明らかに高い値です。入力値を確認してください。" });
  return warnings;
}
