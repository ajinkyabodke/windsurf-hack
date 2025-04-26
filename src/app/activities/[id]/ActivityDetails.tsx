"use client";

import { type Activity } from "@/lib/types";
import { useEffect, useState } from "react";

export function ActivityDetails({ id }: { id: string }) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
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
            {activity.kudos_count > 0 && (
              <span className="inline-block rounded-lg border-2 border-black bg-pink-200 px-3 py-1 text-sm font-bold">
                ❤️ {activity.kudos_count} kudos
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-4 text-2xl font-bold">Basic Stats</h2>
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Type:</span>
                  <span>{activity.sport_type ?? activity.type}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Distance:</span>
                  <span>{(activity.distance / 1000).toFixed(2)} km</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Moving Time:</span>
                  <span>{formatTime(activity.moving_time)}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Elapsed Time:</span>
                  <span>{formatTime(activity.elapsed_time)}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Average Speed:</span>
                  <span>{(activity.average_speed * 3.6).toFixed(1)} km/h</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Max Speed:</span>
                  <span>{(activity.max_speed * 3.6).toFixed(1)} km/h</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-4 text-2xl font-bold">Elevation & Power</h2>
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Elevation Gain:</span>
                  <span>{activity.total_elevation_gain.toFixed(0)} m</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Elevation High:</span>
                  <span>{activity.elev_high?.toFixed(1)} m</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-bold">Elevation Low:</span>
                  <span>{activity.elev_low?.toFixed(1)} m</span>
                </li>
                {activity.device_watts && (
                  <>
                    <li className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-bold">Average Power:</span>
                      <span>{activity.average_watts?.toFixed(1)} W</span>
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
                      <span>{activity.kilojoules?.toFixed(1)} kJ</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
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
                {/* {activity.start_latlng && activity.end_latlng && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg border-2 border-black bg-emerald-100 p-2 text-center">
                      <div className="text-sm font-bold">Start</div>
                      <div className="text-xs">
                        {activity.start_latlng[0].toFixed(3)},{" "}
                        {activity.start_latlng[1].toFixed(3)}
                      </div>
                    </div>
                    <div className="rounded-lg border-2 border-black bg-red-100 p-2 text-center">
                      <div className="text-sm font-bold">End</div>
                      <div className="text-xs">
                        {activity.end_latlng[0].toFixed(3)},{" "}
                        {activity.end_latlng[1].toFixed(3)}
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            )}
            {activity.average_cadence && (
              <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="mb-4 text-2xl font-bold">Additional Metrics</h2>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-bold">Average Cadence:</span>
                    <span>{activity.average_cadence} rpm</span>
                  </li>
                  {activity.average_temp && (
                    <li className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-bold">Temperature:</span>
                      <span>{activity.average_temp}°C</span>
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
