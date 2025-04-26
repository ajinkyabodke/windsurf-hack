"use client";

import {
  type StravaActivity,
  type StravaProfile,
  type StravaStats,
} from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

type DashboardProps = {
  stravaData?: {
    stats?: StravaStats;
    activities?: StravaActivity[];
    profile?: StravaProfile;
  };
  athleteId?: number;
  stravaFetchedAt?: Date;
};

export function Dashboard({
  stravaData,
  athleteId,
  stravaFetchedAt,
}: DashboardProps) {
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  );

  const formattedTime = stravaFetchedAt
    ? new Date(stravaFetchedAt).toLocaleString()
    : "Never";

  // Default to showing 5 activities, or all if button clicked
  const activitiesToShow = showAllActivities
    ? stravaData?.activities
    : stravaData?.activities?.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 font-mono">
      {stravaData?.profile && (
        <div className="mb-8 rounded-xl border-4 border-black bg-yellow-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-6">
            {stravaData.profile.profile && (
              <div className="relative h-28 w-28 overflow-hidden rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <img
                  src={stravaData.profile.profile}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-black">
                {stravaData.profile.firstname} {stravaData.profile.lastname}
              </h2>
              {stravaData.profile.city && stravaData.profile.country && (
                <p className="text-xl font-bold">
                  {stravaData.profile.city}, {stravaData.profile.country}
                </p>
              )}
              {stravaData.profile.username && (
                <p className="mt-1 inline-block rounded-lg bg-black px-2 py-1 text-lg font-bold text-yellow-300">
                  @{stravaData.profile.username}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="mb-2 text-4xl font-black tracking-tight uppercase">
          Your Strava Stats
        </h2>
        {stravaFetchedAt && (
          <p className="inline-block rotate-[358deg] border-2 border-black bg-cyan-300 px-3 py-1 text-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            Last updated: {formattedTime}
          </p>
        )}
      </div>

      {stravaData ? (
        <div>
          {stravaData.activities && stravaData.activities.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-6 inline-block -rotate-1 transform bg-black px-4 py-2 text-2xl font-black text-white uppercase shadow-[5px_5px_0px_0px_rgba(251,191,36,1)]">
                Recent Activities
              </h3>
              <div className="mb-6 overflow-x-auto rounded-xl border-4 border-black bg-pink-200 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <table className="w-full border-collapse border-4 border-black bg-white">
                  <thead>
                    <tr className="bg-pink-400">
                      <th className="border-r-4 border-b-4 border-black p-3 text-left font-black">
                        Name
                      </th>
                      <th className="border-r-4 border-b-4 border-black p-3 text-left font-black">
                        Type
                      </th>
                      <th className="border-r-4 border-b-4 border-black p-3 text-left font-black">
                        Date
                      </th>
                      <th className="border-r-4 border-b-4 border-black p-3 text-right font-black">
                        Distance
                      </th>
                      <th className="border-b-4 border-black p-3 text-right font-black">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activitiesToShow?.map((activity, index) => (
                      <tr
                        key={activity.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-pink-100"}
                      >
                        <td className="border-r-4 border-black p-3 font-bold">
                          {activity.name}
                        </td>
                        <td className="border-r-4 border-black p-3 font-bold">
                          {activity.type}
                        </td>
                        <td className="border-r-4 border-black p-3 font-bold">
                          {new Date(activity.start_date).toLocaleDateString()}
                        </td>
                        <td className="border-r-4 border-black p-3 text-right font-bold">
                          {(activity.distance / 1000).toFixed(2)} km
                        </td>
                        <td className="p-3 text-right font-bold">
                          {formatTime(activity.moving_time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {stravaData.activities.length > 5 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    className="rounded-xl border-4 border-black bg-blue-500 px-6 py-3 text-xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:bg-blue-600 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {showAllActivities ? "Show Less" : "Show More Activities"}
                  </button>
                </div>
              )}
            </div>
          )}

          {stravaData.activities && stravaData.activities.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-6 inline-block rotate-1 transform bg-black px-4 py-2 text-2xl font-black text-white uppercase shadow-[5px_5px_0px_0px_rgba(52,211,153,1)]">
                Activity Calendar
              </h3>
              <ActivityCalendar
                activities={stravaData.activities}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 gap-10 md:grid-cols-2">
            <StatsCard
              title="Recent Rides"
              stats={stravaData.stats?.recent_ride_totals}
              color="blue"
            />
            <StatsCard
              title="All Rides"
              stats={stravaData.stats?.all_ride_totals}
              color="purple"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-4 border-black bg-red-300 p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-2xl font-black">
            No Strava data available. Connect your Strava account to see your
            stats.
          </p>
        </div>
      )}
    </div>
  );
}

function ActivityCalendar({
  activities,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: {
  activities: StravaActivity[];
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}) {
  // Group activities by date
  const activityMap = activities.reduce<Record<string, StravaActivity[]>>(
    (acc, activity) => {
      const date = new Date(activity.start_date);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      acc[dateKey] ??= [];

      acc[dateKey].push(activity);
      return acc;
    },
    {},
  );

  // Generate calendar month view
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  // Navigation controls
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create week days header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create calendar grid cells
  const calendarCells = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(
      <div
        key={`empty-${i}`}
        className="h-28 border-2 border-black bg-gray-200 p-1"
      ></div>,
    );
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${selectedYear}-${selectedMonth}-${day}`;
    const activitiesOnDay = activityMap[dateKey] ?? [];
    const hasActivities = activitiesOnDay.length > 0;

    const isToday =
      new Date().getDate() === day &&
      new Date().getMonth() === selectedMonth &&
      new Date().getFullYear() === selectedYear;

    calendarCells.push(
      <div
        key={`day-${day}`}
        className={`h-28 border-2 border-black p-2 ${
          isToday
            ? "bg-green-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            : hasActivities
              ? "bg-cyan-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              : "bg-white"
        }`}
      >
        <div className="flex justify-between">
          <span
            className={`text-lg font-black ${isToday ? "rounded-full bg-black px-2 text-white" : ""}`}
          >
            {day}
          </span>
          {hasActivities && (
            <span className="rotate-3 transform rounded-full bg-black px-2 text-sm font-bold text-white">
              {activitiesOnDay.length}
            </span>
          )}
        </div>

        <div className="mt-1 max-h-16 overflow-y-auto">
          {activitiesOnDay.slice(0, 2).map((activity) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              className="block"
            >
              <div className="mb-1 rounded-md border-2 border-black bg-white p-1 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <div className="truncate font-bold">{activity.name}</div>
                <div className="font-bold text-blue-600">
                  {(activity.distance / 1000).toFixed(1)} km
                </div>
              </div>
            </Link>
          ))}
          {activitiesOnDay.length > 2 && (
            <Link
              href={`/dashboard?date=${selectedYear}-${selectedMonth + 1}-${day}`}
              className="inline-block -rotate-2 transform bg-black px-1 py-0.5 text-xs font-bold text-white transition-all hover:rotate-0"
            >
              +{activitiesOnDay.length - 2} more
            </Link>
          )}
        </div>
      </div>,
    );
  }

  return (
    <div className="rounded-xl border-4 border-black bg-emerald-200 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-black">
          {monthNames[selectedMonth]} {selectedYear}
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={goToPreviousMonth}
            className="rounded-md border-2 border-black bg-black px-3 py-1 font-bold text-white shadow-[3px_3px_0px_0px_rgba(110,231,183,1)] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(110,231,183,1)]"
          >
            &larr;
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-md border-2 border-black bg-black px-3 py-1 font-bold text-white shadow-[3px_3px_0px_0px_rgba(110,231,183,1)] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(110,231,183,1)]"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="rotate-[-1deg] transform rounded-md border-2 border-black bg-emerald-400 p-2 text-center font-black"
          >
            {day}
          </div>
        ))}
        {calendarCells}
      </div>
    </div>
  );
}

function StatsCard({
  title,
  stats,
  color = "blue",
}: {
  title: string;
  stats?: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  color?: "blue" | "purple" | "green" | "pink";
}) {
  if (!stats) {
    return null;
  }

  const bgColors = {
    blue: "bg-blue-300",
    purple: "bg-violet-300",
    green: "bg-green-300",
    pink: "bg-pink-300",
  };

  const bgColor = bgColors[color];

  return (
    <div
      className={`${bgColor} rounded-xl border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
    >
      <h3 className="mb-6 rotate-[-1deg] transform text-2xl font-black">
        {title}
      </h3>
      <ul className="space-y-4">
        <li className="flex items-center justify-between border-b-2 border-black pb-2">
          <span className="text-lg font-bold">Activities:</span>
          <span className="rounded-lg border-2 border-black bg-white px-3 py-1 text-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {stats.count}
          </span>
        </li>
        <li className="flex items-center justify-between border-b-2 border-black pb-2">
          <span className="text-lg font-bold">Distance:</span>
          <span className="rounded-lg border-2 border-black bg-white px-3 py-1 text-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {(stats.distance / 1000).toFixed(2)} km
          </span>
        </li>
        <li className="flex items-center justify-between border-b-2 border-black pb-2">
          <span className="text-lg font-bold">Moving Time:</span>
          <span className="rounded-lg border-2 border-black bg-white px-3 py-1 text-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {formatTime(stats.moving_time)}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-lg font-bold">Elevation Gain:</span>
          <span className="rounded-lg border-2 border-black bg-white px-3 py-1 text-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {stats.elevation_gain.toFixed(2)} m
          </span>
        </li>
      </ul>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
}
