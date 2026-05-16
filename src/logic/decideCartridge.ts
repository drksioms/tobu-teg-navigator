import decisions from "../data/cartridge-decision.json";
import type { ClinicalContext, Mode } from "../types";

export type CartridgeDecision = {
  id: string;
  label: string;
  mode?: Mode;
  secondaryMode?: Mode;
  message: string;
  context?: ClinicalContext;
  unavailable?: boolean;
  strength?: "Expert opinion / 参考";
};

export const cartridgeOptions = decisions.options as CartridgeDecision[];

export function decideCartridge(id: string): CartridgeDecision {
  return cartridgeOptions.find((option) => option.id === id) ?? cartridgeOptions[0];
}
