import { z } from "zod";

// last 30 days plan and data.
export const FitnessInput = z.object({
  transcript: z.string(),
  current_data: z.string().nullish().describe("data of last 30 days"),
  current_plan: z.string().nullish().describe("plan of last 30 days"),
  goal: z.object({ name: z.string(), created_on: z.string() }).nullish(),
});

export type FitnessInput = z.infer<typeof FitnessInput>;

export const FitnessOutput = z.object({
  plan: z.object({
    details: z.string(),
    duration: z.string(),
    distance_km: z.string(),
  }),
  goal: z.object({ name: z.string(), created_on: z.string() }).nullish(),
});

export type FitnessOutput = z.infer<typeof FitnessOutput>;
