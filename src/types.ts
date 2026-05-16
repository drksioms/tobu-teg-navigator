export type Mode = "GH" | "PM";

export type Severity = "red" | "yellow" | "green" | "gray";

export type ClinicalContext =
  | "general"
  | "trauma"
  | "antiplatelet"
  | "ecmo"
  | "heparin"
  | "factor"
  | "fibrinogen"
  | "lysis"
  | "hypercoagulable"
  | "other";

export type ResultCard = {
  id: string;
  severity: Severity;
  title: string;
  assessment: string;
  action: string;
  rationale?: string;
  referenceRange?: string;
  strength: "注意" | "参考" | "検討" | "Expert opinion / 参考" | "Expert opinion / 検討";
};

export type GHValues = {
  ckR?: number;
  ckhR?: number;
  crtMa?: number;
  cffMa?: number;
  ly30?: number;
};

export type PMValues = {
  hkhR?: number;
  hkhMa?: number;
  actfMa?: number;
  adpInhibition?: number;
  aaInhibition?: number;
  adpMa?: number;
  aaMa?: number;
};
