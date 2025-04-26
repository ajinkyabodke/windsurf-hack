import { atomWithStorage } from "jotai/utils";
import samplePlan from "./sample-plan.json";
import type { FitnessOutput } from "./zod-types";

type Data = Pick<FitnessOutput, "goal" | "plan"> & {
  day_wise: FitnessOutput["day_wise"];
};

export const dataAtom = atomWithStorage<Data>("data", {
  goal: "",
  plan: "",
  day_wise: samplePlan.day_wise,
});
