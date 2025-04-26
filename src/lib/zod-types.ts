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
    duration: z.string().describe("duration of the plan in minutes"),
    distance_km: z.string().describe("distance of the plan in kilometers"),
    description: z
      .string()
      .describe(
        "description of how the plan will help the user achieve their goal",
      ),
    elevation_gain: z.string().describe("elevation gain in meters"),
    average_speed: z.string().describe("average speed in km/h"),
    average_heartrate: z.string().describe("average heartrate in bpm"),
  }),
  goal: z.string().describe("goal of the user."),
});

export type FitnessOutput = z.infer<typeof FitnessOutput>;
