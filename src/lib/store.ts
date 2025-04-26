import { atomWithStorage } from "jotai/utils";
import type { FitnessOutput } from "./zod-types";

type Data = Pick<FitnessOutput, "goal" | "plan">;

export const dataAtom = atomWithStorage<Data>("data", {
  goal: "",
  plan: "",
});
