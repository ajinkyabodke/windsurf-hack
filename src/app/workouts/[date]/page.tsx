"use client";

import { dataAtom } from "@/lib/store";
// import samplePlan from "@/lib/sample-plan.json";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { z } from "zod";

// Define a schema for the workout plan data from sample-plan.json
const workoutSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  duration: z.string(),
  distance_km: z.string(),
  elevation_gain: z.string(),
  average_speed: z.string(),
  average_heartrate: z.string(),
});

type WorkoutPlan = z.infer<typeof workoutSchema>;

export default function WorkoutPage() {
  const params = useParams();
  const date = params.date as string;

  const [samplePlan] = useAtom(dataAtom);

  // const samplePlan = JSON.parse(
  //   localStorage.getItem("training_plan") ?? "{}",
  // ) as FitnessOutput;

  // Find the workout for this date in sample-plan.json
  const workout = samplePlan.day_wise.find((w) => w.date === date);

  if (!workout) {
    return (
      <div className="container mx-auto px-4">
        <div className="rounded-xl border-4 border-black bg-red-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-black">Workout not found</h1>
          <p className="mt-2 font-bold">Could not find a workout for {date}</p>
        </div>
      </div>
    );
  }

  // Parse the workout data with validation
  const result = workoutSchema.safeParse(workout);

  if (!result.success) {
    return (
      <div className="container mx-auto px-4">
        <div className="rounded-xl border-4 border-black bg-red-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-black">Invalid Workout Data</h1>
          <p className="mt-2 font-bold">The workout data is invalid</p>
        </div>
      </div>
    );
  }

  const parsedWorkout = result.data;
  const workoutDate = new Date(parsedWorkout.date);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 rounded-xl border-4 border-black bg-emerald-200 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-2 text-4xl font-black tracking-tight">
          {parsedWorkout.title}
        </h1>
        <p className="text-xl font-bold">
          {format(workoutDate, "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Workout Description */}
        <div className="rounded-xl border-4 border-black bg-yellow-200 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-2xl font-black">Workout Description</h2>
          <p className="text-xl font-bold">{parsedWorkout.description}</p>
        </div>

        {/* Target Metrics */}
        <div className="rounded-xl border-4 border-black bg-cyan-200 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-2xl font-black">Target Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold text-gray-600">Duration</p>
              <p className="text-2xl font-black">
                {parsedWorkout.duration} min
              </p>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold text-gray-600">Distance</p>
              <p className="text-2xl font-black">
                {parsedWorkout.distance_km} km
              </p>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold text-gray-600">Elevation Gain</p>
              <p className="text-2xl font-black">
                {parsedWorkout.elevation_gain} m
              </p>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold text-gray-600">Avg Speed</p>
              <p className="text-2xl font-black">
                {parsedWorkout.average_speed} km/h
              </p>
            </div>
            {Number(parsedWorkout.average_heartrate) > 0 && (
              <div className="col-span-2 rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-sm font-bold text-gray-600">
                  Target Heart Rate
                </p>
                <p className="text-2xl font-black">
                  {parsedWorkout.average_heartrate} bpm
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
