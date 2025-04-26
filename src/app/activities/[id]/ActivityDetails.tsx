"use client";

import samplePlan from "@/lib/sample-plan.json";
import { type Activity } from "@/lib/types";
import { useEffect, useState } from "react";

type WorkoutPlan = {
  title: string;
  description: string;
  date: string;
  duration: string;
  distance_km: string;
  elevation_gain: string;
  average_speed: string;
  average_heartrate: string;
};

function ComparisonStat({
  label,
  actual,
  planned,
  unit,
}: {
  label: string;
  actual: number | undefined;
  planned: number;
  unit: string;
}) {
  if (!actual) return null;

  const difference = actual - planned;
  const percentDiff = (difference / planned) * 100;
  const isPositive = difference > 0;

  return (
    <li className="flex items-center justify-between border-b border-gray-200 py-2">
      <span className="font-bold">{label}:</span>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="font-bold">
            {actual.toFixed(1)} {unit}
          </div>
          <div className="text-sm text-gray-500">
            Plan: {planned} {unit}
          </div>
        </div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black ${
            isPositive ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <span className="text-xs font-bold">
            {isPositive ? "+" : ""}
            {percentDiff.toFixed(0)}%
          </span>
        </div>
      </div>
    </li>
  );
}

export function ActivityDetails({ id }: { id: string }) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [plannedWorkout, setPlannedWorkout] = useState<WorkoutPlan | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Load activity
      const stravaDataString = localStorage.getItem(
        "strava_data_recent_activities",
      );
      if (!stravaDataString) {
        setError("No Strava data found");
        return;
      }

      const activities = JSON.parse(stravaDataString) as Activity[];
      const foundActivity = activities.find((a) => a.id.toString() === id);

      if (!foundActivity) {
        setError("Activity not found");
        return;
      }

      setActivity(foundActivity);

      // Find matching planned workout
      const activityDate = new Date(foundActivity.start_date);
      const matchingWorkout = samplePlan.day_wise.find(
        (workout) =>
          new Date(workout.date).toDateString() === activityDate.toDateString(),
      );

      if (matchingWorkout) {
        setPlannedWorkout(matchingWorkout);
      }
    } catch (err) {
      setError("Error loading activity");
      console.error(err);
    }
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border-4 border-black bg-red-300 p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-2xl font-black">{error}</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border-4 border-black bg-yellow-300 p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-2xl font-black">Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-xl border-4 border-black bg-cyan-200 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-black">{activity.name}</h1>
          <div className="flex flex-wrap gap-4">
            <span className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold">
              {new Date(activity.start_date_local).toLocaleString()}
            </span>
            <span className="inline-block rounded-lg border-2 border-black bg-white px-3 py-1 text-sm font-bold">
              {activity.timezone}
            </span>
            {activity.kudos_count && activity.kudos_count > 0 && (
              <span className="inline-block rounded-lg border-2 border-black bg-pink-200 px-3 py-1 text-sm font-bold">
                ❤️ {activity.kudos_count} kudos
              </span>
            )}
          </div>
        </div>

        {plannedWorkout && (
          <div className="mb-6 rounded-lg border-2 border-black bg-yellow-200 p-4">
            <h2 className="mb-2 text-xl font-black">📅 Planned Workout</h2>
            <p className="font-bold">{plannedWorkout.title}</p>
            <p className="text-sm text-gray-700">
              {plannedWorkout.description}
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-4 text-2xl font-bold">Basic Stats</h2>
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Type:</span>
                  <span>{activity.sport_type ?? activity.type}</span>
                </li>
                {plannedWorkout ? (
                  <>
                    <ComparisonStat
                      label="Distance"
                      actual={activity.distance / 1000}
                      planned={Number(plannedWorkout.distance_km)}
                      unit="km"
                    />
                    <ComparisonStat
                      label="Duration"
                      actual={activity.moving_time / 60}
                      planned={Number(plannedWorkout.duration)}
                      unit="min"
                    />
                    <ComparisonStat
                      label="Elevation Gain"
                      actual={activity.total_elevation_gain}
                      planned={Number(plannedWorkout.elevation_gain)}
                      unit="m"
                    />
                    <ComparisonStat
                      label="Average Speed"
                      actual={activity.average_speed * 3.6}
                      planned={Number(plannedWorkout.average_speed)}
                      unit="km/h"
                    />
                  </>
                ) : (
                  <>
                    <li className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-bold">Distance:</span>
                      <span>{(activity.distance / 1000).toFixed(2)} km</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-bold">Moving Time:</span>
                      <span>{formatTime(activity.moving_time)}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-bold">Elevation Gain:</span>
                      <span>{activity.total_elevation_gain.toFixed(0)} m</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-bold">Average Speed:</span>
                      <span>
                        {(activity.average_speed * 3.6).toFixed(1)} km/h
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {activity.map?.summary_polyline && (
              <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="mb-4 text-2xl font-bold">Route Map</h2>
                <div className="aspect-square w-full overflow-hidden rounded-lg border-2 border-black">
                  <img
                    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/path-2+f00(${encodeURIComponent(activity.map.summary_polyline)})/auto/400x400@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                    alt="Activity route"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-4 text-2xl font-bold">Additional Stats</h2>
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Elapsed Time:</span>
                  <span>{formatTime(activity.elapsed_time)}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Max Speed:</span>
                  <span>{(activity.max_speed * 3.6).toFixed(1)} km/h</span>
                </li>
                {activity.average_cadence && (
                  <li className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-bold">Average Cadence:</span>
                    <span>{activity.average_cadence} rpm</span>
                  </li>
                )}
                {activity.calories && (
                  <li className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-bold">Calories:</span>
                    <span>{activity.calories} kcal</span>
                  </li>
                )}
              </ul>
            </div>

            {activity.device_watts && (
              <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="mb-4 text-2xl font-bold">Power Data</h2>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-bold">Average Power:</span>
                    <span>{activity.average_watts?.toFixed(0)} W</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-bold">Max Power:</span>
                    <span>{activity.max_watts} W</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-bold">Weighted Avg Power:</span>
                    <span>{activity.weighted_average_watts} W</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-bold">Work:</span>
                    <span>{activity.kilojoules?.toFixed(0)} kJ</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
