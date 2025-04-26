import { z } from "zod";
import { athleteActivitySchema } from "./types";

// last 30 days plan and data.
export const FitnessInput = z.object({
  activities: z.array(athleteActivitySchema),
  transcript: z.string(),
  current_plan: z.string().nullish().describe("plan of last 30 days"),
  goal: z.object({ name: z.string(), created_on: z.string() }).nullish(),
});

export type FitnessInput = z.infer<typeof FitnessInput>;

export const FitnessOutput = z.object({
  plan: z
    .string()
    .describe(
      "description of how the plan will help the user achieve their goal",
    ),

  day_wise: z
    .object({
      title: z.string().describe("title of the activity to be shown on Strava"),
      description: z.string().describe("short concise description of the day"),
      date: z.string().describe("date of the plan in format YYYY-MM-DD"),
      duration: z.string().describe("duration of the plan in minutes"),
      distance_km: z.string().describe("distance of the plan in kilometers"),
      elevation_gain: z.string().describe("elevation gain in meters"),
      average_speed: z.string().describe("average speed in km/h"),
      average_heartrate: z.string().describe("average heartrate in bpm"),
    })
    .describe("day wise plan for the next 30 days")
    .array(),

  goal: z.string().describe("goal of the user."),
});

export type FitnessOutput = z.infer<typeof FitnessOutput>;
