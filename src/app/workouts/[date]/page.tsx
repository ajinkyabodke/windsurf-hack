"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { z } from "zod";

// Sample workout plan data - in a real app, this would come from an API
const workoutPlanSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  targetMetrics: z.object({
    duration: z.number(),
    distance: z.number(),
    elevationGain: z.number(),
    avgSpeed: z.number(),
    avgHeartRate: z.number(),
  }),
  trainingPlanContext: z.string(),
  tips: z.array(z.string()),
});

type WorkoutPlan = z.infer<typeof workoutPlanSchema>;

const samplePlan: WorkoutPlan = {
  title: "Long Endurance Ride",
  description:
    "Focus on maintaining a steady pace throughout the ride. This workout helps build your aerobic base and improves fat metabolism.",
  date: "2024-03-20",
  targetMetrics: {
    duration: 180, // minutes
    distance: 60, // kilometers
    elevationGain: 800, // meters
    avgSpeed: 28, // km/h
    avgHeartRate: 145, // bpm
  },
  trainingPlanContext: "Part of base training phase - Week 8/12",
  tips: [
    "Stay in Zone 2 heart rate for 80% of the ride",
    "Take regular sips of water every 15 minutes",
    "Consume 40-60g of carbs per hour",
    "Focus on smooth pedaling technique",
  ],
};

export default function WorkoutPage() {
  const params = useParams();
  const date = params.date as string;

  // In a real app, we would fetch the workout plan based on the date
  const workout = samplePlan;

  if (!workout) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-red-600">Workout not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">{workout.title}</h1>
        <p className="text-lg text-zinc-600">
          {format(new Date(workout.date), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workout Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600">{workout.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-500">Duration</p>
                <p className="text-xl font-semibold">
                  {workout.targetMetrics.duration} min
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Distance</p>
                <p className="text-xl font-semibold">
                  {workout.targetMetrics.distance} km
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Elevation Gain</p>
                <p className="text-xl font-semibold">
                  {workout.targetMetrics.elevationGain} m
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Avg Speed</p>
                <p className="text-xl font-semibold">
                  {workout.targetMetrics.avgSpeed} km/h
                </p>
              </div>
              {workout.targetMetrics.avgHeartRate > 0 && (
                <div>
                  <p className="text-sm text-zinc-500">Target Heart Rate</p>
                  <p className="text-xl font-semibold">
                    {workout.targetMetrics.avgHeartRate} bpm
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Plan Context</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="mb-4">
              {workout.trainingPlanContext}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-4">
              {workout.tips.map((tip, index) => (
                <li key={index} className="text-zinc-600">
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
